-- Add RLS policies for companies and lead_assignments tables

-- Companies policies (only accessible to authenticated admins)
CREATE POLICY "Companies are not publicly accessible" ON companies FOR SELECT USING (false);

-- Lead assignments policies (only accessible to authenticated admins)
CREATE POLICY "Lead assignments are not publicly accessible" ON lead_assignments FOR SELECT USING (false);