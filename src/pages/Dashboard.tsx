import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, AlertTriangle, Pill, FlaskConical, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface AnalysisRecord {
  id: string;
  patient_id: string;
  drug: string;
  risk_label: string;
  confidence_score: number;
  severity: string;
  created_at: string;
}

function getRiskClass(label: string) {
  if (label === 'Safe') return 'risk-safe';
  if (label === 'Adjust Dosage') return 'risk-adjust';
  return 'risk-toxic';
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`rounded-xl p-3 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('analysis_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setRecords(data || []);
        setLoading(false);
      });
  }, []);

  const totalAnalyses = records.length;
  const highRiskFlags = records.filter(r => r.risk_label === 'Toxic / Ineffective').length;
  const drugs = [...new Set(records.map(r => r.drug))].length;

  return (
    <AppLayout title="Dashboard" subtitle="Pharmacogenomic Risk Prediction System">
      <div className="p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-xl bg-gradient-to-r from-primary to-blue-500 p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">Welcome to PharmaGuard</h2>
              <p className="mt-1 text-blue-100 text-sm max-w-lg">
                Upload a patient VCF genomic file and select drugs to receive pharmacogenomic risk predictions, CPIC clinical recommendations, and AI-powered explanations.
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                {['CYP2D6', 'CYP2C9', 'CYP2C19', 'SLCO1B1', 'TPMT', 'DPYD'].map(gene => (
                  <Badge key={gene} className="bg-white/20 text-white border-white/30 text-xs">{gene}</Badge>
                ))}
              </div>
            </div>
            <FlaskConical className="h-12 w-12 text-white/30 flex-shrink-0 hidden md:block" />
          </div>
          <Button asChild className="mt-4 bg-white text-primary hover:bg-blue-50 font-semibold">
            <Link to="/analysis">
              Start New Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={BarChart3}
            label="Total Analyses"
            value={totalAnalyses}
            sub="All time"
            color="bg-primary/10 text-primary"
          />
          <StatCard
            icon={AlertTriangle}
            label="High-Risk Flags"
            value={highRiskFlags}
            sub="Toxic / Ineffective"
            color="bg-red-100 text-red-600"
          />
          <StatCard
            icon={Pill}
            label="Drug Coverage"
            value={6}
            sub="CODEINE, WARFARIN & more"
            color="bg-green-100 text-green-600"
          />
        </div>

        {/* Quick Start */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Upload VCF File', desc: 'Drag and drop a .vcf genomic file (max 5MB)' },
            { step: '02', title: 'Select Drugs', desc: 'Choose from 6 pharmacogenomically relevant drugs' },
            { step: '03', title: 'Get Results', desc: 'Receive risk assessment, CPIC recommendations & AI explanation' },
          ].map(({ step, title, desc }) => (
            <Card key={step} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Analyses */}
        <Card className="border-border">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Analyses</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/history">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">Loading...</div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 gap-2">
                <FlaskConical className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No analyses yet. <Link to="/analysis" className="text-primary hover:underline">Run your first analysis →</Link></p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 text-left font-medium text-muted-foreground">Patient ID</th>
                      <th className="pb-2 text-left font-medium text-muted-foreground">Drug</th>
                      <th className="pb-2 text-left font-medium text-muted-foreground">Risk</th>
                      <th className="pb-2 text-left font-medium text-muted-foreground">Confidence</th>
                      <th className="pb-2 text-left font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {records.slice(0, 5).map(r => (
                      <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 font-mono text-xs text-muted-foreground">{r.patient_id}</td>
                        <td className="py-2.5 font-medium">{r.drug}</td>
                        <td className="py-2.5">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getRiskClass(r.risk_label)}`}>
                            {r.risk_label}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-border overflow-hidden">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${r.confidence_score}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{r.confidence_score}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-muted-foreground text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(r.created_at), 'MMM d, HH:mm')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
