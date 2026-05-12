import api from './api';

export const getMembers = async () => {
  const { data } = await api.get('/users/members');
  return data;
};

export const getAllUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const getUserCount = async (role) => {
  const params = role ? `?role=${role}` : '';
  const { data } = await api.get(`/users/count${params}`);
  return data.count;
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(`/users/${id}/role`, { role });
  return data;
};
