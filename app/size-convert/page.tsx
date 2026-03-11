'use client';

import React, { useState, useCallback } from 'react';
import { Search, Save, RotateCcw, Printer, Download, Star, Upload } from 'lucide-react';

interface SizeRow {
  item: string; kr85: string; kr90: string; kr95: string; kr100: string; kr105: string; kr110: string;
  us_xs: string; us_s: string; us_m: string; us_l: string; us_xl: string; us_xxl: string;
  eu_34: string; eu_36: string; eu_38: string; eu_40: string; eu_42: string; eu_44: string;
  uk_6: string; uk_8: string; uk_10: string; uk_12: string; uk_14: string; uk_16: string;
  cm_unit: string; note: string;
}

const ITEM_LIST = [
  '가슴둘레', '허리둘레', '엉덩이둘레', '어깨너비', '총기장', '소매기장', '소매통', '소매부리',
  '밑단둘레', '목둘레', '등기장', '앞기장', '허리높이', '엉덩이높이', '허벅지둘레', '무릎둘레',
  '발목둘레', '바지기장', '샅높이', '밑위기장',
];

const INIT_ROWS: SizeRow[] = ITEM_LIST.map(item => ({
  item,
  kr85: '', kr90: '', kr95: '', kr100: '', kr105: '', kr110: '',
  us_xs: '', us_s: '', us_m: '', us_l: '', us_xl: '', us_xxl: '',
  eu_34: '', eu_36: '', eu_38: '', eu_40: '', eu_42: '', eu_44: '',
  uk_6: '', uk_8: '', uk_10: '', uk_12: '', uk_14: '', uk_16: '',
  cm_unit: 'cm', note: '',
}));

const SAMPLE_DATA: Partial<Record<string, Partial<SizeRow>>> = {
  '가슴둘레': { kr85: '82-86', kr90: '86-90', kr95: '90-94', kr100: '94-98', kr105: '98-104', kr110: '104-110', us_xs: '30-32', us_s: '34-36', us_m: '38-40', us_l: '42-44', us_xl: '46-48', us_xxl: '50-52', eu_34: '34', eu_36: '36', eu_38: '38', eu_40: '40', eu_42: '42', eu_44: '44' },
  '허리둘레': { kr85: '64-68', kr90: '68-72', kr95: '72-76', kr100: '76-80', kr105: '80-86', kr110: '86-92' },
  '엉덩이둘레': { kr85: '86-90', kr90: '90-94', kr95: '94-98', kr100: '98-102', kr105: '102-108', kr110: '108-114' },
  '어깨너비': { kr85: '36', kr90: '38', kr95: '40', kr100: '42', kr105: '44', kr110: '46' },
  '총기장': { kr85: '60', kr90: '62', kr95: '64', kr100: '66', kr105: '68', kr110: '70' },
};

const FILTER_INIT = { brand: '', year: '24', season: '', importType: '', mktType: '', class: '', category: '', item: '', itemCode: '', gender: 'F' };

export default function SizeConvert() {
  const [filter, setFilter] = useState(FILTER_INIT);
  const [rows, setRows]     = useState<SizeRow[]>(() =>
    INIT_ROWS.map(r => ({ ...r, ...(SAMPLE_DATA[r.item] ?? {}) }))
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F3') { e.preventDefault(); }
  }, []);
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const ff = (key: string, val: string) => setFilter(p => ({ ...p, [key]: val }));
  const updateCell = (rowIdx: number, field: keyof SizeRow, val: string) => {
    setRows(prev => prev.map((r, i) => i === rowIdx ? { ...r, [field]: val } : r));
  };

  const TH: React.CSSProperties = {
    padding: '4px 6px', fontSize: 10, fontWeight: 600, color: '#475569',
    border: '1px solid #e2e8f0', background: '#f1f5f9',
    textAlign: 'center', whiteSpace: 'nowrap',
  };
  const TD: React.CSSProperties = {
    padding: '2px 4px', border: '1px solid #e2e8f0', fontSize: 11, textAlign: 'center',
  };
  const INPUT_STYLE: React.CSSProperties = {
    width: '100%', border: 'none', background: 'transparent', fontSize: 11,
    textAlign: 'center', padding: 0, outline: 'none',
  };

  const KR_SIZES = ['85', '90', '95', '100', '105', '110'];
  const US_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  const EU_SIZES = ['34', '36', '38', '40', '42', '44'];
  const UK_SIZES = ['6', '8', '10', '12', '14', '16'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* 툴바 */}
      <div className="pdm-toolbar">
        <span className="pdm-page-title">사이즈단위환산(파일) <span className="pdm-page-code">CSB005</span></span>
        <div className="pdm-btn-group">
          <button className="pdm-btn pdm-btn-primary"><Search size={13} /> 조회 <kbd>F3</kbd></button>
          <button className="pdm-btn pdm-btn-success"><Save size={13} /> 저장 <kbd>F9</kbd></button>
          <button className="pdm-btn pdm-btn-info"><Printer size={13} /> 출력 <kbd>F11</kbd></button>
          <button className="pdm-btn pdm-btn-default"><Upload size={13} /> 엑셀 업로드</button>
          <button className="pdm-btn pdm-btn-default"><Download size={13} /> 엑셀 다운로드</button>
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
        <label>두자리코드</label>
        <input style={{ width: 50 }} value={filter.itemCode} onChange={e => ff('itemCode', e.target.value)} placeholder="00" />
        <label>성별</label>
        <select value={filter.gender} onChange={e => ff('gender', e.target.value)}>
          <option value="F">여성(F)</option><option value="M">남성(M)</option><option value="U">유니섹스(U)</option>
        </select>
        <button className="pdm-btn pdm-btn-primary" style={{ marginLeft: 4 }}><Search size={12} /> 조회</button>
      </div>

      {/* 사이즈 환산 테이블 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Star size={12} color="#1a5cb8" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1a5cb8' }}>사이즈 환산 테이블</span>
          <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>— 셀 클릭 후 직접 편집 가능</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 11, minWidth: '100%' }}>
            <colgroup>
              <col style={{ width: 110 }} />
              {KR_SIZES.map(s => <col key={`kr${s}`} style={{ width: 75 }} />)}
              {US_SIZES.map(s => <col key={`us${s}`} style={{ width: 70 }} />)}
              {EU_SIZES.map(s => <col key={`eu${s}`} style={{ width: 55 }} />)}
              {UK_SIZES.map(s => <col key={`uk${s}`} style={{ width: 55 }} />)}
              <col style={{ width: 55 }} />
              <col style={{ width: 120 }} />
            </colgroup>
            <thead>
              {/* 국가 그룹 헤더 */}
              <tr>
                <th style={TH} rowSpan={2}>항목명</th>
                <th style={{ ...TH, background: '#eff6ff', color: '#1a5cb8' }} colSpan={6}>한국 (KR) — 사이즈별</th>
                <th style={{ ...TH, background: '#f0fdf4', color: '#16a34a' }} colSpan={6}>미국 (US) — 사이즈별</th>
                <th style={{ ...TH, background: '#faf5ff', color: '#7c3aed' }} colSpan={6}>유럽 (EU) — 사이즈별</th>
                <th style={{ ...TH, background: '#fff7ed', color: '#c2410c' }} colSpan={6}>영국 (UK) — 사이즈별</th>
                <th style={TH} rowSpan={2}>단위</th>
                <th style={TH} rowSpan={2}>비고</th>
              </tr>
              <tr>
                {KR_SIZES.map(s => <th key={`kr-h-${s}`} style={{ ...TH, background: '#eff6ff' }}>{s}</th>)}
                {US_SIZES.map(s => <th key={`us-h-${s}`} style={{ ...TH, background: '#f0fdf4' }}>{s}</th>)}
                {EU_SIZES.map(s => <th key={`eu-h-${s}`} style={{ ...TH, background: '#faf5ff' }}>{s}</th>)}
                {UK_SIZES.map(s => <th key={`uk-h-${s}`} style={{ ...TH, background: '#fff7ed' }}>{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.item} style={{ background: ri % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ ...TD, fontWeight: 600, textAlign: 'left', paddingLeft: 8, background: '#f1f5f9' }}>{row.item}</td>
                  {/* KR */}
                  {(['kr85','kr90','kr95','kr100','kr105','kr110'] as const).map(f => (
                    <td key={f} style={{ ...TD, background: ri % 2 === 0 ? '#f0f7ff' : '#e8f3ff' }}>
                      <input value={row[f]} onChange={e => updateCell(ri, f, e.target.value)} style={INPUT_STYLE} />
                    </td>
                  ))}
                  {/* US */}
                  {(['us_xs','us_s','us_m','us_l','us_xl','us_xxl'] as const).map(f => (
                    <td key={f} style={{ ...TD, background: ri % 2 === 0 ? '#f0fdf4' : '#e7faf0' }}>
                      <input value={row[f]} onChange={e => updateCell(ri, f, e.target.value)} style={INPUT_STYLE} />
                    </td>
                  ))}
                  {/* EU */}
                  {(['eu_34','eu_36','eu_38','eu_40','eu_42','eu_44'] as const).map(f => (
                    <td key={f} style={{ ...TD, background: ri % 2 === 0 ? '#faf5ff' : '#f4eeff' }}>
                      <input value={row[f]} onChange={e => updateCell(ri, f, e.target.value)} style={INPUT_STYLE} />
                    </td>
                  ))}
                  {/* UK */}
                  {(['uk_6','uk_8','uk_10','uk_12','uk_14','uk_16'] as const).map(f => (
                    <td key={f} style={{ ...TD, background: ri % 2 === 0 ? '#fff7ed' : '#fef0e0' }}>
                      <input value={row[f]} onChange={e => updateCell(ri, f, e.target.value)} style={INPUT_STYLE} />
                    </td>
                  ))}
                  <td style={TD}>
                    <input value={row.cm_unit} onChange={e => updateCell(ri, 'cm_unit', e.target.value)} style={INPUT_STYLE} />
                  </td>
                  <td style={TD}>
                    <input value={row.note} onChange={e => updateCell(ri, 'note', e.target.value)} style={{ ...INPUT_STYLE, textAlign: 'left', paddingLeft: 4 }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
