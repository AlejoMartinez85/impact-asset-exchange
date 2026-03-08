
-- 1. Create sponsors table
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subscription_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- 2. Populate sponsors from existing sponsor_name values
INSERT INTO public.sponsors (name)
SELECT DISTINCT sponsor_name FROM public.elisa_poles
UNION
SELECT DISTINCT sponsor_name FROM public.profiles WHERE sponsor_name IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- 3. Add sponsor_id FK to profiles
ALTER TABLE public.profiles ADD COLUMN sponsor_id UUID REFERENCES public.sponsors(id);

-- 4. Add sponsor_id FK to elisa_poles
ALTER TABLE public.elisa_poles ADD COLUMN sponsor_id UUID REFERENCES public.sponsors(id);

-- 5. Backfill sponsor_id from sponsor_name
UPDATE public.profiles p
SET sponsor_id = s.id
FROM public.sponsors s
WHERE p.sponsor_name = s.name;

UPDATE public.elisa_poles ep
SET sponsor_id = s.id
FROM public.sponsors s
WHERE ep.sponsor_name = s.name;

-- 6. Create get_my_sponsor_id security definer function
CREATE OR REPLACE FUNCTION public.get_my_sponsor_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sponsor_id FROM public.profiles WHERE id = _user_id
$$;

-- 7. Drop old RLS policies on elisa_poles
DROP POLICY IF EXISTS "Service role can read poles" ON public.elisa_poles;
DROP POLICY IF EXISTS "Service role can update poles" ON public.elisa_poles;
DROP POLICY IF EXISTS "Sponsors can read own poles" ON public.elisa_poles;
DROP POLICY IF EXISTS "Super admins can insert poles" ON public.elisa_poles;
DROP POLICY IF EXISTS "Super admins can read all poles" ON public.elisa_poles;
DROP POLICY IF EXISTS "Super admins can update poles" ON public.elisa_poles;

-- 8. New RLS policies on elisa_poles using sponsor_id
CREATE POLICY "Sponsors can read own poles"
ON public.elisa_poles FOR SELECT
TO authenticated
USING (sponsor_id = get_my_sponsor_id(auth.uid()));

CREATE POLICY "Super admins can read all poles"
ON public.elisa_poles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can insert poles"
ON public.elisa_poles FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can update poles"
ON public.elisa_poles FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Service role can read poles"
ON public.elisa_poles FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role can update poles"
ON public.elisa_poles FOR UPDATE
TO service_role
USING (true);

-- 9. Drop old RLS policies on telemetry_logs
DROP POLICY IF EXISTS "Service role can insert telemetry" ON public.telemetry_logs;
DROP POLICY IF EXISTS "Sponsors can read own telemetry" ON public.telemetry_logs;
DROP POLICY IF EXISTS "Super admins can read all telemetry" ON public.telemetry_logs;

-- 10. New RLS policies on telemetry_logs using sponsor_id chain
CREATE POLICY "Sponsors can read own telemetry"
ON public.telemetry_logs FOR SELECT
TO authenticated
USING (pole_id IN (
  SELECT id FROM public.elisa_poles
  WHERE sponsor_id = get_my_sponsor_id(auth.uid())
));

CREATE POLICY "Super admins can read all telemetry"
ON public.telemetry_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Service role can insert telemetry"
ON public.telemetry_logs FOR INSERT
TO service_role
WITH CHECK (true);

-- 11. RLS policies on sponsors table
CREATE POLICY "Sponsors can read own sponsor record"
ON public.sponsors FOR SELECT
TO authenticated
USING (id = get_my_sponsor_id(auth.uid()));

CREATE POLICY "Super admins can manage sponsors"
ON public.sponsors FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- 12. Add updated_at trigger to sponsors
CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
