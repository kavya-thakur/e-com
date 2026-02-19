import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Context/CartContext";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import Ordersummary from "../Components/smallComponents/Ordersummary";
import { Loader2, ArrowRight } from "lucide-react";

// --- Premium Dark Skeleton ---
const Skeleton = () => (
  <div className="animate-pulse space-y-12 w-full">
    <div className="space-y-4">
      <div className="h-4 w-32 bg-neutral-200 rounded" />
      <div className="h-12 w-full bg-neutral-100 rounded" />
      <div className="h-12 w-full bg-neutral-100 rounded" />
    </div>
    <div className="space-y-4">
      <div className="h-4 w-32 bg-neutral-200 rounded" />
      <div className="grid grid-cols-2 gap-8">
        <div className="h-12 w-full bg-neutral-100 rounded" />
        <div className="h-12 w-full bg-neutral-100 rounded" />
      </div>
    </div>
  </div>
);

export default function Checkout() {
  const { cart } = useCart();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

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

  useEffect(() => {
    const fetchSavedData = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.savedAddress) {
              const addr = userData.savedAddress;
              setFirst(addr.first || "");
              setLast(addr.last || "");
              setPhone(addr.phone || "");
              setStreet(addr.street || "");
              setCity(addr.city || "");
              setZip(addr.zip || "");
            }
            if (userData.email) setEmail(userData.email);
          }
        } catch (err) {
          console.error("Profile fetch error:", err);
        }
      }
      setIsInitialLoading(false);
    };

    const timer = setTimeout(() => fetchSavedData(), 800);
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!phone) e.phone = "Phone is required";
    if (!first) e.first = "First name required";
    if (!street) e.street = "Address required";
    if (!city) e.city = "City required";
    if (!zip) e.zip = "Zip code required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const createPaymentOrder = async (orderMetadata) => {
    const cleanPhone = orderMetadata.phone.replace(/\D/g, "").slice(-10);

    const res = await fetch(
      "https://ecommerce-rx1m.onrender.com/api/createCashfreeOrder",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(orderMetadata.total),
          orderId: "KAVYASS_" + Date.now(),
          customer: {
            id: orderMetadata.userId,
            email: orderMetadata.email.trim(),
            phone: cleanPhone,
          },
          // SEND EVERYTHING CLEARLY - No more slimming!
          metadata: {
            items: orderMetadata.items,
            userId: orderMetadata.userId,
            customerName: orderMetadata.customerName,
            address: orderMetadata.address, // Matching the backend key exactly
            subtotal: orderMetadata.subtotal,
            shipping: orderMetadata.shipping,
          },
        }),
      },
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Server error");
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!validate()) return;

    // Safety check for Login
    const user = auth.currentUser;
    if (!user) {
      setMsg("Please login to complete your purchase.");
      return;
    }

    setLoading(true);

    try {
      const orderMetadata = {
        items: cart,
        customerName: `${first} ${last}`,
        phone,
        email,
        address: `${street}, ${city}, ${zip}`, // Clean comma-separated address
        userId: user.uid, // Explicitly use the UID
        subtotal,
        shipping,
        total,
      };

      const order = await createPaymentOrder(orderMetadata);

      if (!order?.payment_session_id) {
        throw new Error("Unable to initialize payment session.");
      }

      // Save user address preference
      if (saveAddress) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            savedAddress: { first, last, phone, street, city, zip },
            lastUpdated: serverTimestamp(),
          },
          { merge: true },
        );
      }

      const cashfree = window.Cashfree({ mode: "sandbox" });
      cashfree.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Checkout Error:", err);
      setMsg(err.message || "Payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const inputClass =
    "w-full border-b border-neutral-200 py-3 text-sm outline-none focus:border-black transition-colors bg-transparent placeholder:text-neutral-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]";
  const errorStyle =
    "text-[9px] uppercase tracking-widest text-red-500 mt-1 block";

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 pb-20 font-sans text-black min-h-screen">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl md:text-6xl font-light tracking-tighter uppercase mb-16"
      >
        Checkout
      </motion.h1>

      <AnimatePresence mode="wait">
        {isInitialLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid lg:grid-cols-2 gap-16 lg:gap-24"
          >
            <Skeleton />
            <div className="hidden lg:block h-[400px] bg-neutral-50 rounded-sm animate-pulse" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start"
          >
            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              id="checkout-form"
              className="space-y-16"
            >
              <section className="space-y-8">
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
                  01. Contact
                </h2>
                <div className="space-y-6">
                  <div>
                    <input
                      placeholder="Email"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <span className={errorStyle}>{errors.email}</span>
                    )}
                  </div>
                  <div>
                    <input
                      placeholder="Phone"
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && (
                      <span className={errorStyle}>{errors.phone}</span>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
                  02. Shipping
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <input
                        placeholder="First Name"
                        className={inputClass}
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                      />
                      {errors.first && (
                        <span className={errorStyle}>{errors.first}</span>
                      )}
                    </div>
                    <input
                      placeholder="Last Name"
                      className={inputClass}
                      value={last}
                      onChange={(e) => setLast(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      placeholder="Street Address"
                      className={inputClass}
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                    {errors.street && (
                      <span className={errorStyle}>{errors.street}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2">
                      <input
                        placeholder="City"
                        className={inputClass}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      {errors.city && (
                        <span className={errorStyle}>{errors.city}</span>
                      )}
                    </div>
                    <div>
                      <input
                        placeholder="Zip"
                        className={inputClass}
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                      />
                      {errors.zip && (
                        <span className={errorStyle}>{errors.zip}</span>
                      )}
                    </div>
                  </div>

                  {/* PREMIUM SAVE ADDRESS TOGGLE */}
                  <div
                    onClick={() => setSaveAddress(!saveAddress)}
                    className="flex items-center gap-3 pt-6 cursor-pointer group select-none"
                  >
                    <div
                      className={`w-4 h-4 border border-black flex items-center justify-center transition-all ${saveAddress ? "bg-black" : "bg-transparent"}`}
                    >
                      {saveAddress && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 bg-white rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 group-hover:text-black transition-colors">
                      Save address to my profile
                    </span>
                  </div>
                </div>
              </section>
            </form>

            {/* SUMMARY */}
            <div className="space-y-10 lg:sticky lg:top-24">
              <Ordersummary />
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className={`w-full py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-3 ${
                  loading
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-neutral-800 cursor-pointer"
                }`}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="l" className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing payment...</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Proceed to Payment <ArrowRight size={14} />
                    </div>
                  )}
                </AnimatePresence>
              </button>
              {msg && (
                <p className="text-[10px] text-red-500 uppercase text-center tracking-widest">
                  {msg}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
