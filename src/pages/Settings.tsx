import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Database, Brain, Download, BookOpen, FlaskConical } from "lucide-react";
import { downloadSampleVcf } from "@/lib/sampleVcf";
import { Button } from "@/components/ui/button";

const SUPPORTED_DRUGS = [
  { drug: 'CODEINE', gene: 'CYP2D6', phenotypes: ['Poor', 'Intermediate', 'Ultrarapid Metabolizer'] },
  { drug: 'WARFARIN', gene: 'CYP2C9 / VKORC1', phenotypes: ['Intermediate Metabolizer', 'Warfarin Sensitive'] },
  { drug: 'CLOPIDOGREL', gene: 'CYP2C19', phenotypes: ['Poor', 'Intermediate', 'Rapid Metabolizer'] },
  { drug: 'SIMVASTATIN', gene: 'SLCO1B1', phenotypes: ['Decreased Function'] },
  { drug: 'AZATHIOPRINE', gene: 'TPMT', phenotypes: ['Poor', 'Intermediate Metabolizer'] },
  { drug: 'FLUOROURACIL', gene: 'DPYD', phenotypes: ['Poor', 'Intermediate Metabolizer'] },
];

export default function Settings() {
  return (
    <AppLayout title="Settings & About" subtitle="System configuration and documentation">
      <div className="p-6 space-y-6">
        {/* About */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> About PharmaGuard
            </CardTitle>
            <CardDescription>Pharmacogenomic Risk Prediction System v1.0.0</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground">
            <p className="leading-relaxed text-muted-foreground">
              PharmaGuard is a clinical decision support tool that analyzes patient VCF genomic files against a curated pharmacogenomic variant database. It predicts drug interaction risks using CPIC guidelines and generates AI-powered clinical explanations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: Database, label: 'Database', desc: '18 variants, 12 CPIC guidelines, 6 drugs' },
                { icon: Brain, label: 'AI Model', desc: 'Lovable AI (Gemini 3 Flash)' },
                { icon: FlaskConical, label: 'Guidelines', desc: 'CPIC Level A & B Evidence' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supported Drugs */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Supported Drugs & Genes
            </CardTitle>
            <CardDescription>Pharmacogenomic coverage for variant analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-medium text-muted-foreground">Drug</th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">Gene(s)</th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">Covered Phenotypes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SUPPORTED_DRUGS.map(({ drug, gene, phenotypes }) => (
                    <tr key={drug} className="hover:bg-muted/50">
                      <td className="py-2.5 font-semibold">{drug}</td>
                      <td className="py-2.5 font-mono text-xs text-primary">{gene}</td>
                      <td className="py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {phenotypes.map(p => (
                            <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Setup / README */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Getting Started</p>
              <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
                <li>Navigate to the <strong className="text-foreground">Analysis</strong> page from the sidebar.</li>
                <li>Download the sample VCF file (button below) or use your own .vcf file.</li>
                <li>Drag and drop the VCF file into the upload zone.</li>
                <li>Select one or more drugs from the dropdown.</li>
                <li>Click <strong className="text-foreground">Run Analysis</strong> and wait for results.</li>
                <li>Browse results across 5 tabs: Risk, Profile, Recommendation, AI Explanation, Metrics.</li>
              </ol>
            </div>
            <Separator />
            <div>
              <p className="font-semibold mb-2">VCF File Format</p>
              <p className="text-muted-foreground">The system accepts standard VCFv4.x format files. The parser looks for:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>rsID in the <code className="bg-muted px-1 rounded">ID</code> column (e.g. <code className="bg-muted px-1 rounded">rs3892097</code>)</li>
                <li>CHROM, POS, REF, ALT fields</li>
                <li>Genotype <code className="bg-muted px-1 rounded">GT</code> in FORMAT field</li>
                <li>Lines starting with <code className="bg-muted px-1 rounded">#</code> are treated as headers and skipped</li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-semibold mb-2">Disclaimer</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                PharmaGuard is a research and educational tool. All results, including AI-generated explanations, are for informational purposes only and must not be used as the sole basis for clinical decisions. Always consult a qualified healthcare professional or clinical pharmacist before making any treatment decisions.
              </p>
            </div>
            <Button variant="outline" onClick={downloadSampleVcf} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Download Sample VCF File
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
