import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, getDocs, addDoc, query, where, updateDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { LogOut, Plus, Trash2, Settings, Calendar as CalendarIcon, Table as TableIcon, LayoutGrid } from 'lucide-react';
import TimeTable from '../components/TimeTable';

const DEFAULT_SLOTS = [
  { label: '아침', start: '08:05', end: '08:20' },
  { label: '1교시', start: '08:20', end: '09:10' },
  { label: '2교시', start: '09:20', end: '10:10' },
  { label: '3교시', start: '10:20', end: '11:10' },
  { label: '4교시', start: '11:20', end: '12:10' },
  { label: '점심 1', start: '12:10', end: '12:30' },
  { label: '점심 2', start: '12:50', end: '13:10' },
  { label: '5교시', start: '13:10', end: '14:00' },
  { label: '6교시', start: '14:10', end: '15:00' },
  { label: '7교시', start: '15:10', end: '16:00' },
  { label: '방과후 1', start: '16:05', end: '16:30' },
  { label: '방과후 2', start: '16:30', end: '17:00' },
  { label: '저녁 1', start: '18:30', end: '19:00' },
  { label: '저녁 2', start: '19:00', end: '19:30' },
  { label: '저녁 3', start: '19:30', end: '20:00' }
];

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [authCode, setAuthCode] = useState('');
  const [isSavingCode, setIsSavingCode] = useState(false);
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // Used only for deletion now
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadTeacherData(currentUser.uid);
        await loadDates(currentUser.uid);
      } else {
        navigate('/teacher/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const loadTeacherData = async (uid) => {
    try {
      const docRef = doc(db, 'teachers', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAuthCode(docSnap.data().authCode || '');
      } else {
        await setDoc(docRef, { email: auth.currentUser.email, authCode: '' });
      }
    } catch (err) {
      console.error('Error loading teacher data:', err);
    }
  };

  const loadDates = async (uid) => {
    try {
      const q = query(collection(db, 'consultationDates'), where('createdBy', '==', uid));
      const querySnapshot = await getDocs(q);
      const datesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      datesList.sort((a, b) => a.date.localeCompare(b.date));
      setDates(datesList);
      setLoading(false);
    } catch (err) {
      console.error('Error loading dates:', err);
      setLoading(false);
    }
  };

  const handleSaveAuthCode = async () => {
    if (!authCode || authCode.length !== 4) {
      alert('인증코드는 4자리로 설정해주세요.');
      return;
    }
    setIsSavingCode(true);
    try {
      await setDoc(doc(db, 'teachers', user.uid), { authCode }, { merge: true });
      alert('인증코드가 저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('인증코드 저장 실패');
    } finally {
      setIsSavingCode(false);
    }
  };

  const handleAddDate = async () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      alert('시작 날짜는 종료 날짜보다 앞서야 합니다.');
      return;
    }

    setLoading(true);
    let successCount = 0;
    
    try {
      // 시작일부터 종료일까지 반복
      let currentDate = new Date(start);
      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // 이미 있는 날짜인지 확인
        if (!dates.find(d => d.date === dateStr)) {
          await addDoc(collection(db, 'consultationDates'), {
            date: dateStr,
            createdBy: user.uid,
            createdAt: new Date()
          });

          const batch = writeBatch(db);
          DEFAULT_SLOTS.forEach(slotInfo => {
            const newSlotRef = doc(collection(db, 'slots'));
            batch.set(newSlotRef, {
              date: dateStr,
              timeLabel: slotInfo.label,
              startTime: slotInfo.start,
              endTime: slotInfo.end,
              status: 'available',
              bookedByStudentId: null,
              bookedByStudentName: null,
              bookedByType: null,
              bookedAt: null,
            });
          });
          await batch.commit();
          successCount++;
        }
        
        // 다음 날짜로 이동
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setStartDate('');
      setEndDate('');
      await loadDates(user.uid);
      
      if (successCount > 0) {
        alert(`${successCount}일치의 날짜가 추가되었습니다.`);
      } else {
        alert('추가할 새로운 날짜가 없습니다. (이미 추가됨)');
      }
    } catch (err) {
      console.error(err);
      alert('날짜 추가 중 오류가 발생했습니다. (데이터베이스 규칙 또는 설정 문제일 수 있습니다)');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = async (slot) => {
    if (slot.status === 'booked') {
      const confirmCancel = window.confirm(
        `신청자: ${slot.bookedByStudentName} (${slot.bookedByStudentId}, ${slot.bookedByType === 'student' ? '학생' : '학부모'})\n예약을 취소하시겠습니까?`
      );
      if (confirmCancel) {
        try {
          const slotRef = doc(db, 'slots', slot.id);
          await updateDoc(slotRef, {
            status: 'available',
            bookedByStudentId: null,
            bookedByStudentName: null,
            bookedByType: null,
            bookedAt: null
          });
          setRefreshTrigger(prev => prev + 1);
        } catch (err) {
          console.error(err);
          alert('예약 취소 실패');
        }
      }
    } else {
      // Toggle available <-> unavailable
      const newStatus = slot.status === 'available' ? 'unavailable' : 'available';
      try {
        const slotRef = doc(db, 'slots', slot.id);
        await updateDoc(slotRef, { status: newStatus });
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error(err);
        alert('상태 변경 실패');
      }
    }
  };

  const handleDeleteDate = async (dateStr, dateId) => {
    if (!window.confirm(`${dateStr} 날짜를 삭제하시겠습니까? 해당 날짜의 모든 예약이 사라집니다.`)) return;

    try {
      setLoading(true);
      
      // 1. Delete all slots for this date
      const slotsQ = query(collection(db, 'slots'), where('date', '==', dateStr));
      const slotsSnap = await getDocs(slotsQ);
      
      const batch = writeBatch(db);
      slotsSnap.docs.forEach(docSnap => {
        batch.delete(docSnap.ref);
      });
      
      // 2. Delete the date document
      const dateRef = doc(db, 'consultationDates', dateId);
      batch.delete(dateRef);
      
      await batch.commit();
      
      if (selectedDate === dateStr) {
        setSelectedDate(null);
      }
      await loadDates(user.uid);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllDates = async () => {
    if (!window.confirm(`모든 상담 날짜와 예약 내역을 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다!`)) return;

    try {
      setLoading(true);
      const batch = writeBatch(db);
      
      for (const d of dates) {
        const slotsQ = query(collection(db, 'slots'), where('date', '==', d.date));
        const slotsSnap = await getDocs(slotsQ);
        slotsSnap.docs.forEach(docSnap => {
          batch.delete(docSnap.ref);
        });
        const dateRef = doc(db, 'consultationDates', d.id);
        batch.delete(dateRef);
      }
      
      await batch.commit();
      setSelectedDate(null);
      await loadDates(user.uid);
      setRefreshTrigger(prev => prev + 1);
      alert('모든 일정이 삭제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('전체 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
  };

  if (!user) return <div className="main-content"><div className="loader"></div></div>;

  return (
    <div className="card dashboard-container" style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="card-title" style={{ marginBottom: 0 }}>교사 관리자 화면</h1>
        <button className="btn btn-outline" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={handleLogout}>
          <LogOut size={18} style={{ marginRight: '0.5rem' }} /> 로그아웃
        </button>
      </div>

      <div className="guidance-box">
        <h3>💡 관리자 사용 방법</h3>
        <ol>
          <li><strong>상담용 인증코드</strong>를 4자리로 설정하여 학생/학부모에게 안내합니다.</li>
          <li><strong>상담 가능 날짜</strong>를 달력에서 선택하여 추가합니다.</li>
          <li>추가된 날짜의 <strong>시간표</strong>에서 상담 불가한 시간을 클릭하여 "불가"로 표시합니다.</li>
          <li>이미 신청된 시간을 클릭하면 예약 내역을 확인하거나 취소할 수 있습니다.</li>
        </ol>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Settings size={20} color="var(--primary-color)" style={{ marginRight: '0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>인증코드 설정</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="예: 1234" 
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value.slice(0, 4))}
              maxLength={4}
            />
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={handleSaveAuthCode} disabled={isSavingCode}>
              저장
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>학생/학부모가 입력할 4자리 코드입니다.</p>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <CalendarIcon size={20} color="var(--primary-color)" style={{ marginRight: '0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>상담 날짜 추가</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', width: '40px' }}>시작</span>
              <input 
                type="date" 
                className="input-field" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', width: '40px' }}>종료</span>
              <input 
                type="date" 
                className="input-field" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button className="btn btn-primary" style={{ width: 'auto' }} onClick={handleAddDate} disabled={loading}>
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>상담 시간표 관리</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {dates.length > 0 && (
            <button className="btn btn-outline" style={{ width: 'auto', padding: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }} onClick={handleDeleteAllDates}>
              <Trash2 size={16} style={{ marginRight: '0.25rem' }} /> 전체 삭제
            </button>
          )}
        </div>
      </div>
      
      {dates.length > 0 ? (
        <>
          <div className="date-list" style={{ marginBottom: '1rem' }}>
            {dates.map(d => (
              <div key={d.id} style={{ position: 'relative' }}>
                <div 
                  className="date-pill"
                  style={{ paddingRight: '2rem', cursor: 'default' }}
                >
                  {d.date}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteDate(d.date, d.id); }}
                  style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <TimeTable 
            teacherUid={user.uid} 
            userRole="teacher" 
            onSlotClick={handleSlotClick} 
            refreshTrigger={refreshTrigger}
          />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          상담 가능 날짜를 먼저 추가해주세요.
        </div>
      )}
    </div>
  );
}
