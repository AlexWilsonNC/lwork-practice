import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenKey = 'PTCGLegendsToken';
  const emailKey = 'PTCGLegendsEmail';

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    const email = localStorage.getItem(emailKey);
    const username = localStorage.getItem('PTCGLegendsUsername');
    if (token && email) {
      setUser({ token, email, username });
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const { token, username, email: userEmail } = await res.json();
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(emailKey, userEmail)
    localStorage.setItem('PTCGLegendsUsername', username);
    setUser({ token, email: userEmail, username });
  };

  const signup = async (email, password, username) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username })
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error);
    }
    await login(email, password);
  };

  const updateUserProfile = async ({ username, email }) => {
    const token = localStorage.getItem(tokenKey);
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username, email })
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || 'Profile update failed');
    }
    const { username: u, email: e } = await res.json();
    localStorage.setItem(emailKey, e);
    localStorage.setItem('PTCGLegendsUsername', u);
    setUser(user => ({ ...user, username: u, email: e }));
  };

  const changePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem(tokenKey);
    const res = await fetch('/api/auth/password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || 'Password change failed');
    }
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(emailKey);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}
