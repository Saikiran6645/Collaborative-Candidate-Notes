import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import CandidateList from "../components/CandidateList";
import NotificationCard from "../components/NotificationCard";
import { useSelector, useDispatch } from "react-redux";
import useSocket from "../hooks/useSocket";
import { setNotifications } from "../features/notificationsSlice";
import { FaUserAlt, FaBell } from "react-icons/fa";

export default function Dashboard() {
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setNotifications(data));
    },
  });
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useSocket();
  useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get("/notifications").then((res) => res.data),
    onSuccess: (data) => dispatch(setNotifications(data)),
    enabled: !!user,
  });

  // Fetch candidates
  const { data: candidates = [], refetch: refetchCandidates } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await api.get("/candidate");
      return res.data;
    },
  });

  // Fetch notifications

  return (
    <div className="container mx-auto py-10 min-h-screen bg-gradient-to-tr from-[#fdfbfb] via-[#ebedee] to-[#dfe9f3]">
      {/* Welcome Banner */}
      <div className="rounded-2xl shadow-xl bg-gradient-to-r from-indigo-100 to-purple-100 px-10 py-8 mb-12 border border-indigo-200 text-center">
        <h2 className="text-5xl font-extrabold text-indigo-800 mb-3 tracking-tight">
          Welcome, <span className="text-purple-600">{user.name}</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Manage candidates, track collaboration notes, and receive real-time
          notifications – all in one place.
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Candidates Section */}
        <div className="rounded-2xl shadow-lg bg-white p-6 border border-indigo-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <div className="flex items-center mb-5">
            <FaUserAlt className="text-indigo-600 text-2xl" />
            <h3 className="text-xl font-semibold text-slate-800 ml-3">
              Candidates
            </h3>
            <span className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-ping" />
          </div>
          <hr className="border-indigo-200 mb-5" />
          <CandidateList candidates={candidates} refetch={refetchCandidates} />
        </div>

        {/* Notifications Section */}
        <div className="rounded-2xl shadow-lg bg-white p-6 border border-pink-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <div className="flex items-center mb-5">
            <FaBell className="text-pink-500 text-2xl" />
            <h3 className="text-xl font-semibold text-slate-800 ml-3">
              Notifications
            </h3>
          </div>
          <hr className="border-pink-200 mb-5" />
          <NotificationCard />
        </div>
      </div>
    </div>
  );
}
