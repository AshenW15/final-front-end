"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { getSession } from "@/lib/auth-compat";
import { toast } from "react-hot-toast";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [currentloggedInEmail, setCurrentloggedInEmail] = useState(null);
  const router = useRouter();

  // Load session and cart count on client side
  useEffect(() => {
    const loadSession = async () => {
      const session = await getSession();
      setCurrentloggedInEmail(session?.user?.email || null);
    };

    const loadCartCount = () => {
      if (typeof window !== "undefined") {
        const savedCount = parseInt(localStorage.getItem("cartCount") || "0", 10);
        setCartCount(savedCount);
      }
    };

    loadSession();
    loadCartCount();
  }, []);

  const addToCart = async (product, qty) => {
    const userRole = sessionStorage.getItem("userRole");

    if (userRole === "guest") {
      alert("You need to login first..!");
      router.push("/user/login");
      return;
    }

    const cartItem = { ...product };
    const existingItemIndex = cart.findIndex((item) => item.id === cartItem.id);

    let newCart;
    if (existingItemIndex !== -1) {
      // Update quantity
      newCart = [...cart];
      newCart[existingItemIndex].quantity += qty || 1;
      setCart(newCart);
    } else {
      // Add new item
      cartItem.quantity = qty || 1;
      newCart = [...cart, cartItem];
      setCart(newCart);

      const newCartCount = cartCount + 1;
      setCartCount(newCartCount);
      localStorage.setItem("cartCount", newCartCount);

      toast.success("Added to Cart!", {
        icon: "🛒🛍️",
        style: { background: "#FFFFFF", color: "#000000" },
      });
    }

    await addCartItemsToDatabase(newCart);
  };

  const addCartItemsToDatabase = async (items) => {
    if (items.length === 0 || !currentloggedInEmail) return;

    try {
      const response = await fetch(`${baseUrl}/save_cart.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentloggedInEmail, item: items }),
      });

      if (!response.ok) {
        throw new Error("Failed to add items to database");
      }

      console.log("Message from server:", await response.json());
      setCart([]);
    } catch (error) {
      console.error("Error adding cart items to database:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, currentloggedInEmail }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;