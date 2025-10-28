import { apiFetch } from './apiClient';

export function addToWishlist(user_id, product_id) {
  return apiFetch('/wishlists', { method: 'POST', body: { user_id, product_id } });
}

export function removeFromWishlist(userId, productId) {
  return apiFetch(`/users/${userId}/wishlists/${productId}`, { method: 'DELETE' });
}

export function listWishlist(userId) {
  return apiFetch(`/users/${userId}/wishlists`);
}