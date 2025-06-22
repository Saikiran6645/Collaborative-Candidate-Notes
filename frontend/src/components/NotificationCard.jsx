import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";

export default function NotificationCard() {
  const notifications = useSelector((state) => state.notifications);
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-pink-50 via-rose-100 to-red-50 rounded-2xl shadow-xl border border-rose-200">
      <CardHeader className="flex items-center gap-2">
        <FaBell className="text-rose-500 text-xl animate-pulse" />
        <CardTitle className="text-2xl font-bold text-rose-600 tracking-tight">
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n, i) => (
              <li
                key={i}
                onClick={() =>
                  navigate(
                    `/candidate/${n.candidateId}?highlight=${n.noteId || ""}`
                  )
                }
                className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg hover:bg-rose-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="h-9 w-9 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-sm group-hover:bg-rose-200">
                  {n.userName?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-snug">
                    <span className="font-semibold text-rose-700">
                      {n.userName}
                    </span>{" "}
                    <span className="text-gray-500">tagged a note:</span>
                    <br />
                    <span className="block mt-1 text-gray-800">
                      {n.message.length > 60
                        ? n.message.slice(0, 60) + "..."
                        : n.message}
                    </span>
                  </p>
                </div>
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
