import { apiFetch } from './apiClient';

export function createOrder(payload) {
  return apiFetch('/orders', { method: 'POST', body: payload });
}

export function getOrder(id) {
  return apiFetch(`/orders/${id}`);
}

export function listOrdersForUser(userId, params = '') {
  return apiFetch(`/users/${userId}/orders${params ? `?${params}` : ''}`);
}

export function updateOrderStatus(id, status) {
  return apiFetch(`/orders/${id}/status`, { method: 'PUT', body: { status } });
}

export function deleteOrder(id) {
  return apiFetch(`/orders/${id}`, { method: 'DELETE' });
}