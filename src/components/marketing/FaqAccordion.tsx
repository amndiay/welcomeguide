import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { useLanguage } from "@/i18n/LanguageProvider";

export function FaqAccordion() {
  const { t } = useLanguage();

  return (
    <section className="bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.faq.eyebrow}
          title={t.faq.title}
          align="center"
        />
        <Accordion type="single" collapsible className="mt-10">
          {t.faq.items.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-b border-border"
            >
              <AccordionTrigger className="text-left text-base font-medium text-card-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
