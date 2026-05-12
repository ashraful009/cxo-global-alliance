import api from './api';

export const getAllServices = async () => {
  const { data } = await api.get('/services');
  return data;
};

export const getServiceById = async (id) => {
  const { data } = await api.get(`/services/${id}`);
  return data;
};

export const createService = async (formData) => {
  const { data } = await api.post('/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateService = async (id, formData) => {
  const { data } = await api.put(`/services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/services/${id}`);
  return data;
};
