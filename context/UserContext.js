import { createContext, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";

export const UserContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
  getUserInfo: ({ id, email, name, phone }) => {},
  updateUserInfo: ({ name, phone, email }) => {},
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

  // Called after login — store initial user info from API
  function getUserInfo({ id, email, name, phone }) {
    const info = { id, email, name: name ?? "", phone: phone ?? "" };
    setUserInfo(info);
    // Persist so it survives app restarts
    SecureStorage.setItemAsync("userInfo", JSON.stringify(info));
  }

  // Called from UserProfileScreen — update name / phone / email
  async function updateUserInfo({ name, phone, email }) {
    const updated = {
      ...userInfo,
      name:  name  ?? userInfo?.name  ?? "",
      phone: phone ?? userInfo?.phone ?? "",
      email: email ?? userInfo?.email ?? "",
    };
    setUserInfo(updated);
    await SecureStorage.setItemAsync("userInfo", JSON.stringify(updated));
  }

  async function tryAutoLogin() {
    const storedToken = await SecureStorage.getItemAsync("token");
    if (storedToken) {
      setAuthToken(storedToken);
      // Restore persisted user info
      const storedUser = await SecureStorage.getItemAsync("userInfo");
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
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
    updateUserInfo,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}