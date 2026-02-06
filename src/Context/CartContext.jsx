import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const CartContext = createContext();

function getCartKey(user) {
  return user ? `cart_${user.uid}` : "cart_guest";
}

function initCart() {
  const user = auth.currentUser;
  const key = getCartKey(user);
  return JSON.parse(localStorage.getItem(key)) || [];
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      const exists = state.find((item) => item.id === action.payload.id);
      if (exists) {
        return state.map((item) =>
          item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...state, { ...action.payload, qty: 1 }];

    case "REMOVE":
      return state.filter((item) => item.id !== action.id);

    case "DECREASE":
      return state
        .map((item) =>
          item.id === action.id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0);

    case "CLEAR":
      return [];

    case "RESET_TO":
      return action.payload;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(reducer, [], initCart);

  useEffect(() => {
    const key = getCartKey(auth.currentUser);
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const key = getCartKey(user);
      const saved = JSON.parse(localStorage.getItem(key)) || [];
      dispatch({ type: "RESET_TO", payload: saved });
    });

    return () => unsub();
  }, []);

  const value = useMemo(() => {
    return { cart, dispatch };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
