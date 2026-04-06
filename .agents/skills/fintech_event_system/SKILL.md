---
name: fintech-event-system
description: >
  Guides the development, update, and scaling of the RENTFLOWINSIGHT / Funder
  system, including secure event handling, financial transaction integrity,
  SSE/Redis integration, and frontend consistency. Ensures best practices for
  idempotency, distributed event architecture, and high-performance fintech UX.

license: Complete terms in LICENSE
---

# Instructions

- All updates must preserve **financial correctness** and **transactional integrity**.
- SSE is only an augmentation; **database (PostgreSQL) is single source of truth**.
- All API POST requests must use **idempotency keys** stored in Redis with TTL.
- Redis/BullMQ integration is required for durable job processing and pub/sub for UI invalidation.
- Workers must implement **idempotent handlers** for exactly-once side-effects.
- Redis Pub/Sub channels must be **per-user** (user:{id}) to avoid O(N) loops.
- SSE connections must auto-reconnect, but include **rate limiting/backoff** to prevent floods.
- Multi-instance scaling must be supported; all nodes subscribe to Redis for cross-instance event propagation.
- Include observability:
  - SSE connections count
  - BullMQ job queue depth / failure count
  - Redis latency / memory usage
  - Distributed tracing for each transaction
- Reconciliation jobs must exist to compare:
  - `walletBuckets` vs `generalLedger` totals
  - Log any discrepancies
- Background refetch/polling for UI must exist in case SSE events are missed.
- All financial operations must use **Prisma `$transaction`** for atomicity.
- Prevent double-spending and duplicates with:
  - Redis idempotency locks
  - DB unique constraints
  - Worker-level idempotent handling
- SSE authentication should favor **short-lived tokens or HTTP-only cookies** over query strings.
- Graceful degradation: system must remain functional if Redis/SSE fail, with only UX impacted.
- Prefetching should consider **network speed and device constraints**.
- All updates must maintain separation of **durable events (BullMQ)** vs **ephemeral events (Redis Pub/Sub)**.

# Technologies

## Backend
- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- BullMQ (Redis-backed job queue)
- Redis Pub/Sub (ephemeral UI events)

## Frontend
- React
- React Query (caching and invalidation)
- SSE (`EventSource`) for realtime updates

## DevOps
- Dockerized Redis with HA (optional clustering)
- Monitoring endpoints for SSE/BullMQ/Redis
- Logging for distributed transaction tracing

# Patterns

## Event Processing
- API receives POST
- Validate Idempotency-Key via Redis SETNX
- Commit atomic transaction in Postgres
- Publish event to:
  - BullMQ for durable jobs
  - Redis Pub/Sub for UI invalidation
- Worker executes idempotent side-effects
- React Query / SSE updates frontend

## SSE Management
- Map SSE connections per user in memory
- Subscribe to Redis per-user channels
- Push updates to client via `res.write()`
- Auto-reconnect with backoff
- React Query refetch ensures UI consistency

## Transaction Integrity
- Atomic DB transactions via `$transaction`
- Idempotency enforced in:
  - API (Redis): Return `409 Conflict` if currently processing, or return the cached `200 OK` response/skip if the transaction already safely completed.
  - DB (unique constraints)
  - Workers (side-effect guards)
- Reconciliation jobs for ledger verification

## Scaling and Performance
- Multi-node setup subscribes to Redis channels
- Avoid O(N) loops for user events
- SSE buffer limits; disconnect slow clients
- Redis reduces CPU for fan-out notifications

## Security
- Prefer HTTP-only cookies for SSE auth
- JWT/session mapping validated per connection
- Short-lived ephemeral tokens if URL params must be used
- Force disconnect SSE connections on logout

## Observability
- Track metrics:
  - SSE connection count
  - Event rate / latency
  - BullMQ queue depth / failed jobs
  - Redis memory / latency
- Implement distributed tracing for POST → DB → Queue → SSE

## Failure Handling
- If SSE fails: UI falls back to refetch
- If Redis goes down: durable jobs buffered, ephemeral events lost
- If BullMQ fails: retry based on configured policy; move to DLQ if retries exhausted
- Manual reconciliation ensures financial integrity
