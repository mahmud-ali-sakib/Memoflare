// src/types/note.ts (suggested)
export type NoteDoc = {
  _id: string;          
  userId: string;
  title: string;
  body: string;
  tag: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
};