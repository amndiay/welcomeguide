REVOKE EXECUTE ON FUNCTION public.current_org_id() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_org_role(public.org_role[]) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.owns_guide(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;