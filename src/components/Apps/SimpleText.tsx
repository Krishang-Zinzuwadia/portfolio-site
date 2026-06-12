"use client";

import React, { useState } from "react";
import { useAudio } from "@/hooks/useAudio";

interface DocumentItem {
  id: string;
  title: string;
  content: string;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: "about_me",
    title: "About_Me.txt",
    content: `HELLO, I'M KRISHANG ZINZUWADIA!
===================================
I am a software engineer and creative designer who loves building systems at the intersection of retro aesthetics and modern web technologies.

My Philosophy:
-----------------------------------
I believe the web should be fun, interactive, and beautifully designed. This portfolio itself is a testament to my dedication to crafting unique user experiences that stand out.

Welcome to my digital playground. Feel free to explore the other files in the sidebar, run command lines in the MacTerminal, check out my projects in Finder HD, and send me a note using Mail Box!`,
  },
  {
    id: "resume",
    title: "Resume.txt",
    content: `KRISHANG ZINZUWADIA
===================================
Location: India
Web: https://zinzuwadia.com

EXPERIENCE:
-----------------------------------
* Software Engineer - Frontend Systems
  - Crafting immersive, high-performance web applications using React, Next.js, and TypeScript.
  - Building customized UI component libraries and complex state management workflows.
  
* Creative Technologist
  - Designing retro-futurist, 3D (R3F/Three.js) and interactive visual models for client websites.

EDUCATION:
-----------------------------------
* B.S. in Computer Science

CORE CAPABILITIES:
-----------------------------------
* Languages: TypeScript, JavaScript, Python, C++, HTML/CSS, SQL
* Frameworks: React, Next.js, TailwindCSS, Zustand, Framer Motion, Three.js
* Tools: Git, Docker, Node.js, Vercel, Figma`,
  },
  {
    id: "colophon",
    title: "Colophon.txt",
    content: `COLOPHON
===================================
* Typefaces:
  - Chicago Pixel (header menus, titles)
  - Geneva (system text, icons)
  - Monaco (monospace commands, text)
  
* Inspired by:
  - System 7 OS (Macintosh, 1991)
  - Early graphical user interfaces
  - Vintage physical computer models
  
* Technical Details:
  - Framework: Next.js 16 (App Router)
  - Styling: TailwindCSS
  - Animations: Framer Motion
  - State Manager: Zustand`,
  },
];

export default function SimpleText() {
  const [selectedDocId, setSelectedDocId] = useState<string>("about_me");
  const { playSound } = useAudio();

  const selectedDoc = DOCUMENTS.find((doc) => doc.id === selectedDocId) || DOCUMENTS[0];

  const handleSelectDoc = (id: string) => {
    playSound("click");
    setSelectedDocId(id);
  };

  return (
    <div className="flex h-full w-full bg-white text-black font-geneva select-none">
      {/* Left Sidebar: File Explorer */}
      <div className="w-[150px] border-r border-black bg-retro-bg p-2 flex flex-col space-y-1 overflow-y-auto">
        <span className="text-[10px] font-chicago font-bold uppercase tracking-wider text-retro-inactiveHeader border-b border-retro-borderDark mb-2 pb-1">
          Documents
        </span>
        {DOCUMENTS.map((doc) => (
          <button
            key={doc.id}
            onClick={() => handleSelectDoc(doc.id)}
            className={`flex items-center space-x-2 w-full text-left p-1 text-[11px] rounded ${
              selectedDocId === doc.id
                ? "bg-black text-white"
                : "hover:bg-black/5"
            }`}
          >
            {/* Simple Text Document Icon SVG */}
            <svg
              className="w-3.5 h-4 flex-shrink-0"
              viewBox="0 0 32 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2H22L30 10V38H2V2Z"
                fill={selectedDocId === doc.id ? "black" : "#F0F0F0"}
                stroke={selectedDocId === doc.id ? "white" : "black"}
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M22 2V10H30"
                fill={selectedDocId === doc.id ? "black" : "#F0F0F0"}
                stroke={selectedDocId === doc.id ? "white" : "black"}
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
            <span className="truncate">{doc.title}</span>
          </button>
        ))}
      </div>

      {/* Right Content Area: Text Editor Panel */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Editor Status Bar */}
        <div className="bg-retro-bg border-b border-black px-2 py-1 text-[9px] font-chicago font-bold flex justify-between tracking-wide text-retro-activeHeader uppercase">
          <span>SimpleText v1.2</span>
          <span>{selectedDoc.title}</span>
        </div>
        
        {/* Document Content Box */}
        <textarea
          readOnly
          value={selectedDoc.content}
          className="flex-grow p-4 font-monaco text-[11px] leading-relaxed resize-none focus:outline-none border-none outline-none select-text overflow-y-auto whitespace-pre bg-white text-black selection:bg-black selection:text-white"
        />
      </div>
    </div>
  );
}
