import { lazy, Suspense } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import GameBackground from "./components/GameBackground";
import DemoBg from "./components/DemoBg";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import SectionSkeleton from "./components/SectionSkeleton";

/* Lazy-loaded sections — only download when user scrolls near them */
const StoryCategories = lazy(() => import("./components/StoryCategories"));
const StoryReaderDemo = lazy(() => import("./components/StoryReaderDemo"));
const Features = lazy(() => import("./components/Features"));
const KidModeDemo = lazy(() => import("./components/KidModeDemo"));
const HowItWorks = lazy(() => import("./components/HowItWorks"));
const ParentDashboardDemo = lazy(
  () => import("./components/ParentDashboardDemo"),
);
const Testimonials = lazy(() => import("./components/Testimonials"));
const Pricing = lazy(() => import("./components/Pricing"));
const Contact = lazy(() => import("./components/Contact"));
const CTA = lazy(() => import("./components/CTA"));
const Footer = lazy(() => import("./components/Footer"));

export default function App() {
  return (
    <div className="min-h-screen">
      <GameBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <DemoBg />
        <Hero />
        <Stats />
        <Suspense fallback={<SectionSkeleton height="640px" />}>
          <StoryReaderDemo />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="560px" />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="520px" />}>
          <StoryCategories />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="480px" />}>
          <KidModeDemo />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="480px" />}>
          <HowItWorks />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <ParentDashboardDemo />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="480px" />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="560px" />}>
          <Pricing />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="480px" />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="240px" />}>
          <CTA />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="200px" />}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}
