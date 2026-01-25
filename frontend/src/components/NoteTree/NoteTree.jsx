import React, { useState } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TreeItem } from './TreeItem';
import './NoteTree.css';

export function NoteTree({ notes, projectId, onNoteCreate, onNoteDelete, onNoteMove, onAddChild, activeId, projected, indentationWidth = 50 }) {
  const [expandedItems, setExpandedItems] = useState(new Set());

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
    if (typeof onAddChild === 'function') {
      onAddChild(parentId);
      return;
    }
    // Fallback: prompt if no modal handler provided
    const title = prompt('Enter note title:');
    if (title && typeof onNoteCreate === 'function') {
      onNoteCreate(title, '', parentId);
    }
  };

  return (
    <div className="note-tree">
      {notes.length === 0 ? (
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
          items={notes.map((n) => n.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="tree-list">
            {notes.map((note) => (
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
