"use server"

import { auth } from '@clerk/nextjs/server';

const API_TIMEOUT_MS = 60000;

async function apiFetch<T>(
  urlPath: string,
  options: RequestInit = {},
  timeoutMs = API_TIMEOUT_MS
): Promise<T> {

  const BASE_URL = process.env.API_BASE_URL;
  if (!BASE_URL) {
    throw new Error("Thiếu biến môi trường API_BASE_URL");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const isFormData = options.body instanceof FormData;
  const defaultHeaders: Record<string, string> = {};

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: defaultHeaders,
    cache: 'no-store',
    signal: controller.signal,
  };

  const finalOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...(defaultOptions.headers as Record<string, string>),
      ...((options.headers || {}) as Record<string, string>),
    },
  };

  const fullUrl = `${BASE_URL}${urlPath}`;
  try {
    const response = await fetch(fullUrl, finalOptions);
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Đã xảy ra lỗi";
      try {
        if (errorText) {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null as T;
    }

    const text = await response.text();
    if (!text) {
      return null as T;
    }

    const data: T = JSON.parse(text);
    return data;

  } catch (error) {
    clearTimeout(timeout);
    console.error("Lỗi apiFetch:", error);
    throw error;
  }
}

export async function getClerkToken(): Promise<string> {
  const { getToken, userId } = await auth();
  if (!userId) {
    throw new Error('Chưa xác thực (User ID not found)');
  }
  const token = await getToken({ template: 'aflower' });
  if (!token) {
    throw new Error('Không lấy được token (getToken failed)');
  }
  return token;
}

export async function fetchAuthenticated<T>(
  urlPath: string,
  options: RequestInit = {}
): Promise<T> {

  const token = await getClerkToken();

  const authHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...((options.headers || {}) as Record<string, string>),
    },
  };

  return apiFetch<T>(urlPath, finalOptions);
}

export async function fetchPublic<T>(
  urlPath: string,
  options: RequestInit = {}
): Promise<T> {
  return apiFetch<T>(urlPath, options);
}