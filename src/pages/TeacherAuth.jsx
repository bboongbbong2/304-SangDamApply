import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock } from 'lucide-react';

export default function TeacherAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // NOTE: 교사 계정은 Firebase Console에서 미리 생성되어 있어야 합니다.
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/teacher/dashboard');
    } catch (err) {
      console.error(err);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '48px', height: '48px', backgroundColor: 'var(--bg-color)', borderRadius: '50%', marginBottom: '1rem' }}>
          <Lock size={24} color="var(--primary-color)" />
        </div>
        <h1 className="card-title" style={{ marginBottom: '0.5rem' }}>교사 로그인</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>상담 일정을 관리하기 위해 로그인하세요.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label" htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="teacher@sejong.hs.kr"
          />
        </div>
        
        <div className="input-group" style={{ marginBottom: '2rem' }}>
          <label className="input-label" htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}
