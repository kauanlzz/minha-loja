"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useSyncExternalStore,
  useState,
} from "react";

import { getLocalProduct } from "@/lib/catalog";
import type { Money } from "@/lib/money/types";

const STORAGE_KEY = "local-demo-cart";
const EMPTY_CART = "[]";
const listeners = new Set<() => void>();

export interface LocalCartLine {
  handle: string;
  image: string;
  price: Money;
  quantity: number;
  title: string;
}

interface LocalCartContextValue {
  addItem: (item: Omit<LocalCartLine, "quantity">, quantity?: number) => void;
  closeCart: () => void;
  hasHydrated: boolean;
  isCartOpen: boolean;
  lines: LocalCartLine[];
  openCart: () => void;
  removeItem: (handle: string) => void;
  setQuantity: (handle: string, quantity: number) => void;
  totalAmount: Money;
  totalQuantity: number;
}

const LocalCartContext = createContext<LocalCartContextValue | null>(null);

function parseCart(snapshot: string): LocalCartLine[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    if (!Array.isArray(value)) return [];
    return value.flatMap((item) => {
      if (!isStoredLine(item)) return [];
      const product = getLocalProduct(item.handle);
      if (!product?.featuredImage) return [];
      return [
        {
          handle: product.handle,
          image: product.featuredImage.url,
          price: product.price,
          quantity: item.quantity,
          title: product.title,
        },
      ];
    });
  } catch (error) {
    console.warn("Unable to read the locally saved demo cart.", error);
    return [];
  }
}

function isStoredLine(value: unknown): value is Pick<LocalCartLine, "handle" | "quantity"> {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<Pick<LocalCartLine, "handle" | "quantity">>;
  return (
    typeof line.handle === "string" &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  );
}

function subscribeHydration() {
  return () => {};
}

function getHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_CART;
  } catch (error) {
    console.warn("Unable to read the locally saved demo cart.", error);
    return EMPTY_CART;
  }
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function writeCart(lines: LocalCartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch (error) {
    console.error("Unable to save the local demo cart.", error);
    throw error;
  }
  listeners.forEach((listener) => listener());
}

export function LocalCartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hasHydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const lines = parseCart(snapshot);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback((item: Omit<LocalCartLine, "quantity">, quantity = 1) => {
    const current = parseCart(getSnapshot());
    const existing = current.find((line) => line.handle === item.handle);
    writeCart(
      existing
        ? current.map((line) =>
            line.handle === item.handle ? { ...line, quantity: line.quantity + quantity } : line,
          )
        : [...current, { ...item, quantity }],
    );
  }, []);
  const removeItem = useCallback(
    (handle: string) =>
      writeCart(parseCart(getSnapshot()).filter((line) => line.handle !== handle)),
    [],
  );
  const setQuantity = useCallback((handle: string, quantity: number) => {
    writeCart(
      parseCart(getSnapshot()).flatMap((line) =>
        line.handle === handle ? (quantity > 0 ? [{ ...line, quantity }] : []) : [line],
      ),
    );
  }, []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const totalQuantity = lines.reduce((total, line) => total + line.quantity, 0);
  const amount = lines.reduce(
    (total, line) => total + Number(line.price.amount) * line.quantity,
    0,
  );
  const value: LocalCartContextValue = {
    addItem,
    closeCart,
    hasHydrated,
    isCartOpen,
    lines,
    openCart,
    removeItem,
    setQuantity,
    totalAmount: { amount: amount.toFixed(2), currencyCode: "USD" },
    totalQuantity,
  };

  return <LocalCartContext.Provider value={value}>{children}</LocalCartContext.Provider>;
}

export function useLocalCart() {
  const context = useContext(LocalCartContext);
  if (!context) throw new Error("useLocalCart must be used inside LocalCartProvider");
  return context;
}
