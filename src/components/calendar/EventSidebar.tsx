"use client";
import { useState } from "react";
import { CalendarEvent, EventColor, COLOR_STYLES, formatTime, MONTH_NAMES } from "@/types/types";

const COLOR_OPTIONS: EventColor[] = ["primary", "emerald", "amber", "rose", "violet", "cyan"];
const COLOR_LABELS: Record<EventColor, string> = {
  primary: "Blue",
  emerald: "Green",
  amber: "Yellow",
  rose: "Red",
  violet: "Purple",
  cyan: "Cyan",
};

interface Props {
  selectedDate: string;
  events: CalendarEvent[];
  onAdd: (e: CalendarEvent) => void;
  onDelete: (id: number) => void;
}

const EventSidebar = ({ selectedDate, events, onAdd, onDelete }: Props) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [color, setColor] = useState<EventColor>("primary");
  const [description, setDescription] = useState("");

  const [d, m, y] = selectedDate
    ? (() => {
        const parts = selectedDate.split("-");
        return [Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])];
      })()
    : [0, 0, 0];

  const dateLabel = selectedDate
    ? `${DAY_FULL[new Date(y, m, d).getDay()]}, ${d} ${MONTH_NAMES[m]} ${y}`
    : "Select a date";

  const reset = () => {
    setTitle("");
    setTime("09:00");
    setDuration(60);
    setColor("primary");
    setDescription("");
    setAdding(false);
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(),
      title: title.trim(),
      date: selectedDate,
      time,
      duration,
      color,
      description: description.trim() || undefined,
    });
    reset();
  };

  const sorted = [...events].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="w-72 shrink-0 border-l border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-5 border-b border-border shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Selected
        </p>
        <h2 className="font-heading text-base font-bold tracking-tight leading-snug">
          {dateLabel}
        </h2>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {sorted.length === 0 && !adding && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground text-center">
            <span className="text-3xl">📅</span>
            <p className="text-sm font-medium">No events</p>
            <p className="text-xs">Add one below</p>
          </div>
        )}

        {sorted.map((ev) => (
          <div
            key={ev.id}
            className={`group relative rounded-2xl border p-3 ${COLOR_STYLES[ev.color].pill}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{ev.title}</p>
                <p className="text-[11px] opacity-75 mt-0.5">
                  {formatTime(ev.time)} · {ev.duration >= 60
                    ? `${Math.floor(ev.duration / 60)}h${ev.duration % 60 ? ` ${ev.duration % 60}m` : ""}`
                    : `${ev.duration}m`}
                </p>
                {ev.description && (
                  <p className="text-[11px] opacity-60 mt-1 leading-relaxed line-clamp-2">
                    {ev.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => onDelete(ev.id)}
                className="shrink-0 h-5 w-5 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Add event form */}
        {adding && (
          <div className="rounded-2xl border border-border bg-card/60 p-4 flex flex-col gap-3 mt-1">
            <p className="text-xs font-semibold text-foreground">New event</p>

            {/* Title */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title..."
              autoFocus
              className="h-9 w-full rounded-xl border border-border bg-background/50 px-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 transition-colors"
            />

            {/* Time + Duration */}
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-9 w-full rounded-xl border border-border bg-background/50 px-3 text-sm text-foreground outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Mins</label>
                <input
                  type="number"
                  value={duration}
                  min={5}
                  step={5}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="h-9 w-full rounded-xl border border-border bg-background/50 px-3 text-sm text-foreground outline-none focus:border-primary/40 transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 transition-colors resize-none"
            />

            {/* Color picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    title={COLOR_LABELS[c]}
                    className={`h-6 w-6 rounded-full border-2 transition-all ${COLOR_STYLES[c].dot} ${
                      color === c ? "border-foreground scale-110" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAdd}
                disabled={!title.trim()}
                className="flex-1 h-8 rounded-xl bg-primary/20 hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed text-primary text-xs font-semibold transition-colors"
              >
                Add event
              </button>
              <button
                onClick={reset}
                className="flex-1 h-8 rounded-xl border border-border hover:bg-muted/40 text-muted-foreground text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer — add button */}
      {!adding && (
        <div className="px-4 py-4 border-t border-border shrink-0">
          <button
            onClick={() => setAdding(true)}
            disabled={!selectedDate}
            className="w-full h-9 rounded-2xl bg-primary/20 hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed text-primary text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add event
          </button>
        </div>
      )}
    </div>
  );
};

const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default EventSidebar;