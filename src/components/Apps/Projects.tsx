"use client";

import React, { useState } from "react";
import { useAudio } from "@/hooks/useAudio";

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "vapor_os",
    title: "VaporOS Simulation",
    subtitle: "Vaporwave Web Desktop Environment",
    description: "A gorgeous client-side simulation of a vaporwave operating system environment, featuring interactive music cassette widgets, synthwave canvas graphics, shader filters, and retro terminal logs.",
    features: [
      "Custom audio cassette synthesizer loaded via Web Audio APIs.",
      "Responsive neon desktop widgets and window dragging coordination.",
      "CRT Scanline and RGB chromatic aberration toggle shaders."
    ],
    tech: ["React", "Next.js", "Zustand", "Framer Motion", "TailwindCSS"],
    liveUrl: "https://vapor-os.zinzuwadia.com",
    githubUrl: "https://github.com/Krishang-Zinzuwadia/vapor-os",
  },
  {
    id: "tiled_rust",
    title: "Tiled-Rust Manager",
    subtitle: "Dynamic UNIX Tiling Window Manager",
    description: "A fast, lightweight tiling window manager written from scratch in Rust, communicating via X11 libraries to arrange client windows in Master-Stack or Grid layouts with gaps.",
    features: [
      "Lightweight Unix IPC event parser written in pure Rust.",
      "Configurable gaps, dynamic workspace switching, and keybind handlers.",
      "Optimized CPU load (<1% under constant layout updates)."
    ],
    tech: ["Rust", "X11", "UNIX IPC", "C++ bindings"],
    liveUrl: "https://github.com/Krishang-Zinzuwadia/tiled-rust",
    githubUrl: "https://github.com/Krishang-Zinzuwadia/tiled-rust",
  },
  {
    id: "keyboard_3d",
    title: "R3F Keyboard customizer",
    subtitle: "3D Keyboard Tester & Keycaps Simulator",
    description: "An immersive 3D mechanical keyboard visualizer. Allows keyboard enthusiasts to custom select casing metals, switch models, profile layouts, and test typing sound acoustics.",
    features: [
      "Fully interactive 3D model loaders using React Three Fiber.",
      "Interactive keycap switch tester with customized Web Audio sound profiles.",
      "Custom canvas texture rendering with realistic lighting shaders."
    ],
    tech: ["Three.js", "React Three Fiber", "GLSL Shaders", "Zustand"],
    liveUrl: "https://kb-tester.zinzuwadia.com",
    githubUrl: "https://github.com/Krishang-Zinzuwadia/r3f-keyboard",
  },
  {
    id: "retro_meme",
    title: "Vintage Meme Gen",
    subtitle: "Classic 80s Meme Canvas Builder",
    description: "A fun pixel-art style generator tool allowing users to upload images and overlay classic 80s fonts, vintage stickers, and pixelated border layouts using HTML5 Canvas coordinates.",
    features: [
      "Fast HTML5 canvas drawing layers with high-resolution image output.",
      "Responsive drag-and-drop text positioning coordinates.",
      "Themed preset filters mimicking early dithering image patterns."
    ],
    tech: ["HTML5 Canvas", "React", "TypeScript", "TailwindCSS"],
    liveUrl: "https://meme-gen.zinzuwadia.com",
    githubUrl: "https://github.com/Krishang-Zinzuwadia/retro-meme-gen",
  },
];

export default function Projects() {
  const { playSound } = useAudio();
  
  const [selectedProjId, setSelectedProjId] = useState<string | null>(null);
  const [activeInfoProj, setActiveInfoProj] = useState<ProjectItem | null>(null);

  const handleSelectProject = (id: string) => {
    playSound("click");
    setSelectedProjId(id);
  };

  const handleDoubleClick = (proj: ProjectItem) => {
    playSound("disk");
    setActiveInfoProj(proj);
  };

  const handleBack = () => {
    playSound("click");
    setActiveInfoProj(null);
    setSelectedProjId(null);
  };

  const activeProj = PROJECTS.find((p) => p.id === selectedProjId);

  return (
    <div className="w-full h-full bg-white text-black font-geneva select-none flex flex-col border border-black shadow-[inset_1px_1px_0px_#fff]">
      {/* Finder Top Header Bar */}
      <div className="bg-[#c0c0c0] border-b border-black p-2 flex items-center justify-between text-[10px] font-chicago font-bold uppercase tracking-wide">
        <div className="flex items-center space-x-2">
          {activeInfoProj ? (
            <button
              onClick={handleBack}
              className="px-2 py-0.5 border border-black rounded bg-white shadow-retro active:shadow-none flex items-center space-x-1"
            >
              <span>◁</span>
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              {/* Retro folder icon */}
              <svg className="w-4 h-3.5" viewBox="0 0 40 32" fill="none">
                <path d="M2 4C2 2.895 2.895 2 4 2H14L18 6H36C37.1 6 38 6.9 38 8V28C38 29.1 37.1 30 36 30H4C2.9 30 2 29.1 2 28V4Z" fill="#F0F0F0" stroke="black" strokeWidth="3"/>
                <path d="M2 10H38" stroke="black" strokeWidth="3"/>
              </svg>
              <span>Finder HD</span>
            </div>
          )}
        </div>
        <div className="text-retro-inactiveHeader">
          {activeInfoProj ? activeInfoProj.title : `${PROJECTS.length} Items`}
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {!activeInfoProj ? (
          /* PROJECT GRID VIEW */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {PROJECTS.map((proj) => {
              const isSelected = selectedProjId === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => handleSelectProject(proj.id)}
                  onDoubleClick={() => handleDoubleClick(proj)}
                  className="flex flex-col items-center justify-center cursor-pointer group p-1"
                >
                  <div
                    className={`p-2 rounded flex items-center justify-center border border-transparent ${
                      isSelected ? "bg-black text-white" : "group-hover:bg-black/5"
                    }`}
                  >
                    {/* Big Retro Project Folder Icon */}
                    <svg
                      className="w-12 h-10"
                      viewBox="0 0 40 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 4C2 2.89543 2.89543 2 4 2H14L18 6H36C37.1046 6 38 6.89543 38 8V28C38 29.1046 37.1046 30 36 30H4C2.89543 30 2 29.1046 2 28V4Z"
                        fill={isSelected ? "black" : "#F0F0F0"}
                        stroke={isSelected ? "white" : "black"}
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 10H38"
                        stroke={isSelected ? "white" : "black"}
                        strokeWidth="3.5"
                      />
                    </svg>
                  </div>
                  <span
                    className={`mt-2 text-[10px] text-center font-chicago leading-tight px-1 py-0.5 rounded break-words max-w-[90px] border border-dotted ${
                      isSelected
                        ? "bg-black text-white border-white"
                        : "bg-white text-black border-transparent group-hover:bg-[#c0c0c0]/30"
                    }`}
                  >
                    {proj.title}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* PROJECT INSPECTOR / GET INFO DETAIL VIEW */
          <div className="flex flex-col h-full max-w-[560px] mx-auto text-[11px] space-y-4">
            {/* Title & Info */}
            <div className="border-b-2 border-black pb-2">
              <h2 className="font-chicago font-bold text-sm tracking-wide text-retro-activeHeader uppercase leading-tight">
                {activeInfoProj.title}
              </h2>
              <span className="text-retro-inactiveHeader text-[9px] font-bold uppercase tracking-wider block mt-0.5">
                {activeInfoProj.subtitle}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1.5 leading-relaxed bg-[#f5f5f5] p-3 border border-black/10 rounded select-text">
              <span className="font-bold block">Description:</span>
              <p className="text-black/80">{activeInfoProj.description}</p>
            </div>

            {/* Features Bullet List */}
            <div className="space-y-1">
              <span className="font-bold block">Key Features:</span>
              <ul className="list-disc pl-4 space-y-1 text-black/80 select-text">
                {activeInfoProj.features.map((feat, index) => (
                  <li key={index}>{feat}</li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-1.5">
              <span className="font-bold block">Technology Stack:</span>
              <div className="flex flex-wrap gap-1.5 select-text">
                {activeInfoProj.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 border border-black rounded-sm bg-[#e0e0e0] font-monaco text-[9px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Link buttons */}
            <div className="flex space-x-2 pt-2 border-t border-black/10">
              {activeInfoProj.liveUrl && (
                <a
                  href={activeInfoProj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound("click")}
                  className="px-4 py-1.5 border-2 border-black rounded bg-white shadow-retro hover:bg-black/5 active:shadow-none font-chicago font-bold text-[10px] tracking-wide text-center"
                >
                  Visit Live Site
                </a>
              )}
              {activeInfoProj.githubUrl && (
                <a
                  href={activeInfoProj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound("click")}
                  className="px-4 py-1.5 border border-black rounded bg-[#c0c0c0] shadow-retro hover:bg-black/5 active:shadow-none font-bold text-[10px] text-center"
                >
                  View GitHub Source
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
