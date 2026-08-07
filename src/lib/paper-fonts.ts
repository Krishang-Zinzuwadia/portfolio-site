import { Alegreya, Alegreya_Sans } from "next/font/google";

const paperSerif = Alegreya({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-paper-serif",
  display: "swap",
});

const paperSans = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-paper-sans",
  display: "swap",
});

export const paperFontClassName = `${paperSerif.variable} ${paperSans.variable}`;
