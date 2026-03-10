'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Building2, Save, Settings, Search, RotateCcw } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface ConfigRow {
  codeName: string;
  value: string;
}

export default function Company() {
  const [searchName, setSearchName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [bizNo, setBizNo] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [fax, setFax] = useState('');
  const [configRowData, setConfigRowData] = useState<ConfigRow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchName) params.set('name', searchName);

      const [companyRes, configRes] = await Promise.all([
        fetch(`/api/company?${params}`),
        fetch('/api/company/config'),
      ]);

      if (companyRes.ok) {
        const data = await companyRes.json();
        if (data) {
          setCompanyName(data.name ?? '');
          setCeoName(data.ceo_name ?? '');
          setBizNo(data.biz_no ?? '');
          setAddress(data.address ?? '');
          setPhone(data.phone ?? '');
          setFax(data.fax ?? '');
        }
      }

      if (configRes.ok) {
        const data = await configRes.json();
        setConfigRowData(data);
      }
    } catch (err) {
      alert('조회 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchName]);

  const handleInit = useCallback(() => {
    setSearchName('');
    setCompanyName('');
    setCeoName('');
    setBizNo('');
    setAddress('');
    setPhone('');
    setFax('');
    setConfigRowData([]);
  }, []);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, ceoName, bizNo, address, phone, fax }),
      });
      if (!res.ok) throw new Error('저장 실패');
      alert('회사 기본 정보가 저장되었습니다.');
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [companyName, ceoName, bizNo, address, phone, fax]);

  const handleConfigSave = useCallback(async () => {
    if (!configRowData.length) return;
    setLoading(true);
    try {
      const res = await fetch('/api/company/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configRowData),
      });
      if (!res.ok) throw new Error('저장 실패');
      alert('환경 설정이 저장되었습니다.');
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [configRowData]);

  const onConfigCellValueChanged = useCallback((event: any) => {
    setConfigRowData(prev =>
      prev.map(row => row.codeName === event.data.codeName ? { ...row, ...event.data } : row)
    );
  }, []);

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: "codeName", headerName: "설정 항목", width: 150, pinned: 'left', cellStyle: { fontWeight: 'bold' } },
    { field: "value", headerName: "설정값", flex: 1, editable: true }
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true, wrapHeaderText: true, sortable: false, filter: false, autoHeaderHeight: true }), []);

  return (
    <div className="container-fluid">
      <div className="card mb-4 p-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-bold text-muted">회사명</label>
            <input
              type="text"
              className="form-control form-control-sm border-secondary-subtle"
              placeholder="회사명을 입력하세요"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="col d-flex justify-content-end gap-2">
            <button className="btn btn-sm btn-amer px-4 shadow-sm" onClick={handleSearch} disabled={loading}>
              <Search size={14} className="me-1" />조회
            </button>
            <button className="btn btn-sm btn-light border px-4" onClick={handleInit} disabled={loading}>
              <RotateCcw size={14} className="me-1" />초기화
            </button>
          </div>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-xl-7">
          <div className="card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <Building2 className="text-danger" size={18} style={{ color: 'var(--amer-red)' }} />
                <h6 className="fw-bold mb-0 text-amer">회사 기본 정보</h6>
                {loading && <span className="spinner-border spinner-border-sm text-secondary ms-2" />}
              </div>
              <button className="btn btn-sm btn-amer px-3 shadow-sm" onClick={handleSave} disabled={loading}>
                <Save size={14} className="me-1" />저장
              </button>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <span className="info-label" style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '5px', display: 'block' }}>회사코드</span>
                <input type="text" className="form-control form-control-sm bg-light" value="ASK" readOnly />
              </div>
              <div className="col-md-6">
                <span className="info-label" style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '5px', display: 'block' }}>회사명</span>
                <input type="text" className="form-control form-control-sm" value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div className="col-md-6">
                <span className="info-label" style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '5px', display: 'block' }}>대표자명</span>
                <input type="text" className="form-control form-control-sm" value={ceoName} onChange={e => setCeoName(e.target.value)} />
              </div>
              <div className="col-md-6">
                <span className="info-label" style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '5px', display: 'block' }}>사업자번호</span>
                <input type="text" className="form-control form-control-sm" value={bizNo} onChange={e => setBizNo(e.target.value)} />
              </div>
              <div className="col-12">
                <span className="info-label" style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '5px', display: 'block' }}>주소</span>
                <input type="text" className="form-control form-control-sm" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div className="col-md-6">
                <span className="info-label" style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '5px', display: 'block' }}>전화번호</span>
                <input type="text" className="form-control form-control-sm" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="col-md-6">
                <span className="info-label" style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '5px', display: 'block' }}>팩스번호</span>
                <input type="text" className="form-control form-control-sm" value={fax} onChange={e => setFax(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className="card p-0 h-100 border-0 shadow-sm">
            <div className="card-header bg-white p-3 border-bottom-0">
              <div className="d-flex align-items-center gap-2">
                <Settings className="text-danger" size={18} style={{ color: 'var(--amer-red)' }} />
                <h6 className="mb-0 fw-bold">환경 설정 정보</h6>
                <button className="btn btn-sm btn-amer px-3 ms-auto shadow-sm" onClick={handleConfigSave} disabled={loading}>
                  <Save size={14} className="me-1" />저장
                </button>
              </div>
            </div>
            <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
              <AgGridReact
                rowData={configRowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onCellValueChanged={onConfigCellValueChanged}
                singleClickEdit={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
