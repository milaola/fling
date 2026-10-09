
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

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

  
  async function login(email, password) {
    if (!email.trim() || !password) {
      throw new Error("Email and password are required.");
    }

   
    throw new Error("Login API is not connected yet.");
  }


  async function signup(name, email, password) {
    if (!name.trim() || !email.trim() || !password) {
      throw new Error("Please complete all fields.");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    throw new Error("Signup API is not connected yet.");
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
