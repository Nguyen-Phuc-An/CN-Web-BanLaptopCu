import { apiFetch, API_BASE } from './apiClient';

export function getProducts(query = '') {
  return apiFetch('/products' + (query ? `?${query}` : ''));
}

export function getProduct(id) {
  return apiFetch(`/products/${id}`);
}

export function createProduct(payload) {
  return apiFetch('/products', { method: 'POST', body: payload });
}

export function updateProduct(id, payload) {
  return apiFetch(`/products/${id}`, { method: 'PUT', body: payload });
}

export function deleteProduct(id) {
  return apiFetch(`/products/${id}`, { method: 'DELETE' });
}

export async function uploadProductImages(productId, files = []) {
  const form = new FormData();
  files.forEach(f => form.append('images', f));
  const token = localStorage.getItem('cn_token');
  const headers = token ? { Authorization: 'Bearer ' + token } : {};
  const res = await fetch(API_BASE + `/products/${productId}/images`, {
    method: 'POST',
    headers,
    body: form
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}