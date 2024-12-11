import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { Element } from 'hast';

interface TocEntry {
  depth: number;
  value: string;
  url: string;
}

function slugify(text: string, filePath: string): string {
  const fileId = filePath
    .replace(/^content[/\\]/, '')
    .replace(/\.md$/, '')
    .replace(/[/\\]/g, '-');
  
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `${fileId}-${slug}`;
}

function extractTocFromMarkdown(tree: any, filePath: string): TocEntry[] {
  const toc: TocEntry[] = [];
  const usedSlugs = new Set<string>();

  visit(tree, 'heading', (node: any) => {
    if (node.depth <= 3) {
      const value = toString(node);
      let url = `#${slugify(value, filePath)}`;
      
      let counter = 1;
      while (usedSlugs.has(url)) {
        url = `#${slugify(value, filePath)}-${counter}`;
        counter++;
      }
      
      usedSlugs.add(url);
      toc.push({ depth: node.depth, value, url });
    }
  });
  return toc;
}

function generateTocMarkdown(entries: TocEntry[]): string {
  let lastDepth = 1;
  return entries
    .map((entry) => {
      const depthDiff = entry.depth - lastDepth;
      lastDepth = entry.depth;
      const prefix = depthDiff > 0 
        ? '\n' + '  '.repeat(entry.depth - 1)
        : '  '.repeat(entry.depth - 1);
      return `${prefix}- [${entry.value}](${entry.url}) {.depth-${entry.depth - 1}}`;
    })
    .join('\n');
}

export async function generateTableOfContents(
  content: string,
  filePath: string
): Promise<string> {
  const processor = unified().use(remarkParse).use(remarkGfm);
  const tree = processor.parse(content);
  const tocEntries = extractTocFromMarkdown(tree, filePath);
  return generateTocMarkdown(tocEntries);
}

export async function processMarkdown(
  content: string,
  filePath: string
): Promise<string> {
  const usedSlugs = new Set<string>();

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => (tree) => {
      visit(tree, 'heading', (node: any) => {
        const value = toString(node);
        let id = slugify(value, filePath);
        
        let counter = 1;
        while (usedSlugs.has(id)) {
          id = `${slugify(value, filePath)}-${counter}`;
          counter++;
        }
        
        usedSlugs.add(id);
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.id = id;
      });

      // 处理代码块
      visit(tree, 'code', (node: any) => {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.className = [
          'hljs',
          node.lang ? `language-${node.lang}` : ''
        ].filter(Boolean);
      });

      return tree;
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { 
      allowDangerousHtml: true,
      closeSelfClosing: true,
      quoteSmart: true,
      preferUnquoted: false,
      tightAttributes: false
    })
    .process(content);

  return processedContent.toString();
}

