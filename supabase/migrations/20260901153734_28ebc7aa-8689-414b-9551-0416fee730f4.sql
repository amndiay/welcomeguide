GRANT EXECUTE ON FUNCTION public.current_org_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_org_role(public.org_role[]) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.owns_guide(uuid) TO authenticated, service_role;