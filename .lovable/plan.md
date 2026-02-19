
## PharmaGuard – Pharmacogenomic Risk Prediction System

### Overview
A full-stack clinical decision support web application that analyzes patient VCF genomic files against a pharmacogenomic variant database to predict drug interaction risks, generate CPIC-based clinical recommendations, and produce AI-powered explanations.

**Stack**: React + Vite + TypeScript (frontend), Supabase Edge Functions (backend API), Supabase PostgreSQL (variant database), OpenAI via edge function (AI explanations), Zod (validation).

---

### 1. Design System & Layout
- **Theme**: Clinical blue & white, subtle gradients, professional health-tech aesthetic
- **Sidebar navigation** with PharmaGuard logo, route links (Dashboard, Analysis, History, Settings)
- **Top header** with app title, version badge, and a system status indicator (green dot = API connected)
- Fully responsive layout — sidebar collapses to icon-only on smaller screens

---

### 2. Dashboard / Home Page
- Welcome panel with quick-start instructions
- Stats cards: Total Analyses Run, High-Risk Flags, Drug Coverage count
- Recent analyses table (populated from Supabase)

---

### 3. Analysis Page — VCF Upload
- **Drag-and-drop zone** (react-dropzone) accepting `.vcf` files only, max 5MB
- File name, size, and line-count preview after upload
- Inline validation errors (wrong format, oversized, empty)
- Visual upload progress indicator with Lucide icons

---

### 4. Analysis Page — Drug Selection
- **Multi-select dropdown** (shadcn/ui Combobox) with all 6 supported drugs:
  CODEINE, WARFARIN, CLOPIDOGREL, SIMVASTATIN, AZATHIOPRINE, FLUOROURACIL
- Comma-separated manual text input as fallback
- Zod-powered input validation with error messages
- Selected drug chips displayed below the input

---

### 5. Analysis Submission
- **Submit button** disabled until both file and ≥1 drug selected
- Loading spinner during API call
- Calls Supabase Edge Function `POST /analyze` with VCF content + drug list
- Toast notifications for success/error states

---

### 6. Backend Edge Function — `/analyze`
The edge function will:
1. **Parse VCF file** line-by-line, extract variants (CHROM, POS, REF, ALT, rsID)
2. **Match variants** against the Supabase `pharmacogenomic_variants` table (rsID lookup)
3. **Run rule-based risk engine** → Risk Label (Safe / Adjust Dosage / Toxic), Severity, Confidence score
4. **Generate CPIC recommendation** from the `cpic_guidelines` table
5. **Call OpenAI** (GPT-4o structured JSON output mode) for clinical narrative explanation
6. **Validate response** against strict Zod JSON schema
7. Return structured JSON matching the required schema

---

### 7. Supabase Database Schema
Three tables:
- `pharmacogenomic_variants` — rsID, gene, star_allele, diplotype, phenotype, impact, associated_drugs
- `cpic_guidelines` — drug, gene, phenotype, recommendation, dosage_adjustment, evidence_level
- `analysis_results` — patient_id, drug, timestamp, full result JSON (for history)

Seeded with realistic sample data for all 6 drugs (CYP2D6/CODEINE, CYP2C9+VKORC1/WARFARIN, CYP2C19/CLOPIDOGREL, SLCO1B1/SIMVASTATIN, TPMT/AZATHIOPRINE, DPYD/FLUOROURACIL)

---

### 8. Results Display Page
Using shadcn/ui Cards and Tabs:

**Tab 1 — Risk Summary**
- Large color-coded **Risk Label** badge (Green/Yellow/Red)
- **Confidence Score** as animated progress bar (0–100%)
- Severity badge (Low / Moderate / High / Contraindicated)
- Timestamp and patient/drug info

**Tab 2 — Pharmacogenomic Profile**
- Primary gene, diplotype, phenotype (info cards)
- **Detected Variants Table**: rsID | Star Allele | Impact columns

**Tab 3 — Clinical Recommendation**
- CPIC recommendation text
- Dosage adjustment guidance
- Evidence level badge
- Alternative drug suggestions (if applicable)

**Tab 4 — AI Explanation**
- Collapsible LLM-generated clinical narrative
- Disclaimer banner ("AI-generated, review by clinician recommended")

**Tab 5 — Quality Metrics**
- Coverage %, variant call rate, depth of coverage, parsing warnings

---

### 9. JSON Output Viewer
- Raw JSON display (syntax-highlighted using a pre block with Tailwind styling)
- **Copy to clipboard** button (Lucide Copy icon) with success toast
- **Download JSON** button (saves as `pharma_guard_result_[timestamp].json`)

---

### 10. Analysis History Page
- Table of all past analyses stored in Supabase
- Columns: Date, Drug, Risk Level, Confidence, Actions (View JSON, Re-run)
- Filter by drug and risk level
- Click any row to view full results

---

### 11. Sample VCF File
- A downloadable sample `.vcf` file included in the app (e.g., via a "Download Sample VCF" link)
- Pre-loaded with variants known to trigger interesting results for WARFARIN and CODEINE

---

### 12. Error Handling & Validation
- Frontend: Zod schemas for all form inputs
- Backend: express-validator equivalent in edge function
- Graceful error cards in the results section (parse errors, API failures, no variants found)
- Rate limit handling for OpenAI calls

---

### Environment Configuration
- OpenAI API key stored as a Supabase secret (`OPENAI_API_KEY`)
- All config managed via Supabase secrets (no `.env` files in Lovable, but equivalent setup documented)
- A README section in the app's About page with setup instructions

