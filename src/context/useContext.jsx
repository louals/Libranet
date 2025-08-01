// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from "../api"

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    api.get("/auth/me")
      .then(res => {
        const user = res.data;
        setAuthState({
          isAuthenticated: true,
          isAdmin: user.role === "admin",
          user,
          token,
          loading: false,
        });
      })
      .catch(err => {
        console.error("Token invalid or expired:", err);
        localStorage.removeItem("token");
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
          token: null,
          loading: false,
        });
      });
  } else {
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null,
      loading: false,
    });
  }
}, []);


  const login = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('token', token);
      setAuthState({
        isAuthenticated: true,
        isAdmin: payload.role === 'admin',
        user: payload,
        token,
        loading: false,
      });
      resolve(true);
    } catch (err) {
      console.error('Login error:', err);
      reject(false);
    }
  });
};

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
