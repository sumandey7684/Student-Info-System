import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

function getCookie(name: string) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : '';
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const csrfToken = getCookie('csrf_token');
  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      if (!refreshing) {
        refreshing = apiClient
          .post('/auth/refresh', {})
          .then((res) => {
            const token = res.data.data?.accessToken ?? res.data.accessToken ?? null;
            if (token) useAuthStore.getState().setSession(token, useAuthStore.getState().role ?? 'ADMIN');
            return token;
          })
          .catch(() => {
            useAuthStore.getState().clearSession();
            return null;
          })
          .finally(() => {
            refreshing = null;
          });
      }
      const token = await refreshing;
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);
