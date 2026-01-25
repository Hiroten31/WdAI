import React, { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, Trash2, Plus, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TreeItem.css';

export function TreeItem({
  note,
  projectId,
  expandedItems,
  onToggleExpanded,
  onDelete,
  onMove,
  onAddChild,
  activeId,
  projected,
  depth = 0,
  indentationWidth = 50,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: note.id,
    data: {
      type: 'Note',
      note,
    },
  });

  // Use projected depth if this is the active item
  const itemDepth = note.id === activeId && projected ? projected.depth : depth;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'background-color 200ms ease',
    opacity: isDragging ? 0.5 : 1,
    paddingLeft: '10px',
  };

  const hasChildren = note.children && note.children.length > 0;
  const isExpanded = expandedItems?.has(note.id);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note? Child notes will become root notes.')) {
      setIsDeleting(true);
      try {
        await onDelete(note.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <li ref={setNodeRef} style={style} className={`tree-item ${isOver ? 'over' : ''}`} data-id={note.id}>
      <div className={`tree-item-content ${isDragging ? 'dragging' : ''} ${note._isAncestorOnly ? 'ancestor-only' : ''} ${note._isMatching ? 'matching' : ''}`}>
        <div className="tree-item-header" {...attributes}>
          <div className="drag-handle" {...listeners}>
            <GripVertical size={16} />
          </div>

          {hasChildren ? (
            <button
              className="toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpanded(note.id);
              }}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          ) : (
            <div className="toggle-placeholder" />
          )}

          <div 
            className="tree-item-info"
            onClick={() => navigate(`/projects/${projectId}/notes/${note.id}`)}
          >
            <div className="note-title-with-tags">
              <h4 className="note-title">{note.title}</h4>
              {note.tags && note.tags.length > 0 && (
                <div className="note-tags-inline">
                  {note.tags.map((tag) => (
                    <span key={tag.id} className="tag-badge">{tag.name}</span>
                  ))}
                </div>
              )}
            </div>
            {!!(note.description && note.description.trim()) && (
              <p className="note-preview">{note.description.trim().substring(0, 80)}{note.description.trim().length > 80 ? '…' : ''}</p>
            )}
          </div>

          <div className="tree-item-actions">
            <button
              className="action-btn add-child-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(note.id);
              }}
              title="Add child note"
            >
              <Plus size={18} />
            </button>
            <button
              className="action-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              title="Delete note"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <SortableContext
            items={note.children.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="tree-list nested">
              {note.children.map((child) => (
                <TreeItem
                  key={child.id}
                  note={child}
                  projectId={projectId}
                  expandedItems={expandedItems}
                  onToggleExpanded={onToggleExpanded}
                  onDelete={onDelete}
                  onMove={onMove}
                  onAddChild={onAddChild}
                  activeId={activeId}
                  projected={projected}
                  depth={itemDepth + 1}
                  indentationWidth={indentationWidth}
                />
              ))}
            </ul>
          </SortableContext>
        )}
      </div>
    </li>
  );
}
