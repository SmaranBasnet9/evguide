-- 005_create_consent_logs.sql
-- Audit table for cookie consent decisions.
-- Stores only hashed/truncated identifiers — no raw PII.

CREATE TABLE IF NOT EXISTS public.consent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  profile_id uuid,
  analytics boolean NOT NULL DEFAULT false,
  personalization boolean NOT NULL DEFAULT false,
  consent_version text NOT NULL DEFAULT '1',
  consent_method text NOT NULL DEFAULT 'banner',
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

-- Index for session-based lookups (anonymous audit trail).
CREATE INDEX IF NOT EXISTS idx_consent_logs_session
  ON public.consent_logs (session_id)
  WHERE session_id IS NOT NULL;

-- Index for user-based lookups (authenticated audit trail).
CREATE INDEX IF NOT EXISTS idx_consent_logs_profile
  ON public.consent_logs (profile_id)
  WHERE profile_id IS NOT NULL;

-- RLS: consent_logs is written by the backend (service role) only.
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;
