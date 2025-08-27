
const getNodeOrder = (node) => {
  const isFolder = node.children?.length;

  if (!isFolder) {
    // Fix: Check nav-weight first, then order as fallback
    return node.data?.data?.["nav-weight"] ?? node.data?.data?.order;
  }

  const lastUrlPart = node.permalink.split("/").at(-1);

  const childIndex = node.children?.find((c) => {
    const cLastUrlPart = c.permalink.split("/").at(-1);
    return cLastUrlPart === lastUrlPart;
  });

  // Fix: Check nav-weight first, then order as fallback
  return childIndex?.data?.data?.["nav-weight"] ?? childIndex?.data?.data?.order;
}

// recursively sort the tree based on: data.nav-weight (numeric desc) or node.name (alphabetical asc)
const sortFn = (a, b) => {
  const aOrder = getNodeOrder(a);
  const bOrder = getNodeOrder(b);

  if (typeof aOrder === 'number' && typeof bOrder !== 'number') {
    return -1;
  }
  if (typeof aOrder !== 'number' && typeof bOrder === 'number') {
    return 1;
  }
  if (typeof aOrder === 'number' && typeof bOrder === 'number') {
    return aOrder - bOrder;
  }
  return a.name.localeCompare(b.name);
}

function sortTree(node) {
  node.children?.sort(sortFn);
  for (const child of node.children ?? []) {
    sortTree(child);
  }
}

export function buildTree(data) {
  // Sort documents to process index files first, then other files
  // This ensures that when we process /tags/accountability.md, 
  // the /tags/index.md has already created the parent node
  const sortedData = [...data].sort((a, b) => {
    const aIsIndex = a.data.permalink.endsWith('/index') || a.id.endsWith('/index');
    const bIsIndex = b.data.permalink.endsWith('/index') || b.id.endsWith('/index');
    
    if (aIsIndex && !bIsIndex) return -1;
    if (!aIsIndex && bIsIndex) return 1;
    return 0;
  });
  
  const root = [];

  for (const item of sortedData) {
    if (item.data.publish === false) {
      continue;
    }
    
    // Skip the root index file - it shouldn't appear in navigation
    if (item.data.permalink === '/' || item.data.permalink === '/index') {
      continue;
    }
    
    // Skip attachments folder - it's for media files, not navigation
    if (item.data.permalink.startsWith('/attachments')) {
      continue;
    }
    
    // Skip all readme/README files - they're documentation, not navigation content
    if (item.data.permalink.toLowerCase().includes('/readme') || item.data.permalink.toLowerCase().endsWith('/readme')) {
      continue;
    }

    const parts = item.data.permalink.replace(import.meta.env.BASE_URL, '').split('/').filter((p, i) => p !== '');
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (!part) {
        continue;
      }

      // Always search by the URL part name first to avoid duplicates
      const urlPartName = part.replaceAll('-', ' ');
      const isLastPart = i === parts.length - 1;
      
      // Build the expected permalink for this level
      const expectedPermalink = `${import.meta.env.BASE_URL}/${parts.slice(0, i + 1).join('/')}`.replace('//', '/');
      
      let existingNode = currentLevel.find(node => 
        // Look for existing nodes with the exact same permalink
        node.permalink === expectedPermalink
      );

      if (!existingNode) {
        existingNode = {
          name: urlPartName,
          permalink: expectedPermalink,
          children: []
        };
        currentLevel.push(existingNode);
      }

      if (isLastPart) {
        // This is the actual document - add the data and ensure it's marked as a document
        existingNode.name = item.data.title;
        existingNode.permalink = item.data.permalink.replace('//', '/');
        existingNode.data = item;
        
        // If this was previously just a folder placeholder, it's now a document
      }

      currentLevel = existingNode.children;
    }
  }

  root.sort(sortFn);
  for (const node of root) {
    sortTree(node);
  }

  return root;
}