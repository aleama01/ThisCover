import React, { createContext, useState, useEffect } from 'react';

export interface IContext {
  isAuthenticated: boolean,
  setIsAuthenticated: (config: boolean) => void;
  logout: () => void;
};

// Create Auth Context
export const AuthContext = createContext<IContext>({
  isAuthenticated: false,
  setIsAuthenticated(_config) { },
  logout() { },
});

const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage to set the initial auth state
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
