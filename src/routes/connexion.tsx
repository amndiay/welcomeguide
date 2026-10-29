import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { useAppCopy } from "@/hooks/use-app-copy";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const title = "Connexion — Dalal";
const description =
  "Accédez à votre espace Dalal pour créer et mettre à jour les livrets d'accueil de vos logements.";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const copy = useAppCopy();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in visitors go straight to their space.
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { first_name: firstName, last_name: lastName },
          },
        });
        if (error) throw error;
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate({ to: "/onboarding" });
        } else {
          toast.success(copy.auth.checkEmail);
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/connexion`,
        });
        if (error) throw error;
        toast.success(copy.auth.resetSent);
        setMode("signin");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(String(result.error));
      if (result.redirected) return;
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  const heading =
    mode === "signin"
      ? copy.auth.signInTitle
      : mode === "signup"
        ? copy.auth.signUpTitle
        : copy.auth.resetTitle;
  const sub =
    mode === "signin"
      ? copy.auth.signInDescription
      : mode === "signup"
        ? copy.auth.signUpDescription
        : copy.auth.resetDescription;

  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-20 sm:px-6 sm:py-24">
      <Logo />
      <div className="mt-8 w-full rounded-3xl border border-border bg-card p-7 shadow-soft">
        <h1 className="text-xl font-semibold text-card-foreground">{heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{sub}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">{copy.auth.firstName}</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{copy.auth.lastName}</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{copy.auth.email}</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {mode !== "reset" && (
            <div className="space-y-2">
              <Label htmlFor="password">{copy.auth.password}</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          )}

          <Button type="submit" className="w-full rounded-full" disabled={busy}>
            {busy && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            {mode === "signin"
              ? copy.auth.signIn
              : mode === "signup"
                ? copy.auth.signUp
                : copy.auth.sendReset}
          </Button>
        </form>

        {mode !== "reset" && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              {copy.auth.or}
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              disabled={busy}
              onClick={() => void handleGoogle()}
            >
              {copy.auth.google}
            </Button>
          </>
        )}

        <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
          {mode === "signin" ? (
            <>
              <p>
                {copy.auth.noAccount}{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline"
                  onClick={() => setMode("signup")}
                >
                  {copy.auth.signUp}
                </button>
              </p>
              <button
                type="button"
                className="font-medium text-primary underline"
                onClick={() => setMode("reset")}
              >
                {copy.auth.forgot}
              </button>
            </>
          ) : (
            <p>
              {copy.auth.haveAccount}{" "}
              <button
                type="button"
                className="font-medium text-primary underline"
                onClick={() => setMode("signin")}
              >
                {copy.auth.signIn}
              </button>
            </p>
          )}
          <p>
            {t.login.hintBefore}{" "}
            <Link to="/exemple" className="font-medium text-primary underline">
              {t.login.hintLink}
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
