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
      dispatch(addNotification(data));
      toast.info(`🔔 You were mentioned by ${data.userName}`);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, candidateId, dispatch]);

  return socketRef;
}
