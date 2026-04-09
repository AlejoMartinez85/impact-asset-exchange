
-- Drop overly permissive public write policies on sponsors
DROP POLICY IF EXISTS "Allow insert on sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Allow update on sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Allow delete on sponsors" ON public.sponsors;

-- Replace with super_admin-only policies
CREATE POLICY "Super admins can insert sponsors" ON public.sponsors
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can update sponsors" ON public.sponsors
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can delete sponsors" ON public.sponsors
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role));
