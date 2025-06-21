import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import CandidateList from "../components/CandidateList";
import NotificationCard from "../components/NotificationCard";
import { useSelector, useDispatch } from "react-redux";
import useSocket from "../hooks/useSocket";
import { setNotifications } from "../features/notificationsSlice";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Socket connection for real-time updates
  useSocket();

  // Fetch candidates
  const { data: candidates = [], refetch: refetchCandidates } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await api.get("/candidate");
      return res.data;
    },
  });

  // Fetch notifications from backend on load and persist to Redux
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setNotifications(data));
    },
    enabled: !!user, // Only fetch if user is available
  });

  return (
    <div className="container mx-auto py-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="rounded-xl shadow-lg bg-white px-8 py-6 mb-10 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">
          Welcome, <span className="text-blue-600">{user.name}</span>
        </h2>
        <p className="text-lg text-slate-600 text-center">
          Here’s an overview of your dashboard. Track candidates and receive
          real-time notifications.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg shadow-md bg-white p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-4">
            <span className="text-xl font-semibold text-slate-800">
              Candidates
            </span>
            <span className="ml-2 inline-block h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
          <hr className="border-slate-200 mb-6" />
          <CandidateList candidates={candidates} refetch={refetchCandidates} />
        </div>
        <div className="rounded-lg shadow-md bg-white p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-4">
            <span className="text-xl font-semibold text-slate-800">
              Notifications
            </span>
          </div>
          <hr className="border-slate-200 mb-6" />
          <NotificationCard />
        </div>
      </div>
    </div>
  );
}
