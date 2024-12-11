"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useState, useEffect } from 'react'
import { HyperText } from "@/components/ui/hyper-text";
import { BlurIn } from "@/components/ui/blur-in";

export function DocDemo() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const mouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      })

      console.log(event.clientX, event.clientY)
    }

    window.addEventListener('mousemove', mouseMove)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
    }
  }, [])

  const maskStyle = {
    maskImage: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 100%)`,
    WebkitMaskImage: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 100%)`,
    maskSize: '100% 100%',
  }

  return (
    <div className="relative flex h-[100vh] w-full flex-col items-center justify-center overflow-hidden bg-background">
      {/* <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
        Dot Pattern
      </p> */}
      <div className="flex flex-col items-center justify-center pb-[12rem]">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center mb-6"
        >
          {/* Welcome to My Digital Garden */}
          <HyperText
            className="text-6xl font-bold text-black dark:text-white"
            text="Welcome to My Digital Garden"
            duration={0.1}
          />
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground text-center max-w-2xl"
        >
          A place where ideas grow and thoughts flourish. Explore my collection of
          writings, tutorials, and digital experiments.
        </motion.p>
      </div>
      <DotPattern
        style={maskStyle}
        // className={cn(
        //   "absolute z-0 w-full h-full bg-gradient-to-br from-primary to-secondary"
        // )}
        cr={1}
      />
    </div>
  );
}
