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
 * Interceptor de requisição HTTP.
 * 
 * Funcionalidade:
 * - Adiciona automaticamente o token de autenticação ao header Authorization
 * - Token é recuperado do localStorage quando disponível
 * - Formato: "Bearer {token}"
 * 
 * Verifica se está no ambiente do navegador (typeof window !== 'undefined')
 * para evitar erros durante Server-Side Rendering (SSR) do Next.js.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Verifica se está no ambiente do navegador (não no servidor)
    if (typeof window !== 'undefined') {
      // Recupera o token do localStorage
      const token = localStorage.getItem('token');

      // Se o token existir, adiciona ao header de autorização
      // Formato padrão: "Bearer {token}"
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    // Em caso de erro na requisição, rejeita a promise
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta HTTP.
 * 
 * Funcionalidades:
 * 1. Em caso de sucesso: verifica se a resposta contém um novo token e o armazena
 * 2. Em caso de erro 401 (Unauthorized): remove token e redireciona para login
 * 
 * Tratamento de erros:
 * - 401: Token inválido/expirado → remove token e redireciona para login
 * - Outros erros: são rejeitados para serem tratados pelos componentes
 */
api.interceptors.response.use(
  (response) => {
    // Verifica se a resposta contém um novo token (útil para refresh tokens)
    if (response.data && typeof window !== 'undefined') {
      const token = response.data.access_token || response.data.token;
      if (token) {
        // Armazena o novo token no localStorage
        localStorage.setItem('token', token);
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // Tratamento de erro 401 (Não autorizado)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Remove o token inválido do localStorage
      localStorage.removeItem('token');

      // Redireciona para a página de login se não estiver já nela
      // Evita loop de redirecionamento
      if (!window.location.href.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }

    // Rejeita a promise para que o erro seja tratado pelo componente que fez a requisição
    return Promise.reject(error);
  }
);

export { api, API_URI };

