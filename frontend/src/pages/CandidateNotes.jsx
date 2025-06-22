import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/api";
import useSocket from "../hooks/useSocket";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { FaPaperPlane } from "react-icons/fa";

export default function CandidateNotes() {
  const { id } = useParams();
  const highlightId = new URLSearchParams(useLocation().search).get(
    "highlight"
  );
  const { user } = useSelector((state) => state.auth);

  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const socketRef = useSocket(id);
  const bottomRef = useRef(null);

  // Fetch candidate data to get candidate.name
  const { data: candidate = {} } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => api.get(`/candidate/${id}`).then((res) => res.data),
  });

  // Load existing notes
  const { data: notesData = [] } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => api.get(`/notes/${id}`).then((res) => res.data),
  });
  useEffect(() => setNotes(notesData), [notesData]);

  // Auto-scroll on new incoming notes
  useEffect(
    () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    [notes]
  );

  // Load users for @-mention
  useEffect(() => {
    api.get("/user/all").then((res) => setAllUsers(res.data));
  }, []);

  // Listen for live real-time notes
  useEffect(() => {
    if (!socketRef.current) return;
    const handler = (data) => setNotes((prev) => [...prev, data]);
    socketRef.current.on("receiveNote", handler);
    return () => socketRef.current.off("receiveNote", handler);
  }, [socketRef]);

  // Handle typing & @-suggestions
  const handleChange = (e) => {
    const val = e.target.value;
    setMessage(val);
    const match = val.match(/@(\w*)$/);
    if (match) {
      const prefix = match[1].toLowerCase();
      setSuggestions(
        allUsers.filter((u) => u.name.toLowerCase().startsWith(prefix))
      );
    } else {
      setSuggestions([]);
    }
  };
  const selectSuggestion = (name) => {
    setMessage((msg) => msg.replace(/@\w*$/, `@${name} `));
    setSuggestions([]);
  };

  const canSend = message.trim().length > 0;

  const sendNote = () => {
    if (!canSend || !socketRef.current) return;
    const tags = Array.from(message.matchAll(/@([a-zA-Z0-9_]+)/g), (m) =>
      m[1].toLowerCase()
    );
    const taggedUsers = allUsers
      .filter((u) => tags.includes(u.name.toLowerCase()))
      .map((u) => u._id);
    const data = {
      candidateId: id,
      userId: user.id,
      userName: user.name,
      message: message.trim(),
      taggedUsers,
      createdAt: new Date().toISOString(),
    };
    socketRef.current.emit("newNote", data);
    setMessage("");
  };

  return (
    <div className="pt-16 container mx-auto max-w-3xl h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="bg-white rounded-xl shadow-lg flex flex-col flex-grow border border-gray-200 overflow-hidden transform transition-all duration-200">
        <div className="px-6 py-4 border-b border-indigo-200 bg-gradient-to-r from-indigo-100 to-purple-100">
          <h2 className="text-2xl font-bold text-indigo-800">
            💬 Chat with {candidate.name || "Candidate"}{" "}
            {/* dynamic candidate name */}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-indigo-50">
          {notes.map((note) => {
            const isMe = note.userId === user.id;
            return (
              <div
                key={note._id || note.createdAt}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl shadow transition-colors duration-300 ${
                    isMe
                      ? "bg-indigo-200 hover:bg-indigo-300"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <span
                    className={`block font-semibold ${
                      isMe
                        ? "text-sm italic text-gray-600"
                        : "text-sm text-indigo-700"
                    }`}
                  >
                    {isMe ? "You" : note.userName}
                  </span>
                  <p className="mt-1 text-lg">{note.message}</p>
                  <time className="text-xs text-gray-500 block text-right mt-1">
                    {new Date(note.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input & Suggestions */}
        <div className="px-6 py-4 bg-white border-t border-indigo-200 relative">
          {suggestions.length > 0 && (
            <ul className="absolute bottom-full mb-2 left-6 right-6 max-h-48 overflow-y-auto bg-white rounded-md shadow-lg border border-gray-200 z-10 animate-fade-in">
              {suggestions.map((s) => (
                <li
                  key={s._id}
                  onClick={() => selectSuggestion(s.name)}
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer transition"
                >
                  @{s.name}
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={message}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (canSend) sendNote();
                  else e.preventDefault();
                }
              }}
              placeholder="Type a message... use @ to tag"
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-300 shadow-sm transition"
            />
            <button
              onClick={sendNote}
              disabled={!canSend}
              className={`bg-indigo-600 text-white p-3 rounded-full transform transition ${
                canSend
                  ? "hover:bg-indigo-700 hover:scale-105"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
