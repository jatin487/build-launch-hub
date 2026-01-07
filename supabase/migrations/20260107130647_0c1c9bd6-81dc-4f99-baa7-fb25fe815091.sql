-- Create enum for project types
CREATE TYPE public.project_type AS ENUM ('new_website', 'shopify_store', 'website_redesign', 'maintenance');

-- Create enum for job types
CREATE TYPE public.job_type AS ENUM ('frontend', 'backend', 'fullstack');

-- Create enum for experience level
CREATE TYPE public.experience_level AS ENUM ('junior', 'mid', 'senior');

-- Create project submissions table
CREATE TABLE public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_type project_type NOT NULL,
  features TEXT[] DEFAULT '{}',
  custom_requirements TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  timeline TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title TEXT NOT NULL,
  job_type job_type NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio projects table
CREATE TABLE public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  client_name TEXT,
  project_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_image TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat inquiries table
CREATE TABLE public.chat_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio and testimonials (public content)
CREATE POLICY "Portfolio projects are viewable by everyone" 
ON public.portfolio_projects FOR SELECT USING (true);

CREATE POLICY "Testimonials are viewable by everyone" 
ON public.testimonials FOR SELECT USING (true);

-- Allow anonymous inserts for forms (public submissions)
CREATE POLICY "Anyone can submit project requests" 
ON public.project_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit job applications" 
ON public.job_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit chat inquiries" 
ON public.chat_inquiries FOR INSERT WITH CHECK (true);

-- Insert sample portfolio projects
INSERT INTO public.portfolio_projects (title, description, image_url, category, client_name, technologies, featured) VALUES
('E-Commerce Platform', 'A complete online shopping experience with advanced filtering, cart management, and secure checkout.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', 'Full-Stack', 'RetailMax', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], true),
('Shopify Fashion Store', 'Modern fashion boutique with custom theme, product variants, and integrated inventory management.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'Shopify', 'Luxe Apparel', ARRAY['Shopify', 'Liquid', 'JavaScript'], true),
('SaaS Dashboard', 'Analytics dashboard with real-time data visualization, user management, and reporting tools.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'Web', 'DataFlow Inc', ARRAY['React', 'TypeScript', 'D3.js', 'Firebase'], true),
('Restaurant Ordering App', 'Mobile-first web app for restaurant ordering with real-time kitchen updates and payment processing.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Full-Stack', 'Bistro 54', ARRAY['Next.js', 'Supabase', 'Tailwind'], false),
('Real Estate Portal', 'Property listing platform with virtual tours, appointment scheduling, and mortgage calculator.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'Web', 'HomeFind', ARRAY['React', 'Express', 'MongoDB'], false),
('Fitness Tracker', 'Workout tracking application with progress charts, meal planning, and social features.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 'Full-Stack', 'FitLife', ARRAY['React Native', 'Node.js', 'PostgreSQL'], false);

-- Insert sample testimonials
INSERT INTO public.testimonials (client_name, client_title, client_company, quote, rating, featured) VALUES
('Sarah Johnson', 'CEO', 'RetailMax', 'They transformed our outdated website into a modern e-commerce powerhouse. Sales increased by 150% within the first quarter!', 5, true),
('Michael Chen', 'Founder', 'DataFlow Inc', 'The team delivered beyond our expectations. Their attention to detail and technical expertise is unmatched.', 5, true),
('Emily Roberts', 'Marketing Director', 'Luxe Apparel', 'Our Shopify store looks stunning and converts beautifully. They understood our brand vision perfectly.', 5, true),
('David Martinez', 'Owner', 'Bistro 54', 'The ordering system they built has streamlined our operations completely. Customers love the experience!', 5, false),
('Lisa Thompson', 'COO', 'HomeFind', 'Professional, responsive, and incredibly talented. They''re now our go-to development partner.', 5, false);