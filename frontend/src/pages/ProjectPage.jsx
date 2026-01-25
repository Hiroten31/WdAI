import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNotes, createNote, deleteNote, moveNote, reorderNote, getProject, getTags, createTag, deleteTagApi } from '../api/authApi';
import { NoteTree } from '../components/NoteTree/NoteTree';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { flattenTree, getProjection, buildTree, removeChildrenOf } from '../components/NoteTree/utilities';
import './ProjectPage.css';

export function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [project, setProject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteDescription, setNewNoteDescription] = useState('');
  const [newNoteParentId, setNewNoteParentId] = useState('');
  const [newNoteTagIds, setNewNoteTagIds] = useState([]);
  const [selectedTagsForFilter, setSelectedTagsForFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  
  const indentationWidth = 10;

  // Drop animation config
  const dropAnimationConfig = {
    keyframes({ transform }) {
      return [
        { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
        {
          opacity: 0,
          transform: CSS.Transform.toString({
            ...transform.final,
            x: transform.final.x + 5,
            y: transform.final.y + 5,
          }),
        },
      ];
    },
    easing: 'ease-out',
    sideEffects({ active }) {
      active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: defaultDropAnimation.duration,
        easing: defaultDropAnimation.easing,
      });
    },
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchProjectAndNotes();
  }, [projectId]);

  const fetchProjectAndNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectData, notesData, tagsData] = await Promise.all([
        getProject(projectId),
        getNotes(projectId),
        getTags(projectId),
      ]);
      setProject(projectData);
      setNotes(notesData);
      setTags(tagsData);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to load project';
      setError(errorMsg);
      if (errorMsg.includes('access denied') || err.response?.status === 403) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const tag = await createTag(projectId, newTagName.trim());
      setTags([...tags, tag].sort((a, b) => a.name.localeCompare(b.name)));
      setNewTagName('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create tag');
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await deleteTagApi(projectId, tagId);
      setTags(tags.filter((t) => t.id !== tagId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete tag');
    }
  };

  const openAddNoteModal = (parentId = '') => {
    setNewNoteTitle('');
    setNewNoteDescription('');
    setNewNoteParentId(parentId || '');
    setNewNoteTagIds([]);
    setIsAddModalOpen(true);
  };

  const handleSubmitNewNote = async (eOrTitle, _contentUnused, parentFromArgs = null) => {
    // Support both modal submit (event) and fallback prompt signature
    const isEvent = eOrTitle && typeof eOrTitle.preventDefault === 'function';
    if (isEvent) {
      eOrTitle.preventDefault();
    }

    const title = isEvent ? newNoteTitle.trim() : (eOrTitle || '').trim();
    const parentId = isEvent
      ? (newNoteParentId ? parseInt(newNoteParentId) : null)
      : (parentFromArgs ? parentFromArgs : null);
    const description = isEvent ? newNoteDescription.trim() : '';
    const tagIdsToSend = isEvent ? newNoteTagIds.map((id) => parseInt(id)) : [];

    if (!title) return;

    try {
      const created = await createNote(
        projectId,
        title,
        '',
        parentId,
        description,
        tagIdsToSend
      );
      setNotes([...notes, created]);
      if (isEvent) {
        setIsAddModalOpen(false);
        setNewNoteTitle('');
        setNewNoteDescription('');
        setNewNoteParentId('');
        setNewNoteTagIds([]);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(projectId, noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete note');
    }
  };

  const handleMoveNote = async (noteId, newParentId) => {
    try {
      const updatedNote = await moveNote(projectId, noteId, newParentId);
      setNotes(notes.map((n) => (n.id === noteId ? updatedNote : n)));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to move note');
    }
  };

  const handleReorderNote = async (noteId, newParentId, newPosition) => {
    try {
      await reorderNote(projectId, noteId, newParentId, newPosition);
      // Refresh notes to get updated positions
      const updatedNotes = await getNotes(projectId);
      setNotes(updatedNotes);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reorder note');
      // Refresh to revert
      const updatedNotes = await getNotes(projectId);
      setNotes(updatedNotes);
    }
  };

  // Helper: Get all ancestor IDs for a note
  const getAncestorIds = (noteId, noteMap) => {
    const ancestors = new Set();
    let currentId = noteId;
    while (currentId !== null && currentId !== undefined) {
      const note = noteMap.get(currentId);
      if (!note || !note.parent_note_id) break;
      ancestors.add(note.parent_note_id);
      currentId = note.parent_note_id;
    }
    return ancestors;
  };

  // Filter tree: if tags selected, show only matching notes and their ancestors
  const filteredNotes = useMemo(() => {
    if (selectedTagsForFilter.length === 0) return notes;

    const noteMap = new Map();
    notes.forEach((note) => noteMap.set(note.id, note));

    const matchingIds = new Set();
    const ancestorIds = new Set();

    // Find all notes matching selected tags
    notes.forEach((note) => {
      const hasMatchingTag = note.tags && note.tags.some((tag) =>
        selectedTagsForFilter.includes(tag.id)
      );
      if (hasMatchingTag) {
        matchingIds.add(note.id);
        // Add all ancestors
        getAncestorIds(note.id, noteMap).forEach((id) => ancestorIds.add(id));
      }
    });

    // Return filtered notes with metadata
    return notes
      .filter((note) => matchingIds.has(note.id) || ancestorIds.has(note.id))
      .map((note) => {
        const isMatching = matchingIds.has(note.id);
        const isAncestor = ancestorIds.has(note.id);
        return {
          ...note,
          _isMatching: isMatching,
          _isAncestorOnly: isAncestor && !isMatching,
        };
      });
  }, [notes, selectedTagsForFilter]);

  // Build tree structure from flat notes
  const treeNotes = useMemo(() => {
    const noteMap = new Map();
    const rootNotes = [];

    filteredNotes.forEach((note) => {
      noteMap.set(note.id, { ...note, children: [] });
    });

    filteredNotes.forEach((note) => {
      if (note.parent_note_id) {
        const parent = noteMap.get(note.parent_note_id);
        if (parent) {
          parent.children.push(noteMap.get(note.id));
        }
      } else {
        rootNotes.push(noteMap.get(note.id));
      }
    });

    // Sort by position
    const sortByPosition = (a, b) => (a.position || 0) - (b.position || 0);
    rootNotes.sort(sortByPosition);
    noteMap.forEach((note) => {
      if (note.children.length > 0) {
        note.children.sort(sortByPosition);
      }
    });

    return rootNotes;
  }, [filteredNotes]);

  // Flatten tree for drag operations
  const flattenedNotes = useMemo(() => {
    const flattened = flattenTree(treeNotes);
    // Remove collapsed items (we'll add this later)
    return flattened.map((item) => ({
      ...item,
      parentId: item.parent_note_id,
    }));
  }, [treeNotes]);

  const projected =
    activeId && overId
      ? getProjection(flattenedNotes, activeId, overId, offsetLeft, indentationWidth)
      : null;

  const sortedIds = useMemo(() => flattenedNotes.map(({ id }) => id), [flattenedNotes]);

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    setOverId(active.id);
    document.body.style.setProperty('cursor', 'grabbing');
  };

  const handleDragMove = ({ delta }) => {
    setOffsetLeft(delta.x);
  };

  const handleDragOver = ({ over }) => {
    setOverId(over?.id ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    resetDragState();

    // Only proceed if projection is valid (null means operation would create a cycle)
    if (projected !== null && projected && over) {
      const { depth, parentId } = projected;

      // Guard: never allow a note to become its own parent
      if (parentId === active.id) {
        return;
      }
      const clonedItems = JSON.parse(JSON.stringify(flattenedNotes));
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      
      // Calculate new position in parent
      const newParentChildren = sortedItems.filter((item) => item.parentId === parentId);
      const newPositionInParent = newParentChildren.findIndex((item) => item.id === active.id);

      handleReorderNote(active.id, parentId, newPositionInParent);
    }
  };

  const handleDragCancel = () => {
    resetDragState();
  };

  const resetDragState = () => {
    setActiveId(null);
    setOverId(null);
    setOffsetLeft(0);
    document.body.style.setProperty('cursor', '');
  };

  if (loading) {
    return (
      <div className="project-page">
        <div className="project-header">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} /> Back to Projects
          </button>
        </div>
        <div className="loading">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-page">
        <div className="project-header">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} /> Back to Projects
          </button>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="project-page">
      <div className="project-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} /> Back to Projects
        </button>
        <div className="project-info">
          <h1>{project?.title}</h1>
          {project?.description && <p className="project-description">{project.description}</p>}
        </div>
      </div>

      <div className="project-content">
        <div className="notes-section">
          <div className="section-header">
            <h2>Notes</h2>
            <button
              className="btn-primary"
              onClick={() => openAddNoteModal('')}
            >
              + Add Note
            </button>
          </div>

          <div className="tags-panel">
            <div className="tags-panel__top">
              <h3>Tags</h3>
              <div className="tags-panel__controls">
                <input
                  type="text"
                  value={newTagName}
                  placeholder="New tag name"
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTag();
                  }}
                />
                <button className="btn-primary" onClick={handleAddTag} disabled={!newTagName.trim()}>
                  Add Tag
                </button>
              </div>
            </div>
            <div className="tags-panel__list">
              {tags.length === 0 && <span className="tags-panel__empty">No tags yet</span>}
              {tags.map((tag) => {
                const isSelected = selectedTagsForFilter.includes(tag.id);
                return (
                  <span key={tag.id} className={`tag-pill ${isSelected ? 'selected' : ''}`}>
                    <label className="tag-pill__label">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedTagsForFilter((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== tag.id)
                              : [...prev, tag.id]
                          );
                        }}
                      />
                      <span className="tag-pill__text">{tag.name}</span>
                    </label>
                    <button className="tag-pill__delete" onClick={() => handleDeleteTag(tag.id)} title="Delete tag">
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
              <NoteTree
                notes={treeNotes}
                projectId={projectId}
                onNoteCreate={handleSubmitNewNote}
                onNoteDelete={handleDeleteNote}
                onNoteMove={handleReorderNote}
                onAddChild={(parentId) => openAddNoteModal(parentId)}
                activeId={activeId}
                projected={projected}
                indentationWidth={indentationWidth}
              />
            </SortableContext>

            <DragOverlay dropAnimation={dropAnimationConfig}>
              {activeId ? (
                <div className="drag-overlay">
                  <div className="drag-overlay-card">
                    {notes.find((n) => n.id === activeId)?.title || activeId}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Note</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)} aria-label="Close">×</button>
            </div>
            <form className="modal-body" onSubmit={handleSubmitNewNote}>
              <label className="modal-field">
                <span>Title *</span>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </label>

              <label className="modal-field">
                <span>Description</span>
                <textarea
                  value={newNoteDescription}
                  onChange={(e) => setNewNoteDescription(e.target.value)}
                  placeholder="Brief description"
                  rows={3}
                />
              </label>

              <label className="modal-field">
                <span>Parent</span>
                <select
                  value={newNoteParentId}
                  onChange={(e) => setNewNoteParentId(e.target.value)}
                >
                  <option value="">(no parent)</option>
                  {notes
                    .slice()
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.title}
                      </option>
                    ))}
                </select>
              </label>

              <div className="modal-field">
                <span>Tags</span>
                <div className="modal-tags-grid">
                  {tags.length === 0 && <span className="modal-tags-empty">No tags in project</span>}
                  {tags.map((tag) => {
                    const tagIdNum = parseInt(tag.id);
                    const checked = newNoteTagIds.some((id) => parseInt(id) === tagIdNum);
                    return (
                      <label key={tag.id} className={`modal-tag-pill ${checked ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setNewNoteTagIds((prev) =>
                              isChecked
                                ? [...prev, tagIdNum]
                                : prev.filter((id) => parseInt(id) !== tagIdNum)
                            );
                          }}
                        />
                        <span>{tag.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={!newNoteTitle.trim()}>
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
