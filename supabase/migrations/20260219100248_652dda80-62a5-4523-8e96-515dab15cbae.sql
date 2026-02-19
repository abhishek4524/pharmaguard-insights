
-- Table 1: Pharmacogenomic variants
CREATE TABLE public.pharmacogenomic_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rs_id TEXT NOT NULL,
  gene TEXT NOT NULL,
  star_allele TEXT NOT NULL,
  diplotype TEXT NOT NULL,
  phenotype TEXT NOT NULL,
  impact TEXT NOT NULL,
  associated_drugs TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table 2: CPIC guidelines
CREATE TABLE public.cpic_guidelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drug TEXT NOT NULL,
  gene TEXT NOT NULL,
  phenotype TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  dosage_adjustment TEXT NOT NULL,
  evidence_level TEXT NOT NULL,
  alternative_drugs TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table 3: Analysis results (history)
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id TEXT NOT NULL DEFAULT ('PG-' || substr(gen_random_uuid()::text, 1, 8)),
  drug TEXT NOT NULL,
  risk_label TEXT NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  severity TEXT NOT NULL DEFAULT 'Low',
  result_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public reads for variants/guidelines, no auth required for demo)
ALTER TABLE public.pharmacogenomic_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpic_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Public read access for variant data
CREATE POLICY "Public read variants" ON public.pharmacogenomic_variants FOR SELECT USING (true);
CREATE POLICY "Public read guidelines" ON public.cpic_guidelines FOR SELECT USING (true);

-- Analysis results: public read/write for demo (no auth required)
CREATE POLICY "Public read results" ON public.analysis_results FOR SELECT USING (true);
CREATE POLICY "Public insert results" ON public.analysis_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update results" ON public.analysis_results FOR UPDATE USING (true);
