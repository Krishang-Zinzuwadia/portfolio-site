import type { Viewport } from "next";

import styles from "@/components/Work/WorkPages.module.css";
import { paperFontClassName } from "@/lib/paper-fonts";

export const viewport: Viewport = {
  themeColor: "#f2ead6",
  colorScheme: "light",
};

export default function WorkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${paperFontClassName} ${styles.workRoot}`}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      {children}
    </div>
  );
}
