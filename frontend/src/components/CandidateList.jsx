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
  };

  return (
    <Card className="rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-indigo-700">
          Candidates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-indigo-100">
          {candidates.map((c) => (
            <li
              key={c._id}
              onClick={() => navigate(`/candidate/${c._id}`)}
              className="p-3 bg-white rounded-md hover:bg-indigo-50 cursor-pointer transition-all duration-200"
            >
              <span className="font-medium text-indigo-800">{c.name}</span>
              <span className="ml-2 text-sm text-gray-500">({c.email})</span>
            </li>
          ))}
        </ul>

        {/* Add Candidate Form */}
        <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-700 mb-3">
            Add New Candidate
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="focus:ring-2 focus:ring-indigo-300"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="focus:ring-2 focus:ring-indigo-300"
            />
            <Button
              onClick={addCandidate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
