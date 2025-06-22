"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  balance?: number;
}

// Add an interface for the user data stored in localStorage
interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
  balance?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      // Only access localStorage on the client side
      if (typeof window !== 'undefined') {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          if (userData._id && userData.email) {
            setUser(userData);
            setLoading(false);
            return;
          }
        }
      }

      // Fallback to API check
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (!data.user) {
        throw new Error("Invalid response from server");
      }

      console.log("Login response data:", data);

      // Add balance for investor users
      const userData: UserData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        isLoggedIn: true,
      };
      
      // Add default balance for investors
      if (data.user.role === 'investor') {
        userData.balance = 10000; // Default balance of ₹10,000
      }

      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(userData));

      setUser(data.user);
      
      // Redirect based on user role
      switch (data.user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'investor':
          router.push('/dashboard/investor');
          break;
        case 'entrepreneur':
          router.push('/dashboard/entrepreneur');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem('userData');
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        router.push("/dashboard");
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 