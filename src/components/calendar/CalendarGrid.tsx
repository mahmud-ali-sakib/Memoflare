import {
  CalendarEvent,
  COLOR_STYLES,
  DAY_NAMES,
  toDateKey,
} from "@/types/types";

interface Props {
  year: number;
  month: number; // 0-indexed
  selectedDate: string;
  events: CalendarEvent[];
  onSelectDate: (key: string) => void;
}

const CalendarGrid = ({
  year,
  month,
  selectedDate,
  events,
  onSelectDate,
}: Props) => {
  const today = toDateKey(new Date());
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  // build cells: prev-month tail + current + next-month head
  const cells: { dateKey: string; day: number; current: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const prevMonth = month === 0 ? 12 : month;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({
      dateKey: `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      day: d,
      current: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      dateKey: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      day: d,
      current: true,
    });
  }

  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = month === 11 ? 1 : month + 2;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({
      dateKey: `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      day: d,
      current: false,
    });
  }

  const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>(
    (acc, e) => {
      acc[e.date] = acc[e.date] ? [...acc[e.date], e] : [e];
      return acc;
    },
    {},
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-7 flex-1"
        style={{ gridTemplateRows: "repeat(6, 1fr)" }}
      >
        {cells.map(({ dateKey, day, current }) => {
          const isToday = dateKey === today;
          const isSelected = dateKey === selectedDate;
          const dayEvents = eventsByDate[dateKey] ?? [];

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`relative flex flex-col p-2 border-b border-r border-border text-left transition-colors min-h-[80px] ${
                isSelected
                  ? "bg-primary/20"
                  : current
                    ? "hover:bg-muted/30"
                    : "hover:bg-muted/20"
              }`}
            >
              {/* Day number */}
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium mb-1 transition-colors ${
                  isToday
                    ? "bg-primary text-primary-foreground font-bold"
                    : isSelected
                      ? "bg-primary/20 text-primary"
                      : current
                        ? "text-foreground"
                        : "text-muted-foreground/40"
                }`}
              >
                {day}
              </span>

              {/* Event pills — show max 2, then "+N more" */}
              <div className="flex flex-col gap-0.5 w-full">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    className={`truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${COLOR_STYLES[ev.color].pill}`}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[10px] text-muted-foreground pl-1">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
