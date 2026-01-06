import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, LogOut, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (!u) navigate("/login");
    });

    return () => unsub();
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          My Account
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your profile and view your activity.
        </p>
      </motion.div>

      {/* Account Card — unchanged styles */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-sm p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-700" />
          </div>

          <div className="flex-1">
            <p className="font-medium text-lg">
              {user?.displayName || "Customer"}
            </p>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
              onClick={() => signOut(auth)}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Orders Link — unchanged */}
      <Link to="/orders">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="mt-6 rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-sm p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-700" />
            </div>

            <div>
              <p className="font-medium">View My Orders</p>
              <p className="text-gray-500 text-sm">
                Track past and current purchases.
              </p>
            </div>
          </div>

          <span className="text-gray-400 text-xl">→</span>
        </motion.div>
      </Link>
    </div>
  );
}
