"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileNode } from "@/lib/utils/content";
import { FileTree } from "@/components/file-tree";
import { MarkdownContent } from "@/components/markdown-content";

interface BlogContentProps {
  fileTree: FileNode[];
}

export function BlogContent({ fileTree }: BlogContentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="border rounded-lg p-4"
      >
        <FileTree tree={fileTree} onSelect={setSelectedFile} />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedFile}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="min-h-[500px] border rounded-lg p-6"
        >
          {selectedFile ? (
            <MarkdownContent filePath={selectedFile} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a file to view its content
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}