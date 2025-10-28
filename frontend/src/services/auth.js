import { apiFetch, API_BASE } from './apiClient';

export function login(emailOrPayload, password) {
  const body = (typeof emailOrPayload === 'object' && emailOrPayload !== null)
    ? emailOrPayload
    : { email: emailOrPayload, password };

  return apiFetch('/auth/login', { method: 'POST', body });
}

export function register(payload) {
  return apiFetch('/auth/register', { method: 'POST', body: payload });
}

export function logout() {
  // client-side only: clear token via setToken in apiClient (import where used)
  return Promise.resolve();
}

// optional: fetch current user if backend has endpoint
export function me() {
  return apiFetch('/auth/me');
}