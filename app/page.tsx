"use client";

import { useCallback, useState } from "react";
import Aurora from "@/components/Aurora";
import Header, { type TabId } from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Projects from "@/components/Projects";
import AuroraPlayground from "@/components/AuroraPlayground";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [tab, setTab] = useState<TabId>("home");

  const handleTab = useCallback((t: TabId) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="relative min-h-screen">
      <Aurora />
      <Header tab={tab} onTab={handleTab} />
      <main className="relative z-10">
        {tab === "home" && (
          <div key="home" className="tab-panel">
            <Hero onTab={handleTab} />
            <Services />
          </div>
        )}
        {tab === "about" && (
          <div key="about" className="tab-panel pt-16">
            <About />
          </div>
        )}
        {tab === "projects" && (
          <div key="projects" className="tab-panel pt-16">
            <Projects />
          </div>
        )}
        {tab === "playground" && (
          <div key="playground" className="tab-panel pt-16">
            <AuroraPlayground />
          </div>
        )}
        {tab === "experience" && (
          <div key="experience" className="tab-panel pt-16">
            <Experience />
          </div>
        )}
        {tab === "contact" && (
          <div key="contact" className="tab-panel pt-16">
            <Contact />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
