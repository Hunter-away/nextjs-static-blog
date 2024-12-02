'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Markdown from 'markdown-to-jsx';
import { Loader2 } from 'lucide-react';
import { BlogPost } from '@/lib/utils/content';

interface MarkdownContentProps {
  filePath: string;
}

export function MarkdownContent({ filePath }: MarkdownContentProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const slug = filePath
          .replace(/\.md$/, '')
          .replace(/^content\//, '')
          .replace(/\\/g, '/'); // Normalize path separators
        console.log(slug, 'slug');
        const response = await fetch(`/api/posts/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching content:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load content'
        );
      }
      setLoading(false);
    };

    fetchContent();
  }, [filePath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center text-muted-foreground">
        {error || 'Failed to load content'}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="prose prose-neutral dark:prose-invert max-w-none"
    >
      <h1>{post.title}</h1>
      <div className="text-sm text-muted-foreground mb-6">
        {new Date(post.date).toLocaleDateString()}
      </div>
      {post.toc && (
        <div className="bg-muted p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
          <Markdown>{post.toc}</Markdown>
        </div>
      )}
      <Markdown>{post.content}</Markdown>
    </motion.div>
  );
}
