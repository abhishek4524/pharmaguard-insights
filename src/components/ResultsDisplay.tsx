import { useState } from "react";
import { AnalysisResult } from "@/types/pharma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle, CheckCircle, Info, Brain, BarChart3,
  Copy, Download, ChevronDown, AlertCircle, Dna, Pill, Clipboard
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  results: AnalysisResult[]; // array of results (one per drug)
}

function getRiskClass(label: string) {
  if (label === 'Safe') return 'risk-safe';
  if (label === 'Adjust Dosage') return 'risk-adjust';
  return 'risk-toxic';
}

function getRiskIcon(label: string) {
  if (label === 'Safe') return CheckCircle;
  if (label === 'Adjust Dosage') return AlertTriangle;
  return AlertCircle;
}

function getSeverityColor(severity: string) {
  const map: Record<string, string> = {
    'Low': 'bg-green-100 text-green-700 border-green-200',
    'Moderate': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'High': 'bg-orange-100 text-orange-700 border-orange-200',
    'Contraindicated': 'bg-red-100 text-red-700 border-red-200',
  };
  return map[severity] || 'bg-muted text-muted-foreground';
}

function getEvidenceColor(level: string) {
  const map: Record<string, string> = {
    'A': 'bg-green-100 text-green-700 border-green-200',
    'B': 'bg-blue-100 text-blue-700 border-blue-200',
    'C': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'D': 'bg-muted text-muted-foreground',
  };
  return map[level] || 'bg-muted text-muted-foreground';
}

// Subcomponent that renders a single result with all details
function ResultDetail({ result }: { result: AnalysisResult }) {
  const { toast } = useToast();
  const [aiOpen, setAiOpen] = useState(false);
  const jsonStr = JSON.stringify(result, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonStr);
    toast({ title: 'Copied!', description: 'JSON copied to clipboard.' });
  };

  const downloadJson = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharma_guard_result_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const RiskIcon = getRiskIcon(result.risk_assessment.risk_label);
  const riskClass = getRiskClass(result.risk_assessment.risk_label);

  return (
    <div className="space-y-4">
      {/* Risk header summary */}
      <div className={cn("rounded-xl border-2 p-6 flex items-center gap-6", riskClass)}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-current/10 flex-shrink-0">
          <RiskIcon className="h-8 w-8" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-bold">{result.risk_assessment.risk_label}</span>
            <Badge className={cn("border", getSeverityColor(result.risk_assessment.severity))}>
              {result.risk_assessment.severity}
            </Badge>
          </div>
          <p className="text-sm opacity-80 mt-1">{result.drug} · {result.patient_id}</p>
          <p className="text-xs opacity-60 mt-0.5">{format(new Date(result.timestamp), 'PPpp')}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-bold">{result.risk_assessment.confidence_score}%</p>
          <p className="text-xs opacity-70">Confidence</p>
          <div className="mt-2 h-2 w-24 rounded-full bg-current/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-current transition-all duration-1000"
              style={{ width: `${result.risk_assessment.confidence_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="risk">
        <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="risk" className="text-xs sm:text-sm">Risk Summary</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs sm:text-sm">Genomic Profile</TabsTrigger>
          <TabsTrigger value="recommendation" className="text-xs sm:text-sm">Recommendation</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs sm:text-sm">AI Explanation</TabsTrigger>
          <TabsTrigger value="quality" className="text-xs sm:text-sm">Quality Metrics</TabsTrigger>
          <TabsTrigger value="json" className="text-xs sm:text-sm">JSON Output</TabsTrigger>
        </TabsList>

        {/* Tab 1 — Risk Summary */}
        <TabsContent value="risk" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold", riskClass)}>
                  <RiskIcon className="h-4 w-4" />
                  {result.risk_assessment.risk_label}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Confidence Score</p>
                  <div className="flex items-center gap-3">
                    <Progress value={result.risk_assessment.confidence_score} className="flex-1" />
                    <span className="text-sm font-bold w-10 text-right">{result.risk_assessment.confidence_score}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Severity:</span>
                  <Badge className={cn("border text-xs", getSeverityColor(result.risk_assessment.severity))}>
                    {result.risk_assessment.severity}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clinical Reasoning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">{result.risk_assessment.reasoning}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2 — Pharmacogenomic Profile */}
        <TabsContent value="profile" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Primary Gene', value: result.pharmacogenomic_profile.primary_gene, icon: Dna },
              { label: 'Diplotype', value: result.pharmacogenomic_profile.diplotype, icon: Info },
              { label: 'Phenotype', value: result.pharmacogenomic_profile.phenotype, icon: BarChart3 },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{label}</p>
                      <p className="mt-1 text-sm font-semibold">{value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Detected Variants</CardTitle>
            </CardHeader>
            <CardContent>
              {result.pharmacogenomic_profile.detected_variants.length === 0 ? (
                <p className="text-sm text-muted-foreground">No variants detected in the database.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-2 text-left font-medium text-muted-foreground">rsID</th>
                        <th className="pb-2 text-left font-medium text-muted-foreground">Gene</th>
                        <th className="pb-2 text-left font-medium text-muted-foreground">Star Allele</th>
                        <th className="pb-2 text-left font-medium text-muted-foreground">Diplotype</th>
                        <th className="pb-2 text-left font-medium text-muted-foreground">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.pharmacogenomic_profile.detected_variants.map((v, i) => (
                        <tr key={i} className="hover:bg-muted/50">
                          <td className="py-2.5 font-mono text-xs text-primary">{v.rs_id}</td>
                          <td className="py-2.5 font-semibold">{v.gene}</td>
                          <td className="py-2.5 font-mono text-xs">{v.star_allele}</td>
                          <td className="py-2.5 text-xs">{v.diplotype}</td>
                          <td className="py-2.5 text-xs text-muted-foreground">{v.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3 — Clinical Recommendation */}
        <TabsContent value="recommendation" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">CPIC Recommendation</CardTitle>
                <Badge className={cn("border text-xs", getEvidenceColor(result.clinical_recommendation.evidence_level))}>
                  Evidence Level {result.clinical_recommendation.evidence_level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm leading-relaxed">{result.clinical_recommendation.cpic_recommendation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Dosage Adjustment</p>
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <Pill className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">{result.clinical_recommendation.dosage_adjustment}</p>
                </div>
              </div>
              {result.clinical_recommendation.alternative_drugs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Alternative Drugs</p>
                  <div className="flex flex-wrap gap-2">
                    {result.clinical_recommendation.alternative_drugs.map(drug => (
                      <Badge key={drug} variant="outline" className="text-xs">{drug}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4 — AI Explanation */}
        <TabsContent value="ai" className="space-y-4 mt-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800 font-medium">AI-generated content. Review by a qualified clinician is strongly recommended before any clinical decision.</p>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> AI Clinical Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{result.llm_generated_explanation.summary}</p>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Findings</p>
                <ul className="space-y-1.5">
                  {result.llm_generated_explanation.key_findings.map((finding, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
              <Collapsible open={aiOpen} onOpenChange={setAiOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    {aiOpen ? 'Hide' : 'Show'} Detailed Narrative
                    <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", aiOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 rounded-lg bg-muted/50 p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.llm_generated_explanation.detailed_narrative}</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Clinical Implications</p>
                      <p className="text-sm text-muted-foreground">{result.llm_generated_explanation.clinical_implications}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5 — Quality Metrics */}
        <TabsContent value="quality" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Variants Parsed', value: result.quality_metrics.total_variants_parsed },
              { label: 'Variants Matched', value: result.quality_metrics.variants_matched },
              { label: 'Coverage', value: `${result.quality_metrics.coverage_percent}%` },
              { label: 'Variant Call Rate', value: `${result.quality_metrics.variant_call_rate}%` },
            ].map(({ label, value }) => (
              <Card key={label}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {result.quality_metrics.parsing_warnings.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Parsing Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {result.quality_metrics.parsing_warnings.map((w, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded px-3 py-1.5">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" /> {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 6 — JSON Output */}
        <TabsContent value="json" className="space-y-4 mt-4">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadJson}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Download JSON
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <pre className="json-viewer overflow-auto max-h-[500px] p-4 text-foreground rounded-lg">
                <code>{jsonStr}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main ResultsDisplay component
export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeDrug, setActiveDrug] = useState(results[0]?.drug || '');

  if (results.length === 0) return null;

  const activeResult = results.find(r => r.drug === activeDrug) || results[0];

  return (
    <div className="space-y-4">
      {/* Drug selector tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {results.map(result => (
          <button
            key={result.drug}
            onClick={() => setActiveDrug(result.drug)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
              activeDrug === result.drug
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {result.drug}
          </button>
        ))}
      </div>

      {/* Render the active result */}
      <ResultDetail result={activeResult} />
    </div>
  );
}