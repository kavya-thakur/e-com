import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { easeIn, motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successfully");
      navigate(redirectPath);
    } catch (err) {
      setError("Incorrect email or password.");
    }
  };

  return (
    <motion.div
      initial={{ y: 24 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.25, ease: easeIn }}
      className="h-[85vh] flex flex-col items-center justify-center px-6"
    >
      <div className="max-w-md w-full bg-gray-50/80 shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-gray-500 text-sm">
          Sign in to continue your shopping experience.
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90">
            Sign in
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
