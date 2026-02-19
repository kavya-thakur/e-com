import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Context/CartContext";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
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

  // const createPaymentOrder = async () => {
  //   const res = await fetch(
  //     "https://ecommerce-rx1m.onrender.com/api/createCashfreeOrder",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         amount: total,
  //         orderId: "store_" + Date.now(),
  //         customer: { id: auth.currentUser?.uid || "guest", email, phone },
  //       }),
  //     },
  //   );
  //   return await res.json();
  // };

  const createPaymentOrder = async () => {
    // 1. STRIP THE CART: Added safety checks for item properties
    const cleanItems = cart.map((item) => ({
      id: item.id || "unknown",
      // Safety check: if name is missing, use 'Product' as default
      name: (item.name || "Product").toString().substring(0, 50),
      price: Number(item.price) || 0,
      qty: Number(item.qty) || 1,
    }));

    const orderMetadata = {
      items: cleanItems,
      address: `${street}, ${city} - ${zip}`,
      customerName: `${first} ${last}`,
      userId: auth.currentUser?.uid || "guest",
      total: total,
    };

    // 2. CLEAN THE PHONE: Cashfree Sandbox fails if phone is not exactly 10 digits
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    const res = await fetch(
      "https://ecommerce-rx1m.onrender.com/api/createCashfreeOrder",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(total), // Ensure it's a number, not a string
          orderId: "KAVYASS_" + Date.now(),
          customer: {
            id: auth.currentUser?.uid || "guest",
            email: email.trim(),
            phone: cleanPhone,
          },
          metadata: orderMetadata,
        }),
      },
    );

    // 3. BETTER ERROR HANDLING: This helps you see WHY it failed
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Cashfree Reject Reason:", errorData);
      throw new Error(errorData.message || "Payment failed to initialize");
    }

    return await res.json();
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMsg("");
  //   if (!validate()) return;
  //   setLoading(true);

  //   try {
  //     const user = auth.currentUser;
  //     const order = await createPaymentOrder();
  //     if (!order?.payment_session_id) throw new Error("Payment failed");

  //     await addDoc(collection(db, "orders"), {
  //       userId: user?.uid || "guest",
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
  //       order_id: order.order_id,
  //       createdAt: serverTimestamp(),
  //     });

  //     if (saveAddress && user) {
  //       const userRef = doc(db, "users", user.uid);
  //       await setDoc(
  //         userRef,
  //         {
  //           savedAddress: { first, last, phone, street, city, zip },
  //           lastUpdated: serverTimestamp(),
  //         },
  //         { merge: true },
  //       );
  //     }

  //     window.Cashfree({ mode: "sandbox" }).checkout({
  //       paymentSessionId: order.payment_session_id,
  //       redirectTarget: "_self",
  //     });
  //   } catch (err) {
  //     setMsg("Something went wrong. Please try again.");
  //   }
  //   setLoading(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    // 1. Validate form fields first
    if (!validate()) return;

    setLoading(true);

    try {
      const user = auth.currentUser;

      const orderMetadata = {
        items: cart,
        customerName: `${first} ${last}`,
        phone,
        email,
        address: `${street}, ${city} - ${zip}`,
        userId: user?.uid || "guest",
        subtotal,
        shipping,
        total,
      };

      const order = await createPaymentOrder(orderMetadata);

      if (!order?.payment_session_id)
        throw new Error("Payment failed to initialize");
      if (saveAddress && user) {
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
      window.Cashfree({ mode: "sandbox" }).checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Checkout Error:", err);
      setMsg("Something went wrong. Please try again.");
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
