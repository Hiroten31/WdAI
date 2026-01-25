import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject, deleteProject } from '../api/authApi';
import { LogOut } from 'lucide-react';
import './Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      setError('Project title is required');
      return;
    }

    try {
      const project = await createProject(newProject.title, newProject.description);
      setProjects([project, ...projects]);
      setNewProject({ title: '', description: '' });
      setShowNewProjectForm(false);
      setError('');
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete project');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>StoryForge</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="logout-btn"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="projects-section">
          <div className="section-header">
            <h2>Your Projects</h2>
            <button
              onClick={() => setShowNewProjectForm(!showNewProjectForm)}
              className="btn-primary"
            >
              {showNewProjectForm ? 'Cancel' : '+ New Project'}
            </button>
          </div>

          {showNewProjectForm && (
            <form className="new-project-form" onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="project-title">Project Title</label>
                <input
                  id="project-title"
                  type="text"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  placeholder="Enter project title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-description">Description</label>
                <textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  placeholder="Enter project description (optional)"
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary">
                Create Project
              </button>
            </form>
          )}

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                  <div className="project-meta">
                    <small>Created: {new Date(project.created_at).toLocaleDateString()}</small>
                  </div>
                  <div className="project-actions">
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="btn-secondary"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
