import React, { forwardRef, useState } from "react";
import { useOSStore } from "@/store/useOSStore";
import { useAudio } from "@/hooks/useAudio";

interface DesktopIconProps {
  id: string;
  title: string;
  iconType: "folder" | "document" | "terminal" | "settings" | "mail" | "trash";
  onDoubleClick: () => void;
}

function DesktopIcon({ id, title, iconType, onDoubleClick }: DesktopIconProps) {
  const focusedWindowId = useOSStore((state) => state.focusedWindowId);
  const isSelected = focusedWindowId === id;

  const renderIconSvg = () => {
    switch (iconType) {
      case "folder":
        return (
          <svg className="w-10 h-8" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4C2 2.89543 2.89543 2 4 2H14L18 6H36C37.1046 6 38 6.89543 38 8V28C38 29.1046 37.1046 30 36 30H4C2.89543 30 2 29.1046 2 28V4Z" fill="#F0F0F0" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 10H38" stroke="black" strokeWidth="2"/>
          </svg>
        );
      case "document":
        return (
          <svg className="w-8 h-10" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2H22L30 10V38H2V2Z" fill="#F0F0F0" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M22 2V10H30" fill="#F0F0F0" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
            <line x1="6" y1="16" x2="26" y2="16" stroke="black" strokeWidth="2"/>
            <line x1="6" y1="22" x2="26" y2="22" stroke="black" strokeWidth="2"/>
            <line x1="6" y1="28" x2="20" y2="28" stroke="black" strokeWidth="2"/>
          </svg>
        );
      case "terminal":
        return (
          <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="36" height="36" rx="4" fill="#121212" stroke="black" strokeWidth="2"/>
            <path d="M2 10H38" stroke="black" strokeWidth="2"/>
            <circle cx="6" cy="6" r="1.5" fill="#FF5F56"/>
            <circle cx="11" cy="6" r="1.5" fill="#FFBD2E"/>
            <circle cx="16" cy="6" r="1.5" fill="#27C93F"/>
            <path d="M8 18L14 22L8 26" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="26" x2="24" y2="26" stroke="#00FF00" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case "settings":
        return (
          <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="36" height="36" fill="#F0F0F0" stroke="black" strokeWidth="2"/>
            <rect x="6" y="6" width="28" height="12" fill="#D0D0D0" stroke="black" strokeWidth="2"/>
            <rect x="6" y="22" width="28" height="12" fill="#D0D0D0" stroke="black" strokeWidth="2"/>
            <circle cx="14" cy="12" r="3" fill="#808080" stroke="black" strokeWidth="2"/>
            <circle cx="26" cy="28" r="3" fill="#808080" stroke="black" strokeWidth="2"/>
          </svg>
        );
      case "mail":
        return (
          <svg className="w-10 h-8" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="36" height="28" rx="2" fill="#F0F0F0" stroke="black" strokeWidth="2"/>
            <path d="M2 4L20 18L38 4" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        );
      case "trash":
        return (
          <svg className="w-8 h-10" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="24" height="30" rx="1" fill="#F0F0F0" stroke="black" strokeWidth="2"/>
            <line x1="8" y1="14" x2="8" y2="32" stroke="black" strokeWidth="2"/>
            <line x1="16" y1="14" x2="16" y2="32" stroke="black" strokeWidth="2"/>
            <line x1="24" y1="14" x2="24" y2="32" stroke="black" strokeWidth="2"/>
            <path d="M2 8H30" stroke="black" strokeWidth="2"/>
            <path d="M10 8V4C10 2.89543 10.8954 2 12 2H20C21.1046 2 22 2.89543 22 4V8" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onDoubleClick={onDoubleClick}
      className="flex flex-col items-center justify-center w-[80px] h-[80px] cursor-pointer group rounded"
    >
      <div className={`p-1.5 rounded flex items-center justify-center ${isSelected ? "bg-black text-white" : ""}`}>
        {renderIconSvg()}
      </div>
      <span
        className={`mt-1 text-[10px] text-center font-chicago leading-tight px-1 py-0.5 rounded break-all w-[76px] ${
          isSelected 
            ? "bg-black text-white" 
            : "bg-white text-black border border-black border-dotted md:border-transparent group-hover:bg-retro-bg"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

const Desktop = forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
  ({ children }, ref) => {
    const [showTrashAlert, setShowTrashAlert] = useState(false);
    const openWindow = useOSStore((state) => state.openWindow);
    const activeTheme = useOSStore((state) => state.activeTheme);
    const activeDropZone = useOSStore((state) => state.activeDropZone);
    const { playSound } = useAudio();

    const handleLaunch = (id: string) => {
      playSound("disk");
      openWindow(id);
    };

    const getWallpaperClass = () => {
      switch (activeTheme) {
        case "vaporwave":
          return "bg-[#008080] bg-[radial-gradient(#ff007f_1px,transparent_1px)] [background-size:16px_16px]";
        case "dark-mode":
          return "bg-[#121212] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]";
        case "system7":
        default:
          return "bg-retro-desktop bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:4px_4px] bg-repeat";
      }
    };

    return (
      <div ref={ref} className={`relative flex-1 w-full h-[calc(100%-24px)] ${getWallpaperClass()} overflow-hidden`}>
        {/* Absolute Aligned Desktop Icons on the Right */}
        <div className="absolute right-4 top-4 flex flex-col space-y-4 items-end z-20 pointer-events-auto">
          <DesktopIcon
            id="about"
            title="About Me"
            iconType="document"
            onDoubleClick={() => handleLaunch("about")}
          />
          <DesktopIcon
            id="projects"
            title="Finder HD"
            iconType="folder"
            onDoubleClick={() => handleLaunch("projects")}
          />
          <DesktopIcon
            id="terminal"
            title="MacTerminal"
            iconType="terminal"
            onDoubleClick={() => handleLaunch("terminal")}
          />
          <DesktopIcon
            id="settings"
            title="Control Panel"
            iconType="settings"
            onDoubleClick={() => handleLaunch("settings")}
          />
          <DesktopIcon
            id="contact"
            title="Mail Box"
            iconType="mail"
            onDoubleClick={() => handleLaunch("contact")}
          />
        </div>

        {/* Bottom Right Trash Can */}
        <div className="absolute right-4 bottom-4 z-20 pointer-events-auto">
          <DesktopIcon
            id="trash"
            title="Trash"
            iconType="trash"
            onDoubleClick={() => {
              playSound("trash");
              setShowTrashAlert(true);
            }}
          />
        </div>

        {/* Visual Drop Zone Guides */}
        {activeDropZone && (
          <div
            className={`
              absolute z-30 pointer-events-none border-4 border-dashed border-black bg-white/20 mix-blend-difference transition-all duration-200
              ${activeDropZone === "left" ? "left-1 top-1 w-[calc(50%-2px)] h-[calc(100%-8px)]" : ""}
              ${activeDropZone === "right" ? "left-1/2 top-1 w-[calc(50%-4px)] h-[calc(100%-8px)]" : ""}
              ${activeDropZone === "top" ? "left-1 top-1 w-[calc(100%-8px)] h-[calc(100%-8px)]" : ""}
              ${activeDropZone === "bottom" ? "left-1 top-1/2 w-[calc(100%-8px)] h-[calc(50%-4px)]" : ""}
            `}
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 10px, transparent 10px, transparent 20px)"
            }}
          />
        )}

        {/* Render layered Windows inside this boundaries */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>

        {/* Trash Can Empty Warning Overlay */}
        {showTrashAlert && (
          <div className="absolute inset-0 bg-black/25 z-50 flex items-center justify-center pointer-events-auto">
            <div className="w-[280px] bg-[#c0c0c0] border-2 border-black p-4 shadow-[2px_2px_0px_#000] flex flex-col space-y-4 select-none">
              <div className="flex items-start space-x-3">
                {/* Info Sign */}
                <div className="w-10 h-10 border-2 border-black rounded-full bg-white flex items-center justify-center flex-shrink-0 text-xl font-bold font-chicago">
                  i
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <span className="font-chicago font-bold block text-[11px] leading-tight tracking-wide text-retro-activeHeader uppercase">
                    Trash Empty
                  </span>
                  <p className="text-[10px] leading-normal font-geneva">
                    There are no files or applications in the Trash. Everything is clean!
                  </p>
                </div>
              </div>
              
              {/* Double Bordered OK button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playSound("click");
                    setShowTrashAlert(false);
                  }}
                  className="px-6 py-0.5 border-2 border-black rounded bg-white shadow-retro hover:bg-black/5 active:shadow-none font-chicago font-bold text-[10px] tracking-wide outline-none focus:ring-1 focus:ring-black"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Desktop.displayName = "Desktop";

export default Desktop;
