import api from "@/api/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
export default function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  return token ? children : <Navigate to="/login" />;
}
