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
    const n = openWindows.length;
    if (n === 0) return coordsMap;

    if (tilingLayout === "master-stack") {
      if (n === 1) {
        coordsMap[openWindows[0].id] = {
          x: gaps,
          y: gaps,
          w: dimensions.width - 2 * gaps,
          h: dimensions.height - 2 * gaps,
        };
      } else {
        // Master window on the left
        const masterW = Math.round(dimensions.width * splitRatio) - gaps;
        const masterH = dimensions.height - 2 * gaps;
        coordsMap[openWindows[0].id] = {
          x: gaps,
          y: gaps,
          w: masterW,
          h: masterH,
        };

        // Stack windows on the right
        const stackX = masterW + 2 * gaps;
        const stackW = dimensions.width - masterW - 3 * gaps;
        const k = n - 1;
        const totalStackGapsHeight = (k + 1) * gaps;
        const stackCellH = Math.floor((dimensions.height - totalStackGapsHeight) / k);

        for (let i = 0; i < k; i++) {
          coordsMap[openWindows[i + 1].id] = {
            x: stackX,
            y: gaps + i * (stackCellH + gaps),
            w: stackW,
            h: stackCellH,
          };
        }
      }
    } else {
      // Fallback placeholder
      openWindows.forEach((w) => {
        coordsMap[w.id] = {
          x: w.x,
          y: w.y,
          w: w.w,
          h: w.h,
        };
      });
    }

    return coordsMap;
  };

  return {
    tiledCoords: calculateTiledCoords(),
    width: dimensions.width,
    height: dimensions.height,
  };
}
