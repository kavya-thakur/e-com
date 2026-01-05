import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem("cart")) || [];

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

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const value = { cart, dispatch };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
