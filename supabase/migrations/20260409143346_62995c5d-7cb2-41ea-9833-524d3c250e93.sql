-- Enable RLS on realtime.messages for channel authorization
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Allow sponsors to subscribe only to channels for their own poles' telemetry
CREATE POLICY "Sponsors subscribe to own telemetry"
  ON realtime.messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.elisa_poles
      WHERE elisa_poles.sponsor_id = public.get_my_sponsor_id(auth.uid())
    )
  );

-- Allow super admins to subscribe to all channels
CREATE POLICY "Super admins subscribe to all channels"
  ON realtime.messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role));