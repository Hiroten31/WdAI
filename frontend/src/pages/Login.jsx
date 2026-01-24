import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!username || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(error || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>StoryForge - Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {(localError || error) && (
            <div className="error-message">{localError || error}</div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}
