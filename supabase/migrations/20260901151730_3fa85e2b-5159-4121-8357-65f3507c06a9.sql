-- ENUMS
CREATE TYPE public.org_type AS ENUM ('individual_host','professional_host','concierge');
CREATE TYPE public.org_role AS ENUM ('owner','admin','editor','viewer');
CREATE TYPE public.property_type AS ENUM ('apartment','villa','house','studio','room','other');
CREATE TYPE public.property_status AS ENUM ('draft','active','archived');
CREATE TYPE public.guide_status AS ENUM ('draft','published','archived');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type public.org_type NOT NULL DEFAULT 'individual_host',
  logo_url text,
  subscription_id uuid,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.org_role NOT NULL DEFAULT 'viewer',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type public.property_type NOT NULL DEFAULT 'apartment',
  address text,
  city text,
  country text,
  description text,
  cover_image_url text,
  phone text,
  whatsapp text,
  wifi_name text,
  wifi_password text,
  checkin_time text,
  checkout_time text,
  status public.property_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX properties_org_idx ON public.properties (organization_id, status);

CREATE TABLE public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  preview_url text,
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  template_id uuid REFERENCES public.templates(id) ON DELETE SET NULL,
  status public.guide_status NOT NULL DEFAULT 'draft',
  default_language text NOT NULL DEFAULT 'fr',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX guides_property_idx ON public.guides (property_id);

CREATE TABLE public.guide_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.guide_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.guide_sections(id) ON DELETE CASCADE,
  type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.guide_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  airtable_record_id text NOT NULL,
  category text,
  custom_title text,
  custom_description text,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid REFERENCES public.guides(id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.guide_sections(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX analytics_guide_idx ON public.analytics_events (guide_id, created_at DESC);

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guides TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guide_sections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guide_blocks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guide_recommendations TO authenticated;
GRANT SELECT ON public.templates TO authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.organizations, public.profiles, public.organization_members,
  public.properties, public.guides, public.guide_sections, public.guide_blocks,
  public.guide_recommendations, public.templates, public.analytics_events,
  public.subscriptions TO service_role;

CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.has_org_role(_roles public.org_role[])
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members m
    WHERE m.user_id = auth.uid()
      AND m.organization_id = public.current_org_id()
      AND m.role = ANY(_roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_guide(_guide_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.guides g
    JOIN public.properties p ON p.id = g.property_id
    WHERE g.id = _guide_id AND p.organization_id = public.current_org_id()
  );
$$;

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org members read own org" ON public.organizations
  FOR SELECT TO authenticated USING (id = public.current_org_id());
CREATE POLICY "org admins update own org" ON public.organizations
  FOR UPDATE TO authenticated USING (id = public.current_org_id() AND public.has_org_role(ARRAY['owner','admin']::public.org_role[]));

CREATE POLICY "read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid() OR organization_id = public.current_org_id());
CREATE POLICY "update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "read own org members" ON public.organization_members
  FOR SELECT TO authenticated USING (organization_id = public.current_org_id());
CREATE POLICY "admins manage members" ON public.organization_members
  FOR ALL TO authenticated
  USING (organization_id = public.current_org_id() AND public.has_org_role(ARRAY['owner','admin']::public.org_role[]))
  WITH CHECK (organization_id = public.current_org_id() AND public.has_org_role(ARRAY['owner','admin']::public.org_role[]));

CREATE POLICY "read org properties" ON public.properties
  FOR SELECT TO authenticated USING (organization_id = public.current_org_id());
CREATE POLICY "editors insert properties" ON public.properties
  FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.current_org_id() AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]));
CREATE POLICY "editors update properties" ON public.properties
  FOR UPDATE TO authenticated
  USING (organization_id = public.current_org_id() AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]))
  WITH CHECK (organization_id = public.current_org_id());
CREATE POLICY "admins delete properties" ON public.properties
  FOR DELETE TO authenticated
  USING (organization_id = public.current_org_id() AND public.has_org_role(ARRAY['owner','admin']::public.org_role[]));

CREATE POLICY "read org guides" ON public.guides
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.organization_id = public.current_org_id()));
CREATE POLICY "editors manage guides" ON public.guides
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.organization_id = public.current_org_id())
    AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]))
  WITH CHECK (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.organization_id = public.current_org_id())
    AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]));

CREATE POLICY "read guide sections" ON public.guide_sections
  FOR SELECT TO authenticated USING (public.owns_guide(guide_id));
CREATE POLICY "editors manage guide sections" ON public.guide_sections
  FOR ALL TO authenticated
  USING (public.owns_guide(guide_id) AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]))
  WITH CHECK (public.owns_guide(guide_id) AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]));

CREATE POLICY "read guide blocks" ON public.guide_blocks
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.guide_sections s WHERE s.id = section_id AND public.owns_guide(s.guide_id)));
CREATE POLICY "editors manage guide blocks" ON public.guide_blocks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.guide_sections s WHERE s.id = section_id AND public.owns_guide(s.guide_id))
    AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]))
  WITH CHECK (EXISTS (SELECT 1 FROM public.guide_sections s WHERE s.id = section_id AND public.owns_guide(s.guide_id))
    AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]));

CREATE POLICY "read guide recommendations" ON public.guide_recommendations
  FOR SELECT TO authenticated USING (public.owns_guide(guide_id));
CREATE POLICY "editors manage guide recommendations" ON public.guide_recommendations
  FOR ALL TO authenticated
  USING (public.owns_guide(guide_id) AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]))
  WITH CHECK (public.owns_guide(guide_id) AND public.has_org_role(ARRAY['owner','admin','editor']::public.org_role[]));

CREATE POLICY "authenticated read templates" ON public.templates
  FOR SELECT TO authenticated USING (status = 'active');

CREATE POLICY "read org analytics" ON public.analytics_events
  FOR SELECT TO authenticated USING (guide_id IS NOT NULL AND public.owns_guide(guide_id));

CREATE POLICY "read org subscription" ON public.subscriptions
  FOR SELECT TO authenticated USING (organization_id = public.current_org_id());

CREATE TRIGGER organizations_updated BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER properties_updated BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER guides_updated BEFORE UPDATE ON public.guides FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER guide_sections_updated BEFORE UPDATE ON public.guide_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER guide_blocks_updated BEFORE UPDATE ON public.guide_blocks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER templates_updated BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER subscriptions_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_first text := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  v_last text := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  v_org_id uuid;
  v_org_name text;
BEGIN
  v_org_name := NULLIF(TRIM(v_first || ' ' || v_last), '');
  IF v_org_name IS NULL THEN v_org_name := COALESCE(NEW.email, 'Mon organisation'); END IF;

  INSERT INTO public.organizations (name) VALUES (v_org_name) RETURNING id INTO v_org_id;

  INSERT INTO public.profiles (id, first_name, last_name, email, organization_id)
  VALUES (NEW.id, NULLIF(v_first,''), NULLIF(v_last,''), NEW.email, v_org_id);

  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (v_org_id, NEW.id, 'owner');

  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "authenticated read property images" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'property-images');
CREATE POLICY "authenticated upload property images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images');
CREATE POLICY "authenticated update own property images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'property-images' AND owner = auth.uid());
CREATE POLICY "authenticated delete own property images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'property-images' AND owner = auth.uid());