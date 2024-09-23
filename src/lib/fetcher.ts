import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { withQuery } from "with-query";
import { TApiResponseData, TQueryParams, Resp } from "@/types/api.type";
import { envClient } from "../lib/env/client";
import { getSession } from "next-auth/react";
import { TFilterDataWithMeta } from "@/types/vacancies.type";

const API_BASE_URL = envClient.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

async function getAccessToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    const session = await getSession();
    return session?.accessToken || null;
  }
  return null;
}

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

function removeLeadingSlash(url: string): string {
  return url.startsWith("/") ? url.slice(1) : url;
}

const fetcher = {
  async request<T>(
    method: string,
    url: string,
    params?: TQueryParams,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<Resp<T>> {
    try {
      const cleanUrl = removeLeadingSlash(url);
      const fullUrl = params ? withQuery(cleanUrl, params as Record<string, string>) : cleanUrl;

      const config: AxiosRequestConfig = {
        method,
        url: fullUrl,
        data: body,
        headers,
      };

      const response = await axiosInstance(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      }
      throw new Error("An unknown error occurred");
    }
  },

  get<T>(url: string, params?: TQueryParams, headers?: Record<string, string>): Promise<Resp<T>> {
    return this.request<T>("get", url, params, undefined, headers);
  },

  post<T>(
    url: string,
    body?: unknown,
    params?: TQueryParams,
    headers?: Record<string, string>,
  ): Promise<Resp<T>> {
    return this.request<T>("post", url, params, body, headers);
  },

  put<T>(
    url: string,
    body?: unknown,
    params?: TQueryParams,
    headers?: Record<string, string>,
  ): Promise<Resp<T>> {
    return this.request<T>("put", url, params, body, headers);
  },

  patch<T>(
    url: string,
    body?: unknown,
    params?: TQueryParams,
    headers?: Record<string, string>,
  ): Promise<Resp<T>> {
    return this.request<T>("patch", url, params, body, headers);
  },

  delete<T>(
    url: string,
    params?: TQueryParams,
    headers?: Record<string, string>,
  ): Promise<Resp<T>> {
    return this.request<T>("delete", url, params, undefined, headers);
  },
};

export async function fetchData<T>(
  url: string,
  params?: TQueryParams,
  headers?: Record<string, string>,
): Promise<TApiResponseData<T>> {
  return fetcher.get<TApiResponseData<T>>(url, params, headers);
}

export async function fetchDropdownData(
  url: string,
  params?: TQueryParams,
  headers?: Record<string, string>,
): Promise<TFilterDataWithMeta> {
  return fetcher.get<TFilterDataWithMeta>(url, params, headers);
}

export async function postData<T>(
  url: string,
  body: unknown,
  params?: TQueryParams,
  headers?: Record<string, string>,
): Promise<Resp<T>> {
  return fetcher.post<T>(url, body, params, headers);
}

export async function putData<T>(
  url: string,
  body: unknown,
  params?: TQueryParams,
  headers?: Record<string, string>,
): Promise<Resp<T>> {
  return fetcher.put<T>(url, body, params, headers);
}

export async function patchData<T>(
  url: string,
  body: unknown,
  params?: TQueryParams,
  headers?: Record<string, string>,
): Promise<Resp<T>> {
  return fetcher.patch<T>(url, body, params, headers);
}

export async function deleteData<T>(
  url: string,
  params?: TQueryParams,
  headers?: Record<string, string>,
): Promise<Resp<T>> {
  return fetcher.delete<T>(url, params, headers);
}

export { fetcher };
