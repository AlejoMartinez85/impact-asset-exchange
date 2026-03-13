import { motion, type Easing } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, ShieldCheck, Cpu, Satellite, Users, MapPin, Radio, ClipboardCheck, FileText, Flame, Warehouse, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

const ease: Easing = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease },
  }),
};

const sectionFade = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const poPWItems = [
  {
    icon: ShieldCheck,
    title: "Hardware Resilience",
    description: "IP67 military-grade solar infrastructure designed for extreme last-mile environments.",
  },
  {
    icon: Cpu,
    title: "Edge Computing",
    description: "Integrated MPPT (Maximum Power Point Tracking) microcontrollers that process voltage, current, and environmental data at the source.",
  },
  {
    icon: Satellite,
    title: "Unbreakable Connectivity",
    description: "Direct integration with Starlink satellite networks, ensuring 24/7 telemetry transmission regardless of geographic isolation.",
  },
  {
    icon: Users,
    title: "Social License to Operate",
    description: "Deployed utilizing a proven grassroots methodology that guarantees community ownership, resulting in a zero-vandalism operational track record.",
  },
];

const pipelineSteps = [
  {
    step: "01",
    icon: MapPin,
    title: "Deploy (CapEx)",
    description: 'Corporate sponsors fund the deployment of a "Corporate Impact Cluster" (e.g., 50 ELISA nodes).',
  },
  {
    step: "02",
    icon: Radio,
    title: "Mine (Telemetry)",
    description: "Nodes continuously harvest solar energy, providing public lighting and Wi-Fi, while transmitting raw data packets to our secure backend.",
  },
  {
    step: "03",
    icon: ClipboardCheck,
    title: "Audit (Verification)",
    description: "The Impact Exchange engine cross-references telemetry against global reporting standards.",
  },
  {
    step: "04",
    icon: FileText,
    title: "Report (Compliance)",
    description: "Automated generation of machine-readable CSRD digital tags and PDF certificates for third-party assurance firms.",
  },
];

const lifecycleSteps = [
  {
    icon: Warehouse,
    title: "Sponsorship",
    description: "A corporation purchases a 50-pole cluster for $19,995 (CapEx) + $4,995/yr SaaS (OpEx).",
  },
  {
    icon: Rocket,
    title: "Minting",
    description: "As the physical cluster operates, it mints 50 $LITRO tokens monthly into the corporate sponsor's isolated dashboard.",
  },
  {
    icon: Flame,
    title: "Retirement (Burning)",
    description: 'To claim the ESG impact for their annual reports, the corporation must "burn" the tokens. This triggers an immutable, timestamped certificate proving that the impact was consumed for regulatory compliance and cannot be resold or claimed by another entity.',
  },
];

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Title Block */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            <Satellite className="h-3.5 w-3.5 text-primary" />
            DePIN Protocol Whitepaper
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] leading-[1.1] mb-4">
            $LITRO Protocol: The Impact Intelligence Network
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Decentralized Physical Infrastructure (DePIN) for Immutable ESG Compliance
          </p>
          <Separator className="my-8 mx-auto max-w-xs" />
          <p className="text-sm text-muted-foreground">
            By <span className="font-medium text-foreground">Camilo Herrera</span>, Ambassador Of Light / CEO
            <br />
            <span className="font-mono text-xs">Version 1.0 (Enterprise Draft)</span>
          </p>
        </motion.div>

        {/* Abstract */}
        <Section index={1} title="Abstract">
          <p>
            The global transition towards sustainable supply chains is paralyzed by a systemic trust deficit. Current Environmental, Social, and Governance (ESG) reporting relies heavily on manual estimations, third-party consultants, and delayed data, creating massive legal exposure for corporations under new frameworks like the European CSRD and the SEC's climate disclosure rules. The <strong>$LITRO Protocol</strong> solves the "Oracle Problem" of ESG reporting by bridging physical last-mile infrastructure with cryptographic verification. By deploying ruggedized, IoT-enabled solar telecommunications nodes (ELISA®) in off-grid regions, we generate a continuous stream of real-time, AI-audited telemetry. This document outlines the architecture of our Impact Intelligence platform, which transforms solar energy and digital inclusion into programmable, auditable, and burnable ESG assets.
          </p>
        </Section>

        {/* Section 1 */}
        <Section index={2} title="1. The Market Failure: The Greenwashing Trap">
          <p className="mb-6">
            Corporations are legally mandated to report their Scope 3 emissions and social impact across their global supply chains. However, traditional philanthropic and sustainability investments yield "photos and promises" rather than verifiable data.
          </p>
          <Card className="border-border bg-muted/30 mb-4">
            <CardContent className="p-5">
              <h4 className="font-semibold text-foreground mb-1.5">The Oracle Problem</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Blockchains and financial ledgers are blind to the physical world. Without hardware acting as a secure bridge, any ESG data inputted into a ledger can be manipulated.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-muted/30">
            <CardContent className="p-5">
              <h4 className="font-semibold text-foreground mb-1.5">The Compliance Burden</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manual auditing is slow, expensive, and fails the strict data immutability requirements of modern regulatory frameworks (GRI, SASB, GHG Protocol).
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* Section 2: PoPW */}
        <Section index={3} title="2. The Solution: Proof of Physical Work (PoPW)">
          <p className="mb-8">
            We bypass manual reporting entirely through a <strong>Hardware-Enabled SaaS</strong> model. The core of the $LITRO Protocol is the physical deployment of proprietary hardware acting as autonomous data-mining nodes.
          </p>
          <div className="space-y-4">
            {poPWItems.map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-0.5">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 3: Architecture */}
        <Section index={4} title="3. Protocol Architecture: The Impact Flywheel">
          <p className="mb-8">
            Our end-to-end pipeline transforms physical solar infrastructure into auditable financial instruments in four precise steps:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pipelineSteps.map((step) => (
              <Card key={step.step} className="border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs font-bold text-primary">{step.step}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <step.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Section 4: Tokenomics */}
        <Section index={5} title="4. $LITRO Tokenomics: The Mathematics of Impact">
          <p className="mb-6">
            The <strong>$LITRO token</strong> is not a speculative cryptocurrency. It is a programmable, non-tradable utility receipt representing a mathematically verified unit of environmental and social impact.
          </p>
          <p className="mb-6">
            We define the minting of 1 $LITRO as the equivalent of <strong>1 Month of Audited Operation</strong> for a single ELISA Node. The underlying value is calculated through continuous IoT telemetry:
          </p>

          <MathBlock>
            <BlockMath math="1 \text{ LITRO} = E_{\text{mitigation}} + C_{\text{connectivity}} + S_{\text{social}}" />
          </MathBlock>

          <h3 className="font-serif text-xl font-semibold text-foreground mt-10 mb-3">
            A. Renewable Energy &amp; Scope 3 Mitigation (<InlineMath math="E_{\text{mitigation}}" />)
          </h3>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Calculated by integrating the power generated over time, multiplied by the UNFCCC standardized Emission Factor (<InlineMath math="FE" />) for displaced off-grid kerosene/diesel.
          </p>
          <MathBlock>
            <BlockMath math="E_{\text{mitigation}} = \left( \sum_{t=1}^{n} \frac{V_t \times I_t \times \Delta t}{1000} \right) \times FE" />
          </MathBlock>

          <h3 className="font-serif text-xl font-semibold text-foreground mt-10 mb-3">
            B. Digital Inclusion (<InlineMath math="C_{\text{connectivity}}" />)
          </h3>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            The aggregate bandwidth distributed to off-grid users via the Starlink router, aligned with SASB TC-TL-230a.1 standards.
          </p>
          <MathBlock>
            <BlockMath math="C_{\text{connectivity}} = \sum (D_{\text{download}} + D_{\text{upload}}) \text{ in Gigabytes}" />
          </MathBlock>

          <h3 className="font-serif text-xl font-semibold text-foreground mt-10 mb-3">
            C. Verified Social Impact (<InlineMath math="S_{\text{social}}" />)
          </h3>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Active hours of nighttime illumination multiplied by the localized census density (<InlineMath math="D_c" />), strictly tied to the hardware's operational uptime.
          </p>
          <MathBlock>
            <BlockMath math="S_{\text{social}} = (P_{\text{active}} \times \text{Hours}_{\text{operational}}) \times D_c" />
          </MathBlock>

          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-foreground">
                <strong>Smart Contract Minting:</strong>{" "}
                <span className="text-muted-foreground font-normal">
                  If the node fails to transmit cryptographic proof of these three variables, the minting process halts. There is zero room for estimation.
                </span>
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* Section 5: Mint & Burn */}
        <Section index={6} title="5. Corporate Asset Lifecycle (Mint & Burn)">
          <p className="mb-8">
            To ensure compliance and prevent double-counting, the $LITRO Protocol operates on a strict <strong>Mint-and-Burn lifecycle</strong> for enterprise clients:
          </p>
          <div className="space-y-4">
            {lifecycleSteps.map((item, i) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground font-mono text-xs font-bold">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-0.5">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 6: Execution */}
        <Section index={7} title="6. Execution Capability & Immediate Scalability">
          <p className="mb-4">
            Litro de Luz is not conceptualizing this infrastructure; we are actively scaling it. With our headquarters in Cali, Colombia, we currently hold an active inventory of <strong>462 ELISA nodes</strong> fully assembled and ready for immediate deployment.
          </p>
          <p>
            We possess the hardware, the proprietary logistics network to reach the hardest-to-serve regions of the global supply chain, and the enterprise-grade software to audit the results.
          </p>
        </Section>

        {/* Footer CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionFade}
          className="mt-24 text-center"
        >
          <Separator className="mb-16 mx-auto max-w-xs" />
          <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 leading-snug">
            Welcome to the era of Impact Intelligence.
          </p>
          <Link to="/login">
            <Button size="lg" className="h-13 px-10 text-base font-semibold gap-2">
              <Rocket className="h-5 w-5" />
              Deploy a Corporate Cluster
            </Button>
          </Link>
          <p className="mt-6 text-xs text-muted-foreground">
            $LITRO Protocol · Version 1.0 · Enterprise Draft · © {new Date().getFullYear()} Litro de Luz
          </p>
        </motion.div>
      </main>
    </div>
  );
}

/* ── Reusable sub-components ─────────────────────────────── */

function Section({ title, children, index }: { title: string; children: React.ReactNode; index: number }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={sectionFade}
      className="mb-16"
    >
      <h2 className="font-serif text-2xl font-bold text-foreground mb-5 tracking-tight">{title}</h2>
      <div className="text-muted-foreground leading-[1.8] text-[0.95rem]">{children}</div>
    </motion.section>
  );
}

function MathBlock({ children }: { children: React.ReactNode }) {
  return (
    <Card className="my-6 border-border bg-muted/40">
      <CardContent className="flex items-center justify-center p-6 overflow-x-auto">
        {children}
      </CardContent>
    </Card>
  );
}
