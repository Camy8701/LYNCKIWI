-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
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

-- RLS policy for user_roles table (admins can manage all roles)
CREATE POLICY "Admins can view all user roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- DROP existing overly permissive policies on leads
DROP POLICY IF EXISTS "Authenticated users can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;

-- CREATE new admin-only policies for leads
CREATE POLICY "Only admins can view leads"
ON public.leads FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update leads"
ON public.leads FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Keep public insert for website form
-- "Anyone can create leads" policy already exists and is correct

-- DROP existing overly permissive policies on companies
DROP POLICY IF EXISTS "Authenticated users can view all companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can delete companies" ON public.companies;
DROP POLICY IF EXISTS "Companies are not publicly accessible" ON public.companies;

-- CREATE new admin-only policies for companies
CREATE POLICY "Only admins can view companies"
ON public.companies FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert companies"
ON public.companies FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update companies"
ON public.companies FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete companies"
ON public.companies FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- DROP existing overly permissive policies on lead_assignments
DROP POLICY IF EXISTS "Authenticated users can view all lead assignments" ON public.lead_assignments;
DROP POLICY IF EXISTS "Authenticated users can create lead assignments" ON public.lead_assignments;
DROP POLICY IF EXISTS "Authenticated users can update lead assignments" ON public.lead_assignments;
DROP POLICY IF EXISTS "Lead assignments are not publicly accessible" ON public.lead_assignments;

-- CREATE new admin-only policies for lead_assignments
CREATE POLICY "Only admins can view lead assignments"
ON public.lead_assignments FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert lead assignments"
ON public.lead_assignments FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update lead assignments"
ON public.lead_assignments FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete lead assignments"
ON public.lead_assignments FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Insert admin role for existing admin user (info@lynckservices.de)
-- You'll need to manually get the user_id from Supabase dashboard and add:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('your-admin-user-id-here', 'admin');