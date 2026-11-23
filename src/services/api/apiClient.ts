import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Standard Axios Client for Crave App
 * Configured with request/response interceptors, timeouts, and OSM compliant headers
 */
export const apiClient: AxiosInstance = axios.create({
  timeout: 15000, // 15 seconds default timeout
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'CraveFoodDiscoveryApp/1.0 (https://crave.app; contact@crave.app)',
  },
});

// Request Interceptor: Attach headers or log in dev
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can attach authorization tokens here in the future
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform error formatting
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with a status code out of 2xx range (e.g. 502 at capacity)
      const summary =
        typeof error.response.data === 'string'
          ? error.response.data.slice(0, 40).replace(/\r?\n|\r/g, ' ')
          : JSON.stringify(error.response.data);
      console.log(
        `[API ${error.response.status}]: ${error.config?.url?.split('?')[0] || ''} (${summary})`
      );
    } else if (error.request) {
      // Request made but no response received (timeout, mirror switching)
      console.log('[API Network/Timeout]:', error.config?.url?.split('?')[0] || error.message);
    } else {
      console.log('[API Request Error]:', error.message);
    }
    return Promise.reject(error);
  }
);
