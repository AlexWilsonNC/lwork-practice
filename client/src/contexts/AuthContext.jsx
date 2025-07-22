import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenKey = 'PTCGLegendsToken';
  const emailKey = 'PTCGLegendsEmail';

  // On mount, pull token → validate
  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    const email = localStorage.getItem(emailKey);
    if (token && email) {
      // Optionally verify token by hitting a /me endpoint,
      // but for now we'll just stash it.
      setUser({ token, email });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const { token } = await res.json();
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(emailKey, email);
    setUser({ token, email });
  };

  const signup = async (email, password) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error);
    }
    // auto‑login after signup
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(emailKey);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
