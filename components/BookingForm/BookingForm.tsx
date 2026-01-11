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

/** Week starts Monday */
const startOfWeekMonday = (d: Date) => {
  const day = d.getDay(); // Sun=0
  const diff = (day + 6) % 7; // Mon=0
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

type ToastState =
  | { open: false; type: 'success' | 'error'; text: string }
  | { open: true; type: 'success' | 'error'; text: string };

export default function BookingForm() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    type: 'success',
    text: '',
  });

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
      const disabled = startOfDay(date) < today;
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

  // close calendar on outside click (fix "open then close instantly")
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

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ open: true, type, text });

    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);

    toastTimerRef.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
      toastTimerRef.current = null;
    }, 2800);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  // hint inside Booking date field
  const isHintShown = isCalendarOpen && !selectedDate;

  const bookingValue = selectedDate
    ? formatISO(selectedDate)
    : isCalendarOpen
      ? 'Select a date between today'
      : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim() || !email.trim() || !selectedDate) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      bookingDate: formatISO(selectedDate),
      comment: comment.trim(),
    };

    // ✅ лог у консоль (те, чого тобі не вистачало)
    console.log('[BookingForm] submit payload:', payload);

    try {
      setIsSubmitting(true);

      // Тут буде реальний POST на бекенд, якщо він зʼявиться.
      // Поки що — імітація запиту:
      await new Promise((r) => setTimeout(r, 500));

      showToast('success', 'Booking successful!');
      console.log('[BookingForm] booking success');

      // reset
      setName('');
      setEmail('');
      setComment('');
      setSelectedDate(null);
      setIsCalendarOpen(false);
      setViewMonth(startOfMonth(new Date()));
    } catch (err) {
      console.error('[BookingForm] booking error:', err);
      showToast('error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={rootRef} className={styles.card}>
      {/* ✅ toast */}
      {toast.open && (
        <div
          className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}
          role="status"
          aria-live="polite"
        >
          <span>{toast.text}</span>
          <button
            type="button"
            className={styles.toastClose}
            aria-label="Close notification"
            onClick={() => setToast((t) => ({ ...t, open: false }))}
          >
            ×
          </button>
        </div>
      )}

      <h3 className={styles.title}>Book your campervan now</h3>
      <p className={styles.subtitle}>Stay connected! We are always ready to help you.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
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

                  <button type="button" className={styles.calNav} onClick={goNextMonth} aria-label="Next month">
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

        <button className={styles.send} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
