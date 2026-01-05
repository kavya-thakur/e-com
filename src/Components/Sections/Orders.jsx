import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(list);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="p-6">Loading orders…</div>;

  if (orders.length === 0)
    return <div className="p-6">You have no orders yet.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="border rounded p-4 mb-4">
          <p>
            <strong>Order:</strong> {order.order_id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total:</strong> ₹{order.total}
          </p>
        </div>
      ))}
    </div>
  );
}
