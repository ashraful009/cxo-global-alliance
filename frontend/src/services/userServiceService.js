import api from './api';

export const getUserServices = async (userId) => {
  const { data } = await api.get(`/user-services/${userId}`);
  return data;
};

export const createUserService = async (payload) => {
  const { data } = await api.post('/user-services', payload);
  return data;
};

export const updateUserService = async (id, payload) => {
  const { data } = await api.put(`/user-services/${id}`, payload);
  return data;
};

export const deleteUserService = async (id) => {
  const { data } = await api.delete(`/user-services/${id}`);
  return data;
};
