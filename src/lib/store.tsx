"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, Product, ProductSize, User, Order, CustomRequest } from "./types";
import { MOCK_USER, MOCK_ORDERS } from "./mock-data";
import { calculateRentalPrice } from "./utils";

// ─── State ───────────────────────────────────────────────────────────────────

interface AppState {
  cart: CartItem[];
  user: User | null;
  isLoggedIn: boolean;
  orders: Order[];
  customRequests: CustomRequest[];
  toastMessage: string | null;
  pendingOrder: CartItem[] | null;
  theme: "light" | "dark";
}

const initialState: AppState = {
  cart: [],
  user: null,
  isLoggedIn: false,
  orders: [],
  customRequests: [],
  toastMessage: null,
  pendingOrder: null,
  theme: "dark", // Default to dark for premium feel
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: "ADD_TO_CART"; payload: { product: Product; size: ProductSize; itemType: "buy" | "rent"; rentalDays?: number } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string; size: ProductSize } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; size: ProductSize; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "MOCK_LOGIN" }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "ADD_CUSTOM_REQUEST"; payload: CustomRequest }
  | { type: "SET_TOAST"; payload: string | null }
  | { type: "SET_PENDING_ORDER"; payload: CartItem[] }
  | { type: "CLEAR_PENDING_ORDER" }
  | { type: "TOGGLE_THEME" }
  | { type: "SET_THEME"; payload: "light" | "dark" };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, size, itemType, rentalDays } = action.payload;
      const existing = state.cart.find(
        (i) => i.productId === product.id && i.size === size && i.type === itemType
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.productId === product.id && i.size === size && i.type === itemType
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { productId: product.id, product, quantity: 1, size, type: itemType, rentalDays },
        ],
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(
          (i) => !(i.productId === action.payload.productId && i.size === action.payload.size)
        ),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.productId === action.payload.productId && i.size === action.payload.size
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "LOGIN":
      return { ...state, user: action.payload, isLoggedIn: true, orders: MOCK_ORDERS };
    case "MOCK_LOGIN":
      return { ...state, user: MOCK_USER, isLoggedIn: true, orders: MOCK_ORDERS };
    case "LOGOUT":
      return { ...state, user: null, isLoggedIn: false, orders: [] };
    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] };
    case "ADD_CUSTOM_REQUEST":
      return { ...state, customRequests: [action.payload, ...state.customRequests] };
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "SET_TOAST":
      return { ...state, toastMessage: action.payload };
    case "SET_PENDING_ORDER":
      return { ...state, pendingOrder: action.payload };
    case "CLEAR_PENDING_ORDER":
      return { ...state, pendingOrder: null };
    case "TOGGLE_THEME": {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("fitstyle-theme", newTheme);
      return { ...state, theme: newTheme };
    }
    case "SET_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  addToCart: (product: Product, size: ProductSize, itemType: "buy" | "rent", rentalDays?: number) => void;
  removeFromCart: (productId: string, size: ProductSize) => void;
  updateQuantity: (productId: string, size: ProductSize, quantity: number) => void;
  clearCart: () => void;
  login: (user: User) => void;
  mockLogin: () => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  addCustomRequest: (request: CustomRequest) => void;
  cartCount: number;
  cartTotal: number;
  showToast: (message: string) => void;
  setPendingOrder: (items: CartItem[]) => void;
  clearPendingOrder: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize theme from localStorage and apply class
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("fitstyle-theme") as "light" | "dark" | null;
    if (savedTheme) {
      dispatch({ type: "SET_THEME", payload: savedTheme });
    }
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [state.theme]);

  const addToCart = useCallback(
    (product: Product, size: ProductSize, itemType: "buy" | "rent", rentalDays?: number) => {
      dispatch({ type: "ADD_TO_CART", payload: { product, size, itemType, rentalDays } });
    },
    []
  );

  const removeFromCart = useCallback((productId: string, size: ProductSize) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId, size } });
  }, []);

  const updateQuantity = useCallback((productId: string, size: ProductSize, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, quantity } });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const login = useCallback((user: User) => dispatch({ type: "LOGIN", payload: user }), []);
  const mockLogin = useCallback(() => dispatch({ type: "MOCK_LOGIN" }), []);
  const logout = useCallback(() => dispatch({ type: "LOGOUT" }), []);

  const addOrder = useCallback(
    (order: Order) => dispatch({ type: "ADD_ORDER", payload: order }),
    []
  );

  const addCustomRequest = useCallback(
    (request: CustomRequest) => dispatch({ type: "ADD_CUSTOM_REQUEST", payload: request }),
    []
  );

  const showToast = useCallback((message: string) => {
    dispatch({ type: "SET_TOAST", payload: message });
    setTimeout(() => dispatch({ type: "SET_TOAST", payload: null }), 3500);
  }, []);

  const setPendingOrder = useCallback((items: CartItem[]) => {
    dispatch({ type: "SET_PENDING_ORDER", payload: items });
  }, []);

  const clearPendingOrder = useCallback(() => {
    dispatch({ type: "CLEAR_PENDING_ORDER" });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: "TOGGLE_THEME" });
  }, []);

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.cart.reduce((sum, item) => {
    const unitPrice =
      item.type === "rent" && item.product.rentalPrice
        ? calculateRentalPrice(item.product.rentalPrice, item.rentalDays ?? 3)
        : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  return (
    <AppContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        login,
        mockLogin,
        logout,
        addOrder,
        addCustomRequest,
        cartCount,
        cartTotal,
        showToast,
        setPendingOrder,
        clearPendingOrder,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
