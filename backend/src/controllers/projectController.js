import {
  getUserProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../services/projectService.js';

export async function getProjects(req, res) {
  try {
    const projects = await getUserProjects(req.user.userId);
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProject(req, res) {
  try {
    const { id } = req.params;
    const project = await getProjectById(parseInt(id), req.user.userId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createNewProject(req, res) {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const project = await createProject(req.user.userId, title, description || '');
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateProjectHandler(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const project = await updateProject(parseInt(id), req.user.userId, title, description || '');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteProjectHandler(req, res) {
  try {
    const { id } = req.params;
    const result = await deleteProject(parseInt(id), req.user.userId);
    
    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
