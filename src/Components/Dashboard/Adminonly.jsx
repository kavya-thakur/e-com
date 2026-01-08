import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminOnly({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    async function check() {
      const user = auth.currentUser;
      if (!user) return setAllowed(false);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      console.log("USER:", user?.uid);
      console.log("SNAP EXISTS:", snap.exists());
      console.log("ROLE:", snap.data()?.role);

      setAllowed(snap.exists() && snap.data().role === "admin");
    }
    check();
  }, []);

  if (allowed === null) return <p className="p-10">Checking access…</p>;

  return allowed ? children : <Navigate to="/" replace />;
}
