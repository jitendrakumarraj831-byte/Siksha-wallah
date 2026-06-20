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

    el.style.opacity = "0";
    el.style.transition = `opacity ${duration}ms cubic-bezier(.22,1,.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(.22,1,.36,1) ${delay}ms`;

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
    return () => observer.disconnect();
  }, [type, delay, duration, threshold, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
