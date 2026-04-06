"use client";

import { useState, useEffect } from "react";

interface ViewportSize {
  width: number;
  height: number;
}

const DEBOUNCE_MS = 100;

export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>({ width: 0, height: 0 });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    function measure() {
      const vp = window.visualViewport;
      setSize({
        width: vp ? vp.width : window.innerWidth,
        height: vp ? vp.height : window.innerHeight,
      });
    }

    function handleResize() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(measure, DEBOUNCE_MS);
    }

    measure();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}
