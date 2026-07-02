import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Users, GraduationCap } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>세종과학고등학교</h2>
        <h1 className="card-title" style={{ fontSize: '2rem', marginBottom: '0' }}>상담 신청 시스템</h1>
      </div>

      <div className="guidance-box">
        <h3>💡 이용 안내</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          환영합니다! 상담 신청을 위해 해당되는 역할을 선택해 주세요.
        </p>
        <ol>
          <li>학생 또는 학부모를 선택하여 인증코드를 입력합니다.</li>
          <li>가능한 상담 날짜와 시간을 확인하고 신청합니다.</li>
          <li>교사는 교사 로그인 후 일정을 관리할 수 있습니다.</li>
        </ol>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          className="btn btn-primary" 
          style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          onClick={() => navigate('/auth', { state: { role: 'student' } })}
        >
          <GraduationCap size={20} /> 학생으로 로그인
        </button>
        
        <button 
          className="btn btn-primary" 
          style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          onClick={() => navigate('/auth', { state: { role: 'parent' } })}
        >
          <Users size={20} /> 학부모로 로그인
        </button>
        
        <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>관리자용</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        <button 
          className="btn btn-outline" 
          style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          onClick={() => navigate('/teacher/login')}
        >
          <UserCircle size={20} /> 교사 로그인
        </button>
      </div>
    </div>
  );
}
