import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "منهاج | فهرس تعليمي عربي",
    template: "%s | منهاج",
  },
  description:
    "منهاج فهرس تعليمي عربي مستقل لمحتوى الشيخ أحمد السيد، يسهّل اكتشاف السلاسل والمحاضرات بحسب موضوعها.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${alexandria.variable} min-h-full`}>
      <body><KeyboardShortcuts />{children}</body>
    </html>
  );
}
