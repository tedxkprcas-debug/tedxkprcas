-- ============================================================================
-- KPR CAS SPARK - COMPLETE DATABASE SCHEMA
-- TEDx Event Management System
-- ============================================================================
-- Last Updated: February 18, 2026
--
-- This single SQL file contains everything you need:
-- 1. Table creation
-- 2. Indexes for performance
-- 3. Default data
-- 4. Row Level Security (RLS) policies
--
-- HOW TO USE:
-- 1. Go to https://app.supabase.com
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Click "New Query"
-- 5. Copy ALL content from this file
-- 6. Paste and click "Run"
-- 7. Done! Your database is ready.
-- ============================================================================


-- ============================================================================
-- STEP 1: ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- ==================== PARTICIPANTS TABLE ====================
-- Stores event participants/registrants
DROP TABLE IF EXISTS participants CASCADE;
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no-show')),
  certSent BOOLEAN DEFAULT FALSE,
  certSentDate TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==================== SPEAKERS TABLE ====================
-- Stores event speakers and their information
DROP TABLE IF EXISTS speakers CASCADE;
CREATE TABLE speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  bio TEXT,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==================== CERTIFICATES TABLE ====================
-- Stores certificate template designs
DROP TABLE IF EXISTS certificates CASCADE;
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Certificate of Participation',
  text TEXT NOT NULL DEFAULT 'In recognition of your enthusiasm, engagement, and commitment to spreading ideas worth sharing.',
  bgColor TEXT NOT NULL DEFAULT 'from-amber-50 to-yellow-50',
  template_style TEXT DEFAULT 'default',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==================== CONTACT INFO TABLE ====================
-- Stores contact information for the event
DROP TABLE IF EXISTS contact_info CASCADE;
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  instagram TEXT,
  linkedin TEXT,
  twitter TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==================== ABOUT INFO TABLE ====================
-- Stores about section content
DROP TABLE IF EXISTS about_info CASCADE;
CREATE TABLE about_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'About TEDx KPRCAS',
  description TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==================== EVENTS TABLE ====================
-- Stores event information
DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==================== GALLERY TABLE ====================
-- Stores gallery images for the event
DROP TABLE IF EXISTS gallery CASCADE;

CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL DEFAULT '',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery("order");
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at);

-- RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "gallery_select" ON gallery FOR SELECT USING (true);
CREATE POLICY "gallery_insert" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "gallery_update" ON gallery FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "gallery_delete" ON gallery FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE gallery;


-- ==================== TEAM MEMBERS TABLE ====================
-- Stores team members information
DROP TABLE IF EXISTS team_members CASCADE;

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo TEXT NOT NULL DEFAULT '',
  description TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members("order");
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_created_at ON team_members(created_at);

-- RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "team_members_select" ON team_members FOR SELECT USING (true);
CREATE POLICY "team_members_insert" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "team_members_update" ON team_members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "team_members_delete" ON team_members FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;


-- ==================== SPONSORS TABLE ====================
-- Stores sponsor information (name and logo)
DROP TABLE IF EXISTS sponsors CASCADE;

CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT NOT NULL DEFAULT '',
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sponsors_order ON sponsors("order");
CREATE INDEX IF NOT EXISTS idx_sponsors_is_active ON sponsors(is_active);
CREATE INDEX IF NOT EXISTS idx_sponsors_created_at ON sponsors(created_at);

-- RLS
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "sponsors_select" ON sponsors FOR SELECT USING (true);
CREATE POLICY "sponsors_insert" ON sponsors FOR INSERT WITH CHECK (true);
CREATE POLICY "sponsors_update" ON sponsors FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "sponsors_delete" ON sponsors FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE sponsors;


-- ============================================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Participants indexes
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_date ON participants(date);
CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants(created_at);

-- Speakers indexes
CREATE INDEX IF NOT EXISTS idx_speakers_order ON speakers("order");
CREATE INDEX IF NOT EXISTS idx_speakers_is_active ON speakers(is_active);
CREATE INDEX IF NOT EXISTS idx_speakers_created_at ON speakers(created_at);

-- Certificates indexes
CREATE INDEX IF NOT EXISTS idx_certificates_is_active ON certificates(is_active);

-- Contact info indexes
CREATE INDEX IF NOT EXISTS idx_contact_info_created_at ON contact_info(created_at);

-- About info indexes
CREATE INDEX IF NOT EXISTS idx_about_info_created_at ON about_info(created_at);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);


-- ============================================================================
-- STEP 4: INSERT DEFAULT DATA
-- ============================================================================

-- Insert default certificate design
INSERT INTO certificates (title, text, bgColor)
VALUES (
  'Certificate of Participation',
  'In recognition of your enthusiasm, engagement, and commitment to spreading ideas worth sharing.',
  'from-amber-50 to-yellow-50'
);

-- Insert default contact info
INSERT INTO contact_info (email, phone, address)
VALUES (
  'tedxkprcas@gmail.com',
  '+91-XXXX-XXXX-XX',
  'KPR College of Arts and Science, Coimbatore'
);

-- Insert default about info
INSERT INTO about_info (title, description, content)
VALUES (
  'About TEDx KPRCAS',
  'TEDx is an independent event that brings people together to share a TED-like experience.',
  'In the spirit of ideas worth spreading, TED has created a program called TEDx. TEDx brings the spirit of TED to local communities around the world. Our event is independently organized to bring educational talks inspiring deep discussion and connection in a small group setting. At KPR College of Arts Science and Research, we celebrate the power of storytelling, innovation, and community building through extraordinary talks and experiences.'
);

-- Insert default event
INSERT INTO events (name, date, description, location)
VALUES (
  'TEDx KPRCAS 2026',
  '2026-04-10T09:00:00',
  'TEDx at KPR College of Arts and Science - Sharing Ideas Worth Spreading',
  'KPR College of Arts and Science, Coimbatore'
);


-- ============================================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- STEP 6: CREATE RLS POLICIES (ALLOW FULL CRUD)
-- ============================================================================

-- ==================== PARTICIPANTS POLICIES ====================
CREATE POLICY "participants_select" ON participants FOR SELECT USING (true);
CREATE POLICY "participants_insert" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "participants_update" ON participants FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "participants_delete" ON participants FOR DELETE USING (true);

-- ==================== SPEAKERS POLICIES ====================
CREATE POLICY "speakers_select" ON speakers FOR SELECT USING (true);
CREATE POLICY "speakers_insert" ON speakers FOR INSERT WITH CHECK (true);
CREATE POLICY "speakers_update" ON speakers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "speakers_delete" ON speakers FOR DELETE USING (true);

-- ==================== CERTIFICATES POLICIES ====================
CREATE POLICY "certificates_select" ON certificates FOR SELECT USING (true);
CREATE POLICY "certificates_insert" ON certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "certificates_update" ON certificates FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "certificates_delete" ON certificates FOR DELETE USING (true);

-- ==================== CONTACT_INFO POLICIES ====================
CREATE POLICY "contact_info_select" ON contact_info FOR SELECT USING (true);
CREATE POLICY "contact_info_insert" ON contact_info FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_info_update" ON contact_info FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "contact_info_delete" ON contact_info FOR DELETE USING (true);

-- ==================== ABOUT_INFO POLICIES ====================
CREATE POLICY "about_info_select" ON about_info FOR SELECT USING (true);
CREATE POLICY "about_info_insert" ON about_info FOR INSERT WITH CHECK (true);
CREATE POLICY "about_info_update" ON about_info FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "about_info_delete" ON about_info FOR DELETE USING (true);

-- ==================== EVENTS POLICIES ====================
CREATE POLICY "events_select" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_update" ON events FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "events_delete" ON events FOR DELETE USING (true);

-- ==================== GALLERY POLICIES ====================
-- Policies already created in gallery table section above


-- ==================== SITE SETTINGS TABLE ====================
-- Stores site-wide settings like theme video URL
DROP TABLE IF EXISTS site_settings CASCADE;
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_site_settings_key ON site_settings(key);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);



-- ============================================================================
-- STEP 1.5: CREATE STORAGE BUCKETS & POLICIES (FIXED - DROP BEFORE CREATE)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  104857600, -- 100MB
  ARRAY['video/mp4','video/webm','video/quicktime','video/ogg','video/x-msvideo']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "site_assets_public_read" ON storage.objects;
DROP POLICY IF EXISTS "site_assets_upload" ON storage.objects;
DROP POLICY IF EXISTS "site_assets_update" ON storage.objects;
DROP POLICY IF EXISTS "site_assets_delete" ON storage.objects;

-- Allow public read access
CREATE POLICY "site_assets_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

-- Allow uploads
CREATE POLICY "site_assets_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-assets');

-- Allow updates
CREATE POLICY "site_assets_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-assets') WITH CHECK (bucket_id = 'site-assets');

-- Allow deletes
CREATE POLICY "site_assets_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'site-assets');


-- ============================================================================
-- DONE! DATABASE SETUP COMPLETE
-- ============================================================================
--
-- Tables created: 9
--   - participants (event registrations)
--   - speakers (speaker information)
--   - certificates (certificate templates)
--   - contact_info (contact details)
--   - about_info (about section content)
--   - events (event information)
--   - gallery (event photos)
--   - team_members (team member profiles)
--   - sponsors (sponsor name and logo)
--
-- All tables have:
--   ✅ Primary key (UUID)
--   ✅ Timestamps (created_at, updated_at)
--   ✅ Performance indexes
--   ✅ Row Level Security enabled
--   ✅ Full CRUD policies (SELECT, INSERT, UPDATE, DELETE)
--
-- Default data inserted for:
--   ✅ Certificates
--   ✅ Contact info
--   ✅ About info
--   ✅ Events
--
-- Your database is ready to use! 🎉
-- ============================================================================


-- ============================================================================
-- REGISTRATION SYSTEM DATABASE SCHEMA
-- TEDx Event Registration with Payment
-- ============================================================================
-- Run this SQL after the main database_complete.sql
-- ============================================================================

-- ==================== REGISTRATION FORM FIELDS TABLE ====================
-- Stores dynamic form fields configured by admin
DROP TABLE IF EXISTS registration_form_fields CASCADE;
CREATE TABLE registration_form_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text' CHECK (field_type IN ('text', 'email', 'tel', 'number', 'select', 'textarea', 'checkbox')),
  placeholder TEXT,
  options TEXT[], -- For select type fields
  is_required BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  -- Category visibility: 'all' shows for everyone, or specific categories like 'student', 'company', 'other'
  show_for_category TEXT[] DEFAULT ARRAY['all']::TEXT[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registration_form_fields_order ON registration_form_fields("order");
CREATE INDEX IF NOT EXISTS idx_registration_form_fields_is_active ON registration_form_fields(is_active);

-- RLS
ALTER TABLE registration_form_fields ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "registration_form_fields_select" ON registration_form_fields FOR SELECT USING (true);
CREATE POLICY "registration_form_fields_insert" ON registration_form_fields FOR INSERT WITH CHECK (true);
CREATE POLICY "registration_form_fields_update" ON registration_form_fields FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "registration_form_fields_delete" ON registration_form_fields FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE registration_form_fields;


-- ==================== PAYMENT SETTINGS TABLE ====================
-- Stores payment QR code and UPI details configured by admin
DROP TABLE IF EXISTS payment_settings CASCADE;
CREATE TABLE payment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_url TEXT,
  upi_id TEXT,
  payment_amount DECIMAL(10, 2) DEFAULT 0,
  payment_instructions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "payment_settings_select" ON payment_settings FOR SELECT USING (true);
CREATE POLICY "payment_settings_insert" ON payment_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "payment_settings_update" ON payment_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "payment_settings_delete" ON payment_settings FOR DELETE USING (true);


-- ==================== REGISTRATIONS TABLE WITH EDITABLE ID ====================
-- Auto-incrementing unique number (1, 2, 3, etc.)
DROP SEQUENCE IF EXISTS registration_number_seq CASCADE;
CREATE SEQUENCE registration_number_seq START 1;

DROP TABLE IF EXISTS registrations CASCADE;

CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Auto-incrementing unique number (1, 2, 3, etc.)
  registration_number INTEGER UNIQUE DEFAULT nextval('registration_number_seq'),
  
  -- UNIQUE REGISTRATION CODE - Editable by Admin (e.g., TEDX-2026-ABCD12)
  registration_code TEXT UNIQUE,
  
  -- User type (student, company, other)
  user_type TEXT DEFAULT 'student' CHECK (user_type IN ('student', 'company', 'other')),
  
  -- Basic Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Dynamic form data stored as JSON
  form_data JSONB DEFAULT '{}',
  
  -- Payment Information
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'submitted', 'verified', 'rejected')),
  payment_screenshot_url TEXT,
  user_upi_id TEXT,
  transaction_id TEXT,
  payment_amount DECIMAL(10, 2),
  payment_verified_at TIMESTAMPTZ,
  payment_verified_by TEXT,
  rejection_reason TEXT,
  
  -- Registration Status
  registration_status TEXT NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'confirmed', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXES FOR PERFORMANCE ====================
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON registrations(phone);
CREATE INDEX IF NOT EXISTS idx_registrations_registration_code ON registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_registrations_registration_number ON registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_registrations_user_type ON registrations(user_type);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_transaction_id ON registrations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_registrations_registration_status ON registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);

-- ==================== ROW LEVEL SECURITY (RLS) ====================
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES - FULL CRUD ====================
CREATE POLICY "registrations_select" ON registrations 
  FOR SELECT USING (true);

CREATE POLICY "registrations_insert" ON registrations 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "registrations_update" ON registrations 
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "registrations_delete" ON registrations 
  FOR DELETE USING (true);

-- ==================== ENABLE REAL-TIME SUBSCRIPTIONS ====================
ALTER PUBLICATION supabase_realtime ADD TABLE registrations;


-- ==================== CREATE STORAGE BUCKET FOR PAYMENT SCREENSHOTS ====================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "payment_screenshots_public_read" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_upload" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_update" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_delete" ON storage.objects;

-- Allow public read access
CREATE POLICY "payment_screenshots_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'payment-screenshots');

-- Allow uploads
CREATE POLICY "payment_screenshots_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow updates
CREATE POLICY "payment_screenshots_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'payment-screenshots') WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow deletes
CREATE POLICY "payment_screenshots_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'payment-screenshots');


-- ==================== INSERT DEFAULT DATA ====================

-- Insert default form fields with category visibility
INSERT INTO registration_form_fields (field_name, field_label, field_type, placeholder, is_required, "order", show_for_category) VALUES
-- Common fields for all users
('name', 'Full Name', 'text', 'Enter your full name', true, 1, ARRAY['all']::TEXT[]),
('email', 'Email Address', 'email', 'Enter your email', true, 2, ARRAY['all']::TEXT[]),
('phone', 'Phone Number', 'tel', 'Enter your phone number', true, 3, ARRAY['all']::TEXT[]),
-- Student-specific fields
('college', 'College/Institution', 'text', 'Enter your college name', true, 4, ARRAY['student']::TEXT[]),
('department', 'Department', 'text', 'Enter your department', false, 5, ARRAY['student']::TEXT[]),
('year_of_study', 'Year of Study', 'select', 'Select your year', false, 6, ARRAY['student']::TEXT[]),
('student_id', 'Student ID', 'text', 'Enter your student ID', false, 7, ARRAY['student']::TEXT[]),
-- Company/Organization-specific fields
('company_name', 'Company/Organization Name', 'text', 'Enter your company name', true, 8, ARRAY['company']::TEXT[]),
('designation', 'Designation', 'text', 'Enter your designation', false, 9, ARRAY['company']::TEXT[]),
('company_website', 'Company Website', 'text', 'Enter company website URL', false, 10, ARRAY['company']::TEXT[]),
-- Other-specific fields
('occupation', 'Occupation', 'text', 'Enter your occupation', false, 11, ARRAY['other']::TEXT[]);

-- Update year_of_study options
UPDATE registration_form_fields 
SET options = ARRAY['1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate', 'PhD'] 
WHERE field_name = 'year_of_study';

-- Insert default payment settings
INSERT INTO payment_settings (upi_id, payment_amount, payment_instructions) VALUES
('tedxkprcas@upi', 500.00, 'Please scan the QR code or use the UPI ID to make the payment. After payment, upload the screenshot and enter your UPI ID.');


-- ==================== THEME STATS TABLE ====================
DROP TABLE IF EXISTS theme_stats CASCADE;

CREATE TABLE theme_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_theme_stats_order ON theme_stats("order");
CREATE INDEX IF NOT EXISTS idx_theme_stats_is_active ON theme_stats(is_active);
CREATE INDEX IF NOT EXISTS idx_theme_stats_created_at ON theme_stats(created_at);

-- RLS
ALTER TABLE theme_stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "theme_stats_select" ON theme_stats FOR SELECT USING (true);
CREATE POLICY "theme_stats_insert" ON theme_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "theme_stats_update" ON theme_stats FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "theme_stats_delete" ON theme_stats FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE theme_stats;


-- ==================== VENUE PARTNERS TABLE ====================
DROP TABLE IF EXISTS venue_partners CASCADE;
CREATE TABLE venue_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  partner_label TEXT DEFAULT 'Our Venue Partner',
  subtitle TEXT,
  event_date TEXT,
  description TEXT,
  hero_image TEXT NOT NULL DEFAULT '',
  logo TEXT,
  thumb_one TEXT,
  thumb_two TEXT,
  cta_text TEXT DEFAULT 'Get Directions',
  cta_url TEXT,
  address TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_venue_partners_order ON venue_partners("order");
CREATE INDEX IF NOT EXISTS idx_venue_partners_is_active ON venue_partners(is_active);
CREATE INDEX IF NOT EXISTS idx_venue_partners_created_at ON venue_partners(created_at);
ALTER TABLE venue_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "venue_partners_select" ON venue_partners FOR SELECT USING (true);
CREATE POLICY "venue_partners_insert" ON venue_partners FOR INSERT WITH CHECK (true);
CREATE POLICY "venue_partners_update" ON venue_partners FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "venue_partners_delete" ON venue_partners FOR DELETE USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE venue_partners;

-- ==================== SITE SETTINGS - Add additional configurations ====================
INSERT INTO site_settings (key, value)
VALUES ('registration_code_prefix', 'TEDX')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

UPDATE site_settings
SET value = 'YOUREVENT'
WHERE key = 'registration_code_prefix';

-- ==================== ABOUT INFO - Add additional columns ====================
ALTER TABLE about_info
ADD COLUMN IF NOT EXISTS about_ted_title TEXT DEFAULT 'About TED',
ADD COLUMN IF NOT EXISTS about_ted_content TEXT DEFAULT 'TED is a nonprofit organization devoted to spreading ideas worth sharing through short, powerful talks in a radically shareable video format. TED stands for Technology, Entertainment, Design. TED global community, welcoming people from every discipline and culture who seek a deeper understanding of the world.',
ADD COLUMN IF NOT EXISTS about_tedx_title TEXT DEFAULT 'About TEDx',
ADD COLUMN IF NOT EXISTS about_tedx_content TEXT DEFAULT 'TEDx is an independent event that brings people together to share a TED-like experience. In the spirit of ideas worth spreading, TED has created a program called TEDx. TEDx events are self-organized, local gatherings that bring people together to share a TED-like experience. Our event is independently organized to bring transformative TED-like experiences to our community.',
ADD COLUMN IF NOT EXISTS why_at_kprcas_title TEXT DEFAULT 'Why at KPRCAS',
ADD COLUMN IF NOT EXISTS why_at_kprcas_content TEXT DEFAULT 'KPR College of Arts, Science and Research is committed to fostering innovation, creativity, and critical thinking. TEDx KPRCAS is a platform for our students and faculty to share bold ideas and inspire change. We believe in the power of ideas to transform our world, and TEDx provides the perfect stage for voices that matter.';

-- ==================== PAYMENT SETTINGS - Add merchant name ====================
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS merchant_name TEXT DEFAULT 'TEDx KPRCAS';

-- ============================================================================
-- SUCCESS: Database migration completed!
-- ============================================================================
-- ✅ All tables created with RLS policies
-- ✅ Storage buckets configured
-- ✅ Default data inserted
-- ✅ Indexes created for performance
-- ✅ Real-time subscriptions enabled
-- ============================================================================
