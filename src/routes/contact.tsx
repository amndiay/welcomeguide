import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { site } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageProvider";

const title = "Contacter l'équipe Dalal";
const description =
  "Une question sur les livrets d'accueil digitaux, une conciergerie à équiper ? Écrivez-nous, nous répondons en moins de 24 heures.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
          as="h1"
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        description={t.contact.description}
        align="center"
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <a
          href={`mailto:${site.email}`}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary-deep">
            <Mail className="size-5" />
          </span>
          <h3 className="mt-5 text-base font-semibold text-card-foreground">
            {t.contact.emailTitle}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{site.email}</p>
        </a>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-primary-deep">
            <MessageSquare className="size-5" />
          </span>
          <h3 className="mt-5 text-base font-semibold text-card-foreground">
            {t.contact.demoTitle}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.contact.demoBody}
          </p>
        </div>
      </div>
    </section>
  );
}
