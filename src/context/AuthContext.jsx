import { createContext, useContext, useEffect, useState } from "react";
import client from "@/api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get("/auth/me/", { skipTopLoader: true })
      .then((res) => setUser(res.data))
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await client.post("/auth/dashboard/login/", {
      email,
      password,
    });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
