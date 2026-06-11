import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krishang Zinzuwadia | Retro Desktop Portfolio",
  description: "An interactive, fully functional classic Macintosh OS desktop simulation featuring a custom tiling window manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full select-none antialiased">
      <body className="h-full w-full overflow-hidden bg-black text-black font-geneva">
        {children}
      </body>
    </html>
  );
}
