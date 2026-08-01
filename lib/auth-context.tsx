"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserProfile, UserRole } from "./types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isOwner: boolean;
  loading: boolean;
  loadingProfile: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        setLoadingProfile(true);
        const userDoc = doc(db, "users", u.uid);
        const snap = await getDoc(userDoc);
        if (snap.exists()) {
          const data = snap.data() as Omit<UserProfile, "uid">;
          setProfile({ uid: u.uid, ...data });
          setRole(data.role as UserRole);
          
        } else {
          const userProfile: Omit<UserProfile, "uid"> = {
            name: u.displayName ?? "",
            email: u.email ?? "",
            role: "user",
            registeredAt: Date.now(),
            isOwner: false,
          };
          await setDoc(userDoc, userProfile);
          setProfile({ uid: u.uid, ...userProfile });
          setRole("user");
        }
        setLoadingProfile(false);
      } else {
        setProfile(null);
        setRole(null);
        setLoadingProfile(false);
      }
    });
    return () => unsub();
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(name: string, email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const userDoc = doc(db, "users", cred.user.uid);
    await setDoc(userDoc, {
      name,
      email,
      role: "user",
      registeredAt: Date.now(),
      isOwner: false,
    });
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin: role === "admin",
        isOwner: profile?.isOwner ?? false,
        loading,
        loadingProfile,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

