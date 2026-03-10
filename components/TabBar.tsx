'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTabContext } from '@/contexts/TabContext';

interface ContextMenu {
  tabId: string | null; // null = 탭 빈 영역 우클릭
  x: number;
  y: number;
}

export default function TabBar() {
  const { tabs, activeTabId, setActiveTabId, closeTab, closeAllTabs, closeOtherTabs, reorderTabs } = useTabContext();

  // 스크롤 상태
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 드래그 앤 드롭 상태
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // 컨텍스트 메뉴 상태
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // 스크롤 가능 여부 계산
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, tabs]);

  // ESC 키로 컨텍스트 메뉴 닫기
  useEffect(() => {
    if (!contextMenu) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setContextMenu(null); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [contextMenu]);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -160, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' });

  // 드래그 핸들러
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    (e.currentTarget as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '';
    setDragOverIndex(null);
    dragIndexRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => setDragOverIndex(null);

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndexRef.current !== null && dragIndexRef.current !== toIndex) {
      reorderTabs(dragIndexRef.current, toIndex);
    }
    setDragOverIndex(null);
  };

  // 탭 위 우클릭 → 3가지 메뉴
  const handleTabContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ tabId, x: e.clientX, y: e.clientY });
  };

  // 탭바 빈 영역 우클릭 → 모두닫기만
  const handleBarContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (tabs.length === 0) return;
    setContextMenu({ tabId: null, x: e.clientX, y: e.clientY });
  };

  const hasOverflow = canScrollLeft || canScrollRight;

  return (
    <div className="tab-bar-wrapper" onContextMenu={handleBarContextMenu}>
      {/* 탭 목록 (가로 스크롤 영역) */}
      <div className="tab-bar" ref={scrollRef}>
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={[
              'tab-item',
              activeTabId === tab.id ? 'active' : '',
              dragOverIndex === index ? 'drag-over' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => setActiveTabId(tab.id)}
            onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
            title={tab.title}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <span className="tab-title">{tab.title}</span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              aria-label={`${tab.title} 탭 닫기`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* <> 버튼 그룹 — 오른쪽 고정, 오버플로우 시에만 표시 */}
      {hasOverflow && (
        <div className="tab-scroll-group">
          <button
            className="tab-scroll-btn"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="탭 왼쪽으로 이동"
            tabIndex={-1}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className="tab-scroll-btn"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="탭 오른쪽으로 이동"
            tabIndex={-1}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* 컨텍스트 메뉴 */}
      {contextMenu && (
        <>
          {/* 외부 클릭 감지용 투명 오버레이 */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            onMouseDown={() => setContextMenu(null)}
          />
          <div
            ref={contextMenuRef}
            className="tab-context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x, zIndex: 9999 }}
          >
            {contextMenu.tabId ? (
              // 탭 위 우클릭
              <>
                <button
                  className="tab-context-item"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => { closeTab(contextMenu.tabId!); setContextMenu(null); }}
                >
                  닫기
                </button>
                <button
                  className="tab-context-item"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => { closeOtherTabs(contextMenu.tabId!); setContextMenu(null); }}
                  disabled={tabs.length <= 1}
                >
                  다른 탭 모두 닫기
                </button>
                <div className="tab-context-divider" />
                <button
                  className="tab-context-item tab-context-item--danger"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => { closeAllTabs(); setContextMenu(null); }}
                >
                  모두 닫기
                </button>
              </>
            ) : (
              // 빈 영역 우클릭
              <button
                className="tab-context-item tab-context-item--danger"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => { closeAllTabs(); setContextMenu(null); }}
              >
                모두 닫기
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
