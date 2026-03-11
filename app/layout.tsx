import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "아머스포츠코리아 PDM 시스템",
  description: "Amer Korea Sports PDM System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* iframe 임베드 감지: 페인트 이전에 동기적으로 실행하여 Shell 플래시 방지 */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(window.self!==window.top)document.documentElement.setAttribute('data-embedded','')}catch(e){document.documentElement.setAttribute('data-embedded','')}` }} />
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics/>
      </body>
    </html>
  );
}