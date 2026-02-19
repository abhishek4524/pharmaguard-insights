import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Eye, Filter, RefreshCw, Clock, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { AnalysisResult } from "@/types/pharma";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const DRUGS = ['ALL', 'CODEINE', 'WARFARIN', 'CLOPIDOGREL', 'SIMVASTATIN', 'AZATHIOPRINE', 'FLUOROURACIL'];
const RISKS = ['ALL', 'Safe', 'Adjust Dosage', 'Toxic / Ineffective'];

interface AnalysisRecord {
  id: string;
  patient_id: string;
  drug: string;
  risk_label: string;
  confidence_score: number;
  severity: string;
  result_json: AnalysisResult;
  created_at: string;
}

function getRiskClass(label: string) {
  if (label === 'Safe') return 'risk-safe';
  if (label === 'Adjust Dosage') return 'risk-adjust';
  return 'risk-toxic';
}

export default function History() {
  const { toast } = useToast();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDrug, setFilterDrug] = useState('ALL');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [viewResult, setViewResult] = useState<AnalysisResult | null>(null);

  const fetchRecords = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('pharma_history');
      const data = stored ? JSON.parse(stored) : [];
      setRecords(data);
    } catch (err) {
      console.error('Failed to load history:', err);
      toast({ title: 'Error', description: 'Failed to load history', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('pharma_history');
      setRecords([]);
      toast({ title: 'History cleared', description: 'All analysis records have been removed.' });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filtered = records.filter(r => {
    if (filterDrug !== 'ALL' && r.drug !== filterDrug) return false;
    if (filterRisk !== 'ALL' && r.risk_label !== filterRisk) return false;
    return true;
  });

  if (viewResult) {
    return (
      <AppLayout title="Analysis History" subtitle="View past pharmacogenomic analysis results">
        <div className="p-6 space-y-4">
          <Button variant="outline" onClick={() => setViewResult(null)}>← Back to History</Button>
          <ResultsDisplay results={[viewResult]} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Analysis History" subtitle="View and filter past pharmacogenomic analyses">
      <div className="p-6 space-y-6">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HistoryIcon className="h-4 w-4 text-primary" /> All Analyses
                <Badge variant="secondary" className="ml-1">{filtered.length}</Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchRecords} disabled={loading}>
                  <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
                </Button>
                {records.length > 0 && (
                  <Button variant="destructive" size="sm" onClick={clearHistory}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Filters */}
          <CardContent className="pb-0">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Drug:</span>
                <div className="flex flex-wrap gap-1">
                  {DRUGS.map(d => (
                    <button
                      key={d}
                      onClick={() => setFilterDrug(d)}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
                        filterDrug === d
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Risk:</span>
                <div className="flex flex-wrap gap-1">
                  {RISKS.map(r => (
                    <button
                      key={r}
                      onClick={() => setFilterRisk(r)}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
                        filterRisk === r
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <Search className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No analyses found.</p>
                <p className="text-xs text-muted-foreground">Run an analysis first, results appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left font-medium text-muted-foreground">Patient ID</th>
                      <th className="pb-3 text-left font-medium text-muted-foreground">Drug</th>
                      <th className="pb-3 text-left font-medium text-muted-foreground">Risk Level</th>
                      <th className="pb-3 text-left font-medium text-muted-foreground">Severity</th>
                      <th className="pb-3 text-left font-medium text-muted-foreground">Confidence</th>
                      <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map(r => (
                      <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 font-mono text-xs text-muted-foreground">{r.patient_id}</td>
                        <td className="py-3 font-semibold">{r.drug}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRiskClass(r.risk_label)}`}>
                            {r.risk_label}
                          </span>
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className="text-xs">{r.severity}</Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-border overflow-hidden">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${r.confidence_score}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{r.confidence_score}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(r.created_at), 'MMM d, yyyy HH:mm')}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewResult(r.result_json)}
                            className="text-primary hover:text-primary"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" /> View
                          </Button>
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