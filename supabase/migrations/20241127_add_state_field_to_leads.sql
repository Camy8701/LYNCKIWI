-- Add state field to leads table and make PLZ optional
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS state TEXT;

-- Make PLZ nullable
ALTER TABLE public.leads
ALTER COLUMN plz DROP NOT NULL;

-- Add comment for state field
COMMENT ON COLUMN public.leads.state IS 'State/Bundesland where the property is located (hesse or nrw)';
