import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className = '' }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
