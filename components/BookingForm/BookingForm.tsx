'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './BookingForm.module.css';

const pad2 = (n: number) => String(n).padStart(2, '0');

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addMonths = (d: Date, delta: number) => new Date(d.getFullYear(), d.getMonth() + delta, 1);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const formatISO = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const monthTitle = (d: Date) => d.toLocaleString('en-US', { month: 'long', year: 'numeric' });

/**
 * Week starts Monday:
 * JS getDay(): Sun=0 ... Sat=6
 * Monday-start index: (day + 6) % 7
 */
const startOfWeekMonday = (d: Date) => {
  const day = d.getDay();
  const diff = (day + 6) % 7;
  const res = new Date(d);
  res.setDate(d.getDate() - diff);
  return startOfDay(res);
};

const endOfWeekSunday = (d: Date) => {
  const day = d.getDay(); // Sun=0
  const add = (7 - day) % 7;
  const res = new Date(d);
  res.setDate(d.getDate() + add);
  return startOfDay(res);
};

type Cell = { date: Date; inMonth: boolean; disabled: boolean; isToday: boolean };

export default function BookingForm() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);

  const cells: Cell[] = useMemo(() => {
    const mStart = startOfMonth(viewMonth);
    const mEnd = endOfMonth(viewMonth);

    const gridStart = startOfWeekMonday(mStart);
    const gridEnd = endOfWeekSunday(mEnd);

    const res: Cell[] = [];
    const cur = new Date(gridStart);

    while (cur <= gridEnd) {
      const date = new Date(cur);
      const inMonth = isSameMonth(date, viewMonth);
      const disabled = startOfDay(date) < today; // only from today
      const isToday = isSameDay(date, today);

      res.push({ date, inMonth, disabled, isToday });
      cur.setDate(cur.getDate() + 1);
    }

    return res;
  }, [viewMonth, today]);

  const goPrevMonth = () => setViewMonth((d) => addMonths(d, -1));
  const goNextMonth = () => setViewMonth((d) => addMonths(d, 1));

  const onPickDate = (d: Date) => {
    if (startOfDay(d) < today) return;
    setSelectedDate(d);
    setIsCalendarOpen(false);
  };

  // ✅ outside click close (fix "opens then instantly closes")
  useEffect(() => {
    const onPointerDownCapture = (e: PointerEvent) => {
      if (!isCalendarOpen) return;
      const root = rootRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) setIsCalendarOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDownCapture, true);
    return () => document.removeEventListener('pointerdown', onPointerDownCapture, true);
  }, [isCalendarOpen]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !selectedDate) return;

    alert('Booking successful!');

    setName('');
    setEmail('');
    setComment('');
    setSelectedDate(null);
    setIsCalendarOpen(false);
    setViewMonth(startOfMonth(new Date()));
  };

  // ✅ hint inside Booking date field
  const isHintShown = isCalendarOpen && !selectedDate;

  const bookingValue = selectedDate
    ? formatISO(selectedDate)
    : isCalendarOpen
      ? 'Select a date between today'
      : '';

  return (
    <div ref={rootRef} className={styles.card}>
      <h3 className={styles.title}>Book your campervan now</h3>
      <p className={styles.subtitle}>Stay connected! We are always ready to help you.</p>

      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.fields}>
          <input
            className={styles.input}
            type="text"
            placeholder="Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className={styles.dateField}>
            <input
              ref={inputRef}
              className={`${styles.input} ${isHintShown ? styles.hintValue : ''}`}
              type="text"
              placeholder="Booking date*"
              value={bookingValue}
              readOnly
              onMouseDown={(e) => {
                e.preventDefault();
                setIsCalendarOpen(true);
              }}
              onFocus={() => setIsCalendarOpen(true)}
              required
            />

            {isCalendarOpen && (
              <div
                className={styles.calendar}
                role="dialog"
                aria-label="Choose booking date"
                onPointerDown={(e) => e.stopPropagation()}
              >
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
                  <div>MON</div>
                  <div>TUE</div>
                  <div>WED</div>
                  <div>THU</div>
                  <div>FRI</div>
                  <div>SAT</div>
                  <div>SUN</div>
                </div>

                <div className={styles.grid}>
                  {cells.map((cell) => {
                    const isSelected = selectedDate ? isSameDay(cell.date, selectedDate) : false;

                    return (
                      <button
                        key={cell.date.toISOString()}
                        type="button"
                        className={[
                          styles.day,
                          cell.inMonth ? styles.inMonth : styles.outMonth,
                          cell.isToday ? styles.today : '',
                          isSelected ? styles.selected : '',
                          cell.disabled ? styles.disabled : '',
                        ].join(' ')}
                        onClick={() => onPickDate(cell.date)}
                        disabled={cell.disabled}
                        aria-pressed={isSelected}
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