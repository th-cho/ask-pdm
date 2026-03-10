'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Plus, Save, Trash2, RotateCcw, Printer, Star, Info } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface RequestRow {
  id: number; reqNo: string; reqDate: string; brand: string; season: string;
  styleCode: string; fabricCode: string; fabricName: string; color: string;
  reqQty: number; unit: string; status: string; drafter: string;
}

interface DetailRow {
  no: number; fabricCode: string; fabricName: string; color: string;
  content: string; spec: string; reqQty: number; unit: string; note: string;
}

const FILTER_INIT = { zone: 'WM', brand: '', year: '24', season: '', reqNo: '', status: '' };

const MOCK_REQUESTS: RequestRow[] = [
  { id: 1,  reqNo: 'RQA-2024-0001', reqDate: '2024-03-01', brand: 'VOLCOM', season: '24SS', styleCode: 'VOBAL451111', fabricCode: 'F2024-001', fabricName: '울 혼방 원단', color: 'NVY', reqQty: 200, unit: 'm', status: '승인완료', drafter: '홍길동' },
  { id: 2,  reqNo: 'RQA-2024-0002', reqDate: '2024-03-03', brand: 'VOLCOM', season: '24SS', styleCode: 'VVBEB452241', fabricCode: 'F2024-002', fabricName: '폴리 안감', color: 'BLK', reqQty: 150, unit: 'm', status: '결재중', drafter: '이철수' },
  { id: 3,  reqNo: 'RQA-2024-0003', reqDate: '2024-03-05', brand: 'VOLCOM', season: '24SS', styleCode: 'VOBBC451151', fabricCode: 'F2024-003', fabricName: '코튼 원단', color: 'WHT', reqQty: 300, unit: 'm', status: '임시저장', drafter: '박영희' },
  { id: 4,  reqNo: 'RQA-2024-0004', reqDate: '2024-03-07', brand: 'VOLCOM', season: '24FW', styleCode: 'VOBBC452216', fabricCode: 'F2024-004', fabricName: '나일론 원단', color: 'RED', reqQty: 250, unit: 'm', status: '승인완료', drafter: '홍길동' },
  { id: 5,  reqNo: 'RQA-2024-0005', reqDate: '2024-03-10', brand: 'VOLCOM', season: '24FW', styleCode: 'VOBBL451111', fabricCode: 'F2024-005', fabricName: '데님 원단', color: 'IND', reqQty: 180, unit: 'm', status: '결재반려', drafter: '이철수' },
  { id: 6,  reqNo: 'RQA-2024-0006', reqDate: '2024-03-12', brand: 'VOLCOM', season: '24FW', styleCode: 'VOBBL451151', fabricCode: 'F2024-006', fabricName: '린넨 원단', color: 'BEG', reqQty: 120, unit: 'm', status: '승인완료', drafter: '박영희' },
  { id: 7,  reqNo: 'RQA-2024-0007', reqDate: '2024-03-14', brand: 'VOLCOM', season: '24SS', styleCode: 'VOBBL451211', fabricCode: 'F2024-007', fabricName: '스판 원단', color: 'GRY', reqQty: 90,  unit: 'm', status: '임시저장', drafter: '홍길동' },
  { id: 8,  reqNo: 'RQA-2024-0008', reqDate: '2024-03-15', brand: 'VOLCOM', season: '24SS', styleCode: 'VOBJN452131', fabricCode: 'F2024-008', fabricName: '트위드 원단', color: 'CHK', reqQty: 200, unit: 'm', status: '결재중', drafter: '이철수' },
];

const MOCK_DETAIL: DetailRow[] = [
  { no: 1, fabricCode: 'F2024-001', fabricName: '울 혼방 원단', color: 'NVY', content: '울 60% 폴리 40%', spec: '150cm', reqQty: 100, unit: 'm', note: '' },
  { no: 2, fabricCode: 'F2024-002', fabricName: '울 혼방 원단', color: 'BLK', content: '울 60% 폴리 40%', spec: '150cm', reqQty: 100, unit: 'm', note: '색상 변경 검토 필요' },
];

const STATUS_COLOR: Record<string, string> = {
  '승인완료': '#16a34a', '결재중': '#d97706', '결재반려': '#dc2626', '임시저장': '#6b7280',
};

export default function FabricRequest() {
  const [filter, setFilter] = useState(FILTER_INIT);
  const [rowData, setRowData] = useState<RequestRow[]>([]);
  const [selected, setSelected] = useState<RequestRow | null>(null);
  const [detailRows] = useState<DetailRow[]>(MOCK_DETAIL);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/fabric-request');
      const data = await res.json();
      setRowData(data);
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

  const listCols = useMemo<ColDef[]>(() => [
    { field: 'reqNo',       headerName: '의뢰번호',   flex: 1.2 },
    { field: 'reqDate',     headerName: '의뢰일자',   width: 100 },
    { field: 'brand',       headerName: '브랜드',     width: 80 },
    { field: 'season',      headerName: '시즌',       width: 70 },
    { field: 'styleCode',   headerName: '스타일코드', flex: 1.2 },
    { field: 'fabricCode',  headerName: '원단코드',   width: 110 },
    { field: 'fabricName',  headerName: '원단명',     flex: 1 },
    { field: 'color',       headerName: '컬러',       width: 70 },
    { field: 'reqQty',      headerName: '의뢰량',     width: 80, type: 'numericColumn' },
    { field: 'unit',        headerName: '단위',       width: 60 },
    {
      field: 'status', headerName: '상태', width: 90,
      cellRenderer: (p: any) => (
        <span style={{ color: STATUS_COLOR[p.value] ?? '#334155', fontWeight: 600, fontSize: 12 }}>{p.value}</span>
      ),
    },
    { field: 'drafter', headerName: '기안자', width: 80 },
  ], []);

  const detailCols = useMemo<ColDef[]>(() => [
    { field: 'no',          headerName: 'No',    width: 50 },
    { field: 'fabricCode',  headerName: '원단코드', flex: 1 },
    { field: 'fabricName',  headerName: '원단명',   flex: 1.2 },
    { field: 'color',       headerName: '컬러',     width: 70 },
    { field: 'content',     headerName: '혼용율',   flex: 1 },
    { field: 'spec',        headerName: '스펙',     width: 80 },
    { field: 'reqQty',      headerName: '의뢰량',   width: 80, type: 'numericColumn' },
    { field: 'unit',        headerName: '단위',     width: 60 },
    { field: 'note',        headerName: '비고',     flex: 1 },
  ], []);

  const ff = (key: string, val: string) => setFilter(p => ({ ...p, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', fontFamily: 'inherit' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">원단구매의뢰 <span className="pdm-page-code">RQA010</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-primary" onClick={handleSearch}><Search size={13} /> 조회 <kbd>F3</kbd></button>
          <button className="pdm-btn pdm-btn-default"><Plus size={13} /> 신규 <kbd>F4</kbd></button>
          <button className="pdm-btn pdm-btn-success"><Save size={13} /> 저장 <kbd>F9</kbd></button>
          <button className="pdm-btn pdm-btn-danger"><Trash2 size={13} /> 삭제 <kbd>F5</kbd></button>
          <button className="pdm-btn pdm-btn-info"><Printer size={13} /> 출력 <kbd>F11</kbd></button>
          <button className="pdm-btn pdm-btn-default"><RotateCcw size={13} /> 초기화 <kbd>F12</kbd></button>
        </div>
      </div>

      {/* 필터 */}
      <div className="pdm-filter-bar">
        <label>존</label>
        <select value={filter.zone} onChange={e => ff('zone', e.target.value)}>
          <option value="WM">WM</option><option value="OL">OL</option><option value="AC">AC</option>
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
        <label>의뢰번호</label>
        <input style={{ width: 130 }} value={filter.reqNo} onChange={e => ff('reqNo', e.target.value)} placeholder="RQA-2024-" />
        <label>상태</label>
        <select value={filter.status} onChange={e => ff('status', e.target.value)}>
          <option value="">전체</option><option value="임시저장">임시저장</option><option value="결재중">결재중</option>
          <option value="승인완료">승인완료</option><option value="결재반려">결재반려</option>
        </select>
        <button className="pdm-btn pdm-btn-primary" onClick={handleSearch} style={{ marginLeft: 4 }}>
          <Search size={12} /> 조회
        </button>
      </div>

      {/* 목록 */}
      <div style={{ padding: '0 12px 6px', flex: '0 0 280px', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Star size={12} color="#1a5cb8" /><span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>원단구매의뢰 목록</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>{rowData.length}건</span>
        </div>
        <div className="ag-theme-alpine" style={{ height: 240 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={listCols}
            loading={loading}
            rowSelection="single"
            defaultColDef={{ resizable: true, sortable: true, suppressMovable: true, fontSize: 12 }}
            rowHeight={28} headerHeight={30}
            onRowClicked={e => setSelected(e.data)}
            getRowStyle={p => p.data?.id === selected?.id ? { background: '#dbeafe' } : undefined}
          />
        </div>
      </div>

      {/* 상세 */}
      {selected && (
        <div style={{ flex: 1, padding: '0 12px 8px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          {/* 헤더 정보 */}
          <div className="pdm-detail-section">
            <div className="pdm-section-title"><Info size={12} /> 의뢰 정보</div>
            <div className="pdm-form-grid">
              <div className="pdm-form-row">
                <label>의뢰번호</label><input readOnly value={selected.reqNo} />
                <label>의뢰일자</label><input readOnly value={selected.reqDate} />
                <label>상태</label>
                <input readOnly value={selected.status} style={{ color: STATUS_COLOR[selected.status], fontWeight: 600 }} />
                <label>기안자</label><input readOnly value={selected.drafter} />
              </div>
              <div className="pdm-form-row">
                <label>브랜드</label><input readOnly value={selected.brand} />
                <label>시즌</label><input readOnly value={selected.season} />
                <label>스타일코드</label><input readOnly value={selected.styleCode} style={{ flex: 2 }} />
              </div>
            </div>
          </div>

          {/* 명세 그리드 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Star size={12} color="#1a5cb8" /><span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>원단 명세</span>
              <button className="pdm-btn pdm-btn-default" style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: 11 }}><Plus size={11} /> 행 추가</button>
            </div>
            <div className="ag-theme-alpine" style={{ flex: 1 }}>
              <AgGridReact
                rowData={detailRows}
                columnDefs={detailCols}
                defaultColDef={{ resizable: true, sortable: true, suppressMovable: true }}
                rowHeight={28} headerHeight={30}
              />
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
          목록에서 의뢰 건을 선택하세요.
        </div>
      )}
    </div>
  );
}
