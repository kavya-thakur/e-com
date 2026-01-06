import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ---------------- Skeleton Loader ----------------
  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-36 rounded bg-gray-200 shimmer" />
          <div className="h-4 w-60 rounded bg-gray-200 shimmer" />
        </div>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl  bg-white/70 backdrop-blur-sm p-6 space-y-5 shimmer-card"
          >
            <div className="flex justify-between">
              <div className="h-4 w-28 rounded bg-gray-200 shimmer" />
              <div className="h-5 w-20 rounded bg-gray-200 shimmer" />
            </div>

            <div className="space-y-4">
              {[1, 2].map((k) => (
                <div key={k} className="flex gap-4">
                  <div className="w-20 h-24 rounded-xl bg-gray-200 shimmer" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 bg-gray-200 shimmer rounded" />
                    <div className="h-3 w-24 bg-gray-200 shimmer rounded" />
                  </div>
                  <div className="h-4 w-10 bg-gray-200 shimmer rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  // ---------------- Empty State ----------------
  if (orders.length === 0)
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center px-6 text-center">
        <Package className="w-10 h-10 text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold">No orders yet</h3>
        <p className="text-gray-500 text-sm mt-1">
          When you place an order, it will appear here.
        </p>
      </div>
    );

  const variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 110,
        damping: 22,
      },
    }),
    exit: { opacity: 0, y: 14, scale: 0.98 },
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Orders
        </h1>
        <p className="text-gray-500 mt-2">
          View, track, and manage your purchases.
        </p>
      </div>

      <AnimatePresence>
        <div className="space-y-9">
          {orders.map((order, i) => {
            const status = order.status?.toLowerCase();

            const badge = {
              pending: {
                icon: <Clock className="w-4 h-4" />,
                cls: "bg-amber-50 text-amber-700 border-amber-200",
              },
              completed: {
                icon: <CheckCircle2 className="w-4 h-4" />,
                cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
              },
              failed: {
                icon: <AlertCircle className="w-4 h-4" />,
                cls: "bg-rose-50 text-rose-700 border-rose-200",
              },
            }[status] || {
              icon: <Package className="w-4 h-4" />,
              cls: "bg-gray-50 text-gray-700 border-gray-200",
            };

            return (
              <motion.div
                key={order.id}
                custom={i}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-sm p-6 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.15)] transition-all"
              >
                {/* Top */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Order ID</p>
                    <p className="text-sm mt-0.5">{order.order_id}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm font-medium ${badge.cls}`}
                  >
                    {badge.icon}
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {order.items?.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-5 py-5"
                    >
                      <div className="w-20 h-24 rounded-xl overflow-hidden  bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-gray-500 text-sm mt-0.5">
                          Qty {item.qty} — Size {item.size}
                        </p>
                      </div>

                      <p className="font-semibold">₹{item.price}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom */}
                <div className="flex flex-wrap justify-between items-center mt-6 text-sm">
                  <p className="text-gray-500">
                    Placed on{" "}
                    <span className="font-medium">
                      {order.createdAt?.toDate
                        ? order.createdAt.toDate().toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </p>

                  <button className="flex items-center gap-1.5 text-gray-800 hover:text-black transition">
                    <span className="text-base font-semibold">
                      ₹{order.total}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
