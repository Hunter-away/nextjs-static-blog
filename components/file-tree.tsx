"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, File, Folder } from "lucide-react";
import { FileNode } from "@/lib/utils/content";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  tree: FileNode[];
  onSelect: (path: string) => void;
  level?: number;
}

export function FileTree({ tree, onSelect, level = 0 }: FileTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleDir = (path: string) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <ul className={cn("space-y-1", level > 0 && "ml-4")}>
      {tree.map((node) => (
        <li key={node.path}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 p-1 rounded-md hover:bg-accent cursor-pointer"
            onClick={() => {
              if (node.type === "directory") {
                toggleDir(node.path);
              } else {
                onSelect(node.path);
              }
            }}
          >
            {node.type === "directory" && (
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  expanded[node.path] && "rotate-90"
                )}
              />
            )}
            {node.type === "directory" ? (
              <Folder className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
            <span>{node.name}</span>
          </motion.div>
          <AnimatePresence>
            {node.type === "directory" && expanded[node.path] && node.children && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <FileTree
                  tree={node.children}
                  onSelect={onSelect}
                  level={level + 1}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}