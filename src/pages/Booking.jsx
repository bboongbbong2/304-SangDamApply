import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle2 } from 'lucide-react';
import TimeTable from '../components/TimeTable';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, teacherUid } = location.state || {};

  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!role || !teacherUid) {
      navigate('/');
      return;
    }
    loadDates();
  }, [role, teacherUid, navigate]);

  const loadDates = async () => {
    try {
      const q = query(collection(db, 'consultationDates'), where('createdBy', '==', teacherUid));
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

  const handleSlotClick = (slot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
      setSelectedDate(slot.date);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !studentName || !selectedDate || !selectedSlot) {
      alert('모든 정보를 입력하고 시간을 선택해주세요.');
      return;
    }

    if (studentId.length !== 4 || isNaN(studentId)) {
      alert('학번은 4자리 숫자여야 합니다. (예: 3401)');
      return;
    }

    setSubmitting(true);
    const slotRef = doc(db, 'slots', selectedSlot.id);

    try {
      await runTransaction(db, async (transaction) => {
        const slotDoc = await transaction.get(slotRef);
        if (!slotDoc.exists()) {
          throw 'Slot does not exist!';
        }

        const data = slotDoc.data();
        if (data.status !== 'available') {
          throw 'ALREADY_BOOKED';
        }

        transaction.update(slotRef, {
          status: 'booked',
          bookedByStudentId: studentId,
          bookedByStudentName: studentName,
          bookedByType: role,
          bookedAt: new Date().toISOString()
        });
      });

      setCompleted(true);
    } catch (err) {
      console.error(err);
      if (err === 'ALREADY_BOOKED') {
        alert('죄송합니다. 다른 사람이 이미 신청한 시간입니다. 다른 시간을 선택해주세요.');
        setRefreshTrigger(prev => prev + 1); // reload table
        setSelectedSlot(null);
      } else {
        alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <CheckCircle2 size={64} color="var(--status-available)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 className="card-title" style={{ marginBottom: '0.5rem', color: 'var(--status-available)' }}>
          상담 신청이 완료되었습니다.
        </h1>
        <div style={{ backgroundColor: 'var(--secondary-color)', padding: '1.5rem', borderRadius: '0.5rem', margin: '2rem 0', textAlign: 'left' }}>
          <p style={{ margin: '0.5rem 0' }}><strong>신청자 유형:</strong> {role === 'student' ? '학생' : '학부모'}</p>
          <p style={{ margin: '0.5rem 0' }}><strong>학생 학번:</strong> {studentId}</p>
          <p style={{ margin: '0.5rem 0' }}><strong>학생 이름:</strong> {studentName}</p>
          <p style={{ margin: '0.5rem 0' }}><strong>상담 날짜:</strong> {selectedDate}</p>
          <p style={{ margin: '0.5rem 0' }}><strong>상담 시간:</strong> {selectedSlot.startTime} ~ {selectedSlot.endTime} ({selectedSlot.timeLabel})</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="card dashboard-container" style={{ maxWidth: '1000px' }}>
      <h1 className="card-title">상담 신청</h1>
      
      <div className="guidance-box">
        <h3>💡 신청 방법</h3>
        <ol>
          <li>학생 학번과 이름을 정확히 입력합니다.</li>
          <li>아래 시간표에서 <strong>원하는 상담 시간</strong>을 선택합니다. (가능한 시간만 선택할 수 있습니다)</li>
          <li>신청하기 버튼을 누르면 신청이 완료됩니다.</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label" htmlFor="studentId">학생 학번</label>
            <input
              id="studentId"
              type="text"
              className="input-field"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              required
              maxLength={4}
              minLength={4}
              pattern="\d{4}"
              title="학번 4자리 숫자를 입력해주세요 (예: 3401)"
              placeholder="예: 3401"
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label" htmlFor="studentName">학생 이름</label>
            <input
              id="studentName"
              type="text"
              className="input-field"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              placeholder="예: 홍길동"
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label className="input-label">상담 시간표</label>
          <TimeTable 
            teacherUid={teacherUid} 
            userRole={role} 
            onSlotClick={handleSlotClick}
            selectedSlotId={selectedSlot?.id}
            refreshTrigger={refreshTrigger}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            취소
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting || !selectedDate || !selectedSlot}
          >
            {submitting ? '신청 처리 중...' : '신청하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
