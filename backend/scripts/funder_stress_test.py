import asyncio
import aiohttp
import time
import argparse
import sys
import uuid
from typing import List

try:
    from rich.live import Live
    from rich.table import Table
    from rich.layout import Layout
    from rich.panel import Panel
    from rich.text import Text
    from rich.console import Console
    from rich import box
except ImportError:
    print("\n❌ Error: Required libraries missing.")
    print("Please install them by running:\n    pip install rich aiohttp\n")
    sys.exit(1)

# Windows specific AsyncIO loop fix
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

console = Console()

class Metrics:
    def __init__(self):
        self.total_requests = 0
        self.completed = 0
        self.success = 0           # 2xx
        self.duplicates = 0        # 409
        self.unauthorized = 0      # 401/403
        self.errors = 0            # 5xx or connection
        self.latencies: List[float] = []

    def get_avg_latency(self):
        return sum(self.latencies) / len(self.latencies) if self.latencies else 0

    def get_max_latency(self):
        return max(self.latencies) if self.latencies else 0

async def fire_request(session: aiohttp.ClientSession, url: str, token: str, payload: dict, metrics: Metrics, simulate_double_spend: bool = False, shared_idempotency: str = None):
    # Double spend uses exact SAME key
    # Standard throughput uses UNIQUE keys per request
    idempotency_key = shared_idempotency if simulate_double_spend and shared_idempotency else str(uuid.uuid4())
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Idempotency-Key": idempotency_key
    }
    
    start_time = time.time()
    try:
        async with session.post(url, json=payload, headers=headers) as response:
            latency = (time.time() - start_time) * 1000
            metrics.latencies.append(latency)
            
            status = response.status
            if 200 <= status < 300:
                metrics.success += 1
            elif status == 409:
                metrics.duplicates += 1
            elif status in (401, 403):
                metrics.unauthorized += 1
            else:
                metrics.errors += 1
    except Exception:
        metrics.errors += 1
    finally:
        metrics.completed += 1

def generate_dashboard(metrics: Metrics, concurrency: int, duration_sec: int, mode_str: str) -> Layout:
    layout = Layout()
    layout.split_column(
        Layout(name="header", size=4),
        Layout(name="main", ratio=1)
    )
    
    # Header Setup
    header_text = Text("🚀 Funder Fintech Architecture — Live Stress Analytics", justify="center", style="bold white on #4F46E5")
    header_text.append(f"\nMode: [ {mode_str} ] | Concurrency: {concurrency}/batch | Total Duration: {duration_sec}s")
    layout["header"].update(Panel(header_text, border_style="white"))

    # Response Distribution Table
    metrics_table = Table(title="Execution Outcomes", box=box.ROUNDED, expand=True, title_style="bold cyan")
    metrics_table.add_column("Metric", style="white", justify="left")
    metrics_table.add_column("Count", style="bold white", justify="right")
    
    metrics_table.add_row("⚡ Total Completed", str(metrics.completed))
    metrics_table.add_row("✅ Valid Success (200/201)", Text(str(metrics.success), style="bold green"))
    metrics_table.add_row("🛡️ Blocked Duplicates (409)", Text(str(metrics.duplicates), style="bold yellow"))
    metrics_table.add_row("🚫 Unauthorized (401/403)", Text(str(metrics.unauthorized), style="bold red"))
    metrics_table.add_row("🔥 Internal Errors (500)", Text(str(metrics.errors), style="bold red"))

    # Performance Telemetry Table
    perf_table = Table(title="Network Telemetry", box=box.ROUNDED, expand=True, title_style="bold magenta")
    perf_table.add_column("Metric", style="white", justify="left")
    perf_table.add_column("Time (ms)", style="bold white", justify="right")
    
    avg_lat = metrics.get_avg_latency()
    max_lat = metrics.get_max_latency()
    
    perf_table.add_row("📊 Average Latency", Text(f"{avg_lat:.2f} ms", style="bold green" if avg_lat < 200 else "bold yellow"))
    perf_table.add_row("📈 Peak Latency (Max)", Text(f"{max_lat:.2f} ms", style="bold red" if max_lat > 1000 else "bold white"))
    
    layout["main"].split_row(
        Layout(Panel(metrics_table, border_style="cyan")),
        Layout(Panel(perf_table, border_style="magenta"))
    )
    
    return layout

async def run_stress_test(args):
    url = "http://localhost:3000/api/funder/fund"
    payload = {
        "amount": 100000,
        "roi_mode": "monthly_compounding",
        "duration_months": 12,
        "auto_renew": False
    }
    
    metrics = Metrics()
    
    # If the user specified double_spend, we force ALL requests across all threads to use the SAME UUID
    shared_key = str(uuid.uuid4()) if args.double_spend else None
    mode_str = "🛡️ MULTI-THREAD DOUBLE SPEND (Idempotency Active)" if args.double_spend else "🚅 HIGH THROUGHPUT SIMULATION"
    
    connector = aiohttp.TCPConnector(limit=max(100, args.concurrency * 2))
    async with aiohttp.ClientSession(connector=connector) as session:
        console.clear()
        
        # Start Live Dashboard
        with Live(generate_dashboard(metrics, args.concurrency, args.duration, mode_str), refresh_per_second=15) as live:
            start_time = time.time()
            end_time = start_time + args.duration
            
            while time.time() < end_time:
                tasks = []
                # Fire concurrent batch
                for _ in range(args.concurrency):
                    metrics.total_requests += 1
                    tasks.append(asyncio.create_task(
                        fire_request(session, url, args.token, payload, metrics, args.double_spend, shared_key)
                    ))
                
                # Await batch and instantly update UI
                await asyncio.gather(*tasks)
                live.update(generate_dashboard(metrics, args.concurrency, args.duration, mode_str))
                
    console.print("\n[bold green]✅ Stress Test Protocol Completed![/bold green]")
    throughput = metrics.completed / args.duration
    console.print(f"📊 [cyan]Total Realized Throughput:[/cyan] [bold white]{throughput:.2f} Requests/Sec[/bold white]\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RentFlowInsight Funder Metrics & Stress Tester", formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument("token", help="Your valid active Bearer JWT Token")
    parser.add_argument("-c", "--concurrency", type=int, default=20, help="Concurrent workers per batch (default: 20)")
    parser.add_argument("-d", "--duration", type=int, default=10, help="Test burn duration in seconds (default: 10)")
    parser.add_argument("--double-spend", action="store_true", help="Forces extreme idempotency check by sending the exact same Idempotency-Key\nacross all concurrent threads.\nIf security works, exactly 1 will succeed and hundreds will flag as 409 Duplicates.")
    
    args = parser.parse_args()
    
    try:
        asyncio.run(run_stress_test(args))
    except KeyboardInterrupt:
        console.print("\n[bold red]🛑 Test manually aborted.[/bold red]")
