# Retro 90s Desktop Portfolio Simulator (System 7)

An immersive, high-fidelity portfolio website simulating a classic 90s Macintosh desktop environment (System 7.0.1). Built with Next.js, Tailwind CSS, Zustand, and Framer Motion.

## 🚀 Key Features

* **Authentic 90s Macintosh UI**: Features a classic pixel layout, Chicago/Geneva typography, horizontal title-bar stripes, Windowshade double-click rollup, dynamic drop-down MenuBar, and a CRT scanner shader overlay.
* **Hybrid Draggable & Tiling Window Manager**:
  * *Floating Mode*: Fully draggable and resizable windows constrained to the desktop bounds.
  * *Tiling Mode*: Edge-snapping overlays. Automatic arranging in **Master-Stack**, **Grid**, and **Monocle** mathematical tiling configurations.
* **Global Keyboard Nav (Alt Hotkeys)**: Focus cycling (`Alt+J/K`), swap order stack (`Alt+Shift+J/K`), layout toggle (`Alt+Space`), split ratio resizing (`Alt+H/L`), maximize (`Alt+Enter`), and close active window (`Alt+W`).
* **Interactive Desktop Applications**:
  * 📝 **SimpleText**: Vintage plain-text document viewer to read the About Me and Resume files.
  * 📟 **MacTerminal**: Monaco green-screen command shell supporting file reads (`cat`), skill lists (`skills`), hardware info (`sysinfo`), audio tests (`beep`), theme switching, and command history log.
  * 📁 **Finder HD (Projects)**: Project catalog folder browser showing custom detail inspector sheets ("Get Info") and source links.
  * 🎛️ **Control Panel**: Desktop settings adjusting CRT scanner intensities, theme layers (System 7, Vaporwave, Dark Mode), sound effects, and fullscreen zooms.
  * 📬 **Mail Box**: SMTP mail sender simulator mimicking dial-up handshake loaders and custom popup prompts.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router & Turbopack)
* **Styling**: Tailwind CSS + Custom retro shadow tokens
* **Animations**: Framer Motion
* **State Manager**: Zustand
* **Icons & Typography**: SVG pixel-art vectors, Chicago, Geneva, and Monaco TTF font bundles

---

## 💻 Getting Started

First, install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser. Follow the floppy disk boot screen animation to enter the desktop shell!

