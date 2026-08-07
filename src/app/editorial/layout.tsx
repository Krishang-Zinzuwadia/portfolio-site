import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#090a0b",
  colorScheme: "dark",
};

export default function EditorialLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
