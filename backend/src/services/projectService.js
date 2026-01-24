import pool from '../db.js';

export async function getUserProjects(userId) {
  const result = await pool.query(
    'SELECT id, user_id, title, description, created_at, updated_at FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function getProjectById(projectId, userId) {
  const result = await pool.query(
    'SELECT id, user_id, title, description, created_at, updated_at FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );
  return result.rows[0];
}

export async function createProject(userId, title, description = '') {
  const result = await pool.query(
    'INSERT INTO projects (user_id, title, description) VALUES ($1, $2, $3) RETURNING id, user_id, title, description, created_at, updated_at',
    [userId, title, description]
  );
  return result.rows[0];
}

export async function updateProject(projectId, userId, title, description) {
  const result = await pool.query(
    'UPDATE projects SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING id, user_id, title, description, created_at, updated_at',
    [title, description, projectId, userId]
  );
  return result.rows[0];
}

export async function deleteProject(projectId, userId) {
  const result = await pool.query(
    'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
    [projectId, userId]
  );
  return result.rows[0];
}
