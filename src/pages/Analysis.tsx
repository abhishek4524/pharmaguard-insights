import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Upload, FileText, X, CheckCircle, Loader2, ChevronDown, Download, AlertCircle, Dna, FlaskConical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnalysisResult } from "@/types/pharma";
import { downloadSampleVcf } from "@/lib/sampleVcf";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { analyzeVCF } from "@/api/analyze"; // <-- naya import

const SUPPORTED_DRUGS = ['CODEINE', 'WARFARIN', 'CLOPIDOGREL', 'SIMVASTATIN', 'AZATHIOPRINE', 'FLUOROURACIL'];

const analysisSchema = z.object({
  drugs: z.array(z.string()).min(1, 'Select at least one drug'),
});

export default function Analysis() {
  const { toast } = useToast();
  const [vcfFile, setVcfFile] = useState<File | null>(null);
  const [vcfError, setVcfError] = useState<string>('');
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [drugDropdownOpen, setDrugDropdownOpen] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null); // <-- array

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setVcfError('');
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0];
      if (err.code === 'file-too-large') setVcfError('File exceeds 5MB limit.');
      else if (err.code === 'file-invalid-type') setVcfError('Only .vcf files are accepted.');
      else setVcfError(err.message);
      return;
    }
    if (acceptedFiles[0]) setVcfFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.vcf'], 'application/octet-stream': ['.vcf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const toggleDrug = (drug: string) => {
    setSelectedDrugs(prev =>
      prev.includes(drug) ? prev.filter(d => d !== drug) : [...prev, drug]
    );
  };

  const addManualDrugs = () => {
    const parsed = manualInput
      .split(',')
      .map(d => d.trim().toUpperCase())
      .filter(d => SUPPORTED_DRUGS.includes(d) && !selectedDrugs.includes(d));
    if (parsed.length) {
      setSelectedDrugs(prev => [...prev, ...parsed]);
      setManualInput('');
    }
  };

  const handleSubmit = async () => {
    const validation = analysisSchema.safeParse({ drugs: selectedDrugs });
    if (!validation.success) {
      toast({ title: 'Validation Error', description: validation.error.errors[0].message, variant: 'destructive' });
      return;
    }
    if (!vcfFile) {
      toast({ title: 'Missing File', description: 'Please upload a VCF file.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeVCF(vcfFile, selectedDrugs); // data = array of AnalysisResult
      setResults(data);
      toast({ title: '✓ Analysis Complete', description: `Risk assessed for ${selectedDrugs.join(', ')}` });
    } catch (err: any) {
      toast({
        title: 'Analysis Failed',
        description: err.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = vcfFile && selectedDrugs.length > 0 && !loading;

  return (
    <AppLayout title="VCF Analysis" subtitle="Upload genomic data and predict pharmacogenomic risks">
      <div className="p-6 space-y-6">
        {!results ? (
          <>
            {/* VCF Upload */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Upload className="h-4 w-4 text-primary" /> VCF File Upload
                    </CardTitle>
                    <CardDescription>Drag and drop a .vcf file (max 5MB)</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={downloadSampleVcf}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Sample VCF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!vcfFile ? (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer",
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Dna className="h-7 w-7 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">
                      {isDragActive ? 'Drop your VCF file here' : 'Drag & drop your VCF file'}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">or click to browse · .vcf only · max 5MB</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{vcfFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(vcfFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setVcfFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {vcfError && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {vcfError}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Drug Selection */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" /> Drug Selection
                </CardTitle>
                <CardDescription>Select one or more drugs for pharmacogenomic analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Multi-select dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDrugDropdownOpen(!drugDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-muted-foreground">
                      {selectedDrugs.length === 0 ? 'Select drugs...' : `${selectedDrugs.length} drug(s) selected`}
                    </span>
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", drugDropdownOpen && "rotate-180")} />
                  </button>
                  {drugDropdownOpen && (
                    <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                      {SUPPORTED_DRUGS.map(drug => (
                        <button
                          key={drug}
                          onClick={() => toggleDrug(drug)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                        >
                          <div className={cn(
                            "h-4 w-4 rounded border flex items-center justify-center flex-shrink-0",
                            selectedDrugs.includes(drug) ? "bg-primary border-primary" : "border-input"
                          )}>
                            {selectedDrugs.includes(drug) && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <span className="font-medium">{drug}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected chips */}
                {selectedDrugs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedDrugs.map(drug => (
                      <Badge
                        key={drug}
                        variant="secondary"
                        className="gap-1.5 pr-1.5 bg-primary/10 text-primary border-primary/20"
                      >
                        {drug}
                        <button onClick={() => toggleDrug(drug)} className="rounded-full hover:bg-primary/20 p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Manual input */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Or enter comma-separated drug names:</p>
                  <div className="flex gap-2">
                    <input
                      value={manualInput}
                      onChange={e => setManualInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addManualDrugs()}
                      placeholder="e.g. WARFARIN, CODEINE"
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button variant="outline" size="sm" onClick={addManualDrugs}>Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Ready to Analyze</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {vcfFile ? `✓ ${vcfFile.name}` : '✗ No file uploaded'} &nbsp;·&nbsp;
                      {selectedDrugs.length > 0 ? `✓ ${selectedDrugs.length} drug(s)` : '✗ No drugs selected'}
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 min-w-36"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <><FlaskConical className="mr-2 h-4 w-4" /> Run Analysis</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Analysis Results</h2>
              <Button variant="outline" onClick={() => setResults(null)}>
                ← New Analysis
              </Button>
            </div>
            <ResultsDisplay results={results} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}