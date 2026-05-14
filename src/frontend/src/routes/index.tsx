import { DocumentTypes } from "@/components/landing/DocumentTypes";
import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/Features";
import { LandingFooter } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Pricing } from "@/components/landing/Pricing";
import { Navbar } from "@/components/layout/Navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <DocumentTypes />
      <Pricing />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
