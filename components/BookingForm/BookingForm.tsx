'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './BookingForm.module.css';

type CalendarCell = {
  date: Date;
  inMonth: boolean;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// Monday-first index: Mon=0 ... Sun=6
function weekdayIndexMonFirst(d: Date) {
  return (d.getDay() + 6) % 7;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatISO(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function monthTitle(d: Date) {
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function buildCalendar(monthDate: Date): CalendarCell[] {
  const first = startOfMonth(monthDate);
  const shift = weekdayIndexMonFirst(first);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - shift);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + i);

    cells.push({
      date: day,
      inMonth: day.getMonth() === first.getMonth(),
    });
  }
  return cells;
}

export default function BookingForm() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(new Date()));

  const cells = useMemo(() => buildCalendar(viewMonth), [viewMonth]);

  useEffect(() => {
    if (!isCalendarOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCalendarOpen(false);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setIsCalendarOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [isCalendarOpen]);

  const dateValue = selectedDate ? formatISO(selectedDate) : '';

  const goPrevMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const onPick = (d: Date) => {
    setSelectedDate(d);
    setIsCalendarOpen(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.alert('Booking request sent!');
    setName('');
    setEmail('');
    setComment('');
    setSelectedDate(null);
  };

  return (
    <div className={styles.card} ref={rootRef}>
      <h3 className={styles.title}>Book your campervan now</h3>
      <p className={styles.subtitle}>
        Stay connected! We are always ready to help you.
      </p>

      <form className={styles.form} onSubmit={onSubmit}>
        {/* ✅ ширина 527px як у макеті */}
        <div className={styles.fields}>
          <input
            className={styles.input}
            placeholder="Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className={styles.input}
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className={styles.dateField}>
            <input
              className={styles.input}
              placeholder="Booking date*"
              value={dateValue}
              readOnly
              onFocus={() => setIsCalendarOpen(true)}
              onClick={() => setIsCalendarOpen(true)}
              required
            />

            {isCalendarOpen && (
              <div className={styles.calendar} role="dialog" aria-label="Calendar">
                <div className={styles.calHeader}>
                  <button
                    type="button"
                    className={styles.calNav}
                    onClick={goPrevMonth}
                    aria-label="Previous month"
                  >
                    ‹
                  </button>

                  <div className={styles.calTitle}>{monthTitle(viewMonth)}</div>

                  <button
                    type="button"
                    className={styles.calNav}
                    onClick={goNextMonth}
                    aria-label="Next month"
                  >
                    ›
                  </button>
                </div>

                <div className={styles.weekdays}>
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                  <span>SAT</span>
                  <span>SUN</span>
                </div>

                <div className={styles.grid}>
                  {cells.map((cell) => {
                    const active =
                      selectedDate && isSameDay(selectedDate, cell.date);

                    return (
                      <button
                        key={cell.date.toISOString()}
                        type="button"
                        className={`${styles.day} ${
                          cell.inMonth ? styles.inMonth : styles.outMonth
                        } ${active ? styles.selected : ''}`}
                        onClick={() => onPick(cell.date)}
                      >
                        {cell.date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <textarea
            className={`${styles.input} ${styles.textarea}`}
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button className={styles.send} type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
