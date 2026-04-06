package main

import (
	"bytes"
	"crypto/rand"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"sync/atomic"
	"syscall"
	"time"
)

// generateUUID creates a purely random pseudo-UUID to avoid external dependencies
func generateUUID() string {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}

// Metrics thread-safe metric tracking
type Metrics struct {
	TotalRequests int32
	Completed     int32
	Success       int32
	Duplicates    int32
	Unauthorized  int32
	BadRequests   int32
	Errors        int32
	TotalLatency  int64 // microseconds
	MaxLatency    int64 // microseconds
	LatencyMux    sync.Mutex
}

func (m *Metrics) AddLatency(micro int64) {
	m.LatencyMux.Lock()
	defer m.LatencyMux.Unlock()
	m.TotalLatency += micro
	if micro > m.MaxLatency {
		m.MaxLatency = micro
	}
}

func main() {
	concurrency := flag.Int("c", 20, "Concurrent workers per batch (default: 20)")
	duration := flag.Int("d", 10, "Test burn duration in seconds (default: 10)")
	doubleSpend := flag.Bool("double-spend", false, "Forces extreme idempotency check by sending the exact same Idempotency-Key\nacross all concurrent threads.\nIf security works, exactly 1 will succeed and hundreds will flag as 409 Duplicates.")

	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: go run funder_stress_test.go [options] <token>\n")
		flag.PrintDefaults()
	}

	flag.Parse()

	args := flag.Args()
	if len(args) < 1 {
		fmt.Println("❌ Error: Bearer JWT Token is required as a positional argument.")
		flag.Usage()
		os.Exit(1)
	}
	token := args[0]

	url := "http://localhost:3000/api/funder/fund"
	payload := map[string]interface{}{
		"amount":          100000,
		"roi_mode":        "monthly_compounding",
		"duration_months": 12,
		"auto_renew":      false,
	}
	payloadBytes, _ := json.Marshal(payload)

	var sharedKey string
	if *doubleSpend {
		sharedKey = generateUUID()
	}

	metrics := &Metrics{}

	tr := &http.Transport{
		MaxIdleConns:        *concurrency * 2,
		MaxIdleConnsPerHost: *concurrency * 2,
		IdleConnTimeout:     30 * time.Second,
	}
	client := &http.Client{Transport: tr, Timeout: 10 * time.Second}

	fmt.Printf("\n🚀 Funder Fintech Architecture — Live Stress Analytics (Golang)\n")
	if *doubleSpend {
		fmt.Printf("Mode: [ 🛡️ MULTI-THREAD DOUBLE SPEND (Idempotency Active) ]\n")
	} else {
		fmt.Printf("Mode: [ 🚅 HIGH THROUGHPUT SIMULATION ]\n")
	}
	fmt.Printf("Concurrency: %d/batch | Total Duration: %ds\n\n", *concurrency, *duration)

	stopChan := make(chan struct{})
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-sigChan
		fmt.Printf("\n🛑 Test manually aborted.\n")
		close(stopChan) // Signals main loop to exit
	}()

	startTime := time.Now()
	endTime := startTime.Add(time.Duration(*duration) * time.Second)

	// Live feedback routine
	go func() {
		liveTicker := time.NewTicker(2 * time.Second)
		defer liveTicker.Stop()
		for {
			select {
			case <-stopChan:
				return
			case <-liveTicker.C:
				comp := atomic.LoadInt32(&metrics.Completed)
				suc := atomic.LoadInt32(&metrics.Success)
				errs := atomic.LoadInt32(&metrics.Errors)
				badReq := atomic.LoadInt32(&metrics.BadRequests)
				fmt.Printf("... Live Status: %d simulated users active | ✅ %d Funded | ⚠️ %d Empty | 🔥 %d Errors\n", comp, suc, badReq, errs)
			}
		}
	}()

WorkerLoop:
	for time.Now().Before(endTime) {
		select {
		case <-stopChan:
			break WorkerLoop
		default:
			var batchWg sync.WaitGroup
			for i := 0; i < *concurrency; i++ {
				batchWg.Add(1)
				atomic.AddInt32(&metrics.TotalRequests, 1)
				go func() {
					defer batchWg.Done()
					reqStartTime := time.Now()

					idempotencyKey := sharedKey
					if idempotencyKey == "" {
						idempotencyKey = generateUUID()
					}

					req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
					req.Header.Set("Authorization", "Bearer "+token)
					req.Header.Set("Content-Type", "application/json")
					req.Header.Set("Idempotency-Key", idempotencyKey)

					resp, err := client.Do(req)

					latencyMicro := time.Since(reqStartTime).Microseconds()
					metrics.AddLatency(latencyMicro)

					if err != nil {
						atomic.AddInt32(&metrics.Errors, 1)
					} else {
						// Discard body to reuse connection
						_, _ = io.Copy(io.Discard, resp.Body)
						resp.Body.Close()

						status := resp.StatusCode
						if status >= 200 && status < 300 {
							atomic.AddInt32(&metrics.Success, 1)
						} else if status == 400 {
							atomic.AddInt32(&metrics.BadRequests, 1)
						} else if status == 409 {
							atomic.AddInt32(&metrics.Duplicates, 1)
						} else if status == 401 || status == 403 {
							atomic.AddInt32(&metrics.Unauthorized, 1)
						} else {
							atomic.AddInt32(&metrics.Errors, 1)
						}
					}
					atomic.AddInt32(&metrics.Completed, 1)
				}()
			}
			batchWg.Wait() // Wait for batch completion before next loop
		}
	}

	close(stopChan) // Ensure ticker stops if naturally ended
	actualDuration := time.Since(startTime).Seconds()
	if actualDuration == 0 {
		actualDuration = 0.001
	}

	comp := atomic.LoadInt32(&metrics.Completed)
	suc := atomic.LoadInt32(&metrics.Success)
	dup := atomic.LoadInt32(&metrics.Duplicates)
	errs := atomic.LoadInt32(&metrics.Errors)
	unauth := atomic.LoadInt32(&metrics.Unauthorized)
	badReq := atomic.LoadInt32(&metrics.BadRequests)

	avgLatencyMs := 0.0
	if comp > 0 {
		avgLatencyMs = float64(metrics.TotalLatency) / float64(comp) / 1000.0
	}
	maxLatencyMs := float64(metrics.MaxLatency) / 1000.0

	throughput := float64(comp) / actualDuration

	fmt.Printf("\n=======================================================\n")
	fmt.Printf("📊 RENTFLOW INSIGHT LOAD TEST RESULTS\n\n")
	fmt.Printf("Execution Metrics:\n")
	fmt.Printf("👥 Total Users Simulated (Concurrency): %d users/batch\n", *concurrency)
	fmt.Printf("⏱️  Total Time Taken:                 %.2f seconds\n", actualDuration)
	fmt.Printf("⚡ Total Transactions Processed:      %d\n\n", comp)
	
	fmt.Printf("System Performance:\n")
	fmt.Printf("✅ Successful Investments Made:      %d\n", suc)
	fmt.Printf("⚠️ Rejected (Empty Wallets):         %d\n", badReq)
	fmt.Printf("🛡️ Rejected (Duplicate Spends):      %d\n", dup)
	fmt.Printf("🚫 Rejected (Unauthorized/Security): %d\n", unauth)
	fmt.Printf("🔥 System Crashes (Server Failure):  %d\n\n", errs)
	
	fmt.Printf("Speed Telemetry:\n")
	fmt.Printf("⏳ Average Response Time:            %.2f ms\n", avgLatencyMs)
	fmt.Printf("📈 Slowest Response Time:            %.2f ms\n\n", maxLatencyMs)

	fmt.Printf("🚀 Total Processing Speed:           %.2f Transactions/Sec\n", throughput)
	fmt.Printf("=======================================================\n\n")
}
