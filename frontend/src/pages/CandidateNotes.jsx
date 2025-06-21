import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/api";
import useSocket from "../hooks/useSocket";
import { useSelector } from "react-redux";
import NotesPanel from "../components/NotesPanel";
import { useQuery } from "@tanstack/react-query";

export default function CandidateNotes() {
  const { id } = useParams();
  const location = useLocation();
  const highlightId = new URLSearchParams(location.search).get("highlight");
  const { user } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const socketRef = useSocket(id);

  // Fetch notes
  const { data: notesData = [], refetch } = useQuery({
    queryKey: ["notes", id],
    queryFn: async () => {
      const res = await api.get(`/notes/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    setNotes(notesData);
  }, [notesData]);

  // Fetch users for tagging
  useEffect(() => {
    api.get("/user/all").then((res) => setAllUsers(res.data));
  }, []);

  // Real-time notes
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("receiveNote", (data) =>
      setNotes((n) => [...n, data])
    );
    return () => {
      socketRef.current?.off("receiveNote");
    };
  }, [socketRef]);

  // Tagging suggestions
  const handleChange = (e) => {
    setMessage(e.target.value);
    const match = e.target.value.match(/@(\w*)$/);
    if (match) {
      const input = match[1].toLowerCase();
      setSuggestions(
        allUsers.filter((u) => u.name.toLowerCase().startsWith(input))
      );
    } else setSuggestions([]);
  };

  const selectSuggestion = (name) => {
    setMessage((msg) => msg.replace(/@\w*$/, `@${name} `));
    setSuggestions([]);
  };

  // Send note
  const sendNote = () => {
    // Extract tagged usernames
    const tags = Array.from(message.matchAll(/@([a-zA-Z0-9_]+)/g)).map((m) =>
      m[1].trim().toLowerCase()
    );

    const taggedUsers = allUsers
      .filter((u) => tags.includes(u.name.trim().toLowerCase()))
      .map((u) => u._id);

    console.log("Tagged Users:", taggedUsers);
    const data = {
      candidateId: id,
      userId: user.id,
      userName: user.name,
      message,
      taggedUsers,
      createdAt: new Date().toISOString(),
    };
    socketRef.current.emit("newNote", data);
    setNotes((n) => [...n, data]);
    setMessage("");
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Notes for Candidate</h2>
      <div className="max-w-2xl mx-auto">
        <NotesPanel
          notes={notes}
          sendNote={sendNote}
          message={message}
          setMessage={handleChange}
          suggestions={suggestions}
          selectSuggestion={selectSuggestion}
          allUsers={allUsers}
          highlightId={highlightId}
        />
      </div>
    </div>
  );
}
