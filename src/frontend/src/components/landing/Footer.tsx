import { Separator } from "@/components/ui/separator";
import { Scale } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Document Types", href: "/#documents" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Status", href: "/status" },
    { label: "Caffeine AI", href: "https://caffeine.ai" },
  ],
};

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-card border-t border-border"
      data-ocid="footer.section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        {/* Top row: logo + nav columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary group-hover:scale-105 transition-smooth">
                <Scale className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-base text-foreground">
                Will Maker <span className="text-primary">AI</span>
              </span>
            </a>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              AI-powered legal document generation. Protect your family's future
              today.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
                {group}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      data-ocid={`footer.${group.toLowerCase()}_${link.label.toLowerCase().replace(/ /g, "_")}_link`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-border/50" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {year} Will Maker AI. All rights reserved.</p>
          <p className="text-center">
            ⚠️ This platform does not replace licensed legal advice.
          </p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
