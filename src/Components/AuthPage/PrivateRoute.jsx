import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase";

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);
  const location = useLocation();

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return null;

  return user ? (
    children
  ) : (
    <Navigate to={`/login?redirect=${location.pathname}`} />
  );
}
