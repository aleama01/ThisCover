import React, { createContext, useState, useEffect } from 'react';

export interface IContext {
  isAuthenticated: boolean,
  setIsAuthenticated: (config: boolean) => void;
  logout: () => void;
  isId: string;
  setIsId: (config: string) => void;
  reload: boolean;
  setReload: (config: boolean) => void;
  openScheduleModal: boolean;
  setOpenScheduleModal: (config: boolean) => void;
  currentRoute: number;
  setCurrentRoute: (config: number) => void;
};

// Create Auth Context
export const AuthContext = createContext<IContext>({
  isAuthenticated: false,
  setIsAuthenticated(_config) { },
  logout() { },
  isId: "",
  setIsId(_config) { },
  reload: false,
  setReload(_config) { },
  openScheduleModal: false,
  setOpenScheduleModal(_config) { },
  currentRoute: 1,
  setCurrentRoute(_config) { },
});

const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isId, setIsId] = useState<string>(sessionStorage.getItem('id')!);
  const [reload, setReload] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(1)

  useEffect(() => {
    // Check if token exists in sessionStorage to set the initial auth state
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false)
  }, []);

  useEffect(() => {
    const user_id = sessionStorage.getItem('id')
    if (user_id) {
      setIsId(user_id)
    }
  }, []);

  // Function to log out the user
  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('id');
    setIsId("")
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout, isId, setIsId, reload, setReload, openScheduleModal, setOpenScheduleModal, currentRoute, setCurrentRoute }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
