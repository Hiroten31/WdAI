import { getTagsByProjectId, createTag, deleteTag } from '../services/tagService.js';

export async function listTags(req, res) {
  try {
    const { projectId } = req.params;
    const tags = await getTagsByProjectId(parseInt(projectId), req.user.userId);
    res.json(tags);
  } catch (error) {
    console.error('List tags error:', error);
    if (error.message.includes('not found') || error.message.includes('access denied')) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function createTagHandler(req, res) {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const tag = await createTag(parseInt(projectId), req.user.userId, name.trim());
    res.status(201).json(tag);
  } catch (error) {
    console.error('Create tag error:', error);
    if (error.message.includes('not found') || error.message.includes('access denied')) {
      res.status(403).json({ error: error.message });
    } else if (error.message.includes('already exists')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function deleteTagHandler(req, res) {
  try {
    const { projectId, tagId } = req.params;
    const result = await deleteTag(parseInt(projectId), req.user.userId, parseInt(tagId));
    res.json(result);
  } catch (error) {
    console.error('Delete tag error:', error);
    if (error.message.includes('not found') || error.message.includes('access denied')) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
