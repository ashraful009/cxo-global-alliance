import api from './api';

export const getSettings = async () => {
  const { data } = await api.get('/settings');
  return data;
};

export const getHeroSettings = async () => {
  const { data } = await api.get('/settings/hero');
  return data;
};

export const updateSettings = async (payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await api.put('/settings', payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return data;
};

export const updateHeroSettings = async (formData) => {
  const { data } = await api.put('/settings/hero', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
