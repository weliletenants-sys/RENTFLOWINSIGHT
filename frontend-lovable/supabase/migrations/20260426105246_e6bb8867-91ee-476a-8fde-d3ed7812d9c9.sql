-- Enable Realtime for agent_vouch_limit_history so the agent's vouch history feed
-- updates live when new audit rows are inserted or amended.
ALTER TABLE public.agent_vouch_limit_history REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'agent_vouch_limit_history'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_vouch_limit_history';
  END IF;
END $$;