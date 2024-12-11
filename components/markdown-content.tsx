"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BlogPost } from "@/lib/utils/content";
import hljs from 'highlight.js';
// import 'highlight.js/styles/vs2015.css'; // 或选择其他样式

interface MarkdownContentProps {
  post: BlogPost;
}

export function MarkdownContent({ post }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [post.content]);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="prose prose-neutral dark:prose-invert max-w-none"
    >
      <header className="mb-8">
        <h1 className="mb-2">{post.title}</h1>
        <time className="text-sm text-muted-foreground">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </header>
      
      <div 
        ref={contentRef}
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </motion.article>
  );
}

