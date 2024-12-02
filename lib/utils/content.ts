import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';

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

export function buildFileTree(dir: string, basePath = ''): FileNode[] {
  try {
    const items = fs.readdirSync(dir);

    return items
      .filter((item) => !item.startsWith('.')) // Ignore hidden files
      .map((item) => {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          return {
            name: item,
            path: relativePath,
            type: 'directory',
            children: buildFileTree(fullPath, relativePath),
          };
        }

        return {
          name: item,
          path: relativePath,
          type: 'file',
        };
      });
  } catch (error) {
    console.error('Error building file tree:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  try {
    const fullPath = path.join(process.cwd(), 'content', `${slug}.md`);
    console.log(fullPath, 'fullPath');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkToc, { heading: 'Table of Contents' })
      .process(content);

    const tocSection =
      processedContent
        .toString()
        .split('## Table of Contents')[1]
        ?.split('\n\n')[0] || '';

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
      content: processedContent.toString(),
      toc: tocSection,
    };
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw error;
  }
}
