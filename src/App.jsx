import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,

} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Games from "./pages/Games";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/game" element={<Games />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
    </BrowserRouter>
  );
}