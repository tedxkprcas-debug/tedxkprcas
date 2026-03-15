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
-- STEP 1.5: CREATE STORAGE BUCKETS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  104857600, -- 100MB
  ARRAY['video/mp4','video/webm','video/quicktime','video/ogg','video/x-msvideo']
) ON CONFLICT (id) DO NOTHING;

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
-- STEP 2: CREATE TABLES
-- ============================================================================

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

-- Default site setting for registration code prefix
INSERT INTO site_settings (key, value)
VALUES ('registration_code_prefix', 'TEDX')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

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


-- ==================== VENUE PARTNERS TABLE ====================
-- Stores venue partner details, images and CTA link
DROP TABLE IF EXISTS venue_partners CASCADE;

CREATE TABLE venue_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,                    -- e.g. "The Pavilion by Quorum"
  partner_label TEXT DEFAULT 'Our Venue Partner',
  subtitle TEXT,                          -- e.g. location line
  event_date TEXT,                        -- e.g. "8th November, 2025"
  description TEXT,
  hero_image TEXT NOT NULL DEFAULT '',    -- large background image
  logo TEXT,                              -- partner logo
  thumb_one TEXT,                         -- supporting image 1
  thumb_two TEXT,                         -- supporting image 2
  cta_text TEXT DEFAULT 'Get Directions',
  cta_url TEXT,
  address TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_venue_partners_order ON venue_partners("order");
CREATE INDEX IF NOT EXISTS idx_venue_partners_is_active ON venue_partners(is_active);
CREATE INDEX IF NOT EXISTS idx_venue_partners_created_at ON venue_partners(created_at);

-- RLS
ALTER TABLE venue_partners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "venue_partners_select" ON venue_partners FOR SELECT USING (true);
CREATE POLICY "venue_partners_insert" ON venue_partners FOR INSERT WITH CHECK (true);
CREATE POLICY "venue_partners_update" ON venue_partners FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "venue_partners_delete" ON venue_partners FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE venue_partners;


-- ==================== THEME STATS TABLE ====================
-- Stores theme featured content and statistics
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
  '2026-03-15',
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

