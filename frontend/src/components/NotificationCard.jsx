import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function NotificationCard() {
  const notifications = useSelector((state) => state.notifications);
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {notifications.map((n, i) => (
            <li
              key={i}
              className="border-b py-2 last:border-0 cursor-pointer"
              onClick={() =>
                navigate(`/candidate/${n.candidateId}?highlight=${n.noteId}`)
              }
            >
              <span className="font-semibold">{n.userName}</span>:{" "}
              {n.message.slice(0, 30)}...
            </li>
          ))}
          {notifications.length === 0 && <li>No notifications yet.</li>}
        </ul>
      </CardContent>
    </Card>
  );
}
