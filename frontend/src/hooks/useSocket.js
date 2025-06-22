import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../features/notificationsSlice";
import { toast } from "react-toastify";
export default function useSocket(candidateId) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    socketRef.current = io("http://localhost:5000");
    if (candidateId)
      socketRef.current.emit("joinRoom", { candidateId, userId: user.id });
    else socketRef.current.emit("joinRoom", { userId: user.id });

    socketRef.current.on("notification", (data) => {
      console.log("Notification received:", data);
      dispatch(addNotification(data));

      toast.info(
        `🔔 ${data.userName}: ${
          data.message || "You have a new notification!"
        }`,
        {
          position: "top-right",
          autoClose: 5000, // 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, candidateId, dispatch]);

  return socketRef;
}
