import React, { useState, useMemo } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TreeItem } from './TreeItem';
import './NoteTree.css';

export function NoteTree({ notes, projectId, onNoteCreate, onNoteDelete, onNoteMove, activeId, projected, indentationWidth = 50 }) {
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Build tree structure from flat notes array
  const treeStructure = useMemo(() => {
    const noteMap = new Map();
    const rootNotes = [];

    // First pass: create note objects
    notes.forEach((note) => {
      noteMap.set(note.id, { ...note, children: [] });
    });

    // Second pass: build tree
    notes.forEach((note) => {
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
  }, [notes]);

  const toggleExpanded = (noteId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedItems(newExpanded);
  };

  const handleAddChild = (parentId) => {
    const title = prompt('Enter note title:');
    if (title) {
      onNoteCreate(title, '', parentId);
    }
  };

  return (
    <div className="note-tree">
      {treeStructure.length === 0 ? (
        <div className="empty-notes">
          <p>No notes yet. Create one to get started!</p>
          <button 
            onClick={() => handleAddChild(null)}
            className="btn-add-root"
          >
            + Add Root Note
          </button>
        </div>
      ) : (
        <SortableContext
          items={treeStructure.map((n) => n.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="tree-list">
            {treeStructure.map((note) => (
              <TreeItem
                key={note.id}
                note={note}
                projectId={projectId}
                expandedItems={expandedItems}
                onToggleExpanded={toggleExpanded}
                onDelete={onNoteDelete}
                onMove={onNoteMove}
                onAddChild={handleAddChild}
                activeId={activeId}
                projected={projected}
                depth={note.id === activeId && projected ? projected.depth : 0}
                indentationWidth={indentationWidth}
              />
            ))}
          </ul>
        </SortableContext>
      )}
    </div>
  );
}
