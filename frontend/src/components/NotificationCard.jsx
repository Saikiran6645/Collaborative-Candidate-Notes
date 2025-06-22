import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBell, FaTrash } from "react-icons/fa";
import api from "../api/api";
import { setNotifications } from "../features/notificationsSlice";

export default function NotificationCard() {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      dispatch(setNotifications(notifications.filter((n) => n._id !== id)));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-pink-50 via-rose-100 to-red-50 rounded-2xl shadow-lg border border-rose-200">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaBell className="text-rose-500 text-xl animate-pulse" />
          <CardTitle className="text-2xl font-bold text-rose-600 tracking-tight">
            Notifications ({notifications.length})
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <li
                key={n._id}
                className="flex items-start justify-between gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-rose-50 transition group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/candidate/${n.candidateId}?highlight=${n.noteId}`
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-sm group-hover:bg-rose-200">
                      {n.userName?.[0]?.toUpperCase() || "?"}
                    </div>
                    <p className="text-sm text-gray-700 leading-snug">
                      <span className="font-semibold text-rose-700">
                        {n.userName}
                      </span>{" "}
                      <span className="text-gray-500">mentioned you:</span>
                      <br />
                      <span className="block mt-1 text-gray-800">
                        {n.message.length > 60
                          ? n.message.slice(0, 60) + "..."
                          : n.message}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="text-gray-400 hover:text-red-500 transition p-2 rounded-full"
                  title="Dismiss"
                >
                  <FaTrash />
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center py-4">
              No notifications yet.
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
