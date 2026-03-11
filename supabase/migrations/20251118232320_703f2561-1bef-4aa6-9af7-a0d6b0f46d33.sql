-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_en TEXT,
  is_active BOOLEAN DEFAULT true,
  icon TEXT NOT NULL,
  lead_price_shared DECIMAL(10,2) DEFAULT 50.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cities table
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  plz TEXT NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  service_details TEXT NOT NULL,
  timeline TEXT NOT NULL CHECK (timeline IN ('sofort', 'diese_woche', 'diesen_monat', 'flexibel')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted')),
  source TEXT DEFAULT 'website',
  admin_notes TEXT
);

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  service_ids UUID[],
  cities TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead assignments table
CREATE TABLE lead_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by TEXT NOT NULL,
  amount_charged DECIMAL(10,2) NOT NULL,
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_leads_service_id ON leads(service_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_companies_is_active ON companies(is_active);
CREATE INDEX idx_lead_assignments_lead_id ON lead_assignments(lead_id);
CREATE INDEX idx_lead_assignments_company_id ON lead_assignments(company_id);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Cities are viewable by everyone" ON cities FOR SELECT USING (is_active = true);

-- RLS Policies for leads (public can insert, no read access)
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (true);

-- Insert seed data for services
INSERT INTO services (name, name_en, slug, icon, lead_price_shared, description, description_en) VALUES
('Heizung & HVAC', 'Heating & HVAC', 'heizung', '🔥', 50.00, 
 'Notfall-Service, Installation, Wartung und Reparatur von Heizungsanlagen',
 'Emergency service, installation, maintenance and repair of heating systems'),
('Solar & Photovoltaik', 'Solar & Photovoltaic', 'solar', '☀️', 80.00,
 'Förderungen bis 70%. Installation, Beratung und Wartung von Solaranlagen',
 'Grants up to 70%. Installation, consulting and maintenance of solar systems'),
('Dachdecker', 'Roofing', 'dachdecker', '🏠', 60.00,
 'Reparatur, Sanierung, Neueindeckung und Sturmschaden-Beseitigung',
 'Repair, renovation, re-roofing and storm damage removal'),
('Klempner & Sanitär', 'Plumbing & Sanitary', 'klempner', '🚰', 50.00,
 'Rohrreinigung, Reparaturen, Neuinstallation von Sanitäranlagen',
 'Pipe cleaning, repairs, new installation of sanitary facilities'),
('Elektriker', 'Electrician', 'elektriker', '⚡', 60.00,
 'Smart Home, Panel-Upgrades, Reparatur und Neuinstallation',
 'Smart home, panel upgrades, repair and new installation'),
('Allgemeine Renovierung', 'General Renovation', 'renovierung', '🔨', 55.00,
 'Badezimmer, Küche, Fenster & Türen, Malerarbeiten',
 'Bathroom, kitchen, windows & doors, painting work');

-- Insert seed data for cities
INSERT INTO cities (name) VALUES
('Berlin'),
('München'),
('Hamburg'),
('Stuttgart'),
('Düsseldorf'),
('Köln'),
('Frankfurt'),
('Dortmund'),
('Essen'),
('Leipzig'),
('Dresden'),
('Bremen'),
('Hannover'),
('Nürnberg'),
('Duisburg');