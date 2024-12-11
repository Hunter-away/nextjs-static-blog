"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileNode, BlogPost } from "@/lib/utils/content";
import { FileTree } from "@/components/file-tree";
import { MarkdownContent } from "@/components/markdown-content";
import { TableOfContents } from "@/components/table-of-contents";
import { NavList } from "@/components/nav";

interface BlogContentProps {
  fileTree: FileNode[];
  initialPosts: BlogPost[];
}

export function BlogContent({ fileTree, initialPosts }: BlogContentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [posts] = useState<BlogPost[]>(initialPosts);

  const handleFileSelect = (path: string) => {
    const slug = path.replaceAll('\\', '/').replace(/\.md$/, '');
    setSelectedFile(slug);
  };
  
  const selectedPost = selectedFile
    ? posts.find(post => post.slug === selectedFile)
    : null;

  return (
    <>
      <div className="grid grid-cols-[250px_1fr_250px] gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="border rounded-lg p-4 h-[calc(100vh-8rem)] overflow-y-auto sticky top-20"
        >
          <FileTree tree={fileTree} onSelect={handleFileSelect} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFile}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="min-h-[500px] border rounded-lg p-6 overflow-y-auto"
          >
            {selectedPost ? (
              <MarkdownContent post={selectedPost} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a file to view its content
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="border rounded-lg p-4 h-[calc(100vh-8rem)] overflow-y-auto sticky top-20"
        >
          {selectedPost?.toc ? (
            <TableOfContents toc={selectedPost.toc} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No table of contents
            </div>
          )}
        </motion.div>
      </div>
      <div className="fixed bottom-8 w-full mx-auto flex justify-center">
        <NavList></NavList>
      </div>
    </>
  );
}