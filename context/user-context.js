import { createContext, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";

export const UserContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
});

export default function UserProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  async function authenticate(token) {
    await SecureStorage.setItemAsync("token", token);
    setAuthToken(token);
  }

  async function logout() {
    await SecureStorage.deleteItemAsync("token");
    setAuthToken(null);
    setUserInfo(null);
  }

  function getUserInfo({ id, email }) {
    setUserInfo({ id, email });
  }

  async function tryAutoLogin() {
    const storedToken = await SecureStorage.getItemAsync("token");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }

  useEffect(() => {
    tryAutoLogin();
  }, []);

  const value = {
    user: userInfo,
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
    getUserInfo,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
