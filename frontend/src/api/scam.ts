import { apiClient } from "./client";
import type {
  ApiEnvelope,
  ModelInfo,
  PaginatedResult,
  ScamPredictRequest,
  ScamReport,
  ScamReportsResponse,
} from "../types";

interface RawScamReport extends Omit<ScamReport, "detected_patterns"> {
  detected_patterns: string;
}

export async function predictScam(
  payload: ScamPredictRequest
): Promise<ScamReport> {
  const res = await apiClient.post<ApiEnvelope<RawScamReport>>(
    "/scam/predict",
    payload
  );

  return {
    ...res.data.data,
    detected_patterns: JSON.parse(res.data.data.detected_patterns),
  };
}

export async function getScamModelInfo(): Promise<ModelInfo> {
  const res = await apiClient.get<ApiEnvelope<ModelInfo>>("/scam/model/info");
  return res.data.data;
}

export async function listScamReports(params?: {
  page?: number;
  page_size?: number;
  search?: string;
}): Promise<ScamReportsResponse> {
  const page = params?.page ?? 1;
  const limit = params?.page_size ?? 10;
  const skip = (page - 1) * limit;

  const res = await apiClient.get("/scam", {
    params: {
      skip,
      limit,
    },
  });

  return {
    items: res.data.data.map((report: any) => ({
      ...report,
      detected_patterns: JSON.parse(report.detected_patterns),
    })),
    total: res.data.total,
    skip: res.data.skip,
    limit: res.data.limit,
  };
}

export async function getScamReport(id: string): Promise<ScamReport> {
  const res = await apiClient.get<ApiEnvelope<any>>(`/scam/${id}`);

  const report = res.data.data;

  return {
    ...report,
    detected_patterns: JSON.parse(report.detected_patterns),
  };
}

export async function deleteScamReport(id: string): Promise<void> {
  await apiClient.delete(`/scam/${id}`);
}
