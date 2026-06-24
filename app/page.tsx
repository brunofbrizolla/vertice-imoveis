import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import Metrics from "@/components/Metrics";
import Features from "@/components/Features";
import Properties from "@/components/Properties";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";

export const revalidate = 0;

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchSection />
      <Metrics />
      <Features />
      <Properties />
      <About />
      <Testimonials />
      <CtaBanner />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <ChatBot />
    </>
  );
}
