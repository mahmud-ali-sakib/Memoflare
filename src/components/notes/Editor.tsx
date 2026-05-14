"use client";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────
type Tag = string;

interface Note {
  id: number;
  title: string;
  body: string;
  tag: Tag;
  pinned: boolean;
  updatedAt: string;
}

const PRESET_TAG_COLORS: Record<string, string> = {
  Biology: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  CS: "bg-primary/15 text-primary border-primary/20",
  History: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Math: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Physics: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  English: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

const getTagColor = (tag: string) =>
  PRESET_TAG_COLORS[tag] ?? "bg-muted/40 text-foreground border-border";

// ── Editor Panel ───────────────────────────────────────────────
interface EditorProps {
  note: Note;
  allTags: string[];
  onChange: (n: Note) => void;
  onClose: () => void;
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
}

const Editor = ({
  note,
  allTags,
  onChange,
  onClose,
  onAddTag,
  onDeleteTag,
}: EditorProps) => {
  const [customInput, setCustomInput] = useState("");

  const addCustomTag = () => {
    const val = customInput.trim();
    if (!val) return;
    onAddTag(val);
    onChange({ ...note, tag: val });
    setCustomInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          {/* Mobile back */}
          <button
            onClick={onClose}
            className="md:hidden h-8 w-8 rounded-xl hover:bg-muted/60 flex items-center justify-center text-muted-foreground transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Tag pills with delete */}
          <div className="flex gap-1.5 flex-wrap items-center">
            {allTags.map((t) => (
              <div
                key={t}
                className={`flex items-center gap-1 text-[10px] font-semibold pl-2.5 pr-1.5 py-1 rounded-full border transition-all ${
                  note.tag === t
                    ? getTagColor(t)
                    : "border-border text-muted-foreground hover:border-border/80"
                }`}
              >
                <button onClick={() => onChange({ ...note, tag: t })}>
                  {t}
                </button>
                <button
                  onClick={() => {
                    onDeleteTag(t);
                    if (note.tag === t) {
                      onChange({ ...note, tag: allTags.find((tag) => tag !== t) ?? "CS" });
                    }
                  }}
                  className="opacity-50 hover:opacity-100 hover:text-rose-400 transition-all"
                  title={`Delete tag "${t}"`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Custom tag input */}
            <div className="flex items-center gap-1 border border-border rounded-full overflow-hidden bg-background/50 pl-2.5 pr-1">
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
                placeholder="Add tag..."
                className="text-[10px] w-16 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50 py-1"
              />
              <button
                onClick={addCustomTag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-semibold shrink-0"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Pin + auto-saved */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onChange({ ...note, pinned: !note.pinned })}
            className={`h-8 w-8 rounded-xl flex items-center justify-center transition-colors ${
              note.pinned
                ? "bg-primary/15 text-primary"
                : "hover:bg-muted/60 text-muted-foreground"
            }`}
            title={note.pinned ? "Unpin" : "Pin"}
          >
            <svg viewBox="0 0 24 24" fill={note.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
            </svg>
          </button>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs text-muted-foreground">Auto-saved</span>
        </div>
      </div>

      {/* Active tag display */}
      <div className="px-6 pt-4 shrink-0">
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${getTagColor(note.tag)}`}>
          {note.tag}
        </span>
      </div>

      {/* Title */}
      <div className="px-6 pt-3 pb-2 shrink-0">
        <input
          value={note.title}
          onChange={(e) => onChange({ ...note, title: e.target.value })}
          placeholder="Note title..."
          className="w-full bg-transparent font-heading text-2xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40 outline-none"
        />
      </div>

      {/* Body */}
      <div className="flex-1 px-6 pb-6 min-h-0">
        <textarea
          value={note.body}
          onChange={(e) => onChange({ ...note, body: e.target.value })}
          placeholder="Start writing your notes here..."
          className="w-full h-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none resize-none leading-relaxed"
        />
      </div>
    </div>
  );
};

export default Editor;
export type { Note };