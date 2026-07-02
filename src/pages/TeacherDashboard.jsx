import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, getDocs, addDoc, query, where, orderBy, updateDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { LogOut, Plus, Trash2, Settings, Calendar as CalendarIcon } from 'lucide-react';

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

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
      if (datesList.length > 0 && !selectedDate) {
        setSelectedDate(datesList[0].date);
        await loadSlots(datesList[0].date);
      } else if (selectedDate) {
        await loadSlots(selectedDate);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading dates:', err);
      setLoading(false);
    }
  };

  const loadSlots = async (dateStr) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'slots'), where('date', '==', dateStr));
      const querySnapshot = await getDocs(q);
      let slotsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort by start time manually just in case
      slotsList.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setSlots(slotsList);
    } catch (err) {
      console.error('Error loading slots:', err);
    } finally {
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
          await loadSlots(selectedDate);
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
        await loadSlots(selectedDate);
      } catch (err) {
        console.error(err);
        alert('상태 변경 실패');
      }
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

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>상담 시간표 관리</h3>
      
      {dates.length > 0 ? (
        <>
          <div className="date-list">
            {dates.map(d => (
              <div 
                key={d.id} 
                className={`date-pill ${selectedDate === d.date ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDate(d.date);
                  loadSlots(d.date);
                }}
              >
                {d.date}
              </div>
            ))}
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', backgroundColor: 'var(--secondary-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedDate} 시간표</h4>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '1px solid var(--status-available)', borderRadius: '2px' }}></div> 가능 (클릭 시 불가로 변경)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '12px', height: '12px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '2px' }}></div> 불가 (클릭 시 가능으로 변경)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--status-booked)', borderRadius: '2px' }}></div> 신청 완료</span>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '2rem 0' }}><div className="loader"></div></div>
            ) : (
              <div className="slot-grid">
                {slots.map(slot => {
                  let slotClass = 'slot-available';
                  let statusText = '신청 가능';
                  
                  if (slot.status === 'unavailable') {
                    slotClass = 'slot-unavailable';
                    statusText = '상담 불가';
                  } else if (slot.status === 'booked') {
                    slotClass = 'slot-booked';
                    statusText = `${slot.bookedByStudentName}(${slot.bookedByType === 'student' ? '학생' : '학부모'})`;
                  }

                  return (
                    <div 
                      key={slot.id} 
                      className={`slot-item ${slotClass}`}
                      onClick={() => handleSlotClick(slot)}
                    >
                      <span className="slot-time">{slot.startTime} ~ {slot.endTime}</span>
                      <span className="slot-label">{slot.timeLabel}</span>
                      <span className="slot-status">{statusText}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          상담 가능 날짜를 먼저 추가해주세요.
        </div>
      )}
    </div>
  );
}
