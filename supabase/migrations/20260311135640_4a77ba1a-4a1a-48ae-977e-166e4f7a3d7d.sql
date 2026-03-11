
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Sponsors can read own sponsor record" ON public.sponsors;
DROP POLICY IF EXISTS "Super admins can manage sponsors" ON public.sponsors;

-- Permissive demo policies
CREATE POLICY "Allow public read access on sponsors" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Allow insert on sponsors" ON public.sponsors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on sponsors" ON public.sponsors FOR UPDATE USING (true);
CREATE POLICY "Allow delete on sponsors" ON public.sponsors FOR DELETE USING (true);
