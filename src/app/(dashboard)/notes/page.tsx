"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import NoteEditor, { Note } from "@/components/notes/Editor";

const PRESET_TAGS = ["Biology", "CS", "History", "Math", "Physics", "English"];

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

type ApiNote = {
  id: string;
  title: string;
  body: string;
  tag: string;
  pinned: boolean;
  updatedAt: string;
};

function parseNote(raw: ApiNote): Note {
  return {
    id: raw.id,
    title: raw.title ?? "",
    body: raw.body ?? "",
    tag: raw.tag ?? "CS",
    pinned: Boolean(raw.pinned),
    updatedAt: new Date(raw.updatedAt),
  };
}

function formatUpdatedAt(value: Date): string {
  const diffMs = Date.now() - value.getTime();
  if (diffMs < 60_000) return "Just now";
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  return value.toLocaleDateString();
}

function mergeTags(notes: Note[]): string[] {
  const fromNotes = notes.map((n) => n.tag);
  return [...new Set([...PRESET_TAGS, ...fromNotes])];
}

function useDebouncedCallback<T extends (note: Note) => void | Promise<void>>(
  fn: T,
  delay: number,
) {
  const fnRef = useRef(fn);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (note: Note) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        void fnRef.current(note);
      }, delay);
    },
    [delay],
  );
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [allTags, setAllTags] = useState<string[]>(PRESET_TAGS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<string>("All");
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/notes");
        if (!res.ok) throw new Error("Failed to load notes");
        const data: ApiNote[] = await res.json();
        const parsed = data.map(parseNote);
        if (cancelled) return;
        setNotes(parsed);
        setAllTags(mergeTags(parsed));
        setSelectedId((prev) => {
          if (prev && parsed.some((n) => n.id === prev)) return prev;
          return parsed[0]?.id ?? null;
        });
      } catch {
        if (!cancelled) {
          setError("Could not load notes. Please refresh.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistNote = useCallback(async (note: Note) => {
    const res = await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: note.title,
        body: note.body,
        tag: note.tag,
        pinned: note.pinned,
      }),
    });
    if (!res.ok) throw new Error("Failed to save note");
    return parseNote(await res.json());
  }, []);

  const debouncedSave = useDebouncedCallback(async (note: Note) => {
    try {
      const saved = await persistNote(note);
      setNotes((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
    } catch {
      setError("Failed to save changes.");
    }
  }, 600);

  const filtered = notes.filter((n) => {
    const matchTag = filterTag === "All" || n.tag === filterTag;
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  const updateNote = (updated: Note) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === updated.id ? { ...updated, updatedAt: new Date() } : n,
      ),
    );
    debouncedSave(updated);
  };

  const addTag = (tag: string) => {
    if (!allTags.includes(tag)) setAllTags((prev) => [...prev, tag]);
  };

  const deleteTag = async (tag: string) => {
    const fallback = allTags.find((t) => t !== tag) ?? "CS";
    const affected = notes.filter((n) => n.tag === tag);

    setAllTags((prev) => prev.filter((t) => t !== tag));
    if (filterTag === tag) setFilterTag("All");
    setNotes((prev) =>
      prev.map((n) => (n.tag === tag ? { ...n, tag: fallback } : n)),
    );

    if (selectedNote?.tag === tag) {
      updateNote({ ...selectedNote, tag: fallback });
    }

    await Promise.all(
      affected.map((n) =>
        persistNote({ ...n, tag: fallback }).catch(() => null),
      ),
    );
  };

  const createNote = async () => {
    if (creating) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "",
          body: "",
          tag: allTags[0] ?? "CS",
        }),
      });
      if (!res.ok) throw new Error("Failed to create note");
      const newNote = parseNote(await res.json());
      setNotes((prev) => [newNote, ...prev]);
      setAllTags((prev) =>
        prev.includes(newNote.tag) ? prev : [...prev, newNote.tag],
      );
      setSelectedId(newNote.id);
      setShowEditor(true);
    } catch {
      setError("Could not create note.");
    } finally {
      setCreating(false);
    }
  };

  const deleteNote = async (id: string) => {
    setError(null);
    const prevNotes = notes;
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (selectedId === id) setSelectedId(remaining[0]?.id ?? null);

    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
    } catch {
      setNotes(prevNotes);
      if (!remaining.some((n) => n.id === selectedId)) setSelectedId(id);
      setError("Could not delete note.");
    }
  };

  const NoteCard = ({ note }: { note: Note }) => {
    const isActive = note.id === selectedId;
    return (
      <div
        onClick={() => {
          setSelectedId(note.id);
          setShowEditor(true);
        }}
        className={`group relative p-4 rounded-2xl cursor-pointer transition-all ${
          isActive
            ? "bg-primary/10 border border-primary/25"
            : "hover:bg-muted/40 border border-transparent"
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="text-sm font-semibold truncate leading-snug">
            {note.title || "Untitled note"}
          </p>
          {note.pinned && (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-3 text-primary shrink-0 mt-0.5"
            >
              <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
            </svg>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">
          {note.body || "No content"}
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTagColor(note.tag)}`}
          >
            {note.tag}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatUpdatedAt(note.updatedAt)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(note.id);
          }}
          className="absolute top-3 right-3 h-6 w-6 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-rose-400 hover:border-rose-400/30 opacity-0 group-hover:opacity-100 transition-all"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <div
        className={`${showEditor ? "hidden md:flex" : "flex"} w-full md:w-72 lg:w-80 flex-col border-r border-border shrink-0`}
      >
        <div className="px-5 pt-6 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading text-xl font-bold tracking-tight">Notes</h1>
            <button
              onClick={createNote}
              disabled={creating}
              className="h-8 w-8 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary flex items-center justify-center transition-colors disabled:opacity-50"
              title="New note"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {error && (
            <p className="mb-3 text-xs text-rose-400 bg-rose-500/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="relative mb-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full h-9 rounded-2xl border border-border bg-background/50 pl-8 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Loading notes...
            </p>
          ) : (
            <>
              {pinned.length > 0 && (
                <>
                  <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                    Pinned
                  </p>
                  {pinned.map((n) => (
                    <NoteCard key={n.id} note={n} />
                  ))}
                  {unpinned.length > 0 && (
                    <p className="px-2 mt-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                      Notes
                    </p>
                  )}
                </>
              )}
              {unpinned.map((n) => (
                <NoteCard key={n.id} note={n} />
              ))}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
                  <span className="text-3xl">📝</span>
                  <p className="text-sm font-medium">No notes found</p>
                  <p className="text-xs">Try a different search or tag</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className={`${showEditor ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0 overflow-hidden`}
      >
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            allTags={allTags}
            onChange={updateNote}
            onClose={() => setShowEditor(false)}
            onAddTag={addTag}
            onDeleteTag={deleteTag}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <span className="text-5xl">📄</span>
            <p className="font-heading text-base font-bold">No note selected</p>
            <p className="text-sm">Pick a note from the list or create a new one</p>
            <button
              onClick={createNote}
              disabled={creating}
              className="mt-2 px-4 py-2 rounded-2xl bg-primary/20 hover:bg-primary/30 text-primary text-sm font-semibold transition-colors disabled:opacity-50"
            >
              + New note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
