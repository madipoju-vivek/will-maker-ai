import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, X } from "lucide-react";
import { motion } from "motion/react";

const FREE_FEATURES = [
  { text: "1 Last Will & Testament", included: true },
  { text: "Basic AI generation", included: true },
  { text: "PDF download (watermarked)", included: true },
  { text: "Save & edit drafts", included: true },
  { text: "Power of Attorney document", included: false },
  { text: "Healthcare Directive", included: false },
  { text: "Unlimited document storage", included: false },
  { text: "Priority AI processing", included: false },
  { text: "Legal compliance review", included: false },
];

const PREMIUM_FEATURES = [
  { text: "Unlimited documents of all types", included: true },
  { text: "Advanced AI generation", included: true },
  { text: "Clean, watermark-free PDFs", included: true },
  { text: "Save & edit drafts (unlimited)", included: true },
  { text: "Power of Attorney document", included: true },
  { text: "Healthcare Directive", included: true },
  { text: "Unlimited document storage", included: true },
  { text: "Priority AI processing", included: true },
  { text: "Legal compliance review", included: true },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 lg:py-28 bg-muted/20"
      data-ocid="pricing.section"
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
            Simple Pricing
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
            Start free, upgrade when ready
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            No hidden fees. Cancel anytime. Your documents are always yours.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free tier */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0 }}
          >
            <Card
              className="h-full border-border/50 bg-card/40"
              data-ocid="pricing.free_card"
            >
              <CardContent className="p-7">
                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">
                    Free
                  </h3>
                  <div className="flex items-end gap-1 mt-3">
                    <span className="font-display font-bold text-4xl text-foreground">
                      $0
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">
                      /forever
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Perfect for getting started with a single will.
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full mb-7 border-border hover:border-primary/50 hover:bg-primary/5"
                  data-ocid="pricing.free_cta_button"
                >
                  <a href="/signup">Get Started Free</a>
                </Button>

                <ul className="space-y-3">
                  {FREE_FEATURES.map((item) => (
                    <li
                      key={item.text}
                      className={`flex items-center gap-2.5 text-sm ${
                        item.included
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {item.included ? (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      )}
                      {item.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium tier */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <Card
              className="h-full relative overflow-hidden border-primary/40 bg-card/60 glow-primary"
              data-ocid="pricing.premium_card"
            >
              {/* Popular ribbon */}
              <div className="absolute top-4 right-4">
                <Badge className="gradient-primary border-0 text-white gap-1">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </Badge>
              </div>

              {/* Subtle top highlight */}
              <div className="absolute top-0 inset-x-0 h-[2px] gradient-primary" />

              <CardContent className="p-7">
                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">
                    Premium
                  </h3>
                  <div className="flex items-end gap-1 mt-3">
                    <span className="font-display font-bold text-4xl text-foreground">
                      $19
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">
                      /month
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Full access for complete estate planning.
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full mb-7 gradient-primary glow-primary border-0 font-semibold"
                  data-ocid="pricing.premium_cta_button"
                >
                  <a href="/signup">Start Premium Trial</a>
                </Button>

                <ul className="space-y-3">
                  {PREMIUM_FEATURES.map((item) => (
                    <li
                      key={item.text}
                      className="flex items-center gap-2.5 text-sm text-foreground"
                    >
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.p
          className="text-center text-xs text-muted-foreground mt-10 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          No credit card required for the free tier. Premium billed monthly or
          annually. All plans include end-to-end encryption and secure storage.
        </motion.p>
      </div>
    </section>
  );
}
