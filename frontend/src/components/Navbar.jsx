// src/components/Navbar.jsx
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../features/authSlice";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
// import axios from "axios";
import api from "@/api/api";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await api.get("/user/logout");
      dispatch(logout());

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <nav className="fixed top-0 left-0 w-full h-12 bg-indigo-600 text-white flex items-center px-6 shadow-md z-50">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-lg font-semibold hover:opacity-90">
          Collaborative Notes
        </Link>
        {user && (
          <>
            <FaUserCircle className="ml-2 text-lg text-indigo-200" />
            <span className="text-sm text-indigo-100">{user.name}</span>
          </>
        )}
      </div>
      {user && (
        <button
          onClick={handleLogout}
          className="ml-auto flex items-center gap-1 bg-indigo-500 hover:bg-indigo-700 px-2 py-1 rounded text-sm transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      )}
    </nav>
  );
}
