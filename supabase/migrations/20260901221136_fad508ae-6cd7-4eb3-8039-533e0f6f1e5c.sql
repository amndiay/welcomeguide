-- 1. Table des administrateurs plateforme (séparée des rôles d'organisation)
CREATE TABLE public.platform_admins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

GRANT SELECT ON public.platform_admins TO authenticated;
GRANT ALL ON public.platform_admins TO service_role;

ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

-- 2. Fonction sécurisée
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_admins a WHERE a.user_id = auth.uid()
  );
$$;

CREATE POLICY "admins read platform admins"
ON public.platform_admins FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_platform_admin());

-- 3. Attribution automatique sur e-mail vérifié
CREATE OR REPLACE FUNCTION public.grant_platform_admin_for_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) = 'mathz8@yahoo.fr' THEN
    INSERT INTO public.platform_admins (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_platform_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_platform_admin_for_email();

CREATE TRIGGER on_auth_user_confirmed_grant_platform_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_platform_admin_for_email();

-- Rattraper un compte déjà existant et vérifié
INSERT INTO public.platform_admins (user_id)
SELECT id FROM auth.users
WHERE lower(email) = 'mathz8@yahoo.fr' AND email_confirmed_at IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- 4. Politiques de lecture globale pour les admins plateforme
CREATE POLICY "platform admins read all profiles"
ON public.profiles FOR SELECT TO authenticated USING (public.is_platform_admin());

CREATE POLICY "platform admins read all organizations"
ON public.organizations FOR SELECT TO authenticated USING (public.is_platform_admin());

CREATE POLICY "platform admins read all members"
ON public.organization_members FOR SELECT TO authenticated USING (public.is_platform_admin());

CREATE POLICY "platform admins read all properties"
ON public.properties FOR SELECT TO authenticated USING (public.is_platform_admin());

CREATE POLICY "platform admins read all recommendations"
ON public.recommendations FOR SELECT TO authenticated USING (public.is_platform_admin());

CREATE POLICY "platform admins read all analytics"
ON public.analytics_events FOR SELECT TO authenticated USING (public.is_platform_admin());

CREATE POLICY "platform admins read all subscriptions"
ON public.subscriptions FOR SELECT TO authenticated USING (public.is_platform_admin());

-- 5. Gestion complète des livrets et de leur contenu
CREATE POLICY "platform admins manage all guides"
ON public.guides FOR ALL TO authenticated
USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "platform admins manage all guide sections"
ON public.guide_sections FOR ALL TO authenticated
USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "platform admins manage all guide blocks"
ON public.guide_blocks FOR ALL TO authenticated
USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "platform admins manage all guide recommendations"
ON public.guide_recommendations FOR ALL TO authenticated
USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());