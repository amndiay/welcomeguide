import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  LayoutDashboard,
  Home,
  BookOpen,
  MapPin,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useAppCopy } from "@/hooks/use-app-copy";
import { supabase } from "@/integrations/supabase/client";
import { amIPlatformAdmin } from "@/lib/admin.functions";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { to: "/logements", icon: Home, key: "properties" },
  { to: "/livrets", icon: BookOpen, key: "guides" },
  { to: "/adresses", icon: MapPin, key: "places" },
  { to: "/parametres", icon: Settings, key: "settings" },
] as const;

/** Sidebar layout shared by every authenticated page. */
export function DashboardShell({ children }: { children: ReactNode }) {
  const copy = useAppCopy();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const checkAdmin = useServerFn(amIPlatformAdmin);
  const admin = useQuery({
    queryKey: ["platform-admin"],
    queryFn: () => checkAdmin(),
    staleTime: 5 * 60 * 1000,
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/connexion", replace: true });
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "bg-secondary text-foreground" }}
        >
          <item.icon className="size-4" />
          {copy.nav[item.key]}
        </Link>
      ))}
      {admin.data?.isAdmin && (
        <Link
          to="/admin"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "bg-secondary text-foreground" }}
        >
          <ShieldCheck className="size-4" />
          Administration
        </Link>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft lg:flex">
          <div className="space-y-8">
            <Link to="/dashboard">
              <Logo />
            </Link>
            {nav}
          </div>
          <div className="space-y-3">
            <LanguageToggle />
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {copy.nav.backToSite}
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              {copy.nav.signOut}
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-soft lg:hidden">
            <Link to="/dashboard">
              <Logo />
            </Link>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {open && (
            <div className="mb-4 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft lg:hidden">
              {nav}
              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <LanguageToggle />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl"
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4" />
                  {copy.nav.signOut}
                </Button>
              </div>
            </div>
          )}

          <main className="pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
