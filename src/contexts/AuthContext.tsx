import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { type User, type UserRole, mockUsers } from "../lib/data/mockData";

const AUTH_STORAGE_KEY = "orderdeal-auth-user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password?: string, role?: UserRole) => Promise<{ ok: boolean; user: User | null }>;
  loginWithOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  // Persist user across reloads
  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, [user]);

  // Simulate login with email/password for admin, personnel, livreur
  const login = useCallback(async (identifier: string, password?: string, role?: UserRole): Promise<{ ok: boolean; user: User | null }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    let foundUser = mockUsers.find(u => u.email === identifier);

    if (!foundUser) {
      const prefix = identifier.split("@")[0]?.toLowerCase() ?? "";
      let inferredRole: UserRole | undefined = role;
      if (!inferredRole) {
        if (prefix.includes("admin")) inferredRole = "admin";
        else if (prefix.includes("cuisine") || prefix.includes("kitchen")) inferredRole = "personnel";
        else if (prefix.includes("livr") || prefix.includes("driver")) inferredRole = "livreur";
      }
      if (inferredRole && inferredRole !== "client") {
        foundUser = {
          id: `demo-${Date.now()}`,
          email: identifier,
          name: identifier.split("@")[0],
          role: inferredRole,
          createdAt: new Date().toISOString(),
        };
      }
    }

    if (foundUser && foundUser.role !== "client") {
      setUser(foundUser);
      setIsLoading(false);
      return { ok: true, user: foundUser };
    }

    setIsLoading(false);
    return { ok: false, user: null };
  }, []);

  // Simulate sending OTP for client login
  const loginWithOTP = useCallback(async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store phone for verification
    setPendingPhone(phone);
    setIsLoading(false);
    
    // In real app, this would send SMS
    console.log("OTP sent to:", phone, "- Demo OTP: 123456");
    
    return true;
  }, []);

  // Verify OTP and complete login
  const verifyOTP = useCallback(async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: accept any 6-digit OTP or "123456"
    if (otp.length === 6) {
      // Find existing client or create new one
      let clientUser = mockUsers.find(u => u.phone === phone && u.role === "client");
      
      if (!clientUser) {
        clientUser = {
          id: `client-${Date.now()}`,
          phone: phone,
          name: "Nouveau Client",
          role: "client" as UserRole,
          addresses: [],
          createdAt: new Date().toISOString(),
        };
      }
      
      setUser(clientUser);
      setPendingPhone(null);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPendingPhone(null);
  }, []);

  // Demo function to switch roles
  const switchRole = useCallback((role: UserRole) => {
    const demoUser = mockUsers.find(u => u.role === role);
    if (demoUser) {
      setUser(demoUser);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOTP,
        verifyOTP,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
