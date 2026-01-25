import pool from '../db.js';

export async function getNotesByProjectId(projectId, userId) {
  // Verify user owns the project
  const projectCheck = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );

  if (projectCheck.rows.length === 0) {
    throw new Error('Project not found or access denied');
  }

  // Get all notes for the project
  const result = await pool.query(
    `SELECT id, project_id, parent_note_id, title, description, content, position, created_at, updated_at 
     FROM notes 
     WHERE project_id = $1 
     ORDER BY parent_note_id NULLS FIRST, position ASC, created_at ASC`,
    [projectId]
  );

  return result.rows;
}

export async function getNoteById(noteId, projectId, userId) {
  const result = await pool.query(
    `SELECT n.id, n.project_id, n.parent_note_id, n.title, n.description, n.content, n.position, n.created_at, n.updated_at
     FROM notes n
     JOIN projects p ON n.project_id = p.id
     WHERE n.id = $1 AND n.project_id = $2 AND p.user_id = $3`,
    [noteId, projectId, userId]
  );

  return result.rows[0];
}

export async function createNote(projectId, userId, title, content = '', parentNoteId = null, description = '') {
  // Verify user owns the project
  const projectCheck = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );

  if (projectCheck.rows.length === 0) {
    throw new Error('Project not found or access denied');
  }

  // If there's a parent note, verify it exists in the same project
  if (parentNoteId) {
    const parentCheck = await pool.query(
      'SELECT id FROM notes WHERE id = $1 AND project_id = $2',
      [parentNoteId, projectId]
    );

    if (parentCheck.rows.length === 0) {
      throw new Error('Parent note not found in this project');
    }
  }

  // Get the next position for this parent level
  const positionResult = await pool.query(
    `SELECT COALESCE(MAX(position), -1) + 1 as next_position 
     FROM notes 
     WHERE project_id = $1 AND parent_note_id IS NOT DISTINCT FROM $2`,
    [projectId, parentNoteId]
  );
  const position = positionResult.rows[0].next_position;

  const result = await pool.query(
    `INSERT INTO notes (project_id, parent_note_id, title, description, content, position) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, project_id, parent_note_id, title, description, content, position, created_at, updated_at`,
    [projectId, parentNoteId, title, description, content, position]
  );

  return result.rows[0];
}

export async function updateNote(noteId, projectId, userId, title, content, parentNoteId = undefined, description = undefined) {
  // Verify user owns the note (through project)
  const noteCheck = await pool.query(
    `SELECT n.id, n.parent_note_id, n.description FROM notes n
     JOIN projects p ON n.project_id = p.id
     WHERE n.id = $1 AND n.project_id = $2 AND p.user_id = $3`,
    [noteId, projectId, userId]
  );

  if (noteCheck.rows.length === 0) {
    throw new Error('Note not found or access denied');
  }

  const currentParentId = noteCheck.rows[0].parent_note_id;
  const currentDescription = noteCheck.rows[0].description || '';
  
  // If parentNoteId is not provided (undefined), keep the current parent_note_id
  const newParentNoteId = parentNoteId !== undefined ? parentNoteId : currentParentId;
  const newDescription = description !== undefined ? description : currentDescription;

  console.log('updateNote service:', { 
    noteId, 
    currentParentId, 
    receivedParentNoteId: parentNoteId,
    newParentNoteId,
    currentDescription,
    newDescription
  });

  // Prevent circular references
  if (newParentNoteId && newParentNoteId === noteId) {
    throw new Error('A note cannot be its own parent');
  }

  const result = await pool.query(
    `UPDATE notes 
     SET title = $1, description = $2, content = $3, parent_note_id = $4, updated_at = CURRENT_TIMESTAMP
     WHERE id = $5 AND project_id = $6
     RETURNING id, project_id, parent_note_id, title, description, content, position, created_at, updated_at`,
    [title, newDescription, content, newParentNoteId, noteId, projectId]
  );

  console.log('Updated note result:', result.rows[0]);

  return result.rows[0];
}

export async function deleteNote(noteId, projectId, userId) {
  // Verify user owns the note
  const noteCheck = await pool.query(
    `SELECT n.id FROM notes n
     JOIN projects p ON n.project_id = p.id
     WHERE n.id = $1 AND n.project_id = $2 AND p.user_id = $3`,
    [noteId, projectId, userId]
  );

  if (noteCheck.rows.length === 0) {
    throw new Error('Note not found or access denied');
  }

  // Delete note (child notes will have parent_note_id set to NULL due to ON DELETE SET NULL)
  const result = await pool.query(
    'DELETE FROM notes WHERE id = $1 RETURNING id',
    [noteId]
  );

  return result.rows[0];
}

export async function moveNote(noteId, projectId, userId, newParentNoteId = null) {
  // Verify user owns the note
  const noteCheck = await pool.query(
    `SELECT n.id FROM notes n
     JOIN projects p ON n.project_id = p.id
     WHERE n.id = $1 AND n.project_id = $2 AND p.user_id = $3`,
    [noteId, projectId, userId]
  );

  if (noteCheck.rows.length === 0) {
    throw new Error('Note not found or access denied');
  }

  // If moving to a new parent, verify parent exists
  if (newParentNoteId) {
    const parentCheck = await pool.query(
      'SELECT id FROM notes WHERE id = $1 AND project_id = $2',
      [newParentNoteId, projectId]
    );

    if (parentCheck.rows.length === 0) {
      throw new Error('Parent note not found in this project');
    }

    // Prevent circular references
    if (newParentNoteId === noteId) {
      throw new Error('A note cannot be its own parent');
    }
  }

  const result = await pool.query(
    `UPDATE notes 
     SET parent_note_id = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND project_id = $3
     RETURNING id, project_id, parent_note_id, title, content, position, created_at, updated_at`,
    [newParentNoteId, noteId, projectId]
  );

  return result.rows[0];
}

export async function reorderNote(noteId, projectId, userId, newParentNoteId, newPosition) {
  // Verify user owns the note
  const noteCheck = await pool.query(
    `SELECT n.id, n.parent_note_id, n.position FROM notes n
     JOIN projects p ON n.project_id = p.id
     WHERE n.id = $1 AND n.project_id = $2 AND p.user_id = $3`,
    [noteId, projectId, userId]
  );

  if (noteCheck.rows.length === 0) {
    throw new Error('Note not found or access denied');
  }

  const oldParentId = noteCheck.rows[0].parent_note_id;
  const oldPosition = noteCheck.rows[0].position;

  // If moving to a new parent, verify parent exists
  if (newParentNoteId !== null && newParentNoteId !== undefined) {
    const parentCheck = await pool.query(
      'SELECT id FROM notes WHERE id = $1 AND project_id = $2',
      [newParentNoteId, projectId]
    );

    if (parentCheck.rows.length === 0) {
      throw new Error('Parent note not found in this project');
    }

    // Prevent circular references
    if (newParentNoteId === noteId) {
      throw new Error('A note cannot be its own parent');
    }
  }

  // Check if parent changed or just position changed
  const parentChanged = oldParentId !== newParentNoteId;

  if (parentChanged) {
    // Remove from old parent - shift positions down
    await pool.query(
      `UPDATE notes 
       SET position = position - 1 
       WHERE project_id = $1 AND parent_note_id IS NOT DISTINCT FROM $2 AND position > $3`,
      [projectId, oldParentId, oldPosition]
    );

    // Make room in new parent - shift positions up
    await pool.query(
      `UPDATE notes 
       SET position = position + 1 
       WHERE project_id = $1 AND parent_note_id IS NOT DISTINCT FROM $2 AND position >= $3`,
      [projectId, newParentNoteId, newPosition]
    );

    // Move the note
    const result = await pool.query(
      `UPDATE notes 
       SET parent_note_id = $1, position = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND project_id = $4
       RETURNING id, project_id, parent_note_id, title, content, position, created_at, updated_at`,
      [newParentNoteId, newPosition, noteId, projectId]
    );

    return result.rows[0];
  } else {
    // Same parent, just reordering
    if (oldPosition === newPosition) {
      // No change needed
      return noteCheck.rows[0];
    }

    if (oldPosition < newPosition) {
      // Moving down - shift items between old and new position up
      await pool.query(
        `UPDATE notes 
         SET position = position - 1 
         WHERE project_id = $1 AND parent_note_id IS NOT DISTINCT FROM $2 
         AND position > $3 AND position <= $4`,
        [projectId, oldParentId, oldPosition, newPosition]
      );
    } else {
      // Moving up - shift items between new and old position down
      await pool.query(
        `UPDATE notes 
         SET position = position + 1 
         WHERE project_id = $1 AND parent_note_id IS NOT DISTINCT FROM $2 
         AND position >= $3 AND position < $4`,
        [projectId, oldParentId, newPosition, oldPosition]
      );
    }

    // Move the note
    const result = await pool.query(
      `UPDATE notes 
       SET position = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND project_id = $3
       RETURNING id, project_id, parent_note_id, title, content, position, created_at, updated_at`,
      [newPosition, noteId, projectId]
    );

    return result.rows[0];
  }
}
