import Hero from "@/components/sections/Hero";
import LenderBand from "@/components/sections/LenderBand";
import BillsStress from "@/components/sections/BillsStress";
import SavingsCalculator from "@/components/sections/SavingsCalculator";
import LoanOffers from "@/components/sections/LoanOffers";
import ThreeSteps from "@/components/sections/ThreeSteps";
import Journey from "@/components/sections/Journey";
import CopilotChat from "@/components/sections/CopilotChat";
import Testimonials from "@/components/sections/TestimonialsNew";
import Consultants from "@/components/sections/Consultants";
import CtaBand from "@/components/sections/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <LenderBand />
      <BillsStress />
      <SavingsCalculator />
      <LoanOffers />
      <ThreeSteps />
      <Journey />
      <CopilotChat />
      <Testimonials />
      <Consultants />
      <CtaBand />
    </>
  );
}
