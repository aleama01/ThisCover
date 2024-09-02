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
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    // Check if token exists in sessionStorage to set the initial auth state
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false)
  }, []);

  // Function to log out the user
  const logout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
