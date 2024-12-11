"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, File, Folder } from "lucide-react";
import { FileNode } from "@/lib/utils/content";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 p-1 rounded-md hover:bg-accent cursor-pointer group"
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
                        "h-4 w-4 transition-transform flex-shrink-0",
                        expanded[node.path] && "rotate-90"
                      )}
                    />
                  )}
                  {node.type === "directory" ? (
                    <Folder className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <File className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="truncate max-w-[160px]">{node.name}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[300px] break-all">
                {node.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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