import { useState, useEffect, RefObject } from "react";
import { useOSStore } from "@/store/useOSStore";
import { WindowItem } from "@/store/types";

interface DesktopDimensions {
  width: number;
  height: number;
}

export function useTilingLayout(desktopRef: RefObject<HTMLDivElement | null>) {
  const windows = useOSStore((state) => state.windows);
  const tilingMode = useOSStore((state) => state.tilingMode);
  const tilingLayout = useOSStore((state) => state.tilingLayout);
  const gaps = useOSStore((state) => state.gaps);
  const splitRatio = useOSStore((state) => state.splitRatio);

  const [dimensions, setDimensions] = useState<DesktopDimensions>({
    width: 800,
    height: 600,
  });

  // Track the desktop container size dynamically
  useEffect(() => {
    const element = desktopRef.current;
    if (!element) return;

    const updateDimensions = () => {
      setDimensions({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [desktopRef]);

  const openWindows = windows.filter((w) => w.isOpen && !w.isMinimized);

  const calculateTiledCoords = (): Record<string, { x: number; y: number; w: number; h: number }> => {
    const coordsMap: Record<string, { x: number; y: number; w: number; h: number }> = {};
    if (openWindows.length === 0) return coordsMap;

    // We will implement specific layout algorithms in subsequent commits
    openWindows.forEach((w) => {
      coordsMap[w.id] = {
        x: w.x,
        y: w.y,
        w: w.w,
        h: w.h,
      };
    });

    return coordsMap;
  };

  return {
    tiledCoords: calculateTiledCoords(),
    width: dimensions.width,
    height: dimensions.height,
  };
}
