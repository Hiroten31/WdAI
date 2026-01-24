import bcrypt from 'bcrypt';
import pool from '../db.js';

const SALT_ROUNDS = 10;

export async function createUser(username, email, password) {
  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, passwordHash]
    );
    
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new Error('Username or email already exists');
    }
    throw error;
  }
}

export async function getUserByUsername(username) {
  const result = await pool.query(
    'SELECT id, username, email, password_hash, created_at FROM users WHERE username = $1',
    [username]
  );
  
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await pool.query(
    'SELECT id, username, email, created_at FROM users WHERE id = $1',
    [id]
  );
  
  return result.rows[0];
}

export async function verifyPassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}
