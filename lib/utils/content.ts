import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { generateTableOfContents, processMarkdown } from './markdown';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  toc: string;
}

const CONTENT_DIR = 'content';

export function ensureContentDirectory() {
  const contentPath = path.join(process.cwd(), CONTENT_DIR);
  if (!fs.existsSync(contentPath)) {
    fs.mkdirSync(contentPath, { recursive: true });
  }
  return contentPath;
}

export function buildFileTree(dir: string, basePath = ''): FileNode[] {
  try {
    ensureContentDirectory();
    const items = fs.readdirSync(dir);
    
    return items
      .filter(item => !item.startsWith('.'))
      .map(item => {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          return {
            name: item,
            path: relativePath,
            type: 'directory',
            children: buildFileTree(fullPath, relativePath)
          };
        }
        
        return {
          name: item,
          path: relativePath,
          type: 'file'
        };
      })
      .sort((a, b) => {
        if (a.type === 'directory' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
      });
  } catch (error) {
    console.error('Error building file tree:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  try {
    ensureContentDirectory();
    const normalizedSlug = slug.replace(/\\/g, '/');
    const fullPath = path.join(process.cwd(), CONTENT_DIR, `${normalizedSlug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const [toc, processedContent] = await Promise.all([
      generateTableOfContents(content, normalizedSlug),
      processMarkdown(content, normalizedSlug)
    ]);

    return {
      slug: normalizedSlug,
      title: data.title || 'Untitled',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      content: processedContent,
      toc
    };
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw error;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const contentDir = ensureContentDirectory();
  const posts: BlogPost[] = [];

  function traverseDirectory(dir: string) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (item.endsWith('.md')) {
        const relativePath = path.relative(contentDir, fullPath);
        const slug = relativePath.replace(/\.md$/, '');
        try {
          const post = getPostBySlug(slug);
          posts.push(post);
        } catch (error) {
          console.error(`Error processing ${slug}:`, error);
        }
      }
    }
  }

  traverseDirectory(contentDir);
  return Promise.all(posts);
}