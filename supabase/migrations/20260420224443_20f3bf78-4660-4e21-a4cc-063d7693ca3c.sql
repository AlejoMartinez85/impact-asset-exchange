
-- 1) Hardware secret exposure: revoke column-level SELECT from authenticated users.
-- Service role retains full access (used by ingest function).
REVOKE SELECT (hardware_secret) ON public.elisa_poles FROM authenticated;
REVOKE SELECT (hardware_secret) ON public.elisa_poles FROM anon;

-- 2) Tighten realtime channel scoping: require topic to match a pole_id owned by sponsor
DROP POLICY IF EXISTS "Sponsors subscribe to own telemetry" ON realtime.messages;
CREATE POLICY "Sponsors subscribe to own telemetry"
  ON realtime.messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.elisa_poles p
      WHERE p.sponsor_id = public.get_my_sponsor_id(auth.uid())
        AND realtime.topic() = p.id::text
    )
  );

-- 3) Lock down SECURITY DEFINER helpers from arbitrary RPC enumeration.
-- They remain callable from RLS policies (which run as the table owner / postgres).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_my_sponsor_id(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_my_sponsor_name(uuid) FROM anon, authenticated, public;
