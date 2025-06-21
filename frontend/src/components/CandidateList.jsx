import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import api from "../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function CandidateList({ candidates, refetch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addCandidate = async () => {
    if (!name || !email) return;
    await api.post("/candidate", { name, email });
    setName("");
    setEmail("");
    refetch();
    // or queryClient.invalidateQueries(["candidates"]);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Candidates</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {candidates.map((c) => (
            <li
              key={c._id}
              onClick={() => navigate(`/candidate/${c._id}`)}
              className="p-2 hover:bg-muted rounded cursor-pointer"
            >
              {c.name} ({c.email})
            </li>
          ))}
        </ul>
        <div className="flex gap-2 mt-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Button onClick={addCandidate}>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}
