import { apiFetch } from './apiClient';

export function createOrUpdateReview(payload) {
  return apiFetch('/reviews', { method: 'POST', body: payload });
}

export function getReviewsByProduct(productId) {
  return apiFetch(`/products/${productId}/reviews`);
}

export function deleteReview(productId, userId) {
  return apiFetch(`/products/${productId}/reviews/${userId}`, { method: 'DELETE' });
}