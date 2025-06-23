import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/authSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", { email, password });
      dispatch(setAuth({ token: res.data.token, user: res.data.user }));
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl border border-indigo-200 bg-white hover:shadow-2xl transition duration-300">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-extrabold text-indigo-700 tracking-tight">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">Log in to continue</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              type="email"
              className="focus:ring-2 focus:ring-indigo-400"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="focus:ring-2 focus:ring-indigo-400"
            />
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Login
            </Button>
            {err && (
              <div className="text-red-500 bg-red-50 border border-red-200 rounded p-2 text-sm">
                {err}
              </div>
            )}
            <div className="text-sm text-center mt-2 text-slate-600">
              Don't have an account?{" "}
              <Link
                className="text-indigo-600 hover:underline font-medium"
                to="/register"
              >
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
