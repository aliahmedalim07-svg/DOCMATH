import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "../lib/api";
import type { CreateAccountInput, UserProfile } from "../lib/types";

interface AuthResponse {
  token: string;
  roles: string[];
}

interface AuthContextValue {
  user: UserProfile | null;
  roles: string[];
  loading: boolean;
  signIn: (username: string, password: string, _remember: boolean) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  createAccount: (input: CreateAccountInput) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const tokenKey = "dr-ziad-math-ig-token";
const rolesKey = "dr-ziad-math-ig-roles";

export function AuthProvider({ children, value }: { children: ReactNode; value?: AuthContextValue }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const readStoredRoles = useCallback(() => {
    try {
      const stored = localStorage.getItem(rolesKey);
      if (!stored) return [] as string[];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [] as string[];
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await apiFetch<UserProfile>("/Auth/profile");
      setUser(profile);
      return profile;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      localStorage.removeItem(tokenKey);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    const boot = async () => {
      try {
        const token = localStorage.getItem(tokenKey);
        if (token) {
          setRoles(readStoredRoles());
          await fetchProfile();
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    boot();

    return () => {
      active = false;
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (username: string, password: string, _remember: boolean) => {
    const response = await apiFetch<AuthResponse>("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    localStorage.setItem(tokenKey, response.token);
    localStorage.setItem(rolesKey, JSON.stringify(response.roles ?? []));
    setRoles(response.roles ?? []);
    const profile = await fetchProfile();
    if (!profile) throw new Error("Failed to load user profile after login.");
    
    return profile;
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(rolesKey);
    setUser(null);
    setRoles([]);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem(tokenKey)) return;
    await fetchProfile();
  }, [fetchProfile]);

  const createAccount = useCallback(async (input: CreateAccountInput) => {
    const response = await apiFetch<UserProfile>("/Auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: input.username,
        password: input.tempPassword,
        phoneNumber: input.phone || "",
        parentPhoneNumber: input.parentPhone || "",
        name: input.name,
        accountType: input.accountType,
      }),
    });
    return response;
  }, []);

  const contextValue: AuthContextValue = value || {
    user,
    roles,
    loading,
    signIn,
    signOut,
    refreshProfile,
    createAccount,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

export const useOptionalAuth = () => useContext(AuthContext);
