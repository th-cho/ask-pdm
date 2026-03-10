'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, CheckCircle2, XCircle, RotateCcw, Star, Info } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface ApprovalRow {
  id: number; reqNo: string; bizType: string; reqDate: string;
  drafter: string; zone: string; brand: string; styleCode: string;
  title: string; step: string; status: string; approver: string;
}

const FILTER_INIT = {
  bizType: '', dateFrom: '2024-03-01', dateTo: '2024-03-31',
  drafter: '', zone: '', brand: '', status: '',
};

const MOCK_ROWS: ApprovalRow[] = [
  { id:1,  reqNo:'RQA-2024-0001', bizType:'원단구매의뢰', reqDate:'2024-03-01', drafter:'홍길동', zone:'WM', brand:'VOLCOM', styleCode:'VOBAL451111', title:'24SS 원단구매의뢰', step:'2차승인', status:'결재중',  approver:'김부장' },
  { id:2,  reqNo:'RQA-2024-0002', bizType:'원단구매의뢰', reqDate:'2024-03-03', drafter:'이철수', zone:'WM', brand:'VOLCOM', styleCode:'VVBEB452241', title:'24SS 원단구매의뢰', step:'1차승인', status:'결재중',  approver:'이과장' },
  { id:3,  reqNo:'RQB-2024-0001', bizType:'상품사입의뢰', reqDate:'2024-03-05', drafter:'박영희', zone:'OL', brand:'VOLCOM', styleCode:'VOBBC451151', title:'24SS 상품사입의뢰', step:'최종승인', status:'결재중',  approver:'박상무' },
  { id:4,  reqNo:'RQB-2024-0002', bizType:'상품사입의뢰', reqDate:'2024-03-07', drafter:'홍길동', zone:'OL', brand:'VOLCOM', styleCode:'VOBBC452216', title:'24FW 상품사입의뢰', step:'1차승인', status:'결재중',  approver:'김부장' },
  { id:5,  reqNo:'RQA-2024-0003', bizType:'원단구매의뢰', reqDate:'2024-03-10', drafter:'이철수', zone:'WM', brand:'ARC',    styleCode:'ARCFF451111', title:'24FW 원단구매의뢰', step:'2차승인', status:'결재중',  approver:'이과장' },
  { id:6,  reqNo:'RQB-2024-0003', bizType:'상품사입의뢰', reqDate:'2024-03-12', drafter:'박영희', zone:'AC', brand:'ARC',    styleCode:'ARCBL451211', title:'24SS 상품사입의뢰', step:'최종승인', status:'결재중',  approver:'박상무' },
  { id:7,  reqNo:'RQA-2024-0004', bizType:'원단구매의뢰', reqDate:'2024-03-14', drafter:'홍길동', zone:'WM', brand:'VOLCOM', styleCode:'VOBBL451251', title:'24SS 원단구매의뢰', step:'1차승인', status:'결재중',  approver:'김부장' },
  { id:8,  reqNo:'RQB-2024-0004', bizType:'상품사입의뢰', reqDate:'2024-03-15', drafter:'이철수', zone:'OL', brand:'VOLCOM', styleCode:'VOBBL452131', title:'24FW 상품사입의뢰', step:'2차승인', status:'결재중',  approver:'이과장' },
];

export default function BulkApproval() {
  const [filter, setFilter]   = useState(FILTER_INIT);
  const [rowData, setRowData] = useState<ApprovalRow[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/bulk-approval');
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

  const handleApprove = () => {
    if (selected.size === 0) { alert('결재할 항목을 선택하세요.'); return; }
    if (!confirm(`선택한 ${selected.size}건을 일괄 승인하시겠습니까?`)) return;
    alert('일괄 승인 처리되었습니다.');
  };

  const handleReject = () => {
    if (selected.size === 0) { alert('반려할 항목을 선택하세요.'); return; }
    if (!comment.trim()) { alert('반려 의견을 입력하세요.'); return; }
    if (!confirm(`선택한 ${selected.size}건을 반려하시겠습니까?`)) return;
    alert('반려 처리되었습니다.');
  };

  const colDefs = useMemo<ColDef[]>(() => [
    { field: '_check', headerName: '', width: 50, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'bizType',   headerName: '업무구분',   width: 110 },
    { field: 'reqNo',     headerName: '의뢰번호',   flex: 1.2 },
    { field: 'title',     headerName: '제목',       flex: 1.5 },
    { field: 'reqDate',   headerName: '의뢰일자',   width: 100 },
    { field: 'drafter',   headerName: '기안자',     width: 80 },
    { field: 'zone',      headerName: '존',         width: 60 },
    { field: 'brand',     headerName: '브랜드',     width: 80 },
    { field: 'styleCode', headerName: '스타일코드', flex: 1.2 },
    { field: 'step',      headerName: '결재단계',   width: 90 },
    { field: 'approver',  headerName: '결재자',     width: 80 },
    {
      field: 'status', headerName: '상태', width: 90,
      cellRenderer: (p: any) => (
        <span style={{ color: '#d97706', fontWeight: 600, fontSize: 12 }}>{p.value}</span>
      ),
    },
  ], []);

  const ff = (key: string, val: string) => setFilter(p => ({ ...p, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">일괄결재처리 <span className="pdm-page-code">RQB020</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-primary" onClick={handleSearch}><Search size={13} /> 조회 <kbd>F3</kbd></button>
          <button className="pdm-btn pdm-btn-success" onClick={handleApprove}><CheckCircle2 size={13} /> 일괄승인</button>
          <button className="pdm-btn pdm-btn-danger"  onClick={handleReject}><XCircle size={13} /> 일괄반려</button>
          <button className="pdm-btn pdm-btn-default"><RotateCcw size={13} /> 초기화 <kbd>F12</kbd></button>
        </div>
      </div>

      {/* 필터 */}
      <div className="pdm-filter-bar" style={{ flexWrap: 'wrap', gap: 6 }}>
        <label>업무구분</label>
        <select value={filter.bizType} onChange={e => ff('bizType', e.target.value)}>
          <option value="">전체</option><option value="원단구매의뢰">원단구매의뢰</option><option value="상품사입의뢰">상품사입의뢰</option>
        </select>
        <label>기간</label>
        <input type="date" value={filter.dateFrom} onChange={e => ff('dateFrom', e.target.value)} style={{ width: 120 }} />
        <span>~</span>
        <input type="date" value={filter.dateTo}   onChange={e => ff('dateTo', e.target.value)}   style={{ width: 120 }} />
        <label>기안자</label>
        <input style={{ width: 80 }} value={filter.drafter} onChange={e => ff('drafter', e.target.value)} />
        <label>존</label>
        <select value={filter.zone} onChange={e => ff('zone', e.target.value)}>
          <option value="">전체</option><option value="WM">WM</option><option value="OL">OL</option><option value="AC">AC</option>
        </select>
        <label>브랜드</label>
        <select value={filter.brand} onChange={e => ff('brand', e.target.value)}>
          <option value="">전체</option><option value="VOLCOM">VOLCOM</option><option value="ARC">ARC'TERYX</option>
        </select>
        <button className="pdm-btn pdm-btn-primary" onClick={handleSearch}><Search size={12} /> 조회</button>
      </div>

      {/* 반려 의견 입력 */}
      <div style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 8, background: '#fff7ed', borderBottom: '1px solid #fed7aa' }}>
        <Info size={13} color="#d97706" />
        <span style={{ fontSize: 12, color: '#92400e', fontWeight: 500 }}>반려 의견</span>
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="반려 시 의견을 입력하세요"
          style={{ flex: 1, fontSize: 12, padding: '3px 8px', border: '1px solid #fed7aa', borderRadius: 4 }}
        />
        <span style={{ fontSize: 11, color: '#64748b' }}>선택: {selected.size}건</span>
      </div>

      {/* 목록 */}
      <div style={{ flex: 1, padding: '6px 12px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Star size={12} color="#1a5cb8" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>발주의뢰 목록 (결재 대기)</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>{rowData.length}건</span>
        </div>
        <div className="ag-theme-alpine" style={{ flex: 1 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            // loading={loading}
            rowSelection="multiple"
            defaultColDef={{ resizable: true, sortable: true, suppressMovable: true }}
            rowHeight={28} headerHeight={30}
            onSelectionChanged={e => {
              const nodes = e.api.getSelectedNodes();
              setSelected(new Set(nodes.map((n: any) => n.data.id)));
            }}
          />
        </div>
      </div>
    </div>
  );
}
