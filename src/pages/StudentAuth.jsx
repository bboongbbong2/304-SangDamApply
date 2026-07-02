import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, getDocs, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { KeyRound } from 'lucide-react';

export default function StudentAuth() {
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'student';

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Find a teacher with this authCode
      const q = query(collection(db, 'teachers'), where('authCode', '==', authCode), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // 인증 성공 - 예약 화면으로 이동
        const teacherUid = querySnapshot.docs[0].id;
        navigate('/booking', { state: { role, authCode, teacherUid } });
      } else {
        setError('인증코드가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('인증 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '48px', height: '48px', backgroundColor: 'var(--bg-color)', borderRadius: '50%', marginBottom: '1rem' }}>
          <KeyRound size={24} color="var(--primary-color)" />
        </div>
        <h1 className="card-title" style={{ marginBottom: '0.5rem' }}>
          {role === 'student' ? '학생 인증' : '학부모 인증'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>상담 신청을 위해 선생님이 안내한 4자리 인증코드를 입력해주세요.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleAuth}>
        <div className="input-group" style={{ marginBottom: '2rem' }}>
          <label className="input-label" htmlFor="authCode">인증코드 4자리</label>
          <input
            id="authCode"
            type="text"
            maxLength={4}
            className="input-field"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            required
            placeholder="1234"
            style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.5rem' }}
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '확인 중...' : '인증하고 계속하기'}
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
