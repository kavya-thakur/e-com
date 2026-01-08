import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, { displayName: name });
      await setDoc(doc(db, "users", res.user.uid), {
        name,
        email,
        role: "customer",
        createdAt: new Date(),
      });

      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Account could not be created. Try another email.");
    }
  };

  return (
    <div className="h-[85vh] flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-50/80 shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create account
        </h1>
        <p className="text-gray-500 text-sm">
          Join us for a faster checkout experience.
        </p>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            required
            className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
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
            Create account
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
