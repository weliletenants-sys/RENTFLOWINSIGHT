import { useEffect, useMemo, useState } from 'react';
import { History, ArrowUpRight, ArrowDownRight, RotateCcw, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatUGX } from '@/lib/rentCalculations';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * AgentVouchHistoryFeed
 * ---------------------------------------------------------------------
 * Lists every collection-driven adjustment to the agent's earned vouch
 * limit (insert, update, delete/reversal). Sourced from the
 * `agent_vouch_limit_history` audit table populated by
 * `recompute_agent_earned_vouch`. RLS already gates rows to
 * `agent_id = auth.uid()`.
 */

interface HistoryRow {
  id: string;
  change_source: string;
  collection_id: string | null;
  collection_amount: number | null;
  previous_effective_limit_ugx: number | null;
  new_effective_limit_ugx: number | null;
  delta_ugx: number | null;
  created_at: string;
}

interface Props {
  agentId: string;
  limit?: number;
}

export function AgentVouchHistoryFeed({ agentId, limit = 10 }: Props) {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!agentId) { setLoading(false); return; }
    (async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('agent_vouch_limit_history')
          .select('id, change_source, collection_id, collection_amount, previous_effective_limit_ugx, new_effective_limit_ugx, delta_ugx, created_at')
          .eq('agent_id', agentId)
          .order('created_at', { ascending: false })
          .limit(50);
        if (cancelled) return;
        if (error) {
          setRows([]);
        } else {
          setRows((data ?? []) as HistoryRow[]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [agentId]);

  // Realtime: keep the feed in sync with new/updated history rows for this agent.
  useEffect(() => {
    if (!agentId) return;
    const channel = supabase
      .channel(`agent-vouch-history-${agentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_vouch_limit_history',
          filter: `agent_id=eq.${agentId}`,
        },
        (payload) => {
          const row = payload.new as HistoryRow;
          if (!row?.id) return;
          setRows((prev) => {
            if (prev.some((r) => r.id === row.id)) return prev;
            // Newest first; cap at 50 to match initial fetch.
            return [row, ...prev].slice(0, 50);
          });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agent_vouch_limit_history',
          filter: `agent_id=eq.${agentId}`,
        },
        (payload) => {
          const row = payload.new as HistoryRow;
          if (!row?.id) return;
          setRows((prev) => prev.map((r) => (r.id === row.id ? row : r)));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentId]);

  const visible = showAll ? rows : rows.slice(0, limit);

  // Build chronological points (oldest → newest) so the line shows the
  // running effective limit. We seed with the first row's
  // `previous_effective_limit_ugx` so the chart starts from the pre-change
  // baseline instead of jumping straight to the post-change value.
  const chartData = useMemo(() => {
    if (rows.length === 0) return [] as { ts: number; date: string; limit: number }[];
    const sorted = [...rows].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
    const first = sorted[0];
    const seedLimit = Number(first.previous_effective_limit_ugx ?? first.new_effective_limit_ugx ?? 0);
    const seedTs = new Date(first.created_at).getTime() - 1;
    const points = [{ ts: seedTs, date: fmt(new Date(seedTs)), limit: seedLimit }];
    for (const r of sorted) {
      const ts = new Date(r.created_at).getTime();
      points.push({ ts, date: fmt(new Date(ts)), limit: Number(r.new_effective_limit_ugx ?? 0) });
    }
    return points;
  }, [rows]);

  return (
    <div className="rounded-xl border border-border/60 bg-card/70 p-2.5">
      <div className="flex items-center gap-1.5 mb-2">
        <History className="h-3.5 w-3.5 text-primary" />
        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
          Vouch history
        </p>
      </div>

      {!loading && chartData.length >= 2 && (
        <div className="mb-2.5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
              Effective limit trend
            </p>
            <p className="text-[10px] tabular-nums text-muted-foreground">
              {formatUGX(chartData[0].limit)}
              <span className="mx-1">→</span>
              <span className="font-bold text-foreground">
                {formatUGX(chartData[chartData.length - 1].limit)}
              </span>
            </p>
          </div>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="vouchLimitFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                />
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 11,
                    padding: '4px 8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  formatter={(v: number | string) => [formatUGX(Number(v)), 'Limit']}
                />
                <Area
                  type="monotone"
                  dataKey="limit"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.75}
                  fill="url(#vouchLimitFill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-[11px] text-muted-foreground py-2">Loading…</p>
      )}

      {!loading && rows.length === 0 && (
        <p className="text-[11px] text-muted-foreground py-2 leading-snug">
          No collection adjustments yet. Each cash you collect will appear here
          with the resulting vouch change.
        </p>
      )}

      {!loading && rows.length > 0 && (
        <ul className="divide-y divide-border/50">
          {visible.map((r) => (
            <HistoryItem
              key={r.id}
              row={r}
              onViewCollection={(id) => setActiveCollectionId(id)}
            />
          ))}
        </ul>
      )}

      {!loading && rows.length > limit && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="w-full mt-2 text-[10px] uppercase tracking-wider font-bold text-primary hover:underline"
        >
          {showAll ? 'Show less' : `Show all ${rows.length}`}
        </button>
      )}

      <CollectionDetailDialog
        collectionId={activeCollectionId}
        onClose={() => setActiveCollectionId(null)}
      />
    </div>
  );
}

function HistoryItem({ row, onViewCollection }: { row: HistoryRow; onViewCollection: (id: string) => void }) {
  const delta = Number(row.delta_ugx ?? 0);
  const isReversal = row.change_source === 'collection_delete';
  const isUpdate = row.change_source === 'collection_update';
  const isPositive = delta > 0;
  const isNeutral = delta === 0;

  const Icon = isReversal ? RotateCcw : isPositive ? ArrowUpRight : ArrowDownRight;
  const tone = isReversal
    ? 'text-amber-600 dark:text-amber-400'
    : isPositive
      ? 'text-emerald-600 dark:text-emerald-400'
      : isNeutral
        ? 'text-muted-foreground'
        : 'text-rose-600 dark:text-rose-400';

  const label = isReversal
    ? 'Collection reversed'
    : isUpdate
      ? 'Collection updated'
      : row.change_source === 'collection_insert'
        ? 'Collection recorded'
        : row.change_source === 'backfill'
          ? 'Historical backfill'
          : 'Manual recompute';

  const date = new Date(row.created_at);
  const dateStr = date.toLocaleString(undefined, {
    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });

  const amount = Number(row.collection_amount ?? 0);
  const newLimit = Number(row.new_effective_limit_ugx ?? 0);

  return (
    <li className="py-2 flex items-start gap-2">
      <div className={cn('h-7 w-7 shrink-0 rounded-lg bg-muted/60 flex items-center justify-center', tone)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold text-foreground truncate">{label}</p>
          <p className={cn('text-[11px] font-bold tabular-nums shrink-0', tone)}>
            {delta > 0 ? '+' : ''}{formatUGX(delta)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-[10px] text-muted-foreground">
            {amount > 0 && (
              <>Cash {formatUGX(amount)} <span className="mx-1">·</span></>
            )}
            {dateStr}
          </p>
          <p className="text-[10px] text-muted-foreground tabular-nums">
            New: <span className="font-semibold text-foreground">{formatUGX(newLimit)}</span>
          </p>
        </div>
        {row.collection_id && (
          <button
            type="button"
            onClick={() => onViewCollection(row.collection_id!)}
            className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View collection
          </button>
        )}
      </div>
    </li>
  );
}

interface CollectionDetail {
  id: string;
  amount: number;
  created_at: string;
  payment_method: string;
  location_name: string | null;
  notes: string | null;
  momo_provider: string | null;
  momo_phone: string | null;
  momo_payer_name: string | null;
  momo_transaction_id: string | null;
  tenant_id: string;
  tenant_name?: string | null;
}

function CollectionDetailDialog({
  collectionId,
  onClose,
}: {
  collectionId: string | null;
  onClose: () => void;
}) {
  const [data, setData] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!collectionId) { setData(null); return; }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data: c } = await (supabase as any)
        .from('ln')
        .select('id, amount, created_at, payment_method, location_name, notes, momo_provider, momo_phone, momo_payer_name, momo_transaction_id, tenant_id')
        .eq('id', collectionId)
        .maybeSingle();
      if (cancelled) return;
      if (!c) { setData(null); setLoading(false); return; }
      const { data: tenant } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', c.tenant_id)
        .maybeSingle();
      if (cancelled) return;
      setData({ ...c, tenant_name: tenant?.full_name ?? null } as CollectionDetail);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [collectionId]);

  const open = !!collectionId;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Collection detail</DialogTitle>
          <DialogDescription>
            Field collection record linked to this vouch adjustment.
          </DialogDescription>
        </DialogHeader>
        {loading && <p className="text-sm text-muted-foreground py-4">Loading…</p>}
        {!loading && !data && (
          <p className="text-sm text-muted-foreground py-4">
            Collection not found or no longer accessible.
          </p>
        )}
        {!loading && data && (
          <dl className="text-sm space-y-2">
            <Row label="Amount" value={formatUGX(Number(data.amount))} strong />
            <Row label="Date" value={new Date(data.created_at).toLocaleString()} />
            <Row label="Tenant" value={data.tenant_name || data.tenant_id.slice(0, 8)} />
            <Row label="Method" value={data.payment_method} />
            {data.location_name && <Row label="Location" value={data.location_name} />}
            {data.momo_provider && <Row label="MoMo provider" value={data.momo_provider} />}
            {data.momo_phone && <Row label="MoMo phone" value={data.momo_phone} />}
            {data.momo_payer_name && <Row label="Payer" value={data.momo_payer_name} />}
            {data.momo_transaction_id && <Row label="Txn ID" value={data.momo_transaction_id} />}
            {data.notes && <Row label="Notes" value={data.notes} />}
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={cn('text-right break-all', strong ? 'font-bold text-foreground' : 'text-foreground')}>
        {value}
      </dd>
    </div>
  );
}

export default AgentVouchHistoryFeed;