import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── VCF Parser ────────────────────────────────────────────────────────────────
function parseVcf(content: string) {
  const lines = content.split(/\r?\n/);
  const variants: { rsId: string; chrom: string; pos: string; ref: string; alt: string; genotype: string }[] = [];
  const warnings: string[] = [];
  let dataLines = 0;

  for (const line of lines) {
    if (line.startsWith('#') || line.trim() === '') continue;
    dataLines++;
    const parts = line.split('\t');
    if (parts.length < 8) { warnings.push(`Skipped malformed line: ${line.substring(0, 40)}`); continue; }

    const [chrom, pos, id, ref, alt, , , info, format, sample] = parts;
    const rsId = id && id.startsWith('rs') ? id : (info?.match(/RS=(rs\d+)/)?.[1] || '');
    if (!rsId) { warnings.push(`No rsID found for variant at ${chrom}:${pos}`); continue; }

    let genotype = './.';
    if (format && sample) {
      const fmtParts = format.split(':');
      const sampleParts = sample.split(':');
      const gtIdx = fmtParts.indexOf('GT');
      if (gtIdx >= 0 && sampleParts[gtIdx]) genotype = sampleParts[gtIdx];
    }

    variants.push({ rsId, chrom, pos, ref, alt: alt || '.', genotype });
  }

  return { variants, totalParsed: dataLines, warnings };
}

// ─── Risk Engine ───────────────────────────────────────────────────────────────
function computeRisk(phenotype: string, drug: string): {
  risk_label: string; severity: string; confidence_score: number; reasoning: string;
} {
  const p = phenotype.toLowerCase();
  const d = drug.toUpperCase();

  if (p.includes('poor metabolizer') || p.includes('non-functional')) {
    return {
      risk_label: 'Toxic / Ineffective',
      severity: 'Contraindicated',
      confidence_score: 95,
      reasoning: `Patient carries a poor metabolizer phenotype for the primary gene affecting ${d}. This leads to either toxic accumulation or complete loss of therapeutic effect. Immediate clinical review required.`,
    };
  }
  if (p.includes('ultrarapid')) {
    return {
      risk_label: 'Toxic / Ineffective',
      severity: 'High',
      confidence_score: 90,
      reasoning: `Ultrarapid metabolism of ${d} results in excessively rapid drug conversion, risking toxicity from active metabolites at standard doses.`,
    };
  }
  if (p.includes('intermediate') || p.includes('decreased function') || p.includes('sensitive')) {
    const isHighRisk = d === 'FLUOROURACIL' || d === 'AZATHIOPRINE';
    return {
      risk_label: 'Adjust Dosage',
      severity: isHighRisk ? 'High' : 'Moderate',
      confidence_score: 82,
      reasoning: `Patient has intermediate metabolizer phenotype for ${d}. Reduced enzyme activity requires dose adjustment and enhanced monitoring to achieve safe therapeutic levels.`,
    };
  }
  if (p.includes('rapid')) {
    return {
      risk_label: 'Adjust Dosage',
      severity: 'Low',
      confidence_score: 75,
      reasoning: `Rapid metabolism may reduce ${d} efficacy at standard doses. Monitor therapeutic response and consider dose optimization.`,
    };
  }

  return {
    risk_label: 'Safe',
    severity: 'Low',
    confidence_score: 88,
    reasoning: `Patient's pharmacogenomic profile shows normal metabolizer status for ${d}. Standard dosing is expected to be safe and effective.`,
  };
}

// ─── AI Explanation ────────────────────────────────────────────────────────────
async function generateAIExplanation(
  drug: string, phenotype: string, gene: string, riskLabel: string, recommendation: string, apiKey: string
) {
  const prompt = `You are a clinical pharmacogenomics expert. Generate a concise clinical explanation for this scenario:

Patient Drug: ${drug}
Primary Gene: ${gene}
Phenotype: ${phenotype}
Risk Assessment: ${riskLabel}
CPIC Recommendation: ${recommendation}

Respond with a JSON object containing exactly these fields:
{
  "summary": "One paragraph clinical summary (2-3 sentences)",
  "detailed_narrative": "Detailed explanation of the pharmacogenomic mechanism (3-4 paragraphs)",
  "key_findings": ["finding 1", "finding 2", "finding 3"],
  "clinical_implications": "One sentence about clinical implications"
}

Return ONLY valid JSON, no markdown, no extra text.`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("Rate limit exceeded");
      if (response.status === 402) throw new Error("AI credits exhausted");
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);

    return {
      summary: parsed.summary || `${drug} pharmacogenomics assessment completed. Risk level: ${riskLabel}.`,
      detailed_narrative: parsed.detailed_narrative || recommendation,
      key_findings: Array.isArray(parsed.key_findings) ? parsed.key_findings : [`${phenotype} phenotype detected`, `Risk level: ${riskLabel}`],
      clinical_implications: parsed.clinical_implications || "Consult clinical pharmacist before prescribing.",
    };
  } catch (err) {
    console.error("AI explanation error:", err);
    return {
      summary: `${drug} pharmacogenomics: ${phenotype}. Risk: ${riskLabel}. ${recommendation.substring(0, 120)}`,
      detailed_narrative: recommendation,
      key_findings: [`${gene} ${phenotype}`, `Risk: ${riskLabel}`, "Consult CPIC guidelines"],
      clinical_implications: "Review with clinical pharmacist before prescribing.",
    };
  }
}

// ─── Main Handler ──────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { vcf_content, drug_list } = await req.json();

    if (!vcf_content || typeof vcf_content !== 'string') {
      return new Response(JSON.stringify({ error: "Missing or invalid vcf_content" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (!Array.isArray(drug_list) || drug_list.length === 0) {
      return new Response(JSON.stringify({ error: "drug_list must be a non-empty array" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    // 1. Parse VCF
    const { variants, totalParsed, warnings } = parseVcf(vcf_content);
    const rsIds = [...new Set(variants.map(v => v.rsId))].filter(Boolean);

    // 2. Match variants in DB
    const { data: dbVariants } = await supabase
      .from("pharmacogenomic_variants")
      .select("*")
      .in("rs_id", rsIds);

    // Use first drug for single-analysis mode
    const drug = drug_list[0].toUpperCase();

    // Filter variants relevant to this drug
    const relevantVariants = (dbVariants || []).filter((v: any) =>
      v.associated_drugs?.includes(drug)
    );

    // 3. Determine primary gene, phenotype
    const primaryVariant = relevantVariants[0];
    const primaryGene = primaryVariant?.gene || (dbVariants?.[0]?.gene) || 'Unknown';
    const diplotype = primaryVariant?.diplotype || '*1/*1';
    const phenotype = primaryVariant?.phenotype || 'Normal Metabolizer';

    // 4. Risk engine
    const risk = computeRisk(phenotype, drug);

    // 5. CPIC guideline lookup
    const { data: guidelines } = await supabase
      .from("cpic_guidelines")
      .select("*")
      .eq("drug", drug)
      .ilike("phenotype", `%${phenotype.split(' ')[0]}%`)
      .limit(1);

    const guideline = guidelines?.[0];
    const clinicalRecommendation = {
      cpic_recommendation: guideline?.recommendation || `Standard pharmacogenomic monitoring recommended for ${drug}. No specific CPIC guideline matched for this phenotype.`,
      dosage_adjustment: guideline?.dosage_adjustment || "No dosage adjustment required based on current data.",
      evidence_level: (guideline?.evidence_level || 'B') as 'A' | 'B' | 'C' | 'D',
      alternative_drugs: guideline?.alternative_drugs || [],
    };

    // 6. AI explanation
    const llmExplanation = await generateAIExplanation(
      drug, phenotype, primaryGene, risk.risk_label,
      clinicalRecommendation.cpic_recommendation, LOVABLE_API_KEY
    );

    // 7. Quality metrics
    const matchedCount = relevantVariants.length;
    const qualityMetrics = {
      total_variants_parsed: totalParsed,
      variants_matched: matchedCount,
      coverage_percent: rsIds.length > 0 ? Math.round((matchedCount / rsIds.length) * 100) : 0,
      variant_call_rate: totalParsed > 0 ? Math.round((rsIds.length / totalParsed) * 100) : 0,
      parsing_warnings: warnings,
    };

    // 8. Build result
    const patientId = `PG-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const result = {
      patient_id: patientId,
      drug,
      timestamp,
      risk_assessment: {
        risk_label: risk.risk_label,
        confidence_score: risk.confidence_score,
        severity: risk.severity,
        reasoning: risk.reasoning,
      },
      pharmacogenomic_profile: {
        primary_gene: primaryGene,
        diplotype,
        phenotype,
        detected_variants: relevantVariants.map((v: any) => ({
          rs_id: v.rs_id,
          gene: v.gene,
          star_allele: v.star_allele,
          diplotype: v.diplotype,
          impact: v.impact,
        })),
      },
      clinical_recommendation: clinicalRecommendation,
      llm_generated_explanation: llmExplanation,
      quality_metrics: qualityMetrics,
    };

    // 9. Store in DB
    await supabase.from("analysis_results").insert({
      patient_id: patientId,
      drug,
      risk_label: risk.risk_label,
      confidence_score: risk.confidence_score,
      severity: risk.severity,
      result_json: result,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("analyze error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
