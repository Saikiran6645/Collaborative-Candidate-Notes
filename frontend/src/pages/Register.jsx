import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/authSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RingLoader } from "react-spinners";

export default function Register() {
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/user/register", { name, email, password });
      dispatch(setAuth({ token: res.data.token, user: res.data.user }));
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl border border-indigo-200 bg-white hover:shadow-2xl transition duration-300">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-extrabold text-indigo-700 tracking-tight">
            Create an Account
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Join now and start collaborating!
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              type="email"
              className="focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <RingLoader size={24} color="#fff" /> : "Register"}
            </Button>
            {err && (
              <div className="text-red-500 bg-red-50 border border-red-200 rounded p-2 text-sm">
                {err}
              </div>
            )}
            <div className="text-sm text-center mt-2 text-slate-600">
              Already have an account?{" "}
              <Link
                className="text-indigo-600 hover:underline font-medium"
                to="/login"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
