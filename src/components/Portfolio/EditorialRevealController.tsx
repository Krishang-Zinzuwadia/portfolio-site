"use client";

import { useEffect } from "react";

interface EditorialRevealControllerProps {
  rootId: string;
}

export default function EditorialRevealController({
  rootId,
}: EditorialRevealControllerProps) {
  useEffect(() => {
    const root = document.getElementById(rootId);

    if (!root) {
      return;
    }

    const revealItems = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const initialRevealLine = window.innerHeight * 0.94;

    const initiallyVisible = revealItems.filter(
      (item) => item.getBoundingClientRect().top <= initialRevealLine
    );

    initiallyVisible.forEach((item) => item.classList.add("is-visible"));

    root.classList.add("editorial-motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    revealItems.forEach((item) => {
      if (!item.classList.contains("is-visible")) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, [rootId]);

  return null;
}
