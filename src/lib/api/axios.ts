import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * URL base da API.
 * Pode ser configurada através da variável de ambiente NEXT_PUBLIC_API_URL.
 */
const API_URI = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Instância do Axios configurada para comunicação com a API.
 * Inclui interceptors para adicionar token de autenticação e tratar erros.
 */
const api: AxiosInstance = axios.create({
  baseURL: API_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de requisição.
 * Adiciona o token de autenticação ao header Authorization quando disponível.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Recupera o token do localStorage (ou sessionStorage, conforme necessário)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      // Se o token existir, adiciona ao header de autorização
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta.
 * Trata tokens de autenticação e erros comuns (401, etc).
 */
api.interceptors.response.use(
  (response) => {
    // Verifica se a resposta contém um token e o armazena
    if (response.data && typeof window !== 'undefined') {
      const token = response.data.access_token || response.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // Verifica se o erro é 401 (Unauthorized)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Remove o token do localStorage
      localStorage.removeItem('token');

      // Redireciona para a página de login se não estiver já nela
      if (!window.location.href.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export { api, API_URI };

