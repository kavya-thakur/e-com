import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Phone, MapPin } from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔎 search + status filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "orders"));
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }

    load();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const statusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700",
      processing: "bg-blue-50 text-blue-700",
      shipped: "bg-indigo-50 text-indigo-700",
      delivered: "bg-emerald-50 text-emerald-700",
      cancelled: "bg-rose-50 text-rose-700",
    };
    return styles[status];
  };

  // ⚡ fast filtered list
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const text = `
        ${o?.id ?? ""}
        ${o?.status ?? ""}
        ${o?.customer?.name ?? ""}
        ${o?.customer?.email ?? ""}
        ${o?.customer?.phone ?? ""}
        ${o?.city ?? ""}
      `
        .toLowerCase()
        .trim();

      const matchesSearch = text.includes(search.toLowerCase().trim());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : (o?.status ?? "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 tracking-tight">
        Orders Dashboard
      </h1>

      {/* SEARCH + FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, order ID, email, phone.."
          className="px-4 py-2 rounded-xl border border-neutral-300 shadow-sm text-sm w-full md:w-80 focus:outline-none "
          type="search"
        />

        <div className="flex gap-2 mt-2 overflow-x-auto">
          {[
            { v: "all", label: "All" },
            { v: "pending_payment", label: "Pending" },
            { v: "processing", label: "Processing" },
            { v: "paid", label: "Paid" },
            // { v: "delivered", label: "Delivered" },
            { v: "cancelled", label: "Cancelled" },
          ].map((s) => (
            <button
              key={s.v}
              onClick={() => setStatusFilter(s.v)}
              className={`px-3 py-2 rounded-full text-xs font-medium transition
                ${
                  statusFilter === s.v
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <div className="grid grid-cols-5 text-xs text-gray-500 mb-2 px-3">
        <span>Order</span>
        <span>Status</span>
        <span className="text-right col-span-3">Total</span>
      </div>

      <div className="space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-2xl shadow-sm bg-white">
            <button
              onClick={() => setOpen(open === o.id ? null : o.id)}
              className="w-full flex items-center justify-between px-5 py-3 rounded-2xl hover:bg-gray-50 transition"
            >
              <span className="font-medium text-sm flex items-center gap-2">
                #{o.id.slice(0, 6)}
                <ChevronDown
                  size={16}
                  className={`transition ${open === o.id ? "rotate-180" : ""}`}
                />
              </span>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyle(
                    o.status
                  )}`}
                >
                  {o.status}
                </span>

                <span className="font-semibold text-sm">₹{o.total}</span>
              </div>
            </button>

            <AnimatePresence>
              {open === o.id && (
                <motion.div
                  initial={{ scaleY: 0.65, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0.65, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ originY: 0 }}
                  className="px-6 pb-5 pt-2 space-y-6"
                >
                  {/* PRICE */}
                  <div className="rounded-xl bg-gray-50 p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>₹{o.total - 50}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>₹50</span>
                    </div>

                    <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{o.total}</span>
                    </div>
                  </div>

                  {/* CUSTOMER */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Customer</h4>

                      <p className="font-medium">{o.customer?.name}</p>

                      <p className="flex items-center gap-2 text-gray-500 text-sm">
                        <Mail size={14} /> {o.customer?.email}
                      </p>

                      <p className="flex items-center gap-2 text-gray-500 text-sm">
                        <Phone size={14} /> {o.customer?.phone || "—"}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>

                      <p className="flex gap-2 text-sm text-gray-700">
                        <MapPin size={14} />
                        <span>
                          {o.customer?.address} <br />
                          {o.city} {o.pincode}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="space-y-3">
                    {o.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex gap-3 items-center">
                          <img
                            src={item.image}
                            className="w-12 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-gray-500 text-xs">
                              Qty {item.qty} — Size {item.size}
                            </p>
                          </div>
                        </div>

                        <span className="text-sm font-medium">
                          ₹{item.qty * item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* STATUS */}
                  <div className="flex justify-end">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="px-4 py-2 bg-gray-100 rounded-xl text-sm"
                    >
                      <option>pending</option>
                      <option>processing</option>
                      <option>shipped</option>
                      <option>delivered</option>
                      <option>cancelled</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
