---
title: Advanced Animations with Framer Motion
date: 2024-03-14
---

# Advanced Animations with Framer Motion

Learn how to create beautiful animations in your React applications using Framer Motion.

## Table of Contents

## Introduction

Framer Motion is a powerful library that makes creating animations in React applications simple and intuitive.

## Basic Animations

### Simple Animation

```tsx
import { motion } from 'framer-motion';

function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Hello, Animation!
    </motion.div>
  );
}
```

## Gesture Animations

### Hover Effects

```tsx
<motion.div
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
>
  Hover me!
</motion.div>
```

## Page Transitions

### Using AnimatePresence

```tsx
import { motion, AnimatePresence } from 'framer-motion';

function PageTransition() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        Page Content
      </motion.div>
    </AnimatePresence>
  );
}
```

## Best Practices

1. Keep animations subtle
2. Use appropriate timing
3. Consider reduced motion preferences
4. Optimize performance