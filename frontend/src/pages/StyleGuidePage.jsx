import React from 'react';
import Button from '../components/ui/Button';
import Panel from '../components/ui/Panel';
import StatusBadge from '../components/ui/StatusBadge';
import PlannedBadge from '../components/ui/PlannedBadge';
import SyntheticBanner from '../components/ui/SyntheticBanner';
import SectionHeading from '../components/ui/SectionHeading';
import { 
  CheckCircle2, 
  Layers, 
  Type, 
  Palette, 
  Sliders, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function StyleGuidePage() {
  const contrastData = [
    { pair: "Headline Highlight (#E4DFEE) on Midnight (#06070B)", type: "Large & Display Text", ratio: "15.43:1", wcag: "AAA (Pass)" },
    { pair: "Headline Highlight (#E4DFEE) on Deep Black (#0A0A0A)", type: "Headers on Panels", ratio: "15.17:1", wcag: "AAA (Pass)" },
    { pair: "Soft Lavender (#C9C2DC) on Midnight (#06070B)", type: "Clinical Body Copy", ratio: "11.73:1", wcag: "AAA (Pass)" },
    { pair: "Soft Lavender (#C9C2DC) on Deep Black (#0A0A0A)", type: "Table & Card Text", ratio: "11.53:1", wcag: "AAA (Pass)" },
    { pair: "Muted Lavender (#8E88A8) on Midnight (#06070B)", type: "Small Eyebrows & Metadata", ratio: "5.98:1", wcag: "AA (Pass, >4.5:1)" },
    { pair: "Muted Lavender (#8E88A8) on Deep Black (#0A0A0A)", type: "Small Table Footnotes", ratio: "5.88:1", wcag: "AA (Pass, >4.5:1)" },
    { pair: "Electric Blue (#007BA7) on Midnight (#06070B)", type: "Large Text Only (>=24px)", ratio: "4.21:1", wcag: "AA Large (Pass, >3.0:1)" },
    { pair: "Pass Text (#34D399) on Deep Black (#0A0A0A)", type: "Status Badge (Small)", ratio: "10.30:1", wcag: "AAA (Pass)" },
    { pair: "Missing Text (#FBBF24) on Deep Black (#0A0A0A)", type: "Status Badge (Small)", ratio: "11.86:1", wcag: "AAA (Pass)" },
    { pair: "Conflict Text (#C084FC) on Deep Black (#0A0A0A)", type: "Status Badge (Small)", ratio: "7.49:1", wcag: "AAA (Pass)" },
  ];

  return (
    <div className="min-h-screen bg-midnight text-lavender font-body pb-24">
      {/* Synthetic Banner (Mandatory) */}
      <SyntheticBanner />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 space-y-16">
        
        {/* Style Guide Header */}
        <div className="border-b border-lavender-border pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-electric" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-lavender-muted">
              Design System Specification
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight">
                <span className="text-electric">CLAIM</span>
                <span className="text-lavender-highlight">PILOT</span>
                <span className="text-lavender-muted font-normal text-2xl ml-3">/ Style Guide</span>
              </h1>
              <p className="text-sm text-lavender-muted mt-2 max-w-2xl font-body leading-relaxed">
                Phase 2 atomic tokens, typography scale, 1px hairline system, and unified components.
                Zero out-of-palette colors; headlines use the high-luminance tint derived from <code className="text-lavender-highlight font-mono">#C9C2DC</code> (<code className="text-lavender-highlight font-mono">#E4DFEE</code>). Small text strictly uses lavender tints (&ge; 5.8:1 contrast).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <PlannedBadge type="LIVE" />
              <span className="text-xs font-mono text-lavender-muted">Phase 2 Verification View</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: WCAG CONTRAST AUDIT */}
        <section className="space-y-6">
          <SectionHeading
            tag="Verification 01"
            title="WCAG Contrast Ratio Audit"
            description="Actual calculated mathematical contrast ratios. Small text strictly uses lavender tints (all >= 5.8:1), while #007BA7 (4.21:1) is reserved exclusively for large display text (>=24px), 1px borders, icons, and focus rings."
          />

          <Panel className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-lavender-border text-lavender-muted uppercase tracking-wider text-[11px] bg-midnight">
                    <th className="py-3 px-6">Text / Background Pair</th>
                    <th className="py-3 px-6">Usage Category</th>
                    <th className="py-3 px-6">Calculated Ratio</th>
                    <th className="py-3 px-6">WCAG Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lavender-border">
                  {contrastData.map((row, i) => (
                    <tr key={i} className="hover:bg-lavender-faint transition-colors duration-150">
                      <td className="py-3 px-6 text-lavender-highlight font-medium">{row.pair}</td>
                      <td className="py-3 px-6 text-lavender-muted">{row.type}</td>
                      <td className="py-3 px-6 font-semibold text-lavender-highlight">{row.ratio}</td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center gap-1.5 text-status-pass-text">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {row.wcag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>

        {/* SECTION 2: COLOR PALETTE SPECIFICATION */}
        <section className="space-y-6">
          <SectionHeading
            tag="Token 01"
            title="Palette Specification"
            description="Strictly restricted to the authorized core palette: Midnight Black, Deep Black, Electric Blue, Soft Lavender White, and directly derived neutral tints."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Panel className="p-4 flex flex-col justify-between h-36">
              <div className="w-full h-12 bg-midnight border border-lavender-border rounded-sm" />
              <div>
                <div className="text-xs font-display font-semibold text-lavender-highlight">Midnight Black</div>
                <div className="text-[11px] font-mono text-lavender-muted">#06070B</div>
                <div className="text-[10px] text-lavender-muted/70">Canvas base</div>
              </div>
            </Panel>

            <Panel className="p-4 flex flex-col justify-between h-36">
              <div className="w-full h-12 bg-deepblack border border-lavender-border rounded-sm" />
              <div>
                <div className="text-xs font-display font-semibold text-lavender-highlight">Deep Black</div>
                <div className="text-[11px] font-mono text-lavender-muted">#0A0A0A</div>
                <div className="text-[10px] text-lavender-muted/70">Surface panels</div>
              </div>
            </Panel>

            <Panel className="p-4 flex flex-col justify-between h-36">
              <div className="w-full h-12 bg-electric rounded-sm" />
              <div>
                <div className="text-xs font-display font-semibold text-lavender-highlight">Electric Blue</div>
                <div className="text-[11px] font-mono text-lavender-muted">#007BA7</div>
                <div className="text-[10px] text-lavender-muted/70">Large titles & borders</div>
              </div>
            </Panel>

            <Panel className="p-4 flex flex-col justify-between h-36">
              <div className="w-full h-12 bg-lavender rounded-sm" />
              <div>
                <div className="text-xs font-display font-semibold text-midnight">Soft Lavender</div>
                <div className="text-[11px] font-mono text-lavender-muted">#C9C2DC</div>
                <div className="text-[10px] text-lavender-muted/70">Clinical body text</div>
              </div>
            </Panel>

            <Panel className="p-4 flex flex-col justify-between h-36">
              <div className="w-full h-12 bg-lavender-highlight rounded-sm" />
              <div>
                <div className="text-xs font-display font-semibold text-midnight">Headline Highlight</div>
                <div className="text-[11px] font-mono text-lavender-muted">#E4DFEE</div>
                <div className="text-[10px] text-lavender-muted/70">Derived from #C9C2DC</div>
              </div>
            </Panel>

            <Panel className="p-4 flex flex-col justify-between h-36">
              <div className="w-full h-12 border border-lavender-border bg-lavender-faint rounded-sm" />
              <div>
                <div className="text-xs font-display font-semibold text-lavender-highlight">Hairline Border</div>
                <div className="text-[11px] font-mono text-lavender-muted">rgba(201,194,220,0.12)</div>
                <div className="text-[10px] text-lavender-muted/70">1px boundary system</div>
              </div>
            </Panel>
          </div>
        </section>

        {/* SECTION 3: TYPOGRAPHY HIERARCHY */}
        <section className="space-y-6">
          <SectionHeading
            tag="Token 02"
            title="Typography Hierarchy"
            description="Display and headings in Space Grotesk; clinical reading and tables in Inter; IDs, codes and snippets in JetBrains Mono. Orbitron is permanently removed."
          />

          <Panel className="p-8 space-y-8 divide-y divide-lavender-border">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-lavender-muted mb-2">
                Display Headline — Space Grotesk 64px / Bold (Two-Tone: #007BA7 + #E4DFEE tint)
              </div>
              <div className="text-5xl lg:text-7xl font-display font-bold tracking-tight">
                <span className="text-electric">CLAIM</span>
                <span className="text-lavender-highlight ml-3">PILOT</span>
              </div>
              <div className="text-xs font-display uppercase tracking-[0.2em] text-lavender-muted mt-2">
                WHERE EVIDENCE MEETS <span className="text-lavender-highlight">INTELLIGENCE</span>
              </div>
            </div>

            <div className="pt-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-lavender-muted mb-2">
                Section Heading — Space Grotesk 28px / SemiBold
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-semibold text-lavender-highlight">
                Evidence-Linked Claim Verification
              </h2>
            </div>

            <div className="pt-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-lavender-muted mb-2">
                Clinical Body & Explanation — Inter 13px / 400 & 500
              </div>
              <p className="text-sm text-lavender font-body leading-relaxed max-w-3xl">
                The agent drafts, code verifies, every field traces to its source, and the human approves. 
                Discharge summary notes and billing claims are matched character-for-character against source PDF spans, 
                detecting chronological date inversions and cross-document discrepancies before adjudication.
              </p>
            </div>

            <div className="pt-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-lavender-muted mb-2">
                Verification Mono — JetBrains Mono 12px
              </div>
              <div className="bg-midnight border border-lavender-border p-4 rounded-sm font-mono text-xs text-lavender space-y-1">
                <div><span className="text-lavender-muted">patient_id:</span> <span className="text-lavender-highlight">SYN-0001</span> (discharge_summary.pdf:p1)</div>
                <div><span className="text-lavender-muted">admission_date:</span> <span className="text-lavender-highlight">2026-03-01</span> (agreed across 2 documents)</div>
                <div><span className="text-lavender-muted">discharge_date:</span> <span className="text-status-conflict-text">2026-03-08 vs 2026-03-09</span> [DISCREPANCY]</div>
                <div><span className="text-lavender-muted">icd10_code:</span> <span className="text-lavender-highlight">I21.0</span> (ST elevation myocardial infarction)</div>
              </div>
            </div>
          </Panel>
        </section>

        {/* SECTION 4: BUTTONS */}
        <section className="space-y-6">
          <SectionHeading
            tag="Component 01"
            title="Button Variants"
            description="Crisp 1px borders, restrained transitions, and the circular hairline CTA button directly inspired by HUMAN NEXT."
          />

          <Panel className="p-8 space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">
                Execute Verification
              </Button>

              <Button variant="outline">
                Source Inspector
              </Button>

              <Button variant="ghost">
                Dismiss Notice
              </Button>

              <Button variant="outline" disabled>
                Clearinghouse Submit (Disabled)
              </Button>
            </div>

            <div className="pt-6 border-t border-lavender-border">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-lavender-muted mb-4">
                HUMAN NEXT Reference Call-to-Action (Circular Hairline + Arrow)
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <Button variant="cta">
                  Explore Verification Console
                </Button>

                <Button variant="cta">
                  Inspect Source Documents
                </Button>
              </div>
            </div>
          </Panel>
        </section>

        {/* SECTION 5: BADGES */}
        <section className="space-y-6">
          <SectionHeading
            tag="Component 02 & 03"
            title="StatusBadges & PlannedBadges"
            description="Muted semantic status badges (Pass, Missing, Conflict, Fail, Unable to verify) and navigation state pills (LIVE, SIMULATED, PLANNED)."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Panel className="p-6 space-y-4">
              <div className="text-xs font-display font-semibold text-lavender-highlight">
                Deterministic Rule Evaluation Badges
              </div>
              <p className="text-xs text-lavender-muted font-body">
                Thin-line Lucide icon, 1px border, muted background tint.
              </p>
              
              <div className="flex flex-wrap gap-2.5 pt-2">
                <StatusBadge status="Pass" />
                <StatusBadge status="Missing" />
                <StatusBadge status="Conflict" />
                <StatusBadge status="Fail" />
                <StatusBadge status="Unable to verify" />
              </div>

              <div className="pt-4 border-t border-lavender-border space-y-2">
                <div className="text-[11px] font-mono text-lavender-muted">Confidence & Review Badges:</div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="high" />
                  <StatusBadge status="medium" />
                  <StatusBadge status="low" />
                  <StatusBadge status="verified" />
                  <StatusBadge status="needs_review" />
                  <StatusBadge status="simulated" />
                </div>
              </div>
            </Panel>

            <Panel className="p-6 space-y-4">
              <div className="text-xs font-display font-semibold text-lavender-highlight">
                Navigation Lifecycle Badges (PlannedBadge)
              </div>
              <p className="text-xs text-lavender-muted font-body">
                Distinguishes running prototype features from planned roadmap capabilities.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 bg-midnight p-2 border border-lavender-border rounded-sm">
                  <span className="text-xs font-body text-lavender">Claim Analysis</span>
                  <PlannedBadge type="LIVE" />
                </div>

                <div className="flex items-center gap-2 bg-midnight p-2 border border-lavender-border rounded-sm">
                  <span className="text-xs font-body text-lavender">Rule Validation</span>
                  <PlannedBadge type="SIMULATED" />
                </div>

                <div className="flex items-center gap-2 bg-midnight p-2 border border-lavender-border rounded-sm">
                  <span className="text-xs font-body text-lavender">LLM Extraction</span>
                  <PlannedBadge type="PLANNED" />
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* SECTION 6: 1PX LINE SYSTEM & EVIDENCE ROW DEMO */}
        <section className="space-y-6">
          <SectionHeading
            tag="Component 04"
            title="Panel & 1px Grid Layout"
            description="Clinical data layout on the Claim Analysis screen using solid Deep Black panels, 1px hairline rules, and generous negative space."
          />

          <Panel className="overflow-hidden">
            <div className="bg-midnight px-6 py-3 border-b border-lavender-border flex items-center justify-between text-xs font-mono text-lavender-muted">
              <span>FIELD VERIFICATION GRID (SAMPLE ROW)</span>
              <span>STRICT 1PX SYSTEM</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-lavender-border text-lavender-muted font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-6">Field</th>
                    <th className="py-3 px-6">Extracted Value</th>
                    <th className="py-3 px-6">Document Source</th>
                    <th className="py-3 px-6">Page</th>
                    <th className="py-3 px-6">Confidence</th>
                    <th className="py-3 px-6">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lavender-border font-mono">
                  <tr className="hover:bg-lavender-faint transition-colors duration-150">
                    <td className="py-3.5 px-6 font-medium text-lavender-highlight">patient_id</td>
                    <td className="py-3.5 px-6 text-lavender">SYN-0001</td>
                    <td className="py-3.5 px-6 text-lavender-muted">discharge_summary.pdf</td>
                    <td className="py-3.5 px-6 text-lavender">1</td>
                    <td className="py-3.5 px-6"><StatusBadge status="high" size="xs" /></td>
                    <td className="py-3.5 px-6"><StatusBadge status="verified" size="xs" /></td>
                  </tr>

                  <tr className="hover:bg-lavender-faint transition-colors duration-150 bg-[#0C0D12]">
                    <td className="py-3.5 px-6 font-medium text-lavender-highlight">discharge_date</td>
                    <td className="py-3.5 px-6 text-status-conflict-text font-semibold">2026-03-08 / 2026-03-09</td>
                    <td className="py-3.5 px-6 text-lavender-muted">cross-document (2 docs)</td>
                    <td className="py-3.5 px-6 text-lavender">1</td>
                    <td className="py-3.5 px-6"><StatusBadge status="medium" size="xs" /></td>
                    <td className="py-3.5 px-6"><StatusBadge status="Conflict" size="xs" /></td>
                  </tr>

                  <tr className="hover:bg-lavender-faint transition-colors duration-150">
                    <td className="py-3.5 px-6 font-medium text-lavender-highlight">admission_note</td>
                    <td className="py-3.5 px-6 text-lavender-muted italic">[not present in package]</td>
                    <td className="py-3.5 px-6 text-lavender-muted">package scan</td>
                    <td className="py-3.5 px-6 text-lavender-muted">—</td>
                    <td className="py-3.5 px-6"><StatusBadge status="low" size="xs" /></td>
                    <td className="py-3.5 px-6"><StatusBadge status="Missing" size="xs" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-midnight px-6 py-3 border-t border-lavender-border flex items-center justify-between text-[11px] font-mono text-lavender-muted">
              <span>Dynamic counts derived from /analyze response</span>
              <span className="text-lavender-highlight">Ready for Review</span>
            </div>
          </Panel>
        </section>

      </div>
    </div>
  );
}
