import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCounterfeitReport,
  getCounterfeitModelInfo,
  getCounterfeitReport,
  listCounterfeitReports,
  predictCounterfeit,
} from "../api/counterfeit";

export function useCounterfeitPredict() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: predictCounterfeit,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["counterfeit", "reports"] });
    },
  });
}

export function useCounterfeitModelInfo() {
  return useQuery({
    queryKey: ["counterfeit", "model-info"],
    queryFn: getCounterfeitModelInfo,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useCounterfeitReports(params: { page: number; page_size: number; search?: string }) {
  return useQuery({
    queryKey: ["counterfeit", "reports", params],
    queryFn: () => listCounterfeitReports(params),
    placeholderData: (prev) => prev,
  });
}

export function useCounterfeitReport(id?: string) {
  return useQuery({
    queryKey: ["counterfeit", "report", id],
    queryFn: () => getCounterfeitReport(id as string),
    enabled: !!id,
  });
}

export function useDeleteCounterfeitReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCounterfeitReport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["counterfeit", "reports"] });
    },
  });
}
