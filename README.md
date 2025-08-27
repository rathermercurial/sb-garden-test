# 🌌 Spaceship

**Astro Spaceship** is a powerful, minimal, and flexible theme designed for turning your Obsidian vault into a beautiful, static website using Astro and TailwindCSS. Whether you're sharing your digital garden, notes, or a Zettelkasten, this theme helps bring your knowledge to the web with elegance and ease.

---

## ✨ Features

- 🔗 **Obsidian Link and Image Resolution**  
  Seamlessly supports `[[wiki-links]]` and embeds like `![[image.png]]`, just like in Obsidian. No need to manually convert links or media.

- 📝 **Frontmatter Metadata for Publishing**  
  Control visibility, titles, descriptions, tags, and more with simple frontmatter options. Choose what gets published and how it appears.

- 🌲 **Tree Navigation Bar**  
  Navigate your notes with a collapsible file tree that mirrors your vault structure. Makes exploring content intuitive and fast.

- 🗂 **Table of Contents (ToC)**  
  Auto-generated ToC for every page, based on headings in your notes. Helps readers easily jump to sections.

- 🔁 **Links and Backlinks**  
  Display outgoing links and backlinks at the bottom of each note, making your web of notes as interconnected as your vault.

- 🔌 **Plugins**
  - [Banners/Covers](https://github.com/jparkerweb/pixel-banner)
  - [Spoilers](https://github.com/jacobtread/obsidian-spoilers)
  - [Timeline](https://github.com/George-debug/obsidian-timeline)
  - [Sorting](https://github.com/shu307/obsidian-nav-weight)

---

## 🚀 Built With

- **[Astro](https://astro.build/)** – Lightning-fast static site generation.
- **[TailwindCSS](https://tailwindcss.com/)** – Utility-first CSS for rapid UI styling.
- **[Markdown](https://www.markdownguide.org/)** – Your content stays in plain text, easy to version and manage.

---

## 📁 Use Cases

- Publish a second brain or digital garden
- Share your research notes and knowledge base
- Create a personal wiki
- Document creative projects or coursework

---

## 📸 Screenshots

![](src/content/vault/Assets/Screenshots/001.jpg)
![](src/content/vault/Assets/Screenshots/002.jpg)
![](src/content/vault/Assets/Screenshots/003.jpg)
![](src/content/vault/Assets/Screenshots/004.jpg)

---

## 🛠 Setup & Usage

1. Start a new project with `create spaceship`, `create astro`, or just clone this repo.
```sh
npm create spaceship@latest
# or
npm create astro@latest -- --template aitorllj93/astro-theme-spaceship
# or
degit aitorllj93/astro-theme-spaceship
```
2. Drop your Obsidian vault into the `content/` folder.
3. Customize your config (navigation, theme colors, etc.)
4. Run `npm install && npm run dev` to get started!

###  Customization

* `website.config.mjs`: Global settings such as the Website name and default author
* `styles/global.css`: Tailwind CSS configuration
* `content.config.ts`: Your collections config, including the Obsidian one. Be careful while applying changes here.
* `content`: Your Obsidian Vault + some metadata collections: Authors and Tags

---

## 🔧 Link Processing & Known Issues

### Internal Link Handling

This project implements a comprehensive link processing system to handle Obsidian-style links and convert them for web use:

#### ✅ **Resolved Issues**
1. **Markdown Content Links**: Links in markdown content like `[blockchain](tags/blockchain.md)` are properly converted to `/tags/blockchain`
2. **Relative Path Conversion**: Links starting with `tags/`, `artifacts/`, `links/`, `notes/`, or `attachments/` are converted to absolute paths
3. **Extension Removal**: `.md` extensions are stripped from internal links
4. **Index Link Flattening**: Links like `/path/index` are converted to `/path`

#### ⚠️ **Known Edge Cases (Windows)**

**Frontmatter Tag Links**: A Windows-specific issue exists where frontmatter tags generate URLs with escaped backslashes:

```yaml
# In frontmatter:
tags:
  - blockchain
  - governance
```

**Expected behavior**: Links to `/tags/blockchain`, `/tags/governance`  
**Actual behavior**: Links to `/\tags/blockchain`, `/\tags/governance` (note the backslash)

**Root Cause**: The `astro-loader-obsidian` package has a Windows path handling bug in its URL generation functions (`toUrl`/`toSlug` in `obsidianId.ts`). The loader incorrectly processes Windows file paths when generating permalinks for content loaded from the vault.

**Impact**: ~13 frontmatter tag links per page show incorrect escaping, while all other links work correctly.

**Workaround Status**: This requires forking and patching the obsidian-loader library. For production use, the recommended solution is to:
1. Fork `astro-loader-obsidian`
2. Fix the Windows path normalization in the URL generation functions  
3. Replace the dependency with the fixed fork

#### 🛠 **Implementation Details**

**Remark Plugin**: `src/lib/markdown/remark-fix-obsidian-links.ts`
- Processes markdown AST before HTML rendering
- Converts relative vault paths to absolute URLs
- Works at the correct pipeline stage (markdown → HTML)

**Configuration**: `astro.config.ts`
```typescript
markdown: {
  remarkPlugins: [
    remarkFixObsidianLinks,
  ],
}
```

**Processing Pipeline**:
1. **Obsidian Loader**: Processes `.md` files, removes extensions
2. **Remark Plugin**: Converts relative paths to absolute paths  
3. **Theme**: Renders final HTML with correct links

---

## 🧠 Notes

- Internal links work only for files within the vault structure.
- Uses YAML frontmatter for publishing logic.
- Markdown rendering includes code highlighting, math support (optional), and responsive design out-of-the-box.
- **Windows Users**: See link processing section above for known frontmatter tag link issues.

---

## 🧪 Future Improvements

- Search functionality
- Dark mode toggle
- Custom plugin support
- Tag pages and graph view
- Configuration script

---

## 📄 License

MIT – Free to use, modify, and share.
