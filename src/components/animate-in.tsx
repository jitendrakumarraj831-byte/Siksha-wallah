"use client";

import { useEffect, useRef } from "react";

type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "flip-up"
  | "slide-up";

interface AnimateInProps {
  children: React.ReactNode;
  type?: AnimationType;
  delay?: number;       // ms
  duration?: number;    // ms
  threshold?: number;   // 0-1
  className?: string;
  once?: boolean;
}

export function AnimateIn({
  children,
  type = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.15,
  className = "",
  once = true,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const actualDuration = prefersReducedMotion ? 0 : Math.min(duration, 400); // Cap at 400ms for mobile
    const actualDelay = prefersReducedMotion ? 0 : delay;

    el.style.opacity = "0";
    el.style.willChange = "opacity, transform";
    el.style.contain = "layout style paint";
    el.style.transition = `opacity ${actualDuration}ms cubic-bezier(.22,1,.36,1) ${actualDelay}ms, transform ${actualDuration}ms cubic-bezier(.22,1,.36,1) ${actualDelay}ms`;

    const initialTransforms: Record<AnimationType, string> = {
      "fade-up":    "translateY(40px)",
      "fade-down":  "translateY(-40px)",
      "fade-left":  "translateX(50px)",
      "fade-right": "translateX(-50px)",
      "zoom-in":    "scale(0.85)",
      "flip-up":    "perspective(600px) rotateX(20deg) translateY(30px)",
      "slide-up":   "translateY(60px)",
    };

    el.style.transform = initialTransforms[type];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          if (once) observer.disconnect();
        } else if (!once) {
          el.style.opacity = "0";
          el.style.transform = initialTransforms[type];
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.willChange = "auto";
      el.style.contain = "auto";
    };
  }, [type, delay, duration, threshold, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
