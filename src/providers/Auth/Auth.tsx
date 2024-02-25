import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { client } from "../Apollo";

export interface AuthContext {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

export const StateContext = React.createContext<AuthContext | undefined>(
  undefined
);

const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const setToken = useCallback(
    (token: string) => localStorage.setItem("token", token),
    []
  );
  const getToken = useCallback(() => localStorage.getItem("token"), []);
  const removeToken = useCallback(() => localStorage.removeItem("token"), []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      (client as any).link.options.headers.authorization = token;
      setLoggedIn(true);
    }
  }, [location, getToken]);

  const login = useCallback(
    (_token: string): void => {
      setToken(_token);
      setLoggedIn(true);
      navigate("/dashboard");
    },
    [navigate, setToken]
  );

  const logout = useCallback((): void => {
    removeToken();
    setLoggedIn(false);
    navigate("/login");
  }, [navigate, removeToken]);

  return (
    <StateContext.Provider
      value={{
        isLoggedIn: loggedIn,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { AuthProvider };
