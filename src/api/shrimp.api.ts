import { api } from "../lib/api";

export interface SizeMetrics {
  pixelLength?: number;
  estimatedLengthCm: string;
  estimatedWeightGram: string;
  sizeCategory: string;
  countPerKgEstimate?: string;
}

export interface ColorAnalysis {
  dominantColor: string;
  shellTransparency: string;
  glossiness?: string;
  description: string;
}

export interface UniformityMetrics {
  shrimpCount: number;
  uniformityRate: string;
  rating: string;
  note?: string;
}

export interface AbnormalityMetrics {
  abnormalDetected: boolean;
  healthSummary: string;
  alerts: string[];
  details: string[];
  whiteSpotsDetected?: boolean;
  blackGillsDetected?: boolean;
  muscleOpacityDetected?: boolean;
}

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

  sizeMetrics?: SizeMetrics;
  colorAnalysis?: ColorAnalysis;
  uniformity?: UniformityMetrics;
  abnormalities?: AbnormalityMetrics;
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
