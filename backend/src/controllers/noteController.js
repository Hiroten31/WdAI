import {
  getNotesByProjectId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  moveNote,
  reorderNote,
} from '../services/noteService.js';

export async function getNotes(req, res) {
  try {
    const { projectId } = req.params;
    const notes = await getNotesByProjectId(parseInt(projectId), req.user.userId);
    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function getNote(req, res) {
  try {
    const { projectId, noteId } = req.params;
    const note = await getNoteById(parseInt(noteId), parseInt(projectId), req.user.userId);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createNewNote(req, res) {
  try {
    const { projectId } = req.params;
    const { title, content, parentNoteId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const note = await createNote(
      parseInt(projectId),
      req.user.userId,
      title,
      content || '',
      parentNoteId ? parseInt(parentNoteId) : null
    );

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    if (error.message.includes('not found') || error.message.includes('access denied')) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function updateNoteHandler(req, res) {
  try {
    const { projectId, noteId } = req.params;
    const { title, content } = req.body;

  console.log('=== UPDATE NOTE REQUEST ===');
  console.log('req.body:', JSON.stringify(req.body, null, 2));
  console.log('req.body keys:', Object.keys(req.body));
  console.log('hasOwnProperty parentNoteId:', req.body.hasOwnProperty('parentNoteId'));
  console.log('"parentNoteId" in req.body:', 'parentNoteId' in req.body);
  console.log('Details:', {
      projectId, 
      noteId, 
      title, 
      content,
      hasParentNoteId: 'parentNoteId' in req.body,
      parentNoteIdValue: req.body.parentNoteId,
      bodyKeys: Object.keys(req.body)
    });

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Only pass parentNoteId if it's explicitly provided in the request body
    const shouldUpdateParent = 'parentNoteId' in req.body;
    const parentNoteId = shouldUpdateParent 
      ? (req.body.parentNoteId ? parseInt(req.body.parentNoteId) : null)
      : undefined;

    console.log('Passing to service:', { shouldUpdateParent, parentNoteId });

    const note = await updateNote(
      parseInt(noteId),
      parseInt(projectId),
      req.user.userId,
      title,
      content || '',
      parentNoteId
    );

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    if (error.message.includes('not found') || error.message.includes('access denied')) {
      res.status(403).json({ error: error.message });
    } else if (error.message.includes('circular')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function deleteNoteHandler(req, res) {
  try {
    const { projectId, noteId } = req.params;
    await deleteNote(parseInt(noteId), parseInt(projectId), req.user.userId);

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    if (error.message.includes('not found') || error.message.includes('access denied')) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function moveNoteHandler(req, res) {
  try {
    const { projectId, noteId } = req.params;
    const { parentNoteId } = req.body;

    const note = await moveNote(
      parseInt(noteId),
      parseInt(projectId),
      req.user.userId,
      parentNoteId ? parseInt(parentNoteId) : null
    );

    res.json(note);
  } catch (error) {
    console.error('Move note error:', error);
    if (error.message.includes('not found') || error.message.includes('access denied')) {
      res.status(403).json({ error: error.message });
    } else if (error.message.includes('circular')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function reorderNoteHandler(req, res) {
  try {
    const { projectId, noteId } = req.params;
    const { parentNoteId, position } = req.body;

    if (position === undefined || position === null) {
      return res.status(400).json({ error: 'Position is required' });
    }

    const note = await reorderNote(
      parseInt(noteId),
      parseInt(projectId),
      req.user.userId,
      parentNoteId !== undefined ? (parentNoteId ? parseInt(parentNoteId) : null) : undefined,
      parseInt(position)
    );

    res.json(note);
  } catch (error) {
    console.error('Reorder note error:', error);
    if (error.message.includes('not found') || error.message.includes('access denied')) {
      res.status(403).json({ error: error.message });
    } else if (error.message.includes('circular')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
