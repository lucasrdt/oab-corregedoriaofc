-- Add cover_image_url to subsections table
ALTER TABLE subsections ADD COLUMN IF NOT EXISTS cover_image_url text;
