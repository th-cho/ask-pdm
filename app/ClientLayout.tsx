'use client';

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TabBar from "../components/TabBar";
import { TabProvider, useTabContext } from "../contexts/TabContext";

// TabProvider 하위에서 useTabContext()를 사용하는 내부 컴포넌트
function AppShell({ children }: { children: React.ReactNode }) {
  const { tabs, activeTabId } = useTabContext();

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div className="main-content d-flex flex-column" style={{ flex: 1, overflow: 'hidden' }}>
        <Header />
        <TabBar />
        <div className="page-content tab-content-area" style={{ flex: 1, overflow: 'hidden' }}>
          {tabs.length > 0 ? (
            tabs.map(tab => (
              <div
                key={tab.id}
                style={{
                  display: activeTabId === tab.id ? 'flex' : 'none',
                  height: '100%',
                  flexDirection: 'column',
                }}
              >
                <iframe
                  src={tab.path}
                  title={tab.title}
                  style={{ width: '100%', flex: 1, border: 'none' }}
                />
              </div>
            ))
          ) : (
            // 탭이 없을 때: app/page.tsx 홈 화면
            children
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      // cross-origin iframe에서는 접근 오류 → embedded로 처리
      setIsEmbedded(true);
    }
  }, []);

  // 로그인/회원가입 페이지: 레이아웃 없이 렌더
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  if (isAuthPage) {
    return <>{children}</>;
  }

  // iframe 내부 (embedded): Sidebar/Header/TabBar 없이 페이지 컨텐츠만 렌더
  if (isEmbedded) {
    return <>{children}</>;
  }

  return (
    <TabProvider>
      <div className="app-shell-container">
        <AppShell>{children}</AppShell>
      </div>
    </TabProvider>
  );
}
