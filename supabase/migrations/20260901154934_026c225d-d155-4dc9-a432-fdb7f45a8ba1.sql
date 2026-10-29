-- 1. Guide-level presentation fields
ALTER TABLE public.guides
  ADD COLUMN IF NOT EXISTS theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS welcome_message text,
  ADD COLUMN IF NOT EXISTS host_name text,
  ADD COLUMN IF NOT EXISTS host_avatar_url text;

-- 2. Local guide recommendations owned by a property
CREATE TABLE IF NOT EXISTS public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'restaurants',
  name text NOT NULL,
  description text,
  photo_url text,
  address text,
  latitude double precision,
  longitude double precision,
  phone text,
  whatsapp text,
  website text,
  instagram text,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recommendations TO authenticated;
GRANT ALL ON public.recommendations TO service_role;

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read org recommendations" ON public.recommendations
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = recommendations.property_id AND p.organization_id = public.current_org_id()));

CREATE POLICY "editors manage recommendations" ON public.recommendations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = recommendations.property_id AND p.organization_id = public.current_org_id())
         AND public.has_org_role(ARRAY['owner','admin','editor']::org_role[]))
  WITH CHECK (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = recommendations.property_id AND p.organization_id = public.current_org_id())
         AND public.has_org_role(ARRAY['owner','admin','editor']::org_role[]));

CREATE TRIGGER recommendations_updated_at BEFORE UPDATE ON public.recommendations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS recommendations_property_idx ON public.recommendations(property_id, position);

-- 3. Five design templates
UPDATE public.templates SET status = 'archived';

INSERT INTO public.templates (name, description, configuration, status) VALUES
('Modern', 'Lignes nettes, bleu profond, cartes arrondies.', '{"key":"modern","sections":["welcome","essentials","checkin","wifi","amenities","house_rules","local_guide","contacts","checkout"],"theme":{"primary":"#1B4FA0","accent":"#3B82F6","background":"#F8FAFC","surface":"#FFFFFF","text":"#0F172A","heading_font":"Inter","body_font":"Inter","card_style":"rounded","button_style":"pill","cover_style":"full","nav_style":"grid"}}'::jsonb, 'active'),
('Luxury', 'Noir profond, or et typographie serif.', '{"key":"luxury","sections":["welcome","essentials","checkin","wifi","amenities","house_rules","local_guide","contacts","checkout"],"theme":{"primary":"#1C1917","accent":"#C8A24A","background":"#FAF7F2","surface":"#FFFFFF","text":"#1C1917","heading_font":"Cormorant Garamond","body_font":"Inter","card_style":"sharp","button_style":"outline","cover_style":"portrait","nav_style":"list"}}'::jsonb, 'active'),
('Tropical', 'Turquoise, sable et ambiance balnéaire.', '{"key":"tropical","sections":["welcome","essentials","checkin","wifi","amenities","house_rules","local_guide","contacts","checkout"],"theme":{"primary":"#0F766E","accent":"#F59E0B","background":"#F0FDFA","surface":"#FFFFFF","text":"#0F172A","heading_font":"Inter","body_font":"Inter","card_style":"soft","button_style":"pill","cover_style":"full","nav_style":"grid"}}'::jsonb, 'active'),
('Business', 'Sobre, gris ardoise, orienté conciergerie.', '{"key":"business","sections":["welcome","essentials","checkin","wifi","amenities","house_rules","local_guide","contacts","checkout"],"theme":{"primary":"#0F172A","accent":"#2563EB","background":"#F1F5F9","surface":"#FFFFFF","text":"#0F172A","heading_font":"Inter","body_font":"Inter","card_style":"sharp","button_style":"square","cover_style":"banner","nav_style":"list"}}'::jsonb, 'active'),
('Minimal', 'Blanc, noir, espace et simplicité.', '{"key":"minimal","sections":["welcome","checkin","wifi","house_rules","local_guide","checkout"],"theme":{"primary":"#111827","accent":"#111827","background":"#FFFFFF","surface":"#F9FAFB","text":"#111827","heading_font":"Inter","body_font":"Inter","card_style":"flat","button_style":"square","cover_style":"minimal","nav_style":"list"}}'::jsonb, 'active');