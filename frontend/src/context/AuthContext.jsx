import { createContext, useState, useContext, useEffect } from 'react';
import { getMe, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cxo_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const userData = await getMe();
        setUser(userData);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('cxo_token');
        localStorage.removeItem('cxo_user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const persist = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('cxo_token', jwtToken);
    localStorage.setItem('cxo_user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    persist(data.user, data.token);
    return data.user;
  };

  // formData is a FormData object containing all registration fields
  const register = async (formData) => {
    const data = await registerUser(formData);
    persist(data.user, data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cxo_token');
    localStorage.removeItem('cxo_user');
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('cxo_user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
