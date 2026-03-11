'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Search, Copy, RotateCcw, Info } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface StyleRow { id: number; styleCode: string; styleName: string; repStyleCode: string; designerNo: string; designerName: string; }

interface TreeItem { id: string; label: string; checked: boolean; children?: TreeItem[]; }

const COPY_TREE: TreeItem[] = [
  { id: 'basic', label: '제품기본정보', checked: false, children: [
    { id: 'basic1', label: '제품명#1', checked: false },
    { id: 'basic2', label: '제품명#2', checked: false },
    { id: 'basic3', label: '낱장주문 여 여부', checked: false },
    { id: 'basic4', label: '발인시', checked: false },
    { id: 'basic5', label: '단가(SET)', checked: false },
  ]},
  { id: 'color', label: '색상존재(구분)', checked: false },
  { id: 'digital', label: '디지털컨텐츠', checked: false, children: [
    { id: 'dig1', label: '디자인도', checked: false },
    { id: 'dig2', label: '디자인설명', checked: false },
    { id: 'dig3', label: '라벨 및 자수', checked: false },
  ]},
  { id: 'fabric', label: '원부자재레퍼', checked: false },
  { id: 'sizespec', label: 'SIZE SPEC', checked: false },
  { id: 'order1', label: '수주관련정보', checked: false },
  { id: 'order2', label: '수주관련정보2', checked: false },
  { id: 'qc', label: 'QC', checked: false, children: [
    { id: 'qc1', label: '백업QC', checked: false },
    { id: 'qc2', label: '초두QC', checked: false },
  ]},
];

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', style: '', repStyle: '', designer: '' };

function TreeNode({ item, onToggle }: { item: TreeItem; onToggle: (id: string) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', cursor: 'pointer' }} onClick={() => onToggle(item.id)}>
        <input type="checkbox" checked={item.checked} onChange={() => {}} style={{ cursor: 'pointer' }} />
        <span style={{ fontSize: '12px', color: '#374151' }}>{item.label}</span>
      </div>
      {item.children && (
        <div style={{ marginLeft: 20 }}>
          {item.children.map(c => <TreeNode key={c.id} item={c} onToggle={onToggle} />)}
        </div>
      )}
    </div>
  );
}

export default function StyleCopy() {
  const [filter, setFilter]   = useState(FILTER_INIT);
  const [rowData, setRowData] = useState<StyleRow[]>([]);
  const [selStyle, setSelStyle] = useState<StyleRow | null>(null);
  const [tree, setTree]       = useState<TreeItem[]>(COPY_TREE);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/style-copy');
      const data = await res.json();
      setRowData(data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { handleSearch(); }, []);

  const toggleTree = useCallback((id: string) => {
    const toggle = (items: TreeItem[]): TreeItem[] =>
      items.map(it => it.id === id
        ? { ...it, checked: !it.checked, children: it.children?.map(c => ({ ...c, checked: !it.checked })) }
        : { ...it, children: it.children ? toggle(it.children) : undefined }
      );
    setTree(toggle);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!selStyle) { alert('복사할 스타일을 선택하세요.'); return; }
    alert(`[${selStyle.styleCode}] 스타일 복사가 완료되었습니다.`);
  }, [selStyle]);

  const handleInit = useCallback(() => { setFilter(FILTER_INIT); setRowData([]); setSelStyle(null); setTree(COPY_TREE); }, []);
  const setF = (k: keyof typeof FILTER_INIT) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(f => ({ ...f, [k]: e.target.value }));

  const colDefs = useMemo<ColDef[]>(() => [
    { field: 'styleCode',    headerName: '스타일코드',    flex: 1 },
    { field: 'styleName',    headerName: '스타일명',      flex: 1 },
    { field: 'repStyleCode', headerName: '대표스타일코드', flex: 1 },
    { field: 'designerNo',   headerName: '디자이너사번',  width: 110 },
    { field: 'designerName', headerName: '디자이너명',    width: 90 },
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, sortable: true }), []);

  return (
    <div className="pdm-page">
      <div className="pdm-title-bar">
        <h5 className="pdm-title">스타일복사 (CMB050)</h5>
        <div className="pdm-actions">
          <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /> 조회[F7]</button>
          <button className="btn-pdm-action" onClick={handleCopy}   disabled={loading}><Copy size={13} /> 복사</button>
          <button className="btn-pdm-action" onClick={handleInit}   disabled={loading}><RotateCcw size={13} /> 초기화[F12]</button>
          <button className="btn-pdm-action" style={{ borderColor: 'transparent' }}><Info size={13} /></button>
        </div>
      </div>

      <div className="pdm-filter-bar" style={{ flexWrap: 'nowrap', gap: 4 }}>
        <span className="pdm-filter-label">브랜드</span>
        <select className="form-select form-select-sm" style={{ width: 90 }} value={filter.brand} onChange={setF('brand')}>
          <option value="">전체</option><option value="S">SALOMON</option><option value="W">WILSON</option><option value="A">ATOMIC</option>
        </select>
        <span className="pdm-filter-label">년도</span>
        <input className="form-control form-control-sm" style={{ width: 45 }} value={filter.year} onChange={setF('year')} />
        <span className="pdm-filter-label">시즌</span>
        <select className="form-select form-select-sm" style={{ width: 70 }} value={filter.season} onChange={setF('season')}>
          <option value="">전체</option><option value="1">Q1</option><option value="2">Q2</option><option value="3">Q3</option><option value="4">Q4</option><option value="S">SS</option><option value="F">FW</option><option value="0">NON</option>
        </select>
        <span className="pdm-filter-label">수입구분</span>
        <select className="form-select form-select-sm" style={{ width: 80 }} value={filter.importType} onChange={setF('importType')}>
          <option value="">전체</option><option value="0">국내</option><option value="1">수입</option>
        </select>
        <span className="pdm-filter-label">협찬/정산</span>
        <select className="form-select form-select-sm" style={{ width: 100 }} value={filter.mktType} onChange={setF('mktType')}>
          <option value="">전체</option><option value="0">정상판매</option><option value="1">마케팅샘플</option><option value="2">후원</option><option value="3">협찬</option><option value="4">홈쇼핑(남)</option><option value="5">홈쇼핑(여)</option><option value="6">홈쇼핑(유)</option><option value="7">수출</option>
        </select>
        <span className="pdm-filter-label">클래스</span>
        <select className="form-select form-select-sm" style={{ width: 100 }} value={filter.class} onChange={setF('class')}>
          <option value="">전체</option><option value="01">의류남성</option><option value="02">의류여성</option><option value="03">의류유니</option><option value="07">신발남성</option><option value="08">신발여성</option><option value="09">신발유니</option><option value="0">NO GEN</option><option value="J">주니어</option>
        </select>
        <span className="pdm-filter-label">카테고리</span>
        <select className="form-select form-select-sm" style={{ width: 100 }} value={filter.category} onChange={setF('category')}>
          <option value="">전체</option><option value="H">하이킹</option><option value="S">스포츠스타일</option><option value="W">윈터스포츠</option><option value="R">러닝</option><option value="T">테니스</option><option value="G">골프</option><option value="K">바스켓볼</option><option value="B">베이스볼</option><option value="L">라이프스타일</option><option value="C">축구</option><option value="N">트레이닝</option>
        </select>
        <span className="pdm-filter-label">아이템</span>
        <select className="form-select form-select-sm" style={{ width: 120 }} value={filter.item} onChange={setF('item')}>
          <option value="">전체</option><option value="DJ">DOWN JACKET</option><option value="DV">DOWN VEST</option><option value="PJ">PADDED JACKET</option><option value="PV">PADDED VEST</option><option value="VE">VEST</option><option value="JK">JACKET</option><option value="JA">JACKET ANORAK</option><option value="PT">PANTS(WOVEN)</option><option value="PH">PANTS HALF</option><option value="FJ">FLEECE JACKET</option><option value="FA">FLEECE ANORAK</option><option value="FP">FLEECE PANTS</option><option value="HT">HEAVY TOP</option><option value="HD">HOODED</option><option value="TL">T-LONG</option><option value="TS">T-SHORT</option><option value="TW">T-WOVEN</option><option value="SL">SLEEVELESS</option><option value="LL">LEGGINGS-LONG</option><option value="LS">LEGGINGS-SHORTS</option><option value="SK">SKIRT</option><option value="OP">ONEPIECE</option><option value="SJ">SKI JACKET</option><option value="SP">SKI PANTS</option><option value="SH">SHIRTS</option>
        </select>
        <span className="pdm-filter-label">두자리코드</span>
        <input className="form-control form-control-sm" style={{ width: 55 }} value={filter.itemCode} onChange={setF('itemCode')} placeholder="00" />
        <span className="pdm-filter-label">스타일코드</span>
        <input className="form-control form-control-sm" style={{ width: 110 }} value={filter.style} onChange={setF('style')} />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">대표스타일코드</span>
        <input className="form-control form-control-sm" style={{ width: 110 }} value={filter.repStyle} onChange={setF('repStyle')} />
        <button className="pdm-lookup-btn">?</button>
        <span className="pdm-filter-label">디자이너</span>
        <input className="form-control form-control-sm" style={{ width: 80 }} value={filter.designer} onChange={setF('designer')} />
        <button className="pdm-lookup-btn">?</button>
        <button className="btn-pdm-action" onClick={handleSearch} disabled={loading}><Search size={13} /></button>
      </div>

      <div className="pdm-content">
        {/* 스타일 목록 */}
        <div className="pdm-panel" style={{ width: '55%' }}>
          <div className="pdm-panel-header">스타일 목록</div>
          <div className="pdm-panel-body">
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                rowSelection="single"
                onRowSelected={e => { if (e.node.isSelected()) setSelStyle(e.data); }}
              />
            </div>
          </div>
        </div>

        <div className="pdm-divider" />

        {/* 대상 스타일 정보 */}
        <div className="pdm-panel" style={{ flex: 1 }}>
          <div className="pdm-panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>대상 스타일 정보</span>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>대상구가</span>
          </div>
          <div className="pdm-panel-body" style={{ padding: '10px 14px', overflowY: 'auto' }}>
            {selStyle ? (
              <div>
                <div style={{ marginBottom: 10, padding: '6px 10px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 4, fontSize: '12px', color: '#0369a1' }}>
                  원본 스타일: <strong>{selStyle.styleCode}</strong>
                </div>
                {tree.map(item => <TreeNode key={item.id} item={item} onToggle={toggleTree} />)}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: '12px' }}>
                스타일을 선택하세요
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
