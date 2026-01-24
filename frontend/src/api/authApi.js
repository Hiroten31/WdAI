import apiClient from './apiClient.js';

export async function register(username, email, password, confirmPassword) {
  const response = await apiClient.post('/auth/register', {
    username,
    email,
    password,
    confirmPassword,
  });
  return response.data;
}

export async function login(username, password) {
  const response = await apiClient.post('/auth/login', {
    username,
    password,
  });
  return response.data;
}

export async function getProjects() {
  const response = await apiClient.get('/projects');
  return response.data;
}

export async function getProject(id) {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
}

export async function createProject(title, description) {
  const response = await apiClient.post('/projects', {
    title,
    description,
  });
  return response.data;
}

export async function updateProject(id, title, description) {
  const response = await apiClient.put(`/projects/${id}`, {
    title,
    description,
  });
  return response.data;
}

export async function deleteProject(id) {
  const response = await apiClient.delete(`/projects/${id}`);
  return response.data;
}
