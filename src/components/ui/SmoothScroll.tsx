'use client';

import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Custom Magnetic Cursor Logic
    const onMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      if (cursorRef.current && followerRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out',
        });
        gsap.to(followerRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.4,
          ease: 'power3.out',
        });
      }
    };

    const onMouseDown = () => {
      if (followerRef.current) {
        gsap.to(followerRef.current, { scale: 0.7, duration: 0.15 });
      }
    };

    const onMouseUp = () => {
      if (followerRef.current) {
        gsap.to(followerRef.current, { scale: isHovered ? 1.8 : 1, duration: 0.2 });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Dynamic Hover Check
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, .interactive')) {
        setIsHovered(true);
        if (followerRef.current) {
          gsap.to(followerRef.current, { scale: 1.8, backgroundColor: 'rgba(96, 165, 250, 0.25)', borderColor: '#60A5FA', duration: 0.3 });
        }
      } else {
        setIsHovered(false);
        if (followerRef.current) {
          gsap.to(followerRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(59, 130, 246, 0.5)', duration: 0.3 });
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isHovered]);

  return (
    <>
      {/* Custom Ultra Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-blue-400 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#60a5fa]"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-blue-500/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform ease-out"
      />
      {children}
    </>
  );
}
