---
name: "Event-Driven React Architecture"
description: "Rules and guidelines for implementing high-performance, event-driven components using SSE, React Query, and Intent-based Prefetching."
---

# Event-Driven Architecture Guidelines

For all new module implementations and codebase refactoring within the platform, agents MUST adhere to the following event-driven architectural principles. This ensures maximum perceived performance, eliminates latency during navigation, and cleanly isolates backend side-effects.

## 1. Backend: Isolate Side-Effects (EventBus)
Do not perform heavy, non-critical actions (like creating notifications, saving audit logs, or sending emails) inline within a REST controller. This blocking pattern slows down the API response time.

**Rule**: Use the `EventEmitter` EventBus pattern to run side-effects asynchronously.
```typescript
// BAD (Blocking)
await prisma.notifications.create({ ... });
return res.status(200).json({ status: 'success' });

// GOOD (Event-Driven)
import { FunderEventBus, FUNDER_EVENTS } from '../events/funder.events';
FunderEventBus.emit(FUNDER_EVENTS.WALLET_CREDITED, { userId, amount });
return res.status(200).json({ status: 'success' });
```

## 2. Backend: Data-Sync via Server-Sent Events (SSE)
Instead of forcing the client to pull data blindly or rely gracefully on WebSockets (which are heavy), use unidirectional Server-Sent Events (SSE) to trigger React Query invalidations on the frontend.

**Rule**: When an important `EventBus` action occurs, use the `stream[Module]Events` controller to push an `INVALIDATE` signal.
```typescript
// Example SSE dispatcher
const handleWalletCredited = (payload) => {
  if (payload.userId === streamUserId) {
    res.write(`data: ${JSON.stringify({ type: 'INVALIDATE', keys: ['funder_wallet'] })}\n\n`);
  }
};
```
*Note: The frontend `EventSource` API doesn't support the `Authorization` header natively. The backend HTTP middleware must allow JWT tokens to be processed via `req.query.token` fallback.*

## 3. Frontend: Zero `useEffect` Data Fetching
Manual data loading using `useEffect` and `useState` is **forbidden** for core dashboard data because it breaks caching and creates waterfall loaders.

**Rule**: Use **TanStack React Query (`useQuery`)** for all state fetching, and centralize the queries in custom hooks.
```tsx
// BAD
const [data, setData] = useState(null);
useEffect(() => { fetchData().then(setData) }, []);

// GOOD
export const funderQueryKeys = { wallet: ['funder_wallet'] };
export const useFunderWalletData = () => {
  return useQuery({
    queryKey: funderQueryKeys.wallet,
    queryFn: fetchFunderWalletData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
```

## 4. Frontend: Intent-Based Hover Prefetching
Navigation clicks should result in an *instant* UI render. Do this by speculatively fetching data behind the scenes when the user signals intent.

**Rule**: Add a 200ms debounced `onMouseEnter` prefetch trigger to primary navigation elements.
```tsx
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

const queryClient = useQueryClient();
const intentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

const handlePrefetch = (path: string) => {
  if (intentTimer.current) clearTimeout(intentTimer.current);
  intentTimer.current = setTimeout(() => {
    if (path.includes('/wallet')) {
      queryClient.prefetchQuery({ queryKey: ['funder_wallet'], queryFn: fetchWalletData });
    }
  }, 200); // 200ms delay prevents firing on accidental fast-swipes across the screen
};

// ...
<Link to="/wallet" onMouseEnter={() => handlePrefetch('/wallet')}>
  Wallet
</Link>
```

## 5. Frontend: Mutational Snapping
When a user updates data, they should not see a loading spinner waiting for the entire dashboard to refresh.

**Rule**: Provide an instant perceived success using `queryClient.invalidateQueries`.
```tsx
const handleTransfer = async () => {
  await transferApiCall();
  // Instantly invalidate the local cache to re-fetch softly in the background.
  // The SSE infrastructure acts as a backup for other devices.
  queryClient.invalidateQueries({ queryKey: ['funder_wallet'] });
  toast.success('Transfer complete!');
};
```
