import { HeroSection } from '@/components/home/hero-section';
import { StatsBar } from '@/components/home/stats-bar';
import { ProblemSection } from '@/components/home/problem-section';
import { SolutionSection } from '@/components/home/solution-section';
import { HowItWorks } from '@/components/home/how-it-works';
import { UseCasesGrid } from '@/components/home/use-cases-grid';
import { TrustedBy } from '@/components/home/trusted-by';
import { FinalCta } from '@/components/home/final-cta';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <UseCasesGrid />
      <TrustedBy />
      <FinalCta />
    </>
  );
}
