
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY = "fling_demo_users";
const SESSION_KEY = "fling_user";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("fling_user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to restore user session:", error);
      localStorage.removeItem("fling_user");
    } finally {
      setLoading(false);
    }
  }, []);


  async function signup(name, email, password) {
    if (!name.trim() || !email.trim() || !password) {
      throw new Error("Please complete all fields.");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    if (users.some((item) => item.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([...users, newUser])
    );

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(sessionUser)
    );

    setUser(sessionUser);
    return sessionUser;
  }

  async function login(email, password) {
    if (!email.trim() || !password) {
      throw new Error("Email and password are required.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const foundUser = users.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password.");
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
    };

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(sessionUser)
    );

    setUser(sessionUser);
    return sessionUser;
  }


  function logout() {
    localStorage.removeItem("fling_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
