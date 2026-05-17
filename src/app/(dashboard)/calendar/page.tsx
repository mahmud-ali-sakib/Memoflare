"use client";

import { useEffect, useState } from "react";

import {
  CalendarEvent,
  MONTH_NAMES,
  toDateKey,
} from "../../../types/types";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import EventSidebar from "@/components/calendar/EventSidebar";

const CalendarPage = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(toDateKey(now));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventsPanel, setShowEventsPanel] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed");
        const data: CalendarEvent[] = await res.json();
        if (!cancelled) setEvents(data);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    setShowEventsPanel(true);
  };

  const handleSelectDate = (key: string) => {
    setSelectedDate(key);
    setShowEventsPanel(true);
  };

  const selectedEvents = events.filter((e) => e.date === selectedDate);

  const addEvent = async (ev: Omit<CalendarEvent, "id">) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ev),
    });
    if (!res.ok) return;
    const created: CalendarEvent = await res.json();
    setEvents((prev) => [...prev, created]);
  };

  const deleteEvent = async (id: string) => {
    const prev = events;
    setEvents((e) => e.filter((ev) => ev.id !== id));
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setEvents(prev);
    }
  };

  const eventCount = selectedEvents.length;

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-border shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Calendar
            </p>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight leading-tight truncate">
              {MONTH_NAMES[month]} {year}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowEventsPanel(true)}
              className="md:hidden h-8 px-2.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
            >
              Events{eventCount > 0 ? ` (${eventCount})` : ""}
            </button>
            <button
              type="button"
              onClick={goToday}
              className="h-8 px-2.5 sm:px-3 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
            >
              Today
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="h-8 w-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
                aria-label="Previous month"
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
                type="button"
                onClick={nextMonth}
                className="h-8 w-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
                aria-label="Next month"
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

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Loading events...
          </div>
        ) : (
          <CalendarGrid
            year={year}
            month={month}
            selectedDate={selectedDate}
            events={events}
            onSelectDate={handleSelectDate}
          />
        )}
      </div>

      <div className="hidden md:flex shrink-0">
        <EventSidebar
          selectedDate={selectedDate}
          events={selectedEvents}
          onAdd={addEvent}
          onDelete={deleteEvent}
        />
      </div>

      {showEventsPanel && (
        <>
          <button
            type="button"
            className="md:hidden fixed inset-0 z-30 bg-background/60"
            aria-label="Close events panel"
            onClick={() => setShowEventsPanel(false)}
          />
          <div className="md:hidden fixed inset-x-0 bottom-20 z-40 max-h-[min(70vh,calc(100dvh-8rem))] rounded-t-3xl border border-border bg-card shadow-xl overflow-hidden flex flex-col">
            <EventSidebar
              selectedDate={selectedDate}
              events={selectedEvents}
              onAdd={addEvent}
              onDelete={deleteEvent}
              onClose={() => setShowEventsPanel(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarPage;
