import { Card, CardContent } from "@/components/ui/card";
import {
  BotMessageSquare,
  FileCheck,
  Lock,
  RefreshCcw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: FileCheck,
    title: "Comprehensive Documents",
    description:
      "Generate complete, legally-structured documents covering all essential clauses and provisions required by law.",
    color: "text-primary",
    glow: "oklch(60% 0.15 230 / 0.2)",
  },
  {
    icon: ShieldCheck,
    title: "Legally Compliant",
    description:
      "Drafted to meet current legal standards in your jurisdiction. Our AI stays up-to-date with the latest regulations.",
    color: "text-primary",
    glow: "oklch(65% 0.18 150 / 0.2)",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your personal data is encrypted and protected with enterprise-grade security. We never share your information.",
    color: "text-accent",
    glow: "oklch(65% 0.15 280 / 0.2)",
  },
  {
    icon: BotMessageSquare,
    title: "AI-Powered",
    description:
      "Efficient document creation tailored to your unique circumstances using the latest large language models.",
    color: "text-primary",
    glow: "oklch(70% 0.12 195 / 0.2)",
  },
  {
    icon: UserCheck,
    title: "Simple Step-by-Step Process",
    description:
      "A guided multi-step form makes the process approachable for everyone — no legal knowledge required.",
    color: "text-accent",
    glow: "oklch(75% 0.15 75 / 0.2)",
  },
  {
    icon: RefreshCcw,
    title: "Update Anytime",
    description:
      "Life changes — your documents should too. Edit and re-generate your will whenever your circumstances change.",
    color: "text-accent",
    glow: "oklch(65% 0.18 20 / 0.2)",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-20 lg:py-28 bg-muted/20"
      data-ocid="features.section"
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
            Why Will Maker AI
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
            Everything you need to protect your legacy
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            Our platform combines advanced AI with legal expertise to make
            estate planning accessible to everyone.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Card
                className="h-full glass-hover border-border/50 bg-card/40"
                data-ocid={`features.card.${i + 1}`}
              >
                <CardContent className="p-6">
                  <div
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                    style={{ background: feature.glow }}
                  >
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-base text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
