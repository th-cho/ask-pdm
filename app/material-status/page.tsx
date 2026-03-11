'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, RotateCcw, Printer, Star, Download } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface StyleRow { id: number; styleCode: string; styleName: string; brand: string; season: string; }
interface RawRow    { no: number; code: string; name: string; color: string; content: string; spec: string; reqQty: number; unit: string; note: string; }
interface AccRow    { no: number; code: string; name: string; color: string; spec: string; reqQty: number; unit: string; supplier: string; note: string; }
interface FinishRow { no: number; code: string; name: string; color: string; spec: string; reqQty: number; unit: string; supplier: string; note: string; }

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', style: '' };

const MOCK_STYLES: StyleRow[] = [
  { id: 1,  styleCode: 'VOBAL451111', styleName: 'VOBAL451111', brand: 'VOLCOM', season: '24SS' },
  { id: 2,  styleCode: 'VVBEB452241', styleName: 'VVBEB452241', brand: 'VOLCOM', season: '24SS' },
  { id: 3,  styleCode: 'VOBBC451151', styleName: 'VOBBC451151', brand: 'VOLCOM', season: '24SS' },
  { id: 4,  styleCode: 'VOBBC452216', styleName: 'VOBBC452216', brand: 'VOLCOM', season: '24FW' },
  { id: 5,  styleCode: 'VOBBL451111', styleName: 'VOBBL451111', brand: 'VOLCOM', season: '24FW' },
  { id: 6,  styleCode: 'VOBJN452131', styleName: 'VOBJN452131', brand: 'VOLCOM', season: '24SS' },
];

const MOCK_RAW: RawRow[] = [
  { no: 1, code: 'F2024-001', name: '울 혼방 원단', color: 'NVY', content: '울 60% 폴리 40%', spec: '150cm', reqQty: 2.5, unit: 'm', note: '' },
  { no: 2, code: 'F2024-002', name: '폴리 안감',    color: 'NVY', content: '폴리 100%',       spec: '140cm', reqQty: 2.0, unit: 'm', note: '' },
  { no: 3, code: 'F2024-003', name: '접착심지',     color: 'WHT', content: '폴리 100%',       spec: '90cm',  reqQty: 0.5, unit: 'm', note: '' },
];
const MOCK_ACC: AccRow[] = [
  { no: 1, code: 'A2024-001', name: '단추',     color: 'NVY', spec: '18mm',  reqQty: 6,  unit: '개', supplier: '(주)버튼코리아',  note: '' },
  { no: 2, code: 'A2024-002', name: '지퍼',     color: 'NVY', spec: '35cm',  reqQty: 1,  unit: '개', supplier: '(주)YKK코리아',   note: '' },
  { no: 3, code: 'A2024-003', name: '허리밴드', color: 'BLK', spec: '3.5cm', reqQty: 80, unit: 'cm', supplier: '(주)밴드공방',   note: '' },
];
const MOCK_FINISH: FinishRow[] = [
  { no: 1, code: 'FN2024-001', name: '케어라벨',  color: 'WHT', spec: '4x5cm', reqQty: 1, unit: '장', supplier: '(주)라벨텍', note: '' },
  { no: 2, code: 'FN2024-002', name: 'SIZE 라벨', color: 'WHT', spec: '2x3cm', reqQty: 1, unit: '장', supplier: '(주)라벨텍', note: '' },
  { no: 3, code: 'FN2024-003', name: '행텍',      color: 'WHT', spec: '5x10cm', reqQty: 1, unit: '장', supplier: '(주)태그코', note: '' },
];

type TabKey = 'raw' | 'acc' | 'finish';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'raw',    label: '원자재 목록' },
  { key: 'acc',    label: '부자재 목록' },
  { key: 'finish', label: '완성부자재 목록' },
];

export default function MaterialStatus() {
  const [filter, setFilter]   = useState(FILTER_INIT);
  const [styles, setStyles]   = useState<StyleRow[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<StyleRow | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('raw');
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/material-status');
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

  const rawCols = useMemo<ColDef[]>(() => [
    { field: 'no',      headerName: 'No',    width: 50 },
    { field: 'code',    headerName: '원단코드', flex: 1 },
    { field: 'name',    headerName: '원단명',   flex: 1.2 },
    { field: 'color',   headerName: '컬러',     width: 70 },
    { field: 'content', headerName: '혼용율',   flex: 1 },
    { field: 'spec',    headerName: '스펙',     width: 80 },
    { field: 'reqQty',  headerName: '요적량',   width: 80, type: 'numericColumn' },
    { field: 'unit',    headerName: '단위',     width: 60 },
    { field: 'note',    headerName: '비고',     flex: 1 },
  ], []);

  const accCols = useMemo<ColDef[]>(() => [
    { field: 'no',       headerName: 'No',    width: 50 },
    { field: 'code',     headerName: '부자재코드', flex: 1 },
    { field: 'name',     headerName: '부자재명',   flex: 1.2 },
    { field: 'color',    headerName: '컬러',       width: 70 },
    { field: 'spec',     headerName: '스펙',       width: 80 },
    { field: 'reqQty',   headerName: '소요량',     width: 80, type: 'numericColumn' },
    { field: 'unit',     headerName: '단위',       width: 60 },
    { field: 'supplier', headerName: '공급업체',   flex: 1.2 },
    { field: 'note',     headerName: '비고',       flex: 1 },
  ], []);

  const finishCols = useMemo<ColDef[]>(() => [
    { field: 'no',       headerName: 'No',    width: 50 },
    { field: 'code',     headerName: '완성부자재코드', flex: 1 },
    { field: 'name',     headerName: '완성부자재명',   flex: 1.2 },
    { field: 'color',    headerName: '컬러',           width: 70 },
    { field: 'spec',     headerName: '스펙',           width: 80 },
    { field: 'reqQty',   headerName: '소요량',         width: 80, type: 'numericColumn' },
    { field: 'unit',     headerName: '단위',           width: 60 },
    { field: 'supplier', headerName: '공급업체',       flex: 1.2 },
    { field: 'note',     headerName: '비고',           flex: 1 },
  ], []);

  const tabData = selectedStyle
    ? activeTab === 'raw' ? MOCK_RAW : activeTab === 'acc' ? MOCK_ACC : MOCK_FINISH
    : [];
  const tabCols = activeTab === 'raw' ? rawCols : activeTab === 'acc' ? accCols : finishCols;

  const ff = (key: string, val: string) => setFilter(p => ({ ...p, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">요적현황 <span className="pdm-page-code">CSA020</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-primary" onClick={handleSearch}><Search size={13} /> 조회 <kbd>F3</kbd></button>
          <button className="pdm-btn pdm-btn-info"><Printer size={13} /> 출력 <kbd>F11</kbd></button>
          <button className="pdm-btn pdm-btn-default"><Download size={13} /> 엑셀</button>
          <button className="pdm-btn pdm-btn-default"><RotateCcw size={13} /> 초기화 <kbd>F12</kbd></button>
        </div>
      </div>

      {/* 필터 */}
      <div className="pdm-filter-bar">
        <label>브랜드</label>
        <select value={filter.brand} onChange={e => ff('brand', e.target.value)}>
          <option value="">전체</option><option value="S">SALOMON</option><option value="W">WILSON</option><option value="A">ATOMIC</option>
        </select>
        <label>년도</label>
        <input style={{ width: 45 }} value={filter.year} onChange={e => ff('year', e.target.value)} />
        <label>시즌</label>
        <select value={filter.season} onChange={e => ff('season', e.target.value)}>
          <option value="">전체</option><option value="1">Q1</option><option value="2">Q2</option><option value="3">Q3</option><option value="4">Q4</option><option value="S">SS</option><option value="F">FW</option><option value="0">NON</option>
        </select>
        <label>수입구분</label>
        <select value={filter.importType} onChange={e => ff('importType', e.target.value)}>
          <option value="">전체</option><option value="0">국내</option><option value="1">수입</option>
        </select>
        <label>협찬/정산</label>
        <select value={filter.mktType} onChange={e => ff('mktType', e.target.value)}>
          <option value="">전체</option><option value="0">정상판매</option><option value="1">마케팅샘플</option><option value="2">후원</option><option value="3">협찬</option><option value="4">홈쇼핑(남)</option><option value="5">홈쇼핑(여)</option><option value="6">홈쇼핑(유)</option><option value="7">수출</option>
        </select>
        <label>클래스</label>
        <select value={filter.class} onChange={e => ff('class', e.target.value)}>
          <option value="">전체</option><option value="01">의류남성</option><option value="02">의류여성</option><option value="03">의류유니</option><option value="07">신발남성</option><option value="08">신발여성</option><option value="09">신발유니</option><option value="0">NO GEN</option><option value="J">주니어</option>
        </select>
        <label>카테고리</label>
        <select value={filter.category} onChange={e => ff('category', e.target.value)}>
          <option value="">전체</option><option value="H">하이킹</option><option value="S">스포츠스타일</option><option value="W">윈터스포츠</option><option value="R">러닝</option><option value="T">테니스</option><option value="G">골프</option><option value="K">바스켓볼</option><option value="B">베이스볼</option><option value="L">라이프스타일</option><option value="C">축구</option><option value="N">트레이닝</option>
        </select>
        <label>아이템</label>
        <select value={filter.item} onChange={e => ff('item', e.target.value)}>
          <option value="">전체</option><option value="DJ">DOWN JACKET</option><option value="DV">DOWN VEST</option><option value="PJ">PADDED JACKET</option><option value="PV">PADDED VEST</option><option value="VE">VEST</option><option value="JK">JACKET</option><option value="JA">JACKET ANORAK</option><option value="PT">PANTS(WOVEN)</option><option value="PH">PANTS HALF</option><option value="FJ">FLEECE JACKET</option><option value="FA">FLEECE ANORAK</option><option value="FP">FLEECE PANTS</option><option value="HT">HEAVY TOP</option><option value="HD">HOODED</option><option value="TL">T-LONG</option><option value="TS">T-SHORT</option><option value="TW">T-WOVEN</option><option value="SL">SLEEVELESS</option><option value="LL">LEGGINGS-LONG</option><option value="LS">LEGGINGS-SHORTS</option><option value="SK">SKIRT</option><option value="OP">ONEPIECE</option><option value="SJ">SKI JACKET</option><option value="SP">SKI PANTS</option><option value="SH">SHIRTS</option>
        </select>
        <label>스타일</label>
        <input style={{ width: 120 }} value={filter.style} onChange={e => ff('style', e.target.value)} />
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
              rowData={styles} columnDefs={styleCols}
              // loading={loading}
              rowSelection="single" rowHeight={26} headerHeight={28}
              defaultColDef={{ resizable: true, suppressMovable: true }}
              onRowClicked={e => setSelectedStyle(e.data)}
              getRowStyle={p => p.data?.id === selectedStyle?.id ? { background: '#dbeafe' } : undefined}
            />
          </div>
        </div>

        {/* 우측: 탭 + 목록 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 8px', minWidth: 0 }}>
          {/* 탭 */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 6, borderBottom: '1px solid #e2e8f0' }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '5px 14px', fontSize: 12, fontWeight: activeTab === tab.key ? 600 : 400,
                  border: 'none', borderBottom: activeTab === tab.key ? '2px solid #1a5cb8' : '2px solid transparent',
                  color: activeTab === tab.key ? '#1a5cb8' : '#64748b',
                  background: 'transparent', cursor: 'pointer', marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="ag-theme-alpine" style={{ flex: 1 }}>
            <AgGridReact
              rowData={tabData} columnDefs={tabCols}
              rowHeight={28} headerHeight={30}
              defaultColDef={{ resizable: true, sortable: true, suppressMovable: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
