import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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

export default function TimeTable({ teacherUid, userRole, onSlotClick, selectedSlotId, refreshTrigger }) {
  const [dates, setDates] = useState([]);
  const [slotsByDate, setSlotsByDate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teacherUid) {
      loadFullSchedule();
    }
  }, [teacherUid, refreshTrigger]);

  const loadFullSchedule = async () => {
    setLoading(true);
    try {
      // Load dates
      const datesQuery = query(collection(db, 'consultationDates'), where('createdBy', '==', teacherUid));
      const datesSnap = await getDocs(datesQuery);
      const datesList = datesSnap.docs.map(doc => doc.data().date).sort();
      setDates(datesList);

      // Load all slots for this teacher
      // Since we don't have teacherUid on slots, we have to load slots where date is in datesList
      // But 'in' is limited to 10. We will load all slots and filter locally if needed,
      // or we can load slots for each date. Let's do it individually for each date (since the number of dates is small).
      const newSlotsByDate = {};
      for (const d of datesList) {
        const slotsQ = query(collection(db, 'slots'), where('date', '==', d));
        const slotsSnap = await getDocs(slotsQ);
        const dateSlots = slotsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Convert to dictionary by timeLabel for fast access
        const slotsDict = {};
        dateSlots.forEach(s => {
          slotsDict[s.timeLabel] = s;
        });
        newSlotsByDate[d] = slotsDict;
      }
      
      setSlotsByDate(newSlotsByDate);
    } catch (err) {
      console.error('Error loading timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loader" style={{ margin: '2rem auto' }}></div>;
  }

  if (dates.length === 0) {
    return <div className="alert alert-info">등록된 상담 날짜가 없습니다.</div>;
  }

  return (
    <div style={{ overflowX: 'auto', marginTop: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--secondary-color)', borderBottom: '2px solid var(--border-color)' }}>
            <th style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid var(--border-color)', position: 'sticky', left: 0, backgroundColor: 'var(--secondary-color)', zIndex: 10, minWidth: '110px' }}>시간</th>
            {dates.map(d => (
              <th key={d} style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid var(--border-color)', minWidth: '100px' }}>
                {d.substring(5)} {/* Show MM-DD */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DEFAULT_SLOTS.map((slotInfo, index) => (
            <tr key={slotInfo.label} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.2rem 0.5rem', textAlign: 'center', borderRight: '1px solid var(--border-color)', position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 10, fontWeight: 'bold' }}>
                {slotInfo.label} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({slotInfo.start})</span>
              </td>
              
              {dates.map(d => {
                const slot = slotsByDate[d]?.[slotInfo.label];
                let bgColor = 'white';
                let content = '';
                
                if (!slot) {
                  bgColor = '#f8fafc';
                  content = '-';
                } else if (slot.status === 'unavailable') {
                  bgColor = 'var(--bg-color)';
                  content = '불가';
                } else if (slot.status === 'booked') {
                  bgColor = 'rgba(239, 68, 68, 0.1)';
                  content = userRole === 'teacher' ? `${slot.bookedByStudentName}(${slot.bookedByType === 'student' ? '학생' : '학부모'})` : '예약됨';
                } else {
                  bgColor = 'rgba(34, 197, 94, 0.1)';
                  content = '가능';
                }

                const isSelected = slot && slot.id === selectedSlotId;

                return (
                  <td 
                    key={`${d}-${slotInfo.label}`} 
                    onClick={() => slot && onSlotClick && onSlotClick(slot)}
                    style={{ 
                      padding: '0.25rem', 
                      textAlign: 'center', 
                      borderRight: '1px solid var(--border-color)', 
                      backgroundColor: bgColor,
                      cursor: slot ? 'pointer' : 'default',
                      boxShadow: isSelected ? 'inset 0 0 0 2px var(--primary-color)' : 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (slot) e.currentTarget.style.filter = 'brightness(0.95)';
                    }}
                    onMouseLeave={(e) => {
                      if (slot) e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <span style={{ 
                      color: slot?.status === 'booked' ? 'var(--status-booked)' : slot?.status === 'available' ? 'var(--status-available)' : 'var(--text-muted)', 
                      fontWeight: slot?.status === 'available' || slot?.status === 'booked' ? 'bold' : 'normal' 
                    }}>
                      {content}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
