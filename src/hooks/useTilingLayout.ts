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
    } else if (tilingLayout === "grid") {
      const cols = Math.ceil(Math.sqrt(n));
      const rows = Math.ceil(n / cols);

      const totalGapsWidth = (cols + 1) * gaps;
      const cellW = Math.floor((dimensions.width - totalGapsWidth) / cols);
      const totalGapsHeight = (rows + 1) * gaps;
      const cellH = Math.floor((dimensions.height - totalGapsHeight) / rows);

      for (let idx = 0; idx < n; idx++) {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const isLastRow = r === rows - 1;
        const remainingInLastRow = n - r * cols;

        if (isLastRow && remainingInLastRow < cols) {
          // Stretch windows in the last row to fill the row width
          const lastRowCellW = Math.floor((dimensions.width - (remainingInLastRow + 1) * gaps) / remainingInLastRow);
          coordsMap[openWindows[idx].id] = {
            x: gaps + c * (lastRowCellW + gaps),
            y: gaps + r * (cellH + gaps),
            w: lastRowCellW,
            h: cellH,
          };
        } else {
          coordsMap[openWindows[idx].id] = {
            x: gaps + c * (cellW + gaps),
            y: gaps + r * (cellH + gaps),
            w: cellW,
            h: cellH,
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
