import axios, { AxiosError } from "axios";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; detail?: string }>) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new ApiError("The request timed out. Please try again."));
    }
    if (!error.response) {
      return Promise.reject(
        new ApiError("Failed to connect to server. Check that the backend is running.")
      );
    }
    const backendMessage =
      error.response.data?.message || error.response.data?.detail;
    return Promise.reject(
      new ApiError(backendMessage || "Something went wrong. Please try again.", error.response.status)
    );
  }
);
