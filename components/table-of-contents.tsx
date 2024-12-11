"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

interface TableOfContentsProps {
  toc: string;
}

interface TocItem {
  content: string;
  slug: string;
  depth: number;
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [parsedToc, setParsedToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const parseToc = (tocString: string): TocItem[] => {
      console.log("Raw TOC string:", tocString); // 调试日志
      const lines = tocString.split('\n');
      const items = lines
        .map(line => {
          console.log("Processing line:", line); // 调试日志
          // 更新后的正则表达式
          // const match = line.match(/^\s*- \[(.*?)\]$$(.*?)$$\s*\{\.depth-(\d+)\}/);
          // if (match) {
          //   const [, content, slug, depth] = match;
          //   console.log("Matched:", { content, slug, depth }); // 调试日志
          //   return {
          //     content,
          //     slug: slug.replace(/^#/, ''), // Remove leading '#' if present
          //     depth: parseInt(depth, 10)
          //   };
          // }
          if (line !== '') {
            const content = line.match(/(?<=\[).*(?=])/)?.[0];
            const slug = line.match(/(?<=\().*(?=\))/)?.[0];
            const depth = line.match(/(?<={.depth-).*(?=\})/)?.[0];

            return {
              content,
              slug: slug?.replace(/^#/, ''), // Remove leading '#' if present
              depth: parseInt(depth ?? '0', 10)
            };
          }
          console.log("No match for line"); // 调试日志
          return null;
        })
        .filter((item): item is TocItem => item !== null);
      
      console.log("Parsed items:", items); // 调试日志
      return items;
    };

    const parsed = parseToc(toc);
    console.log("Setting parsedToc:", parsed); // 调试日志
    setParsedToc(parsed);
  }, [toc]);

  if (!toc) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No table of contents
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Table of Contents</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm"
      >
        <nav>
          <ul className="space-y-2 text-muted-foreground">
            {parsedToc.map((item, index) => (
              <li key={index} style={{ marginLeft: `${item.depth * 16}px` }}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`
                    transition-colors duration-200 hover:text-foreground
                    ${item.depth === 0 ? 'font-medium' : ''}
                    ${item.depth === 1 ? 'text-sm' : ''}
                    ${item.depth === 2 ? 'text-xs opacity-80' : ''}
                  `}
                >
                  <a
                    href={`#${item.slug}`}
                    className="hover:text-foreground transition-colors duration-200 block"
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(item.slug);
                      if (target) {
                        const offset = target.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({
                          top: offset,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  >
                    {item.content}
                  </a>
                </motion.div>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </div>
  );
}

