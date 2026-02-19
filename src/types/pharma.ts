export type RiskLabel = 'Safe' | 'Adjust Dosage' | 'Toxic / Ineffective';
export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Contraindicated';
export type EvidenceLevel = 'A' | 'B' | 'C' | 'D';

export interface DetectedVariant {
  rs_id: string;
  gene: string;
  star_allele: string;
  diplotype: string;
  impact: string;
}

export interface RiskAssessment {
  risk_label: RiskLabel;
  confidence_score: number;
  severity: SeverityLevel;
  reasoning: string;
}

export interface PharmacogenomicProfile {
  primary_gene: string;
  diplotype: string;
  phenotype: string;
  detected_variants: DetectedVariant[];
}

export interface ClinicalRecommendation {
  cpic_recommendation: string;
  dosage_adjustment: string;
  evidence_level: EvidenceLevel;
  alternative_drugs: string[];
}

export interface LLMExplanation {
  summary: string;
  detailed_narrative: string;
  key_findings: string[];
  clinical_implications: string;
}

export interface QualityMetrics {
  total_variants_parsed: number;
  variants_matched: number;
  coverage_percent: number;
  variant_call_rate: number;
  parsing_warnings: string[];
}

export interface AnalysisResult {
  patient_id: string;
  drug: string;
  timestamp: string;
  risk_assessment: RiskAssessment;
  pharmacogenomic_profile: PharmacogenomicProfile;
  clinical_recommendation: ClinicalRecommendation;
  llm_generated_explanation: LLMExplanation;
  quality_metrics: QualityMetrics;
}
