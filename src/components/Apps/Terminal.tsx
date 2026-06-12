"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOSStore } from "@/store/useOSStore";
import { useAudio } from "@/hooks/useAudio";

interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "system";
}

export default function Terminal() {
  const { changeTheme, closeWindow } = useOSStore();
  const { playSound } = useAudio();
  
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([
    { text: "Welcome to MacTerminal v2.0 (Motorola 68030)", type: "system" },
    { text: "Type 'help' to see list of available commands.", type: "system" },
    { text: "", type: "output" },
  ]);

  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Focus input on mounting
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add input command to logs
    const newLogs = [...logs, { text: `guest@macterm % ${trimmed}`, type: "input" as const }];
    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Save to history
    const newHistory = [trimmed, ...history.filter(h => h !== trimmed)].slice(0, 50);
    setHistory(newHistory);
    setHistoryIdx(-1);

    const out = (text: string, type: "output" | "error" | "system" = "output") => {
      newLogs.push({ text, type });
    };

    switch (command) {
      case "help":
        out("Available commands:");
        out("  help               - Show this help menu");
        out("  ls                 - List files in current directory");
        out("  cat [file]         - Display contents of a text file");
        out("  skills             - Display core technical capabilities");
        out("  sysinfo            - Display retro computer hardware details");
        out("  beep               - Trigger system alert beep sound");
        out("  theme [name]       - Change OS theme (system7, vaporwave, dark)");
        out("  clear              - Clear terminal window logs");
        out("  exit               - Close the MacTerminal application");
        break;

      case "ls":
        out("Applications & Files in guest/ :");
        out("  about_me.txt          resume.txt            colophon.txt");
        out("  projects.app          control_panel.app     mail.app");
        break;

      case "cat": {
        if (!args[0]) {
          out("cat: missing file operand. Usage: cat [filename]", "error");
          break;
        }
        const file = args[0].toLowerCase();
        if (file === "about_me.txt") {
          out("--- ABOUT ME ---");
          out("Hello! I'm Krishang Zinzuwadia.");
          out("A software engineer who crafts immersive frontends and responsive tiling workspaces.");
          out("I build interactive visual experiences and design beautiful retro interfaces.");
        } else if (file === "resume.txt") {
          out("--- RESUME ---");
          out("Location: India | Web: zinzuwadia.com");
          out("Roles: Frontend Systems Developer & Creative Technologist");
          out("Languages: TypeScript, JavaScript, Python, C++, HTML/CSS, SQL");
          out("Frameworks: React, Next.js, TailwindCSS, Zustand, Framer Motion");
        } else if (file === "colophon.txt") {
          out("--- COLOPHON ---");
          out("Inspired by System 7 OS (Macintosh, 1991).");
          out("Built using Next.js 16, TailwindCSS, Zustand, and Framer Motion.");
        } else if (["projects.app", "control_panel.app", "mail.app"].includes(file)) {
          out(`cat: ${file}: Is an application executable. Launch it from Desktop!`, "error");
        } else {
          out(`cat: ${args[0]}: No such file or directory`, "error");
        }
        break;
      }

      case "skills":
        out("=================== SKILL SETS ===================");
        out("Frontend:    React, Next.js, TypeScript, TailwindCSS");
        out("Animation:   Framer Motion, CSS Shaders, Three.js");
        out("Backend:     Node.js, REST APIs, SQL, Python");
        out("Tools:       Git, Docker, Vercel, npm, Vite");
        out("==================================================");
        break;

      case "sysinfo":
        out("               .---.");
        out("              /     \\");
        out("              \\_.._/       System Info:");
        out("               |  |        ------------");
        out("               |  |        Computer:   Macintosh SE/30");
        out("             .-'  '-.      Processor:  Motorola 68030 @ 8 MHz");
        out("            /________\\     RAM:        4 Megabytes");
        out("            |        |     Graphics:   Built-in 9\" B&W CRT");
        out("            |________|     OS:         RetroOS System 7");
        out("            |        |     Storage:    40MB SCSI HDD");
        out("            '--------'");
        break;

      case "beep":
        playSound("beep");
        out("Beep! Alert triggered.");
        break;

      case "theme": {
        if (!args[0]) {
          out("theme: missing argument. Usage: theme [system7 | vaporwave | dark]", "error");
          break;
        }
        const themeArg = args[0].toLowerCase();
        if (themeArg === "system7") {
          changeTheme("system7");
          playSound("chime");
          out("System theme changed to Classic System 7.");
        } else if (themeArg === "vaporwave") {
          changeTheme("vaporwave");
          playSound("chime");
          out("System theme changed to Vaporwave.");
        } else if (themeArg === "dark") {
          changeTheme("dark-mode");
          playSound("chime");
          out("System theme changed to Dark Mode.");
        } else {
          out(`theme: unknown theme '${args[0]}'. Choose: system7, vaporwave, dark`, "error");
        }
        break;
      }

      case "clear":
        setLogs([]);
        setInputVal("");
        return;

      case "exit":
        playSound("click");
        closeWindow("terminal");
        return;

      default:
        out(`macterm: command not found: ${command}. Type 'help' for options.`, "error");
        break;
    }

    setLogs(newLogs);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx < history.length) {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      if (nextIdx >= 0) {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInputVal("");
      }
    }
  };

  const getLogColorClass = (type: LogLine["type"]) => {
    switch (type) {
      case "input":
        return "text-[#ffff00] font-bold";
      case "error":
        return "text-[#ff5f56]";
      case "system":
        return "text-[#00e6ff]";
      case "output":
      default:
        return "text-[#00ff00]";
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="w-full h-full bg-[#121212] font-monaco text-[11px] p-2 flex flex-col justify-between select-text overflow-hidden cursor-text border border-black selection:bg-white selection:text-black"
    >
      {/* Logs Scroll container */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto space-y-1 pr-1"
      >
        {logs.map((log, idx) => (
          <div key={idx} className={`leading-relaxed whitespace-pre-wrap ${getLogColorClass(log.type)}`}>
            {log.text}
          </div>
        ))}
      </div>

      {/* Input Prompt line */}
      <div className="flex items-center space-x-1 border-t border-[#333333] pt-1 mt-1 text-[#00ff00]">
        <span className="flex-shrink-0 select-none">guest@macterm %</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            playSound("keystroke");
          }}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent border-none outline-none font-monaco text-[11px] focus:ring-0 text-[#ffffff] caret-[#00ff00] p-0"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
