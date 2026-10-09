
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/game", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-indigo-950">
          Welcome Back!
        </h2>
        <p className="text-sm text-slate-500">
          Log in to continue your adventure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-extrabold text-indigo-950"
          >
            Email Address
          </label>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
            <Mail size={17} className="text-slate-400" />

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-extrabold text-indigo-950"
          >
            Password
          </label>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
            <Lock size={17} className="text-slate-400" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="text-slate-400 hover:text-indigo-600"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-indigo-600"
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={() =>
              setError("Connect password recovery to your authentication provider.")
            }
            className="font-bold text-indigo-600 hover:text-indigo-800"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-extrabold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log In"}
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={() =>
            setError("Google sign-in has not been configured yet.")
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <span className="font-black text-blue-600">G</span>
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-extrabold text-indigo-600 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
