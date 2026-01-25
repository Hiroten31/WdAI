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

// Notes API
export async function getNotes(projectId) {
  const response = await apiClient.get(`/projects/${projectId}/notes`);
  return response.data;
}

export async function getNote(projectId, noteId) {
  const response = await apiClient.get(`/projects/${projectId}/notes/${noteId}`);
  return response.data;
}

export async function createNote(projectId, title, content = '', parentNoteId = null, description = '') {
  const response = await apiClient.post(`/projects/${projectId}/notes`, {
    title,
    content,
    description,
    parentNoteId,
  });
  return response.data;
}

export async function updateNote(projectId, noteId, title, content = '', parentNoteId = undefined, description = undefined) {
  const body = {
    title,
    content,
  };
  if (description !== undefined) {
    body.description = description;
  }
  
  // Only include parentNoteId if it's explicitly provided
  if (parentNoteId !== undefined) {
    body.parentNoteId = parentNoteId;
  }
  
  const response = await apiClient.put(`/projects/${projectId}/notes/${noteId}`, body);
  return response.data;
}

export async function deleteNote(projectId, noteId) {
  const response = await apiClient.delete(`/projects/${projectId}/notes/${noteId}`);
  return response.data;
}

export async function moveNote(projectId, noteId, parentNoteId = null) {
  const response = await apiClient.patch(`/projects/${projectId}/notes/${noteId}/move`, {
    parentNoteId,
  });
  return response.data;
}

export async function reorderNote(projectId, noteId, parentNoteId, position) {
  const response = await apiClient.patch(`/projects/${projectId}/notes/${noteId}/reorder`, {
    parentNoteId,
    position,
  });
  return response.data;
}
