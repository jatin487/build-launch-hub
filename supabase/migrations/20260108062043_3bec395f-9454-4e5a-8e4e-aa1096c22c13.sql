-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create enum for developer status
CREATE TYPE public.developer_status AS ENUM ('pending', 'approved', 'rejected');

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'developer');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create developers table
CREATE TABLE public.developers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name text NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    experience_years integer NOT NULL DEFAULT 0,
    location text,
    github_url text,
    portfolio_url text,
    weekly_hours integer DEFAULT 40,
    preferred_project_types text[] DEFAULT '{}',
    status developer_status NOT NULL DEFAULT 'pending',
    is_available boolean DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

-- Create developer_skills table
CREATE TABLE public.developer_skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id uuid REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    skill_name text NOT NULL,
    years_experience integer DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (developer_id, skill_name)
);

ALTER TABLE public.developer_skills ENABLE ROW LEVEL SECURITY;

-- Create developer_screenshots table
CREATE TABLE public.developer_screenshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id uuid REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    file_url text NOT NULL,
    file_name text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.developer_screenshots ENABLE ROW LEVEL SECURITY;

-- Create project_assignments table
CREATE TABLE public.project_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id uuid REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    project_submission_id uuid REFERENCES public.project_submissions(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status text DEFAULT 'active',
    notes text,
    UNIQUE (developer_id, project_submission_id)
);

ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;

-- Create project_files table for reference uploads
CREATE TABLE public.project_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_submission_id uuid REFERENCES public.project_submissions(id) ON DELETE CASCADE,
    file_url text NOT NULL,
    file_name text NOT NULL,
    file_size integer,
    temp_id text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for developers
CREATE POLICY "Developers can view their own profile"
ON public.developers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Developers can update their own profile"
ON public.developers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Developers can insert their own profile"
ON public.developers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all developers"
ON public.developers FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all developers"
ON public.developers FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for developer_skills
CREATE POLICY "Developers can manage their own skills"
ON public.developer_skills FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.developers
        WHERE developers.id = developer_skills.developer_id
        AND developers.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all skills"
ON public.developer_skills FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for developer_screenshots
CREATE POLICY "Developers can manage their own screenshots"
ON public.developer_screenshots FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.developers
        WHERE developers.id = developer_screenshots.developer_id
        AND developers.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all screenshots"
ON public.developer_screenshots FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for project_assignments
CREATE POLICY "Developers can view their own assignments"
ON public.project_assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.developers
        WHERE developers.id = project_assignments.developer_id
        AND developers.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage all assignments"
ON public.project_assignments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for project_files
CREATE POLICY "Anyone can insert project files"
ON public.project_files FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view project files"
ON public.project_files FOR SELECT
USING (true);

CREATE POLICY "Admins can manage project files"
ON public.project_files FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add SELECT policy for project_submissions for admins
CREATE POLICY "Admins can view all project submissions"
ON public.project_submissions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger for developers
CREATE TRIGGER update_developers_updated_at
BEFORE UPDATE ON public.developers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('developer-portfolio', 'developer-portfolio', true);

-- Storage policies for project-files
CREATE POLICY "Anyone can upload project files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-files');

CREATE POLICY "Anyone can view project files"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-files');

-- Storage policies for developer-portfolio
CREATE POLICY "Authenticated users can upload portfolio files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'developer-portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view portfolio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'developer-portfolio');

CREATE POLICY "Users can delete their own portfolio files"
ON storage.objects FOR DELETE
USING (bucket_id = 'developer-portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);