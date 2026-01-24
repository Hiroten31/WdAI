-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note Tags junction table
CREATE TABLE IF NOT EXISTS note_tags (
  note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_notes_project_id ON notes(project_id);
CREATE INDEX idx_notes_parent_id ON notes(parent_note_id);
CREATE INDEX idx_tags_project_id ON tags(project_id);

-- Test data
INSERT INTO users (username, email, password_hash) VALUES 
('testuser', 'test@example.com', 'placeholder_hash_will_be_updated');

INSERT INTO projects (user_id, title, description) VALUES
(1, 'Fantasy World', 'Building a fantasy world with characters and locations'),
(1, 'Sci-Fi Universe', 'A futuristic universe with space exploration');

INSERT INTO tags (project_id, name) VALUES
(1, 'location'),
(1, 'character'),
(1, 'plot'),
(2, 'planet'),
(2, 'technology');

INSERT INTO notes (project_id, title, content) VALUES
(1, 'Nilfgaard', 'A peaceful village in the northern lands'),
(1, 'Cynthia', 'A brave warrior and protector of Nilfgaard'),
(2, 'Mars Colony', 'First human settlement on Mars');

INSERT INTO note_tags (note_id, tag_id) VALUES
(1, 1), (1, 2),
(2, 2), (2, 3),
(3, 4);
