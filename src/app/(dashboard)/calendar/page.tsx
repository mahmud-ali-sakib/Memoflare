"use client";
import { useState } from "react";

import {
  CalendarEvent,
  MONTH_NAMES,
  SEED_EVENTS,
  toDateKey,
} from "../../../types/types";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import EventSidebar from "@/components/calendar/EventSidebar";

const CalendarPage = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(toDateKey(now));
  const [events, setEvents] = useState<CalendarEvent[]>(SEED_EVENTS);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDate(toDateKey(now));
  };

  const selectedEvents = events.filter((e) => e.date === selectedDate);

  const addEvent = (ev: CalendarEvent) => setEvents((prev) => [...prev, ev]);
  const deleteEvent = (id: number) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Main calendar area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Calendar
              </p>
              <h1 className="font-heading text-2xl font-bold tracking-tight leading-tight">
                {MONTH_NAMES[month]} {year}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Today */}
            <button
              onClick={goToday}
              className="h-8 px-3 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
            >
              Today
            </button>

            {/* Prev / Next */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="h-8 w-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={nextMonth}
                className="h-8 w-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar grid */}
        <CalendarGrid
          year={year}
          month={month}
          selectedDate={selectedDate}
          events={events}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* ── Event sidebar ── */}
      <EventSidebar
        selectedDate={selectedDate}
        events={selectedEvents}
        onAdd={addEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
};

export default CalendarPage;
