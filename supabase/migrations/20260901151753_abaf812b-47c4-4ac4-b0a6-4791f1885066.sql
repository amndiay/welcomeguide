REVOKE EXECUTE ON FUNCTION public.current_org_id() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_org_role(public.org_role[]) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.owns_guide(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC;