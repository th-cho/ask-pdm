'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, RotateCcw, Printer, Star, Eye, FileText, Download } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface StyleRow  { id: number; styleCode: string; styleName: string; brand: string; season: string; }
interface HistoryRow { id: number; deployNo: string; deployDate: string; deployType: string; version: string; drafter: string; note: string; }

const FILTER_INIT = { zone: 'WM', brand: '', year: '24', season: '', style: '' };

const MOCK_STYLES: StyleRow[] = [
  { id: 1,  styleCode: 'VOBAL451111', styleName: 'VOBAL451111', brand: 'VOLCOM', season: '24SS' },
  { id: 2,  styleCode: 'VVBEB452241', styleName: 'VVBEB452241', brand: 'VOLCOM', season: '24SS' },
  { id: 3,  styleCode: 'VOBBC451151', styleName: 'VOBBC451151', brand: 'VOLCOM', season: '24SS' },
  { id: 4,  styleCode: 'VOBBC452216', styleName: 'VOBBC452216', brand: 'VOLCOM', season: '24FW' },
  { id: 5,  styleCode: 'VOBBL451111', styleName: 'VOBBL451111', brand: 'VOLCOM', season: '24FW' },
  { id: 6,  styleCode: 'VOBBL451151', styleName: 'VOBBL451151', brand: 'VOLCOM', season: '24FW' },
  { id: 7,  styleCode: 'VOBJN452131', styleName: 'VOBJN452131', brand: 'VOLCOM', season: '24SS' },
  { id: 8,  styleCode: 'VOBJN452141', styleName: 'VOBJN452141', brand: 'VOLCOM', season: '24SS' },
];

const MOCK_HISTORY: HistoryRow[] = [
  { id: 1, deployNo: 'DEP-2024-001', deployDate: '2024-01-15', deployType: '작업지시서',  version: 'v1.0', drafter: '홍길동', note: '최초 배포' },
  { id: 2, deployNo: 'DEP-2024-002', deployDate: '2024-01-22', deployType: '봉제사양서',  version: 'v1.0', drafter: '이철수', note: '봉제사양서 최초 배포' },
  { id: 3, deployNo: 'DEP-2024-003', deployDate: '2024-02-05', deployType: '작업지시서',  version: 'v1.1', drafter: '홍길동', note: '원부자재 수정 후 재배포' },
  { id: 4, deployNo: 'DEP-2024-004', deployDate: '2024-02-18', deployType: '초두QC보고서', version: 'v1.0', drafter: '박영희', note: '초두검사 결과 배포' },
  { id: 5, deployNo: 'DEP-2024-005', deployDate: '2024-03-01', deployType: '작업지시서',  version: 'v1.2', drafter: '홍길동', note: 'SIZE SPEC 수정' },
];

/* 미리보기 Mock Document */
function DeployPreview({ history }: { history: HistoryRow }) {
  return (
    <div style={{ padding: 16, fontSize: 12 }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a5cb8' }}>{history.deployType}</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>{history.deployNo} | {history.version} | {history.deployDate}</div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <tbody>
          {[
            ['배포번호', history.deployNo], ['배포유형', history.deployType],
            ['배포일자', history.deployDate], ['버전', history.version],
            ['기안자', history.drafter], ['비고', history.note],
          ].map(([label, value]) => (
            <tr key={label}>
              <td style={{ padding: '4px 8px', background: '#f1f5f9', fontWeight: 600, border: '1px solid #e2e8f0', width: '35%' }}>{label}</td>
              <td style={{ padding: '4px 8px', border: '1px solid #e2e8f0' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12, padding: 10, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 4, textAlign: 'center', color: '#94a3b8', fontSize: 11 }}>
        [문서 미리보기 영역] — 실제 PDF/출력물 렌더
      </div>
    </div>
  );
}

export default function DeployHistory() {
  const [filter, setFilter]   = useState(FILTER_INIT);
  const [styles, setStyles]   = useState<StyleRow[]>([]);
  const [histories]           = useState<HistoryRow[]>(MOCK_HISTORY);
  const [selectedStyle, setSelectedStyle]   = useState<StyleRow | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<HistoryRow | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/deploy-history');
      const data = await res.json();
      setStyles(data);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { handleSearch(); }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F3') { e.preventDefault(); handleSearch(); }
  }, [handleSearch]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const styleCols = useMemo<ColDef[]>(() => [
    { field: 'styleCode', headerName: '스타일코드', flex: 1 },
    { field: 'brand',     headerName: '브랜드',     width: 80 },
    { field: 'season',    headerName: '시즌',       width: 70 },
  ], []);

  const historyCols = useMemo<ColDef[]>(() => [
    { field: 'deployNo',   headerName: '배포번호',   flex: 1.2 },
    { field: 'deployDate', headerName: '배포일자',   width: 100 },
    { field: 'deployType', headerName: '배포유형',   flex: 1 },
    { field: 'version',    headerName: '버전',       width: 70 },
    { field: 'drafter',    headerName: '기안자',     width: 80 },
    { field: 'note',       headerName: '비고',       flex: 1 },
  ], []);

  const ff = (key: string, val: string) => setFilter(p => ({ ...p, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">배포이력현황 <span className="pdm-page-code">CSA010</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-primary" onClick={handleSearch}><Search size={13} /> 조회 <kbd>F3</kbd></button>
          <button className="pdm-btn pdm-btn-info"><Printer size={13} /> 출력 <kbd>F11</kbd></button>
          <button className="pdm-btn pdm-btn-default"><Download size={13} /> 다운로드</button>
          <button className="pdm-btn pdm-btn-default"><RotateCcw size={13} /> 초기화 <kbd>F12</kbd></button>
        </div>
      </div>

      {/* 필터 */}
      <div className="pdm-filter-bar">
        <label>존</label>
        <select value={filter.zone} onChange={e => ff('zone', e.target.value)}>
          <option value="WM">WM</option><option value="OL">OL</option>
        </select>
        <label>브랜드</label>
        <select value={filter.brand} onChange={e => ff('brand', e.target.value)}>
          <option value="">전체</option><option value="VOLCOM">VOLCOM</option><option value="ARC">ARC'TERYX</option>
        </select>
        <label>년도</label>
        <input style={{ width: 50 }} value={filter.year} onChange={e => ff('year', e.target.value)} />
        <label>시즌</label>
        <select value={filter.season} onChange={e => ff('season', e.target.value)}>
          <option value="">전체</option><option value="SS">SS</option><option value="FW">FW</option>
        </select>
        <label>스타일</label>
        <input style={{ width: 130 }} value={filter.style} onChange={e => ff('style', e.target.value)} placeholder="스타일코드" />
        <button className="pdm-btn pdm-btn-primary" onClick={handleSearch} style={{ marginLeft: 4 }}><Search size={12} /> 조회</button>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, gap: 0 }}>
        {/* 좌측: 스타일 목록 */}
        <div style={{ width: 240, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '6px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Star size={12} color="#1a5cb8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>스타일 목록</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>{styles.length}건</span>
          </div>
          <div className="ag-theme-alpine" style={{ flex: 1 }}>
            <AgGridReact
              rowData={styles} columnDefs={styleCols} loading={loading}
              rowSelection="single" rowHeight={26} headerHeight={28}
              defaultColDef={{ resizable: true, suppressMovable: true }}
              onRowClicked={e => { setSelectedStyle(e.data); setSelectedHistory(null); }}
              getRowStyle={p => p.data?.id === selectedStyle?.id ? { background: '#dbeafe' } : undefined}
            />
          </div>
        </div>

        {/* 가운데: 배포이력 */}
        <div style={{ width: 420, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '6px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Star size={12} color="#1a5cb8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>배포이력</span>
          </div>
          <div className="ag-theme-alpine" style={{ flex: 1 }}>
            <AgGridReact
              rowData={selectedStyle ? histories : []}
              columnDefs={historyCols}
              rowSelection="single" rowHeight={26} headerHeight={28}
              defaultColDef={{ resizable: true, suppressMovable: true }}
              onRowClicked={e => setSelectedHistory(e.data)}
              getRowStyle={p => p.data?.id === selectedHistory?.id ? { background: '#dbeafe' } : undefined}
            />
          </div>
        </div>

        {/* 우측: 미리보기 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '6px 12px 4px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e2e8f0' }}>
            <Eye size={12} color="#1a5cb8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>문서 미리보기</span>
            {selectedHistory && (
              <button className="pdm-btn pdm-btn-info" style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: 11 }}>
                <Printer size={11} /> 인쇄
              </button>
            )}
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {selectedHistory ? (
              <DeployPreview history={selectedHistory} />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                <FileText size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.3 }} />
                <div style={{ textAlign: 'center' }}>배포이력을 선택하면 미리보기가 표시됩니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
