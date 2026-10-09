import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,

} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Game from "./pages/Games";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="/game" element={<Game />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}