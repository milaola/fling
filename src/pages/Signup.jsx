
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await signup(name, email, password);
      navigate("/game", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass =
    "min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-400";

  const wrapperClass =
    "flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100";

  return (
    <AuthLayout>
      <div className="mb-5">
        <h2 className="text-2xl font-black text-indigo-950">
          Create Your Account
        </h2>
        <p className="text-sm text-slate-500">
          Join the fun and start flinging!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-extrabold">
            Full Name
          </label>
          <div className={wrapperClass}>
            <UserRound size={16} className="text-slate-400" />
            <input
              id="name"
              autoComplete="name"
              placeholder="Ace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1 block text-xs font-extrabold">
            Email Address
          </label>
          <div className={wrapperClass}>
            <Mail size={16} className="text-slate-400" />
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1 block text-xs font-extrabold">
            Password
          </label>
          <div className={wrapperClass}>
            <Lock size={16} className="text-slate-400" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={fieldClass}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="text-slate-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-xs font-extrabold">
            Confirm Password
          </label>
          <div className={wrapperClass}>
            <Lock size={16} className="text-slate-400" />
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={fieldClass}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-extrabold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Sign Up"}
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={() => setError("Configure Google sign-in with your authentication provider.")}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          <span className="font-black text-blue-600">G</span>
          Continue with Google
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-extrabold text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
