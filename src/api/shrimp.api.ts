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
  id?: string;
  imageUrl?: string;
  originalName?: string;
  healthStatus?: string;
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

export interface ShrimpHistoryItem {
  id: string;
  userId: string;
  imageUrl: string;
  originalName?: string;
  species: string;
  scientificName: string;
  confidence: number;
  healthStatus?: string;
  sizeEstimate?: string;
  commercialGrade?: string;
  description?: string;
  abnormalDetected: boolean;
  alerts: string[];
  modelStatus?: string;
  processingTime?: string;
  imageDimensions?: string;
  sizeMetrics?: SizeMetrics;
  colorAnalysis?: ColorAnalysis;
  uniformity?: UniformityMetrics;
  abnormalities?: AbnormalityMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface ShrimpHistoryStats {
  totalCount: number;
  healthyCount: number;
  warningCount: number;
  avgConfidence: number;
  speciesBreakdown: Record<string, number>;
}

export interface ShrimpHistoryFilter {
  page?: number;
  limit?: number;
  species?: string;
  status?: string;
  search?: string;
}

export interface ShrimpHistoryResponse {
  items: ShrimpHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: ShrimpHistoryStats;
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

  getHistory: async (filter: ShrimpHistoryFilter = {}): Promise<ShrimpHistoryResponse> => {
    const params = new URLSearchParams();
    if (filter.page) params.append("page", String(filter.page));
    if (filter.limit) params.append("limit", String(filter.limit));
    if (filter.species && filter.species !== "all") params.append("species", filter.species);
    if (filter.status && filter.status !== "all") params.append("status", filter.status);
    if (filter.search) params.append("search", filter.search);

    const response = await api.get<ShrimpHistoryResponse>(
      `/shrimp-analysis/history?${params.toString()}`
    );
    return response.data;
  },

  getHistoryById: async (id: string): Promise<ShrimpHistoryItem> => {
    const response = await api.get<ShrimpHistoryItem>(`/shrimp-analysis/history/${id}`);
    return response.data;
  },

  deleteHistory: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/shrimp-analysis/history/${id}`
    );
    return response.data;
  },

  clearAllHistory: async (): Promise<{ success: boolean; count: number; message: string }> => {
    const response = await api.delete<{ success: boolean; count: number; message: string }>(
      "/shrimp-analysis/history"
    );
    return response.data;
  },
};
