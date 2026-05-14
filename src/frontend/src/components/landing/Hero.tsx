import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Play, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Bank-Level Encryption" },
  { icon: Sparkles, label: "AI-Powered" },
  { icon: Zap, label: "Ready in Minutes" },
];

export function Hero() {
  const { isAuthenticated } = useAuth();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-background"
      data-ocid="hero.section"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(60% 0.15 230 / 0.4), transparent 70%)",
          }}
        />
        <div
          className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, oklch(50% 0.12 185 / 0.3), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, oklch(60% 0.15 230 / 0.5), transparent 60%)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(oklch(60% 0.15 230 / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, oklch(60% 0.15 230 / 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="flex flex-col items-center text-center">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 text-xs border-primary/30 bg-primary/10 text-primary gap-1.5"
            >
              <Sparkles className="h-3 w-3" />
              AI-Powered Legal Documents
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-foreground max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Generate Your Legal Will
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(60% 0.15 230), oklch(50% 0.12 185))",
              }}
            >
              in Minutes with AI
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Trustworthy, secure, and legally binding document generation,
            powered by advanced artificial intelligence. Protect your family's
            future with confidence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isAuthenticated ? (
              <Button
                size="lg"
                asChild
                className="gradient-primary glow-primary border-0 h-12 px-8 text-base font-semibold transition-smooth hover:scale-105"
                data-ocid="hero.dashboard_button"
              >
                <a href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button
                size="lg"
                asChild
                className="gradient-primary glow-primary border-0 h-12 px-8 text-base font-semibold transition-smooth hover:scale-105"
                data-ocid="hero.get_started_button"
              >
                <a href="/signin">
                  Start My Free Will
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFeatures}
              className="h-12 px-8 text-base border-border hover:border-primary/50 hover:bg-primary/5 transition-smooth"
              data-ocid="hero.explore_features_button"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              Explore Features
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground"
              >
                <badge.icon className="h-3.5 w-3.5 text-primary" />
                {badge.label}
              </div>
            ))}
          </motion.div>

          {/* Hero image */}
          <motion.div
            className="mt-16 w-full max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="relative rounded-2xl overflow-hidden glass glow-primary">
              <img
                src="/assets/generated/hero-legal-ai.dim_1200x600.jpg"
                alt="Will Maker AI — Generate legal documents with AI"
                className="w-full h-auto block"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="relative z-10 border-t border-border bg-muted/30 py-3">
        <p className="text-center text-xs text-muted-foreground px-4">
          ⚠️ This platform does not replace licensed legal advice. Always consult
          a qualified attorney for complex legal matters.
        </p>
      </div>
    </section>
  );
}
