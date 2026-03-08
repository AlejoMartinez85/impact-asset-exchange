-- Create enum for pole status
CREATE TYPE public.pole_status AS ENUM ('active', 'maintenance', 'offline', 'decommissioned');

-- ELISA poles registry
CREATE TABLE public.elisa_poles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number TEXT NOT NULL UNIQUE,
  hardware_secret TEXT NOT NULL,
  sponsor_name TEXT NOT NULL,
  community TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status pole_status NOT NULL DEFAULT 'active',
  last_ping_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Telemetry logs from IoT payloads
CREATE TABLE public.telemetry_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pole_id UUID NOT NULL REFERENCES public.elisa_poles(id) ON DELETE CASCADE,
  kwh_generated DOUBLE PRECISION NOT NULL,
  wifi_connections INTEGER NOT NULL DEFAULT 0,
  light_hours DOUBLE PRECISION NOT NULL DEFAULT 0,
  co2_avoided_kg DOUBLE PRECISION NOT NULL,
  raw_payload JSONB,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_telemetry_pole_id ON public.telemetry_logs(pole_id);
CREATE INDEX idx_telemetry_received_at ON public.telemetry_logs(received_at DESC);
CREATE INDEX idx_elisa_poles_serial ON public.elisa_poles(serial_number);
CREATE INDEX idx_elisa_poles_status ON public.elisa_poles(status);

-- Enable RLS
ALTER TABLE public.elisa_poles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_logs ENABLE ROW LEVEL SECURITY;

-- RLS: Service role (edge functions) can do everything via service_role key.
-- Authenticated users can read poles and telemetry.
CREATE POLICY "Authenticated users can read poles"
  ON public.elisa_poles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert poles"
  ON public.elisa_poles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update poles"
  ON public.elisa_poles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read telemetry"
  ON public.telemetry_logs FOR SELECT
  TO authenticated
  USING (true);

-- Service role policies for edge function ingestion
CREATE POLICY "Service role can insert telemetry"
  ON public.telemetry_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update poles"
  ON public.elisa_poles FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can read poles"
  ON public.elisa_poles FOR SELECT
  TO service_role
  USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_elisa_poles_updated_at
  BEFORE UPDATE ON public.elisa_poles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();