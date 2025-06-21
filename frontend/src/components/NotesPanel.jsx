import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "../api/api";
import { useEffect, useRef, useState } from "react";

export default function NotesPanel({
  notes,
  sendNote,
  message,
  setMessage,
  suggestions,
  selectSuggestion,
  allUsers,
  highlightId,
}) {
  const messagesRef = useRef(null);

  useEffect(() => {
    if (highlightId && messagesRef.current) {
      const el = document.getElementById(highlightId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId, notes]);

  return (
    <div>
      <div
        ref={messagesRef}
        className="h-72 overflow-y-scroll border rounded p-2 bg-background mb-4"
      >
        {notes.map((note) => (
          <div
            key={note._id || note.createdAt}
            id={note._id || note.createdAt}
            className={`mb-2 p-2 rounded ${
              note._id === highlightId ? "bg-yellow-100" : "bg-white"
            }`}
          >
            <span className="font-semibold">{note.userName}</span>:{" "}
            {note.message}
          </div>
        ))}
      </div>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendNote();
        }}
      >
        <div className="relative">
          <Input
            value={message}
            onChange={setMessage}
            placeholder="Write a note... use @username to tag"
          />
          {suggestions.length > 0 && (
            <div className="absolute bg-white border rounded w-full z-10">
              {suggestions.map((s) => (
                <div
                  key={s._id}
                  onClick={() => selectSuggestion(s.name)}
                  className="p-2 hover:bg-muted cursor-pointer"
                >
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit" className="self-end">
          Send
        </Button>
      </form>
    </div>
  );
}
