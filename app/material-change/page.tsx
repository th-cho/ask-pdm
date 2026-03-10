'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, RotateCcw, Printer, Star, Download, ArrowRight } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface StyleRow  { id: number; styleCode: string; brand: string; season: string; }
interface ChangeRow {
  id: number; changeNo: string; changeDate: string; changeType: string;
  materialCode: string; materialName: string; color: string;
  beforeValue: string; afterValue: string; drafter: string; reason: string;
}

const FILTER_INIT = { zone: 'WM', brand: '', year: '24', season: '', style: '', changeType: '' };

const MOCK_STYLES: StyleRow[] = [
  { id: 1,  styleCode: 'VOBAL451111', brand: 'VOLCOM', season: '24SS' },
  { id: 2,  styleCode: 'VVBEB452241', brand: 'VOLCOM', season: '24SS' },
  { id: 3,  styleCode: 'VOBBC451151', brand: 'VOLCOM', season: '24SS' },
  { id: 4,  styleCode: 'VOBBC452216', brand: 'VOLCOM', season: '24FW' },
  { id: 5,  styleCode: 'VOBBL451111', brand: 'VOLCOM', season: '24FW' },
  { id: 6,  styleCode: 'VOBJN452131', brand: 'VOLCOM', season: '24SS' },
];

const MOCK_CHANGES: ChangeRow[] = [
  { id: 1, changeNo: 'CHG-2024-001', changeDate: '2024-02-05', changeType: '원단변경',    materialCode: 'F2024-001', materialName: '겉감 원단',   color: 'NVY', beforeValue: '울 60% 폴리 40%', afterValue: '울 70% 폴리 30%',  drafter: '홍길동', reason: '품질 개선' },
  { id: 2, changeNo: 'CHG-2024-002', changeDate: '2024-02-10', changeType: '컬러변경',    materialCode: 'F2024-002', materialName: '안감',        color: 'NVY', beforeValue: 'NVY',             afterValue: 'BLK',              drafter: '이철수', reason: '디자인 변경' },
  { id: 3, changeNo: 'CHG-2024-003', changeDate: '2024-02-18', changeType: '소요량변경',  materialCode: 'A2024-001', materialName: '단추',        color: 'NVY', beforeValue: '5개',             afterValue: '6개',              drafter: '박영희', reason: '디자인 수정' },
  { id: 4, changeNo: 'CHG-2024-004', changeDate: '2024-02-25', changeType: '공급업체변경', materialCode: 'A2024-002', materialName: '지퍼',       color: 'NVY', beforeValue: '(주)구식지퍼',    afterValue: '(주)YKK코리아',    drafter: '홍길동', reason: '단가 절감' },
  { id: 5, changeNo: 'CHG-2024-005', changeDate: '2024-03-02', changeType: '스펙변경',    materialCode: 'F2024-003', materialName: '접착심지',    color: 'WHT', beforeValue: '90cm',            afterValue: '110cm',            drafter: '이철수', reason: '원단폭 변경' },
];

const CHANGE_TYPE_COLOR: Record<string, string> = {
  '원단변경': '#1a5cb8', '컬러변경': '#16a34a', '소요량변경': '#d97706', '공급업체변경': '#7c3aed', '스펙변경': '#dc2626',
};

export default function MaterialChange() {
  const [filter, setFilter]   = useState(FILTER_INIT);
  const [styles, setStyles]   = useState<StyleRow[]>([]);
  const [changes]             = useState<ChangeRow[]>(MOCK_CHANGES);
  const [selectedStyle, setSelectedStyle] = useState<StyleRow | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/material-change');
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

  const changeCols = useMemo<ColDef[]>(() => [
    { field: 'changeNo',   headerName: '변경번호',   flex: 1 },
    { field: 'changeDate', headerName: '변경일자',   width: 100 },
    {
      field: 'changeType', headerName: '변경유형', width: 110,
      cellRenderer: (p: any) => (
        <span style={{ color: CHANGE_TYPE_COLOR[p.value] ?? '#334155', fontWeight: 600, fontSize: 11 }}>{p.value}</span>
      ),
    },
    { field: 'materialCode', headerName: '자재코드',   flex: 1 },
    { field: 'materialName', headerName: '자재명',     flex: 1.2 },
    { field: 'color',        headerName: '컬러',       width: 70 },
    {
      headerName: '변경전', field: 'beforeValue', flex: 1,
      cellRenderer: (p: any) => <span style={{ color: '#dc2626' }}>{p.value}</span>,
    },
    {
      headerName: '', field: '_arrow', width: 30,
      cellRenderer: () => <ArrowRight size={12} color="#64748b" />,
    },
    {
      headerName: '변경후', field: 'afterValue', flex: 1,
      cellRenderer: (p: any) => <span style={{ color: '#16a34a', fontWeight: 500 }}>{p.value}</span>,
    },
    { field: 'drafter', headerName: '수정자', width: 80 },
    { field: 'reason',  headerName: '변경사유', flex: 1.2 },
  ], []);

  const ff = (key: string, val: string) => setFilter(p => ({ ...p, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">원부자재변경현황 <span className="pdm-page-code">CSA030</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-primary" onClick={handleSearch}><Search size={13} /> 조회 <kbd>F3</kbd></button>
          <button className="pdm-btn pdm-btn-info"><Printer size={13} /> 출력 <kbd>F11</kbd></button>
          <button className="pdm-btn pdm-btn-default"><Download size={13} /> 엑셀</button>
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
          <option value="">전체</option><option value="VOLCOM">VOLCOM</option>
        </select>
        <label>년도</label>
        <input style={{ width: 50 }} value={filter.year} onChange={e => ff('year', e.target.value)} />
        <label>시즌</label>
        <select value={filter.season} onChange={e => ff('season', e.target.value)}>
          <option value="">전체</option><option value="SS">SS</option><option value="FW">FW</option>
        </select>
        <label>스타일</label>
        <input style={{ width: 130 }} value={filter.style} onChange={e => ff('style', e.target.value)} />
        <label>변경유형</label>
        <select value={filter.changeType} onChange={e => ff('changeType', e.target.value)}>
          <option value="">전체</option>
          <option value="원단변경">원단변경</option><option value="컬러변경">컬러변경</option>
          <option value="소요량변경">소요량변경</option><option value="공급업체변경">공급업체변경</option>
          <option value="스펙변경">스펙변경</option>
        </select>
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
              onRowClicked={e => setSelectedStyle(e.data)}
              getRowStyle={p => p.data?.id === selectedStyle?.id ? { background: '#dbeafe' } : undefined}
            />
          </div>
        </div>

        {/* 우측: 변경이력 그리드 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 8px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Star size={12} color="#1a5cb8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>수정내역 그리드</span>
            {selectedStyle && <span style={{ fontSize: 11, color: '#64748b' }}>({selectedStyle.styleCode})</span>}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>{selectedStyle ? changes.length : 0}건</span>
          </div>
          <div className="ag-theme-alpine" style={{ flex: 1 }}>
            <AgGridReact
              rowData={selectedStyle ? changes : []}
              columnDefs={changeCols}
              rowHeight={28} headerHeight={30}
              defaultColDef={{ resizable: true, sortable: true, suppressMovable: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
