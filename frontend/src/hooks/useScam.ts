import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteScamReport,
  getScamModelInfo,
  getScamReport,
  listScamReports,
  predictScam,
} from "../api/scam";

export function useScamPredict() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: predictScam,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scam", "reports"] });
    },
  });
}

export function useScamModelInfo() {
  return useQuery({
    queryKey: ["scam", "model-info"],
    queryFn: getScamModelInfo,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useScamReports(params: { page: number; page_size: number; search?: string }) {
  return useQuery({
    queryKey: ["scam", "reports", params],
    queryFn: () => listScamReports(params),
    placeholderData: (prev) => prev,
  });
}

export function useScamReport(id?: string) {
  return useQuery({
    queryKey: ["scam", "report", id],
    queryFn: () => getScamReport(id as string),
    enabled: !!id,
  });
}

export function useDeleteScamReport() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteScamReport,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["scam", "reports"],
      });
    },
  });
}
