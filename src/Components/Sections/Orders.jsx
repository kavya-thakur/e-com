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
          orderBy("createdAt", "desc"),
        );

        const snap = await getDocs(q);
        const ordersList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(ordersList);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading)
    return (
      <div className="p-20 text-center font-medium">
        Loading your order history...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Package className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold">No orders found</h3>
        <p className="text-gray-500">Your recent purchases will appear here.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-10">Your Orders</h1>

      <div className="space-y-10">
        {orders.map((order) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={order.id}
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="bg-gray-50/50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Order ID
                </p>
                <p className="text-sm font-mono text-gray-700">
                  {order.orderId || order.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${
                    order.status === "paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </div>
            </div>

            {/* Items Section */}
            <div className="px-6 divide-y divide-gray-50">
              {order.items?.map((item, idx) => {
                // DEBUG LOG: This helps us see why data is missing
                console.log(`📦 Order ${order.id} | Item ${idx}:`, item);

                return (
                  <div key={idx} className="flex items-center gap-6 py-6">
                    <div className="w-24 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <img
                        // Trying all possible image field names
                        src={
                          item.image ||
                          item.img ||
                          item.thumbnail ||
                          item.url ||
                          "https://placehold.co/400x500/f3f4f6/374151?text=No+Image"
                        }
                        alt="Product"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/400x500/f3f4f6/374151?text=Image+Error";
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg leading-tight">
                        {/* Fallback chain for the product name */}
                        {item.name || item.title || item.n || "Premium Item"}
                      </p>
                      <p className="text-gray-500 text-sm mt-1.5 font-medium">
                        Quantity: {item.qty || item.q || 1}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        Product ID: {item.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-xl text-gray-900">
                        ₹{item.price || "0"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="bg-gray-50/30 px-6 py-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">
                  Shipping Address
                </p>
                <p className="text-sm text-gray-700 leading-relaxed max-w-sm">
                  {order.customer?.address ||
                    order.address ||
                    "No address on record"}
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                  Total Paid
                </p>
                <p className="text-3xl font-black text-gray-900">
                  ₹
                  {order.pricing?.total ||
                    order.total ||
                    order.payment_details?.payment_amount}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
