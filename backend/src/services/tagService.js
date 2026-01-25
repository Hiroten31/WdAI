import pool from '../db.js';

export async function getTagsByProjectId(projectId, userId) {
  const projectCheck = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );
  if (projectCheck.rows.length === 0) {
    throw new Error('Project not found or access denied');
  }

  const result = await pool.query(
    'SELECT id, name, created_at FROM tags WHERE project_id = $1 ORDER BY name ASC',
    [projectId]
  );
  return result.rows;
}

export async function createTag(projectId, userId, name) {
  const projectCheck = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );
  if (projectCheck.rows.length === 0) {
    throw new Error('Project not found or access denied');
  }

  const exists = await pool.query(
    'SELECT id FROM tags WHERE project_id = $1 AND LOWER(name) = LOWER($2)',
    [projectId, name]
  );
  if (exists.rows.length > 0) {
    throw new Error('Tag with this name already exists');
  }

  const result = await pool.query(
    'INSERT INTO tags (project_id, name) VALUES ($1, $2) RETURNING id, name, created_at',
    [projectId, name]
  );
  return result.rows[0];
}

export async function deleteTag(projectId, userId, tagId) {
  const projectCheck = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );
  if (projectCheck.rows.length === 0) {
    throw new Error('Project not found or access denied');
  }

  const tagCheck = await pool.query(
    'SELECT id FROM tags WHERE id = $1 AND project_id = $2',
    [tagId, projectId]
  );
  if (tagCheck.rows.length === 0) {
    throw new Error('Tag not found in this project');
  }

  await pool.query('DELETE FROM note_tags WHERE tag_id = $1', [tagId]);
  await pool.query('DELETE FROM tags WHERE id = $1 AND project_id = $2', [tagId, projectId]);

  return { id: tagId };
}
