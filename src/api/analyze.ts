// src/api/analyze.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function analyzeVCF(file: File, drugs: string[]) {
  const formData = new FormData();
  formData.append('vcf_file', file);
  formData.append('drugs', JSON.stringify(drugs));

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Analysis failed');
  }

  const result = await response.json();
  return result.data; // Our backend returns { success: true, data: [...] }
}