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


-- ==================== REGISTRATIONS TABLE ====================
-- Stores user registrations with form data and payment info
DROP TABLE IF EXISTS registrations CASCADE;
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Unique Registration Code (e.g., TEDX-2026-ABCD12)
  registration_code TEXT UNIQUE,
  -- Basic info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  -- Dynamic form data stored as JSON
  form_data JSONB DEFAULT '{}',
  -- Payment info
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'submitted', 'verified', 'rejected')),
  payment_screenshot_url TEXT,
  user_upi_id TEXT,
  payment_amount DECIMAL(10, 2),
  payment_verified_at TIMESTAMPTZ,
  payment_verified_by TEXT,
  rejection_reason TEXT,
  -- Registration status
  registration_status TEXT NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'confirmed', 'cancelled')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON registrations(phone);
CREATE INDEX IF NOT EXISTS idx_registrations_registration_code ON registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_registration_status ON registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);

-- RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "registrations_select" ON registrations FOR SELECT USING (true);
CREATE POLICY "registrations_insert" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "registrations_update" ON registrations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "registrations_delete" ON registrations FOR DELETE USING (true);

-- Enable realtime
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


-- ==================== MIGRATION FOR EXISTING DATABASES ====================
-- If you already have the table, run this to add the new column:
-- ALTER TABLE registration_form_fields ADD COLUMN IF NOT EXISTS show_for_category TEXT[] DEFAULT ARRAY['all']::TEXT[];
-- UPDATE registration_form_fields SET show_for_category = ARRAY['all']::TEXT[] WHERE show_for_category IS NULL;


-- ============================================================================
-- DONE! REGISTRATION SYSTEM SETUP COMPLETE
-- ============================================================================
