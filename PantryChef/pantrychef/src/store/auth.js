import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'pantryChefUser';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load auth user from storage:', err);
    }
  }, []);

  const isAuthenticated = !!user;

  const persistUser = useCallback((nextUser) => {
    try {
      if (nextUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to persist auth user:', err);
    }
  }, []);

  const login = useCallback(async ({ username, password, slogan, avatar } = {}) => {
    const safeUsername = (username || '').trim();
    if (!safeUsername) {
      throw new Error('请输入用户名');
    }

    const nextUser = {
      id: Date.now(),
      nickname: safeUsername,
      slogan: slogan || '热爱生活',
      avatar: avatar || '/image/image.png'
    };
    setUser(nextUser);
    persistUser(nextUser);
    setLoginVisible(false);
    return nextUser;
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, [persistUser]);

  const openLogin = useCallback(() => setLoginVisible(true), []);
  const closeLogin = useCallback(() => setLoginVisible(false), []);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      setLoginVisible(true);
      return false;
    }
    return true;
  }, [isAuthenticated]);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loginVisible,
    login,
    logout,
    openLogin,
    closeLogin,
    requireAuth,
    setUser,
  }), [user, isAuthenticated, loginVisible, login, logout, openLogin, closeLogin, requireAuth]);

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};


