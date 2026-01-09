-- Allow admins to view all job applications
CREATE POLICY "Admins can view all job applications"
ON public.job_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));