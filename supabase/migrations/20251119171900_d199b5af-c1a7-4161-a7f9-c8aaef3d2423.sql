-- Add RLS policies for admin users to access protected tables

-- Allow authenticated users to read all leads
CREATE POLICY "Authenticated users can view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update leads (for status changes, notes)
CREATE POLICY "Authenticated users can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to read all companies
CREATE POLICY "Authenticated users can view all companies"
ON public.companies
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to manage companies
CREATE POLICY "Authenticated users can insert companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update companies"
ON public.companies
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete companies"
ON public.companies
FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users to read all lead assignments
CREATE POLICY "Authenticated users can view all lead assignments"
ON public.lead_assignments
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to create lead assignments
CREATE POLICY "Authenticated users can create lead assignments"
ON public.lead_assignments
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update lead assignments
CREATE POLICY "Authenticated users can update lead assignments"
ON public.lead_assignments
FOR UPDATE
TO authenticated
USING (true);