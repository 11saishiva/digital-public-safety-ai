import { apiClient } from "./client";
import type { ApiEnvelope, CounterfeitReport, ModelInfo, PaginatedResult } from "../types";

export async function predictCounterfeit(file: File): Promise<CounterfeitReport> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiClient.post<ApiEnvelope<CounterfeitReport>>(
    "/counterfeit/predict",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data.data;
}

export async function getCounterfeitModelInfo(): Promise<ModelInfo> {
  const res = await apiClient.get<ApiEnvelope<ModelInfo>>("/counterfeit/model/info");
  return res.data.data;
}

export async function listCounterfeitReports(params?: {
  page?: number;
  page_size?: number;
  search?: string;
}): Promise<PaginatedResult<CounterfeitReport>> {
  const page = params?.page ?? 1;
  const limit = params?.page_size ?? 10;
  const skip = (page - 1) * limit;

  const res = await apiClient.get<PaginatedResult<CounterfeitReport>>(
    "/counterfeit",
    {
      params: {
        skip,
        limit,
      },
    }
  );

  return {
    items: res.data.data,
    total: res.data.total,
    skip: res.data.skip,
    limit: res.data.limit,
  };
}

export async function getCounterfeitReport(id: string): Promise<CounterfeitReport> {
  const res = await apiClient.get<ApiEnvelope<CounterfeitReport>>(`/counterfeit/${id}`);
  return res.data.data;
}

export async function deleteCounterfeitReport(id: string): Promise<void> {
  await apiClient.delete(`/counterfeit/${id}`);
}
