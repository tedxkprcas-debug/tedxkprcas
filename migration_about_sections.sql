-- ============================================================================
-- MIGRATION: Update about_info table to support three sections
-- Adds columns for About TED, About TEDx, and Why at KPRCAS
-- ============================================================================

-- Add new columns for the three about sections
ALTER TABLE about_info
ADD COLUMN IF NOT EXISTS about_ted_title TEXT DEFAULT 'About TED',
ADD COLUMN IF NOT EXISTS about_ted_content TEXT DEFAULT 'TED is a nonprofit organization devoted to spreading ideas worth sharing through short, powerful talks in a radically shareable video format. TED stands for Technology, Entertainment, Design. TED global community, welcoming people from every discipline and culture who seek a deeper understanding of the world.';

ALTER TABLE about_info
ADD COLUMN IF NOT EXISTS about_tedx_title TEXT DEFAULT 'About TEDx',
ADD COLUMN IF NOT EXISTS about_tedx_content TEXT DEFAULT 'TEDx is an independent event that brings people together to share a TED-like experience. In the spirit of ideas worth spreading, TED has created a program called TEDx. TEDx events are self-organized, local gatherings that bring people together to share a TED-like experience. Our event is independently organized to bring transformative TED-like experiences to our community.';

ALTER TABLE about_info
ADD COLUMN IF NOT EXISTS why_at_kprcas_title TEXT DEFAULT 'Why at KPRCAS',
ADD COLUMN IF NOT EXISTS why_at_kprcas_content TEXT DEFAULT 'KPR College of Arts, Science and Research is committed to fostering innovation, creativity, and critical thinking. TEDx KPRCAS is a platform for our students and faculty to share bold ideas and inspire change. We believe in the power of ideas to transform our world, and TEDx provides the perfect stage for voices that matter.';

-- Ensure the table is included in realtime
ALTER PUBLICATION supabase_realtime ADD TABLE about_info;

-- Return success message
SELECT 'Migration completed successfully!' as status;
