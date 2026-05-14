import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, ArrowRight, FileHeart, FileText, Scale } from "lucide-react";
import { motion } from "motion/react";

const DOCUMENT_TYPES = [
  {
    icon: Scale,
    title: "Last Will & Testament",
    badge: "Most Popular",
    badgeVariant: "default" as const,
    description:
      "Specify how your assets, property, and possessions should be distributed after your passing. Appoint guardians for minor children.",
    highlights: [
      "Asset distribution instructions",
      "Guardian appointments",
      "Executor designation",
      "Specific bequeaths & charitable gifts",
    ],
    href: "/signin",
    accent: "oklch(60% 0.15 230 / 0.15)",
  },
  {
    icon: FileText,
    title: "Power of Attorney",
    badge: "Financial",
    badgeVariant: "secondary" as const,
    description:
      "Authorize a trusted person to manage your financial and legal affairs if you become incapacitated or unavailable.",
    highlights: [
      "Financial decision authority",
      "Property management rights",
      "Banking & investment access",
      "Durable or springing options",
    ],
    href: "/signin",
    accent: "oklch(50% 0.12 185 / 0.15)",
  },
  {
    icon: FileHeart,
    title: "Healthcare Directive",
    badge: "Medical",
    badgeVariant: "outline" as const,
    description:
      "Communicate your medical preferences and appoint someone to make healthcare decisions on your behalf.",
    highlights: [
      "End-of-life care instructions",
      "Healthcare proxy appointment",
      "DNR & life support preferences",
      "Organ donation wishes",
    ],
    href: "/signin",
    accent: "oklch(65% 0.15 15 / 0.15)",
  },
];

export function DocumentTypes() {
  return (
    <section
      id="documents"
      className="py-20 lg:py-28 bg-background"
      data-ocid="documents.section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Document Library
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
            Legal documents for every need
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            From wills to healthcare directives — all the essential estate
            planning documents, powered by AI.
          </p>
        </motion.div>

        {/* Document cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DOCUMENT_TYPES.map((doc, i) => (
            <motion.div
              key={doc.title}
              className="flex"
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                className="flex flex-col w-full border-border/50 bg-card/60 hover:border-primary/30 transition-smooth group"
                style={{ boxShadow: `0 0 0 0 ${doc.accent}` }}
                data-ocid={`documents.card.${i + 1}`}
              >
                <CardContent className="flex flex-col flex-1 p-6">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl transition-smooth group-hover:scale-110"
                      style={{ background: doc.accent }}
                    >
                      <doc.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant={doc.badgeVariant} className="text-xs">
                      {doc.badge}
                    </Badge>
                  </div>

                  {/* Title & description */}
                  <h3 className="font-display font-semibold text-lg text-foreground mb-3">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {doc.description}
                  </p>

                  {/* Feature bullets */}
                  <ul className="flex-1 space-y-2 mb-6">
                    {doc.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Activity className="h-3.5 w-3.5 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/60 transition-smooth group/btn"
                    data-ocid={`documents.cta_button.${i + 1}`}
                  >
                    <a href={doc.href}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-smooth group-hover/btn:translate-x-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
