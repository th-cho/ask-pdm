'use client';

import React from 'react';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card border-0 shadow-sm p-5" style={{ width: '100%', maxWidth: '400px', borderRadius: '16px' }}>
        <div className="text-center mb-4">
          <img src="/assets/image/logo-horizontal-3.svg" alt="Amer" style={{ width: '280px', marginBottom: '2rem' }} />
          <h4 className="fw-bold mb-1">로그인</h4>
          {/*<p className="text-muted small">아머스포츠코리아 PDM 시스템</p>*/}
        </div>

        <form>
          <div className="mb-3">
            <label htmlFor="userId" className="form-label small fw-bold text-secondary">아이디</label>
            <input type="text" className="form-control" id="userId" placeholder="아이디를 입력하세요" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label small fw-bold text-secondary">비밀번호</label>
            <input type="password" className="form-control" id="password" placeholder="비밀번호를 입력하세요" required />
          </div>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label small text-secondary" htmlFor="rememberMe">
                아이디 저장
              </label>
            </div>
            <a href="#" className="small text-secondary text-decoration-none">비밀번호 찾기</a>
          </div>
          <Link href="/" className="btn btn-amer w-100 rounded-3 py-2 fw-bold">로그인</Link>
        </form>

        <div className="text-center mt-4" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
          계정이 없으신가요? <Link href="/signup" className="text-amer text-decoration-none fw-medium">회원가입</Link>
        </div>
      </div>
    </div>
  );
}