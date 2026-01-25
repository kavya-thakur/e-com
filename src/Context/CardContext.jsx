import { createContext, useContext, useReducer, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const CartContext = createContext();

function getCartKey() {
  const user = auth.currentUser;
  return user ? `cart_${user.uid}` : "cart_guest";
}

const initialState = JSON.parse(localStorage.getItem(getCartKey())) || [];

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      const exists = state.find((item) => item.id === action.payload.id);
      if (exists) {
        return state.map((item) =>
          item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...state, { ...action.payload, qty: 1 }];

    case "REMOVE":
      return state.filter((item) => item.id !== action.id);

    case "DECREASE":
      return state
        .map((item) =>
          item.id === action.id ? { ...item, qty: item.qty - 1 } : item,
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
  const [cart, dispatch] = useReducer(reducer, initialState);

  // persist per-user cart
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
  }, [cart]);

  // reload correct cart when user changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      const saved = JSON.parse(localStorage.getItem(getCartKey())) || [];
      dispatch({ type: "RESET_TO", payload: saved });
    });

    return () => unsub();
  }, []);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
