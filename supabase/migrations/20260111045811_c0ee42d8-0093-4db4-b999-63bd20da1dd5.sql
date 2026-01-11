-- Allow developers to view project submissions
CREATE POLICY "Developers can view project submissions"
ON public.project_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'developer'
  )
);