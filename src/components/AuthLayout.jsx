
import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-300 px-4 py-8">


      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/fling-background.png')",
        }}
        aria-hidden="true"
      />


      <div
        className="absolute inset-0 bg-sky-300/10"
        aria-hidden="true"
      />

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-white/70 bg-white/95 px-6 py-8 shadow-2xl shadow-blue-950/20 sm:px-10">


        <Link
          to="/login"
          className="mb-7 flex justify-center"
          aria-label="Fling login"
        >
          <img
            src="/assets/fling-logo.png"
            alt="Fling — Aim, Launch, Solve"
            className="h-auto w-40 object-contain sm:w-48"
          />
        </Link>

        {children}

      </section>
    </main>
  );
}
