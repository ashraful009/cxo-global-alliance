import api from './api';

export const getAllMessages = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', params.limit);
  if (params.unread) query.set('unread', 'true');
  const { data } = await api.get(`/contact${query.toString() ? `?${query}` : ''}`);
  return data;
};

export const getMessageCount = async (unread = false) => {
  const { data } = await api.get(`/contact/count${unread ? '?unread=true' : ''}`);
  return data.count;
};

export const toggleMessageRead = async (id) => {
  const { data } = await api.put(`/contact/${id}/read`);
  return data;
};

export const deleteMessage = async (id) => {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
};
