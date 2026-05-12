import api from './api';

export const getAllFacilities = async () => {
  const { data } = await api.get('/facilities');
  return data;
};

export const getFacilityById = async (id) => {
  const { data } = await api.get(`/facilities/${id}`);
  return data;
};

export const createFacility = async (payload) => {
  const { data } = await api.post('/facilities', payload);
  return data;
};

export const updateFacility = async (id, payload) => {
  const { data } = await api.put(`/facilities/${id}`, payload);
  return data;
};

export const deleteFacility = async (id) => {
  const { data } = await api.delete(`/facilities/${id}`);
  return data;
};
