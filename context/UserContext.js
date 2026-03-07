import { createContext, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
   initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC91sohDOQJR3-GYPcavmLiqNkyw6vKTW4",
  authDomain: "expense-tracker-fd3a5.firebaseapp.com",
  databaseURL: "https://expense-tracker-fd3a5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "expense-tracker-fd3a5",
  storageBucket: "expense-tracker-fd3a5.firebasestorage.app",
  messagingSenderId: "187329536473",
  appId: "1:187329536473:web:c4b1e89dd5faabc4a2b9c8",
  measurementId: "G-3PJMYJ3B15"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const UserContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  authenticate: async ({ email, password, name, isLogin }) => {},
  logout: async () => {},
  updateUserInfo: ({ name, phone, email }) => {},
  getFreshToken: async () => {},
});

export default function UserProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // forceRefresh: true ensures we always get a valid, fresh token
        const token = await firebaseUser.getIdToken(true);
        setAuthToken(token);
        setUserInfo({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName ?? "",
          phone: firebaseUser.phoneNumber ?? "",
        });
        await SecureStorage.setItemAsync("token", token);
      } else {
        setAuthToken(null);
        setUserInfo(null);
        await SecureStorage.deleteItemAsync("token");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Always call this before any authenticated API request
  // Firebase refreshes silently if the token is expired
  async function getFreshToken() {
    if (!auth.currentUser) return null;
    try {
      const token = await auth.currentUser.getIdToken(true);
      setAuthToken(token);
      await SecureStorage.setItemAsync("token", token);
      return token;
    } catch (error) {
      // Refresh failed — token is revoked or user was deleted
      await logout();
      return null;
    }
  }

  async function authenticate({ email, password, name, isLogin }) {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(user, { displayName: name });
      }
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function updateUserInfo({ name, phone, email }) {
    const updated = {
      ...userInfo,
      name:  name  ?? userInfo?.name  ?? "",
      phone: phone ?? userInfo?.phone ?? "",
      email: email ?? userInfo?.email ?? "",
    };
    setUserInfo(updated);
    if (auth.currentUser && name) {
      await updateProfile(auth.currentUser, { displayName: name });
    }
    await SecureStorage.setItemAsync("userInfo", JSON.stringify(updated));
  }

  const value = {
    user: userInfo,
    token: authToken,
    isAuthenticated: !!authToken,
    loading,
    authenticate,
    logout,
    updateUserInfo,
    getFreshToken,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}