import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { getNotes, updateNote, deleteNote } from '../api/authApi';
import './NoteEditorPage.css';

export function NoteEditorPage() {
  const { projectId, noteId } = useParams();
  const navigate = useNavigate();
  
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  // Auto-save every 3 seconds if there are unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 3000);

    return () => clearTimeout(timer);
  }, [content, title, description, hasUnsavedChanges]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all notes and find the specific one
      const notes = await getNotes(projectId);
      const foundNote = findNoteById(notes, parseInt(noteId));
      
      if (!foundNote) {
        setError('Note not found');
        return;
      }

      setNote(foundNote);
      setTitle(foundNote.title);
      setDescription(foundNote.description || '');
      setContent(foundNote.content || '');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const findNoteById = (notes, id) => {
    for (const note of notes) {
      if (note.id === id) return note;
      if (note.children && note.children.length > 0) {
        const found = findNoteById(note.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;

    try {
      setSaving(true);
      // Don't send parentNoteId to avoid moving the note
      await updateNote(projectId, noteId, title, content, undefined, description);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteNote(projectId, noteId);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete note');
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Do you want to leave without saving?')) {
        return;
      }
    }
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="note-editor-page">
        <div className="loading">Loading note...</div>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="note-editor-page">
        <div className="error-message">{error}</div>
        <button className="btn-back" onClick={handleBack}>
          <ArrowLeft size={20} /> Back to Project
        </button>
      </div>
    );
  }

  return (
    <div className="note-editor-page">
      <div className="editor-header">
        <button className="btn-back" onClick={handleBack}>
          <ArrowLeft size={20} /> Back to Project
        </button>
        
        <div className="editor-actions">
          {hasUnsavedChanges && <span className="unsaved-indicator">Unsaved changes</span>}
          {saving && <span className="saving-indicator">Saving...</span>}
          
          <button 
            className="btn-save" 
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving}
          >
            <Save size={18} /> Save
          </button>
          
          <button className="btn-delete" onClick={handleDelete}>
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      <div className="editor-content">
        <input
          type="text"
          className="note-title-input"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setHasUnsavedChanges(true);
          }}
          placeholder="Note title..."
        />

        <textarea
          className="note-description-input"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setHasUnsavedChanges(true);
          }}
          placeholder="Note description..."
          rows={3}
        />

        <div className="markdown-editor-container" data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(val) => {
              setContent(val || '');
              setHasUnsavedChanges(true);
            }}
            height={600}
            preview="live"
            highlightEnable={true}
          />
        </div>
      </div>

      {error && <div className="error-toast">{error}</div>}
    </div>
  );
}
