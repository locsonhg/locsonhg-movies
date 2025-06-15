import axios from "axios";

// Cấu hình axios instance cho PhimAPI
export const phimApi = axios.create({
  baseURL: "https://phimapi.com",
  timeout: 10000,
});

// Request interceptor
phimApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
phimApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// General axios instance cho các API khác
export const api = axios.create({
  timeout: 10000,
});

export default phimApi;
