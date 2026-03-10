'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Tab {
  id: string;     // path (예: '/attendance-regular')
  title: string;  // 표시 이름 (예: '정규직 근태관리')
  path: string;   // 실제 라우트 경로
}

interface TabContextValue {
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (path: string, title: string) => void;
  closeTab: (id: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (id: string) => void;
  setActiveTabId: (id: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const openTab = useCallback((path: string, title: string) => {
    setTabs(prev => {
      if (prev.find(t => t.id === path)) return prev;
      return [...prev, { id: path, title, path }];
    });
    setActiveTabId(path);
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === id);
      const next = prev.filter(t => t.id !== id);
      setActiveTabId(curr => {
        if (curr !== id) return curr;
        if (next.length === 0) return null;
        const newIdx = Math.max(0, idx - 1);
        return next[newIdx]?.id ?? null;
      });
      return next;
    });
  }, []);

  const closeAllTabs = useCallback(() => {
    setTabs([]);
    setActiveTabId(null);
  }, []);

  const closeOtherTabs = useCallback((id: string) => {
    setTabs(prev => prev.filter(t => t.id === id));
    setActiveTabId(id);
  }, []);

  // 드래그로 탭 순서 변경
  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setTabs(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  return (
    <TabContext.Provider value={{ tabs, activeTabId, openTab, closeTab, closeAllTabs, closeOtherTabs, setActiveTabId, reorderTabs }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabContext() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('useTabContext must be used within TabProvider');
  return ctx;
}
