import { apiFetch } from './apiClient';

export function sendMessage(payload) {
  return apiFetch('/messages', { method: 'POST', body: payload });
}

export function listConversation(userA, userB, params = '') {
  return apiFetch(`/messages/conversation/${userA}/${userB}${params ? `?${params}` : ''}`);
}

export function markAsRead(ids = []) {
  return apiFetch('/messages/mark-read', { method: 'PUT', body: { ids } });
}