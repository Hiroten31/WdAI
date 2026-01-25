import { arrayMove } from '@dnd-kit/sortable';

function getDragDepth(offset, indentationWidth) {
  return Math.round(offset / indentationWidth);
}

function getMaxDepth({ previousItem }) {
  if (previousItem) {
    return previousItem.depth + 1;
  }
  return 0;
}

function getMinDepth({ nextItem }) {
  if (nextItem) {
    return nextItem.depth;
  }
  return 0;
}

function isDescendant(items, parentId, potentialChildId) {
  // Check if potentialChildId is a descendant of parentId
  const traverse = (id) => {
    const children = items.filter((item) => item.parentId === id);
    if (children.some((child) => child.id === potentialChildId)) {
      return true;
    }
    return children.some((child) => traverse(child.id));
  };
  return traverse(parentId);
}

export function getProjection(items, activeId, overId, dragOffset, indentationWidth) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  
  if (!activeItem) {
    return null;
  }
  
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  
  let maxDepth = getMaxDepth({ previousItem });
  const minDepth = getMinDepth({ nextItem });
  
  // Prevent dropping active item into its own descendants
  if (previousItem && isDescendant(items, activeId, previousItem.id)) {
    maxDepth = previousItem.depth;
  }
  
  let depth = projectedDepth;
  
  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }

  const parentId = getParentId();
  
  // Final validation: don't allow creating a cycle
  if (parentId && isDescendant(items, activeId, parentId)) {
    return null; // Invalid projection - would create a cycle
  }

  return { depth, maxDepth, minDepth, parentId };
}

export function flatten(items, parentId = null, depth = 0) {
  return items.reduce((acc, item) => {
    const flatItem = { ...item, parentId, depth, children: item.children || [] };
    const children = item.children || [];
    
    return [
      ...acc,
      flatItem,
      ...flatten(children, item.id, depth + 1),
    ];
  }, []);
}

export function flattenTree(items) {
  return flatten(items);
}

export function buildTree(flattenedItems) {
  const root = [];
  const nodes = {};

  // Create a map of all nodes
  flattenedItems.forEach((item) => {
    nodes[item.id] = { ...item, children: [] };
  });

  // Build the tree structure
  flattenedItems.forEach((item) => {
    const node = nodes[item.id];
    if (item.parentId === null) {
      root.push(node);
    } else if (nodes[item.parentId]) {
      nodes[item.parentId].children.push(node);
    }
  });

  return root;
}

export function removeChildrenOf(items, ids) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }
    return true;
  });
}
