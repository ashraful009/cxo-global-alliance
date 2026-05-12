import api from './api';

export const getHeroSettings = async () => {
  const response = await api.get('/settings/hero');
  return response.data;
};

export const getSiteSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSiteSettings = async (settingsData) => {
  const response = await api.put('/settings', settingsData);
  return response.data;
};

export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

export const getFacilities = async () => {
  const response = await api.get('/facilities');
  return response.data;
};

export const getFacilityById = async (id) => {
  const response = await api.get(`/facilities/${id}`);
  return response.data;
};

export const submitContactForm = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

