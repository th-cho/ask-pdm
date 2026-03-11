'use client';

import React, { useState } from 'react';
import { LucideIcon, ChevronRight, Menu as MenuIcon, Settings, Code, LayoutGrid, Users, ShieldCheck, FileSpreadsheet, Printer, Timer, Database, Key, Server, Building2, Layers, Shirt, Copy, Scissors, FileText, ClipboardList, ShoppingBag, CheckSquare, GitBranch, Bell, History, BarChart2, RefreshCw, Ruler, Send, Package } from 'lucide-react';
import { useTabContext } from '@/contexts/TabContext';

interface NavNode {
  id: string;
  label: string;
  path?: string;
  icon?: LucideIcon;
  children?: NavNode[];
}

const NAV_TREE: NavNode[] = [
  {
    id: 'common',
    label: '공통관리',
    icon: Layers,
    children: [
      {
        id: 'common_template',
        label: '템플릿관리',
        icon: ClipboardList,
        children: [
          { id: 'item-wash',         label: '아이템별세탁방법',    path: '/item-wash',         icon: Layers },
          { id: 'accessory-base',    label: '완성부자재기초정보',  path: '/accessory-base',    icon: Database },
          { id: 'accessory-setting', label: '복종별완성부자재설정', path: '/accessory-setting', icon: Settings },
        ],
      },
      {
        id: 'common_style',
        label: '스타일관리',
        icon: Shirt,
        children: [
          { id: 'style-delete', label: '스타일삭제',       path: '/style-delete', icon: Layers },
          { id: 'style-collab', label: '스타일관리(콜라보)', path: '/style-collab', icon: Shirt },
          { id: 'style-copy',   label: '스타일복사',       path: '/style-copy',   icon: Copy },
          { id: 'style-print',  label: '문서일괄출력',     path: '/style-print',  icon: Printer },
        ],
      },
    ],
  },
  {
    id: 'document',
    label: '문서관리',
    icon: FileSpreadsheet,
    children: [
      {
        id: 'doc_workorder',
        label: '작업지시서',
        icon: FileText,
        children: [
          { id: 'work-order',  label: '작업지시서', path: '/work-order',  icon: FileText },
        ],
      },
      {
        id: 'doc_sewing',
        label: '봉제사양서',
        icon: Scissors,
        children: [
          { id: 'sewing-spec', label: '봉제사양서', path: '/sewing-spec', icon: Scissors },
        ],
      },
    ],
  },
  {
    id: 'request',
    label: '의뢰관리',
    icon: Send,
    children: [
      {
        id: 'request_order',
        label: '발주의뢰',
        icon: Package,
        children: [
          { id: 'fabric-request',  label: '원단구매의뢰',  path: '/fabric-request',  icon: ShoppingBag },
          { id: 'product-request', label: '상품사입의뢰',  path: '/product-request', icon: ShoppingBag },
        ],
      },
      {
        id: 'request_approval',
        label: '결재/알림',
        icon: CheckSquare,
        children: [
          { id: 'bulk-approval',  label: '일괄결재처리', path: '/bulk-approval',  icon: CheckSquare },
          { id: 'approval-line',  label: '결재라인관리', path: '/approval-line',  icon: GitBranch   },
          { id: 'notify-setting', label: '알림발송설정', path: '/notify-setting', icon: Bell        },
        ],
      },
    ],
  },
  {
    id: 'status',
    label: '현황관리',
    icon: BarChart2,
    children: [
      {
        id: 'status_doc',
        label: '문서현황',
        icon: FileText,
        children: [
          { id: 'deploy-history',  label: '배포이력현황',     path: '/deploy-history',  icon: History    },
          { id: 'material-status', label: '요척현황',         path: '/material-status', icon: BarChart2  },
          { id: 'material-change', label: '원부자재변경현황', path: '/material-change', icon: RefreshCw  },
        ],
      },
      {
        id: 'status_size',
        label: '사이즈관리',
        icon: Ruler,
        children: [
          { id: 'size-convert', label: '사이즈단위환산(파일)', path: '/size-convert', icon: Ruler },
        ],
      },
    ],
  },
  {
    id: 'system',
    label: '시스템',
    icon: Settings,
    children: [
      {
        id: 'system_mgmt',
        label: '시스템관리',
        icon: Server,
        children: [
          { id: 'company', label: '환경설정', path: '/company', icon: Settings },
          { id: 'common-code-master', label: '공통코드마스터', path: '/common-code', icon: Database },
          { id: 'common-code', label: '공통코드', path: '/common-code', icon: Code },
          { id: 'work-division', label: '업무구분', icon: Layers },
          {
            id: 'api',
            label: 'API',
            icon: Key,
            children: [
              { id: 'api-auth', label: 'API 인증관리', icon: Key },
              { id: 'api-manage', label: 'API 관리', icon: Server },
            ],
          },
          { id: 'excel-template', label: '엑셀양식관리', path: '/excel-template', icon: FileSpreadsheet },
          {
            id: 'output',
            label: '출력물',
            icon: Printer,
            children: [
              { id: 'output-item', label: '출력물등록', path: '/output-item', icon: Printer },
              { id: 'output-manage', label: '출력물관리', icon: Printer },
            ],
          },
          {
            id: 'batch',
            label: '배치관리',
            icon: Timer,
            children: [
              { id: 'batch-manage', label: '배치관리', path: '/batch-manage', icon: Timer },
              { id: 'batch-log', label: '배치로그', icon: Timer },
            ],
          },
        ],
      },
      { id: 'menu', label: '메뉴관리', path: '/menu', icon: MenuIcon },
      { id: 'permission', label: '권한관리', path: '/permission', icon: ShieldCheck },
      {
        id: 'system_org',
        label: '조직정보관리',
        icon: Building2,
        children: [
          { id: 'user', label: '사용자관리', path: '/user', icon: Users },
          { id: 'program', label: '프로그램정보', path: '/program', icon: LayoutGrid },
        ],
      },
    ],
  },
];

// 기본 펼침 상태: 모든 메뉴 펼침
const DEFAULT_OPEN: Record<string, boolean> = {
  system: true,
  system_org: true,
  system_mgmt: true,
  api: true,
  output: true,
  batch: true,
  common: true,
  common_template: true,
  common_style: true,
  document: true,
  doc_workorder: true,
  doc_sewing: true,
  request: true,
  request_order: true,
  request_approval: true,
  status: true,
  status_doc: true,
  status_size: true,
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(DEFAULT_OPEN);
  const { activeTabId, openTab } = useTabContext();

  const toggleNode = (id: string) => {
    setOpenMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (path?: string) => path && activeTabId === path;

  function renderNodes(nodes: NavNode[], depth = 0): React.ReactNode {
    return nodes.map(node => {
      const indent = `nav-indent-${depth}`;
      const isOpen = openMap[node.id] ?? false;
      const Icon = node.icon;

      // 자식이 있으면 폴더(그룹)
      if (node.children && node.children.length > 0) {
        return (
            <React.Fragment key={node.id}>
              <div
                  className={`nav-group ${indent} ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleNode(node.id)}
                  title={collapsed ? node.label : undefined}
              >
                {Icon && <Icon size={14} />}
                <span className="link-text">{node.label}</span>
                <ChevronRight size={12} className="chevron" />
              </div>
              {isOpen && !collapsed && renderNodes(node.children, depth + 1)}
            </React.Fragment>
        );
      }

      // 잎 노드
      return (
          <button
              key={node.id}
              className={`nav-leaf ${indent} ${isActive(node.path) ? 'active' : ''}`}
              onClick={() => node.path && openTab(node.path, node.label)}
              disabled={!node.path}
              title={collapsed ? node.label : undefined}
              style={{ opacity: node.path ? 1 : 0.45 }}
          >
            {Icon && <Icon size={14} />}
            <span className="link-text">{node.label}</span>
          </button>
      );
    });
  }

  return (
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* 로고 */}
        <div className="sidebar-header">
          {!collapsed && (
              <span className="sidebar-logo-text">
            Amer Sports Korea <span>PDM</span>
          </span>
          )}
          <button className="sidebar-toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            <MenuIcon size={18} />
          </button>
        </div>

        {/* 트리 메뉴 */}
        <div className="sidebar-scroll">
          {NAV_TREE.map(section => {
            const isOpen = openMap[section.id] ?? false;
            const Icon = section.icon;
            return (
                <React.Fragment key={section.id}>
                  <div
                      className={`nav-section-header ${isOpen ? 'open' : ''}`}
                      onClick={() => toggleNode(section.id)}
                      title={collapsed ? section.label : undefined}
                  >
                    {Icon && <Icon size={13} />}
                    <span className="link-text">{section.label}</span>
                    {!collapsed && (
                        <ChevronRight
                            size={11}
                            style={{
                              marginLeft: 'auto',
                              transform: isOpen ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s',
                            }}
                        />
                    )}
                  </div>
                  {isOpen && !collapsed && section.children && renderNodes(section.children, 1)}
                </React.Fragment>
            );
          })}
        </div>

        <div className="sidebar-footer">
          © AMER SPORTS KOREA CO.,LTD ALL RIGHTS RESERVED.
        </div>
      </aside>
  );
}
