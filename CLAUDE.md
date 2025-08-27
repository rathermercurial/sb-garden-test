# Claude Context - SuperBenefit Knowledge Garden

> **⚠️ PROOF OF CONCEPT IMPLEMENTATION**  
> This project demonstrates Astro's viability for knowledge gardens but is **not production-ready** due to fundamental limitations with the obsidian-loader dependency.

## Project Overview

This is a **proof-of-concept implementation** of the SuperBenefit Knowledge Garden built with Astro and the Spaceship theme. The project explores adapting existing tools to construct a minimally-viable knowledge garden, serving as a foundation for designing a proper Astro-native implementation that utilizes the framework's built-in Content Layer API, transformers, and content collections.

**Tech Stack:**
- **Framework:** Astro 
- **Theme:** Astro Spaceship (astro-spaceship npm package)
- **Content Loader:** astro-loader-obsidian (for Obsidian-style markdown)
- **Styling:** Tailwind CSS
- **Search:** Pagefind
- **Markdown Processing:** Remark/Rehype plugins

## Project Structure

```
F:\projects\sb-spaceship\
├── src/
│   ├── content/
│   │   └── vault/           # Main content directory
│   │       ├── artifacts/   # Polished knowledge artifacts
│   │       ├── links/       # External resource library
│   │       ├── notes/       # Works in progress
│   │       ├── tags/        # Lexicon/terminology
│   │       └── attachments/ # Images and media
│   ├── collections/         # Astro content collection configs
│   ├── components/          # Custom components
│   ├── pages/              # Astro pages
│   └── styles/             # Global styles
├── public/                 # Static assets
├── astro.config.ts        # Astro configuration
├── website.config.json    # Site metadata
├── package.json          # Dependencies
└── node_modules/
    └── astro-spaceship/  # Theme components and logic
```

## Key Configuration Files

### website.config.json
```json
{
  "author": "Spaceship CO",
  "base": "/",
  "defaultLocale": "en",
  "description": "Ship your Second Brain into the Cyber-Space",
  "site": "https://aitorllj93.github.io",
  "title": "Spaceship"
}
```

### astro.config.ts
- Imports and configures the Spaceship theme
- Uses `astroSpaceship()` integration with website config

### src/content.config.ts
- Defines content collections (authors, documents, tags)
- Uses ObsidianMdLoader for markdown processing

## Content Organization

### Four Main Content Areas

1. **Artifacts** (`/src/content/vault/artifacts/`)
   - Polished, validated knowledge
   - Contains: articles, patterns, playbooks, studies, guides
   - Each has an index.md with metadata

2. **Tags/Lexicon** (`/src/content/vault/tags/`)
   - Definitions and terminology
   - Each tag is a markdown file
   - Serves as shared vocabulary

3. **Links/Library** (`/src/content/vault/links/`)
   - Curated external resources
   - Each link is a markdown file with metadata
   - References to external articles, tools, projects

4. **Notes** (`/src/content/vault/notes/`)
   - Works in progress
   - Active workspace for ideas
   - Currently sparse (mainly index.md)

### Frontmatter Structure

Common frontmatter fields used:
```yaml
---
nav-weight: 100        # Navigation ordering (some use 'order')
title: Page Title      # Display title
description: Text      # Meta description
publish: true          # Whether to include in build
type: index           # Document type (index, article, etc.)
banner: "![[file]]"   # Banner image (Obsidian syntax)
---
```

## Navigation System

### Tree Building
- Component: `/node_modules/astro-spaceship/components/Tree/`
- Builds hierarchical navigation from file structure
- Uses `buildTree()` function to create nav tree
- Sorts by `order` or `nav-weight` (numeric), then alphabetically

### URL Generation
- Files become routes without extensions
- `/content/vault/artifacts/index.md` → `/artifacts`
- Uses `toUrl` function from astro-loader-obsidian

## Markdown Processing Pipeline

### Link Syntax
The project uses standard markdown links:
```markdown
[Link Text](relative/path)
[External](https://example.com)
```

### Image Syntax
Supports Obsidian-style embeds:
```markdown
![[attachments/image.webp]]
```

### Processing Chain
1. ObsidianMdLoader reads markdown files
2. Remark plugins process markdown AST
3. Rehype plugins process HTML AST
4. Final HTML rendered by Astro

## Theme Components

Key Spaceship theme components:
- **LeftSidebar:** Navigation tree and search
- **RightSidebar:** Table of contents and backlinks
- **Tree/Leaf:** Navigation tree rendering
- **Article/Page:** Main content layout
- **Search:** Pagefind integration

## Development Commands

```bash
# Start development server
npm run dev              # Runs on localhost:4321

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

## Process Management Guidelines

**CRITICAL: Use precise process identification to kill target processes while protecting Claude Code.**

### Systematic Process Identification and Termination

1. **Map all processes on target ports:**
   ```bash
   # Find all processes using 432* ports
   netstat -ano | findstr :432
   ```
   This shows: `Protocol LocalAddress ForeignAddress State PID`

2. **Identify each process by PID:**
   ```bash
   # For each PID found above, get process details
   tasklist /FI "PID eq <PID>" /V
   ```
   This shows: `Image Name, PID, Session Name, Session#, Mem Usage, Status, User Name, CPU Time, Window Title`

3. **Categorize processes:**
   - **Target processes to kill:** Look for:
     - `node.exe` with command line containing your project path
     - `npm.exe` or `npx.exe` running dev servers
     - Processes with working directory in your project folder
   - **Claude Code processes to PROTECT:** Look for:
     - Processes with "claude" in Image Name or Window Title
     - Processes owned by Claude Code application
     - Any process you didn't start yourself

4. **Execute targeted kills:**
   ```bash
   # Kill only confirmed target processes
   taskkill /PID <confirmed_target_pid> /F
   ```

### Complete Workflow Example
```bash
# Step 1: Find all processes on 432* ports
netstat -ano | findstr :432

# Step 2: Identify each process (example PIDs: 1234, 5678, 9012)
tasklist /FI "PID eq 1234" /V
tasklist /FI "PID eq 5678" /V  
tasklist /FI "PID eq 9012" /V

# Step 3: Analyze output to categorize:
# - PID 1234: node.exe running npm run dev in F:\projects\sb-spaceship → KILL
# - PID 5678: claude-code.exe or similar → PROTECT
# - PID 9012: node.exe with unknown path → GET MORE INFO

# Step 4: Get additional info for uncertain processes
wmic process where "ProcessId=9012" get ProcessId,ParentProcessId,CommandLine,ExecutablePath

# Step 5: Kill only confirmed target processes
taskkill /PID 1234 /F
# DO NOT kill 5678 (Claude Code)
# Research 9012 further or leave alone if uncertain
```

### Before Starting New Processes
```bash
# Always check first to avoid duplicates
netstat -ano | findstr :4321
# Only start if port is free or you've identified and killed the right process
```

**Rule: Only kill processes you can positively identify as your own project processes.**

## Important Patterns

### Content References
- Internal links should NOT include `.md` extensions
- Use relative paths from current file
- Tags are referenced as `tags/tagname`

### File Naming
- Use kebab-case for file names
- Index files for folder landing pages
- Descriptive names matching content

### Navigation Hierarchy
- Controlled by frontmatter `nav-weight` or `order`
- Lower numbers appear first
- Alphabetical as fallback

## Working with Content

### Adding New Content
1. Create markdown file in appropriate vault folder
2. Add required frontmatter (title, description, publish)
3. Use relative links without extensions
4. Place images in attachments folder

### Content Types
- **Articles:** Essays and thought pieces
- **Patterns:** Reusable templates and models
- **Playbooks:** Step-by-step guides
- **Studies:** Case studies and analyses
- **Guides:** How-to documentation

## Helpful Context

### SuperBenefit Focus Areas
- Decentralized Autonomous Organizations (DAOs)
- Web3 governance
- Social impact initiatives
- Community-driven collaboration
- Knowledge commons

### Common Tags/Topics
- governance, daos, community, decentralization
- protocols, treasury, accountability, transparency
- coordi-nations, localism, regeneration
- mutual-aid, solidarity, cooperatives

## External Documentation

### Astro Documentation Strategy
**IMPORTANT:** For all Astro framework documentation lookups, use the `astro-docs-specialist` sub-agent via the Task tool. This specialized agent has direct access to official Astro documentation and provides more accurate, up-to-date information than general web searches.

**When to use the astro-docs-specialist:**
- Researching Astro features, APIs, or configurations
- Troubleshooting Astro-related issues
- Understanding Astro best practices
- Finding specific Astro code examples
- Learning about Astro integrations
- Content collections questions
- Markdown processing queries
- Build and deployment topics

**Usage pattern:**
```
Use Task tool → subagent_type: "astro-docs-specialist" → specific query about Astro
```

### Astro Resources (for reference)
- Astro Docs: https://docs.astro.build/
- Content Collections: https://docs.astro.build/en/guides/content-collections/
- Routing: https://docs.astro.build/en/guides/routing/
- Markdown: https://docs.astro.build/en/guides/markdown-content/

### Theme Resources
- Spaceship Theme: Check npm package astro-spaceship
- Obsidian Loader: astro-loader-obsidian package

## Working with This Codebase

When making changes:
1. Content changes go in `/src/content/vault/`
2. Theme overrides would go in `/src/components/`
3. Test locally with `npm run dev`
4. Check navigation renders correctly
5. Verify internal links work
6. Ensure consistent frontmatter

## Build Output

- Static site built to `/dist/` directory
- HTML files with client-side navigation
- Pagefind search index generated
- Assets optimized by Astro

---

## **Proof of Concept Results**

### **✅ Successful Demonstrations**
- **Astro Viability**: Framework handles knowledge garden requirements effectively
- **Performance Gains**: Significantly faster build times than current Quartz setup
- **Component Flexibility**: Theme customization and override system works well
- **Link Processing**: 90% success rate with remark plugin approach

### **❌ Critical Limitations Identified**  
- **Windows Platform Bug**: astro-loader-obsidian has unfixable path handling issues
- **Technical Debt**: Patch-heavy architecture using workarounds instead of native features
- **Scalability Concerns**: Third-party dependency constrains transformation capabilities
- **Maintenance Risk**: High complexity due to multiple override systems

### **🎯 Recommended Next Steps**
Based on POC findings, **abandon the obsidian-loader approach** and design an **Astro-native implementation** using:
1. **Content Layer API** for custom data sources (Obsidian REST API + GitHub)
2. **Content Collections** for structured content management  
3. **Built-in Transformers** for Obsidian→Web content processing
4. **Native File System APIs** for local content import

**Goal**: Create a production-ready knowledge garden that properly leverages Astro's built-in capabilities rather than working around third-party limitations.

---

*This context file helps AI assistants understand the SuperBenefit Knowledge Garden proof-of-concept project and its findings for future Astro-native implementations.*