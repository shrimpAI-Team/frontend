import { api } from "../lib/api";

export interface ShrimpAnalysisResponse {
  success: boolean;
  species: string;
  scientificName: string;
  confidence: number;
  sizeEstimate?: string;
  commercialGrade?: string;
  description?: string;
  abnormalDetected?: boolean;
  alerts?: string[];
  modelStatus?: string;
  processingTime?: string;
  imageDimensions?: string;
  analyzedAt: string;
}

export interface SupportedSpecies {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  typicalSize: string;
}

export const shrimpApi = {
  analyze: async (
    file: File | Blob,
    filename = "shrimp.jpg",
  ): Promise<ShrimpAnalysisResponse> => {
    const formData = new FormData();
    formData.append("file", file, filename);

    const response = await api.post<ShrimpAnalysisResponse>(
      "/shrimp-analysis/analyze",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  getSupportedSpecies: async (): Promise<SupportedSpecies[]> => {
    const response = await api.get<SupportedSpecies[]>("/shrimp-analysis/species");
    return response.data;
  },
};
