
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-sky-100">
                <p className="font-bold text-indigo-900">
                    Loading Fling...
                </p>
            </div>
        );
    }

    return isAuthenticated
        ? <Outlet />
        : <Navigate to="/login" replace />;
}
