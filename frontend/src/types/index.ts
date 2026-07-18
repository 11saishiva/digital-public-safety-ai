// ---------- Shared ----------

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ModelInfo {
  model_name: string;
  model_version: string;
  model_type?: string;
  loaded_at?: string;
  [key: string]: unknown;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
  timestamp: string;
}

// ---------- Counterfeit ----------

export type CounterfeitPrediction = "REAL" | "COUNTERFEIT";

export interface CounterfeitReport {
  id: string;
  filename: string;
  image_path: string;
  prediction: string;
  confidence: number;
  model_version: string;
  processing_time_ms: number;
  created_at: string;
  updated_at: string;
}

// ---------- Scam ----------

export type ScamPrediction = "SCAM" | "SAFE";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface ScamReport {
  id: string;
  message: string;
  prediction: string;
  confidence: number;
  risk_level: string;
  detected_patterns: string[];
  model_version: string;
  processing_time_ms: number;
  created_at: string;
}

export interface ScamPredictRequest {
  message: string;
}

// ---------- UI ----------

export type ReportKind = "counterfeit" | "scam";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}

export interface ScamReportsResponse {
  success: boolean;
  message: string;
  data: ScamReport[];
  total: number;
  skip: number;
  limit: number;
  timestamp: string;
}
