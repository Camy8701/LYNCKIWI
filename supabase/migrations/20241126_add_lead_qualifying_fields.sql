-- Add qualifying fields to leads table to improve lead quality
-- These fields filter for property owners, decision makers, property type, and age

ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS property_ownership TEXT CHECK (property_ownership IN ('owner', 'renter')),
ADD COLUMN IF NOT EXISTS property_type TEXT CHECK (property_type IN ('single_family', 'apartment', 'multi_family', 'commercial')),
ADD COLUMN IF NOT EXISTS decision_maker TEXT CHECK (decision_maker IN ('yes', 'no')),
ADD COLUMN IF NOT EXISTS property_age TEXT CHECK (property_age IN ('before_1980', '1980_2000', '2000_2010', 'after_2010', 'not_sure'));

-- Add comments for documentation
COMMENT ON COLUMN public.leads.property_ownership IS 'Whether the lead is a property owner (only owners qualify for services)';
COMMENT ON COLUMN public.leads.property_type IS 'Type of property (single family house, apartment, etc.)';
COMMENT ON COLUMN public.leads.decision_maker IS 'Whether the lead is the decision maker for the project';
COMMENT ON COLUMN public.leads.property_age IS 'Age of the property (optional, helps contractors estimate work needed)';

-- Create index for filtering qualified leads
CREATE INDEX IF NOT EXISTS idx_leads_qualified
ON public.leads(property_ownership, decision_maker, status)
WHERE property_ownership = 'owner' AND decision_maker = 'yes';
