"use client";
import { useState, useEffect, useRef } from "react";

type FocusTimerProps = {
  onSessionComplete?: () => void;
};

const FocusTimer = ({ onSessionComplete }: FocusTimerProps) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [totalSeconds, setTotalSeconds] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const plannedRef = useRef(0);
  const onCompleteRef = useRef(onSessionComplete);

  useEffect(() => {
    onCompleteRef.current = onSessionComplete;
  }, [onSessionComplete]);

  const saveSession = async (completedSeconds: number) => {
    if (completedSeconds <= 0) return;
    try {
      await fetch("/api/focus-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plannedSeconds: plannedRef.current,
          completedSeconds,
          status: "completed",
        }),
      });
      onCompleteRef.current?.();
    } catch {
      // session save failed silently
    }
  };

  const clamp = (val: number, min: number, max: number) =>
    Math.min(max, Math.max(min, val));

  const start = () => {
    const secs = hours * 3600 + minutes * 60;
    if (secs <= 0) return;
    plannedRef.current = secs;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setRunning(true);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setTotalSeconds(null);
    setSecondsLeft(0);
    plannedRef.current = 0;
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            const completed = plannedRef.current;
            void saveSession(completed);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const displayH = Math.floor(secondsLeft / 3600);
  const displayM = Math.floor((secondsLeft % 3600) / 60);
  const displayS = secondsLeft % 60;
  const progress = totalSeconds ? (secondsLeft / totalSeconds) * 100 : 0;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-bold tracking-tight">Focus Timer</h2>
        <span className="text-lg">◷</span>
      </div>

      {!running && totalSeconds === null ? (
        <>
          <p className="text-xs text-muted-foreground -mt-2">Set your focus duration</p>

          {/* Hour / minute spinners */}
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Hours
              </label>
              <div className="flex items-center h-10 rounded-2xl border border-border bg-background/50 overflow-hidden">
                <button
                  onClick={() => setHours((h) => clamp(h - 1, 0, 23))}
                  className="px-3 text-muted-foreground hover:text-foreground transition-colors text-sm select-none"
                >−</button>
                <span className="flex-1 text-center font-heading text-sm font-bold">{pad(hours)}</span>
                <button
                  onClick={() => setHours((h) => clamp(h + 1, 0, 23))}
                  className="px-3 text-muted-foreground hover:text-foreground transition-colors text-sm select-none"
                >+</button>
              </div>
            </div>

            <span className="text-muted-foreground pb-2.5 font-bold text-lg">:</span>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Minutes
              </label>
              <div className="flex items-center h-10 rounded-2xl border border-border bg-background/50 overflow-hidden">
                <button
                  onClick={() => setMinutes((m) => clamp(m - 5, 0, 55))}
                  className="px-3 text-muted-foreground hover:text-foreground transition-colors text-sm select-none"
                >−</button>
                <span className="flex-1 text-center font-heading text-sm font-bold">{pad(minutes)}</span>
                <button
                  onClick={() => setMinutes((m) => clamp(m + 5, 0, 55))}
                  className="px-3 text-muted-foreground hover:text-foreground transition-colors text-sm select-none"
                >+</button>
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "25m", h: 0, m: 25 },
              { label: "45m", h: 0, m: 45 },
              { label: "1h", h: 1, m: 0 },
              { label: "1h 30m", h: 1, m: 30 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => { setHours(p.h); setMinutes(p.m); }}
                className="px-3 py-1 rounded-full border border-border text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={start}
            disabled={hours === 0 && minutes === 0}
            className="w-full h-10 rounded-2xl bg-primary/20 hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed text-primary text-sm font-semibold transition-colors"
          >
            Start session
          </button>
        </>
      ) : (
        <>
          {/* Circular countdown */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-28 w-28">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="currentColor" strokeWidth="6"
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-xl font-bold tracking-tight">
                  {displayH > 0 ? `${pad(displayH)}:` : ""}{pad(displayM)}:{pad(displayS)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {running ? "focusing" : "done!"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className="flex-1 h-10 rounded-2xl bg-primary/20 hover:bg-primary/30 text-primary text-sm font-semibold transition-colors"
            >
              {running ? "Pause" : "Resume"}
            </button>
            <button
              onClick={reset}
              className="flex-1 h-10 rounded-2xl border border-border hover:bg-muted/40 text-muted-foreground text-sm font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FocusTimer;