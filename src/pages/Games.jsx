import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export default function Games() {
    return (
        <div className="min-h-screen bg-sky-100 p-6">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800">
                    Fling
                </h1>
                <span className="text-sm text-slate-600">
                    Level 1
                </span>
            </header>

            <main className="mx-auto max-w-5xl">
                <div className="mb-4 rounded-xl bg-white p-4 shadow">
                    <h2 className="text-xl font-bold">Ready to Fling?</h2>
                    <p className="text-slate-600">
                        Aim carefully and hit the target!
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border-4 border-white bg-sky-300 shadow-xl">
                    <svg
                        viewBox="0 0 800 450"
                        className="block w-full"
                        role="img"
                        aria-label="Fling puzzle game scene"
                    >
                        <rect width="800" height="450" fill="#7dd3fc" />


                        <circle cx="130" cy="80" r="28" fill="white" />
                        <circle cx="160" cy="70" r="36" fill="white" />
                        <circle cx="192" cy="82" r="25" fill="white" />

                        <path
                            d="M0 300 L150 150 L300 300 Z"
                            fill="#86efac"
                        />
                        <path
                            d="M220 300 L400 130 L580 300 Z"
                            fill="#4ade80"
                        />


                        <rect y="360" width="800" height="90" fill="#65a30d" />


                        <path
                            d="M130 360 L145 275 M160 360 L145 275"
                            stroke="#854d0e"
                            strokeWidth="12"
                            strokeLinecap="round"
                            fill="none"
                        />


                        <circle cx="155" cy="335" r="18" fill="#ef4444" />
                        <circle cx="161" cy="330" r="4" fill="white" />
                        <circle cx="162" cy="330" r="2" fill="#111827" />
                        <path d="M171 337 L184 342 L171 346 Z" fill="#facc15" />


                        <rect x="650" y="315" width="22" height="45" fill="#d6a56b" />
                        <rect x="700" y="315" width="22" height="45" fill="#d6a56b" />
                        <rect x="642" y="300" width="90" height="15" fill="#92400e" />

                        <circle cx="685" cy="287" r="18" fill="#a3e635" />
                        <circle cx="679" cy="282" r="3" fill="#1f2937" />
                        <circle cx="691" cy="282" r="3" fill="#1f2937" />
                        <path
                            d="M679 293 Q685 300 692 293"
                            stroke="#1f2937"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
            </main>
        </div>
    );
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
