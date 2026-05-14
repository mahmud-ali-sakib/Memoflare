"use client";
import { useState } from "react";
import NoteEditor, { Note } from "@/components/notes/Editor";

// ── Seed data ──────────────────────────────────────────────────
const SEED_NOTES: Note[] = [
  {
    id: 1,
    title: "Chapter 4 — Cell Biology",
    body: "The cell is the basic structural and functional unit of life. Prokaryotic cells lack a nucleus, while eukaryotic cells have a membrane-bound nucleus.\n\nKey organelles:\n- Mitochondria: powerhouse of the cell (ATP production)\n- Ribosome: protein synthesis\n- Endoplasmic reticulum: transport network\n- Golgi apparatus: packaging and dispatch",
    tag: "Biology",
    pinned: true,
    updatedAt: "2h ago",
  },
  {
    id: 2,
    title: "Sorting Algorithms",
    body: "Comparison of common sorting algorithms:\n\nBubble Sort — O(n²) worst case, simple but slow.\nMerge Sort — O(n log n), divide and conquer, stable.\nQuick Sort — O(n log n) average, in-place, fast in practice.\nHeap Sort — O(n log n), not stable but good space complexity.",
    tag: "CS",
    pinned: true,
    updatedAt: "Yesterday",
  },
  {
    id: 3,
    title: "The French Revolution",
    body: "Causes: financial crisis, social inequality (Three Estates), Enlightenment ideas.\n\nKey events:\n1789 — Storming of the Bastille\n1791 — Constitutional monarchy established\n1793 — Reign of Terror under Robespierre\n1799 — Napoleon's coup (18 Brumaire)",
    tag: "History",
    pinned: false,
    updatedAt: "2 days ago",
  },
  {
    id: 4,
    title: "Quadratic Equations",
    body: "Standard form: ax² + bx + c = 0\n\nQuadratic formula: x = (-b ± √(b²-4ac)) / 2a\n\nDiscriminant (b²-4ac):\n> 0 → two real roots\n= 0 → one real root\n< 0 → no real roots (complex)",
    tag: "Math",
    pinned: false,
    updatedAt: "3 days ago",
  },
  {
    id: 5,
    title: "Newton's Laws of Motion",
    body: "1st Law (Inertia): An object at rest stays at rest unless acted on by a net force.\n\n2nd Law: F = ma. Force equals mass times acceleration.\n\n3rd Law: For every action there is an equal and opposite reaction.",
    tag: "Physics",
    pinned: false,
    updatedAt: "4 days ago",
  },
  {
    id: 6,
    title: "Shakespearean Sonnets",
    body: "Structure: 14 lines in iambic pentameter.\nRhyme scheme: ABAB CDCD EFEF GG (Shakespearean) or ABBA ABBA CDC DCD (Petrarchan).\n\nSonnet 18: 'Shall I compare thee to a summer's day?'\nTheme: the immortality of art vs the transience of nature.",
    tag: "English",
    pinned: false,
    updatedAt: "5 days ago",
  },
];

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

// ── Main page ──────────────────────────────────────────────────
const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);
  const [allTags, setAllTags] = useState<string[]>(PRESET_TAGS);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<string>("All");
  const [showEditor, setShowEditor] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

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
      prev.map((n) => (n.id === updated.id ? { ...updated, updatedAt: "Just now" } : n))
    );
  };

  const addTag = (tag: string) => {
    if (!allTags.includes(tag)) {
      setAllTags((prev) => [...prev, tag]);
    }
  };

  const deleteTag = (tag: string) => {
    setAllTags((prev) => prev.filter((t) => t !== tag));
    setNotes((prev) =>
      prev.map((n) => (n.tag === tag ? { ...n, tag: "CS" } : n))
    );
    if (filterTag === tag) setFilterTag("All");
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "",
      body: "",
      tag: allTags[0] ?? "CS",
      pinned: false,
      updatedAt: "Just now",
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setShowEditor(true);
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(notes[0]?.id ?? null);
  };

  const NoteCard = ({ note }: { note: Note }) => {
    const isActive = note.id === selectedId;
    return (
      <div
        onClick={() => { setSelectedId(note.id); setShowEditor(true); }}
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
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 text-primary shrink-0 mt-0.5">
              <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
            </svg>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">
          {note.body || "No content"}
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTagColor(note.tag)}`}>
            {note.tag}
          </span>
          <span className="text-[10px] text-muted-foreground">{note.updatedAt}</span>
        </div>

        {/* Delete note */}
        <button
          onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
          className="absolute top-3 right-3 h-6 w-6 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-rose-400 hover:border-rose-400/30 opacity-0 group-hover:opacity-100 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Sidebar list ── */}
      <div className={`${showEditor ? "hidden md:flex" : "flex"} w-full md:w-72 lg:w-80 flex-col border-r border-border shrink-0`}>
        <div className="px-5 pt-6 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading text-xl font-bold tracking-tight">Notes</h1>
            <button
              onClick={createNote}
              className="h-8 w-8 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary flex items-center justify-center transition-colors"
              title="New note"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full h-9 rounded-2xl border border-border bg-background/50 pl-8 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 transition-colors"
            />
          </div>
        </div>

        {/* Note list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {pinned.length > 0 && (
            <>
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Pinned
              </p>
              {pinned.map((n) => <NoteCard key={n.id} note={n} />)}
              {unpinned.length > 0 && (
                <p className="px-2 mt-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  Notes
                </p>
              )}
            </>
          )}
          {unpinned.map((n) => <NoteCard key={n.id} note={n} />)}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
              <span className="text-3xl">📝</span>
              <p className="text-sm font-medium">No notes found</p>
              <p className="text-xs">Try a different search or tag</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Editor ── */}
      <div className={`${showEditor ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0 overflow-hidden`}>
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
              className="mt-2 px-4 py-2 rounded-2xl bg-primary/20 hover:bg-primary/30 text-primary text-sm font-semibold transition-colors"
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