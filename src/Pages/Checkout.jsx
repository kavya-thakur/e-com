import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { useCart } from "../Context/CardContext";
import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect } from "react";
import Ordersummary from "../Components/smallComponents/Ordersummary";

export default function Checkout() {
  const { cart } = useCart();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  // form state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const validate = () => {
    const e = {};

    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";

    if (!phone) e.phone = "Phone is required";
    else if (phone.length < 10) e.phone = "Enter a valid phone";

    if (!first) e.first = "First name required";
    if (!street) e.street = "Address required";

    if (!city) e.city = "City required";

    if (!zip) e.zip = "Postal code required";
    else if (!/^\d+$/.test(zip)) e.zip = "Numbers only";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("checkout-info"));
    if (saved) {
      setEmail(saved.email || "");
      setPhone(saved.phone || "");
      setFirst(saved.first || "");
      setLast(saved.last || "");
      setStreet(saved.street || "");
      setCity(saved.city || "");
      setZip(saved.zip || "");
    }
  }, []);
  const createPaymentOrder = async () => {
    const res = await fetch(
      "https://ecommerce-rx1m.onrender.com/api/createCashfreeOrder",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          orderId: "store_" + Date.now(),
          customer: {
            id: auth.currentUser.uid,
            email,
            phone,
          },
        }),
      },
    );

    return await res.json();
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMsg("");

  //   if (!validate()) return; // ⛔ stop if invalid

  //   setLoading(true);

  //   try {
  //     const user = auth.currentUser;
  //     localStorage.setItem(
  //       "checkout-info",
  //       JSON.stringify({ email, phone, first, last, street, city, zip })
  //     );

  //     await addDoc(collection(db, "orders"), {
  //       userId: user.uid,
  //       items: cart,
  //       customer: {
  //         email,
  //         phone,
  //         name: `${first} ${last}`,
  //         address: `${street}, ${city} - ${zip}`,
  //       },
  //       subtotal,
  //       shipping,
  //       total,
  //       status: "pending_payment",
  //       createdAt: serverTimestamp(),
  //     });
  //     const order = await createPaymentOrder();
  //     console.log("session:", order.payment_session_id);

  //     if (!order?.payment_session_id) {
  //       console.error("Session missing:", order);
  //       return;
  //     }

  //     const cashfree = window.Cashfree({
  //       mode: "sandbox",
  //     });

  //     cashfree.checkout({
  //       paymentSessionId: order.payment_session_id,
  //       redirectTarget: "_self",
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     setMsg("Something went wrong. Try again.");
  //   }

  //   setLoading(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!validate()) return;

    setLoading(true);

    try {
      const user = auth.currentUser;

      // 1️⃣ Create Cashfree order first
      const order = await createPaymentOrder();

      if (!order?.payment_session_id || !order?.order_id) {
        throw new Error("Payment order creation failed");
      }

      // 2️⃣ Save order to Firestore (only now)
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cart,
        customer: {
          email,
          phone,
          name: `${first} ${last}`,
          address: `${street}, ${city} - ${zip}`,
        },
        subtotal,
        shipping,
        total,
        status: "pending_payment",
        order_id: order.order_id, // 🔥 always set
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Start checkout
      const cashfree = window.Cashfree({ mode: "sandbox" });

      cashfree.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error(err);
      setMsg("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;

    script.onload = () => {
      console.log("Cashfree SDK loaded", window.Cashfree);
    };

    script.onerror = () => {
      console.error("Failed to load Cashfree SDK");
    };

    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-10">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* LEFT — FORM */}
        <motion.form
          onSubmit={handleSubmit}
          id="checkout-form"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className="space-y-8"
        >
          {/* Contact */}
          <section className="bg-gray-50/70 shadow-sm rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-medium">Contact Information</h2>

            <div className="space-y-4">
              <input
                placeholder="Email address"
                className="w-full bg-white/80 rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}

              <input
                placeholder="Phone number"
                className="w-full bg-white/80 rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
          </section>

          {/* Shipping */}
          <section className="bg-gray-50/70 shadow-sm rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-medium">Shipping Address</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="First name"
                className="col-span-2 md:col-span-1 bg-white/80 rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
                value={first}
                onChange={(e) => setFirst(e.target.value)}
              />
              <input
                placeholder="Last name"
                className="col-span-2 md:col-span-1 bg-white/80 rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
                value={last}
                onChange={(e) => setLast(e.target.value)}
              />
            </div>

            <input
              placeholder="Street address"
              className="w-full bg-white/80 rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-4">
              <input
                placeholder="City"
                className="col-span-2 bg-white/80 rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                placeholder="Postal code"
                className="bg-white/80 rounded-xl px-4 py-3 text-sm outline-none shadow-inner"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          </section>
        </motion.form>

        {/* RIGHT — SUMMARY (unchanged) */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className=" space-y-6"
        >
          <Ordersummary />
          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className={`w-full rounded-xl py-3 text-sm font-medium transition${
              loading
                ? " bg-gray-800 cursor-not-allowed"
                : " bg-gray-900 hover:opacity-90"
            } text-white flex items-center justify-center gap-3`}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  {/* Spinner */}
                  <motion.span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9,
                      ease: "linear",
                    }}
                  />

                  {/* Text */}
                  <span className="tracking-wide">Securing payment…</span>
                </motion.div>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Save & Continue to Payment
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {msg && <p className="text-sm text-green-600">{msg}</p>}
        </motion.div>
      </div>
    </div>
  );
}
