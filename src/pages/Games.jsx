import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export default function Game() {
    const { user, logout } = useAuth();
    const naviagte = useNavigate();
}

function handleLogout() {
    logout();
    Navigate("/login", { replace: true });
    return (
        <div>
            <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-sky-300 to-lime-200 p-6 text-center">
                <h1 className="text-5xl font-black italic text-amber-400 [text-shadow:2px_3px_0_#211653]">
                    FLING
                </h1>
                <h1 className="text-5xl font-black italic text-amber-400 [text-shadow:2px_3px_0_#211653]">
                    FLING
                </h1>
                <p className="text-slate-600">
                    Your puzzle game will live here.
                </p>
                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
                >
                    Log Out
                </button>

            </main>
        </div>
    )
}
