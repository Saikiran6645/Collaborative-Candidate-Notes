import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function NotesPanel({
  notes,
  sendNote,
  message,
  setMessage,
  suggestions,
  selectSuggestion,
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
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-inner space-y-4"
      >
        {notes.map((note) => (
          <div
            key={note._id || note.createdAt}
            id={note._id || note.createdAt}
            className={`p-3 max-w-lg rounded-xl transition-shadow ${
              note._id === highlightId
                ? "bg-yellow-100 border border-yellow-400 shadow"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <p className="text-sm text-gray-800">
              <span className="font-semibold text-indigo-600">
                {note.userName}
              </span>{" "}
              <span className="text-gray-500">says:</span>
            </p>
            <p className="mt-1 text-gray-700">{note.message}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center text-gray-500">No notes yet.</div>
        )}
      </div>

      {/* Input and suggestions */}
      <form
        className="mt-4 flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendNote();
        }}
      >
        <div className="relative">
          <Input
            value={message}
            onChange={setMessage}
            placeholder="Type your note here... use @ to tag"
            className="pl-4 pr-10 py-2 rounded-lg shadow focus:ring-2 focus:ring-indigo-400"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow w-full mt-1">
              {suggestions.map((s) => (
                <div
                  key={s._id}
                  onClick={() => selectSuggestion(s.name)}
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                >
                  @{s.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          type="submit"
          className="self-end flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-full"
        >
          <FaPaperPlane className="text-sm" />
          Send
        </Button>
      </form>
    </div>
  );
}
