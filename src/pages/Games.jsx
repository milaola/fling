
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const START = { x: 155, y: 335 };
const SCENE_WIDTH = 800;
const SCENE_HEIGHT = 450;
const TARGET = { x: 685, y: 287, radius: 36 };

export default function Game() {
  const svgRef = useRef(null);
  const animationRef = useRef(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ ...START });
  const previousTimeRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [bird, setBird] = useState(START);
  const [aiming, setAiming] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [pigHit, setPigHit] = useState(false);
  const [shots, setShots] = useState(0);

  const getPoint = (event) => {
    const svg = svgRef.current;
    if (!svg) return START;

    const rect = svg.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * SCENE_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * SCENE_HEIGHT,
    };
  };

  const startAim = (event) => {
    if (launched || pigHit) return;

    const point = getPoint(event);
    const distance = Math.hypot(
      point.x - bird.x,
      point.y - bird.y
    );


    if (distance > 35) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setAiming(true);
  };

  const moveAim = (event) => {
    if (!aiming || launched || pigHit) return;

    const point = getPoint(event);

    const next = {
      x: Math.max(90, Math.min(START.x, point.x)),
      y: Math.max(260, Math.min(360, point.y)),
    };

    positionRef.current = next;
    setBird(next);
  };

  const releaseBird = () => {
    if (!aiming || launched || pigHit) return;

    const dx = START.x - positionRef.current.x;
    const dy = START.y - positionRef.current.y;


    if (Math.hypot(dx, dy) < 8) {
      positionRef.current = { ...START };
      setBird({ ...START });
      setAiming(false);
      return;
    }

    velocityRef.current = {
      x: dx * 0.16,
      y: dy * 0.16,
    };

    previousTimeRef.current = null;
    setAiming(false);
    setLaunched(true);
    setShots((count) => count + 1);
  };

  const resetLevel = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = null;
    velocityRef.current = { x: 0, y: 0 };
    positionRef.current = { ...START };
    previousTimeRef.current = null;

    setBird({ ...START });
    setAiming(false);
    setLaunched(false);
    setPigHit(false);
    setShots(0);
  };

  const logoutPlayer = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (!launched || pigHit) return;

    const gravity = 0.35;
    const airResistance = 0.99;

    const animate = (time) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time;
      }

      const delta = Math.min(
        (time - previousTimeRef.current) / 16.67,
        2
      );

      previousTimeRef.current = time;

      const velocity = velocityRef.current;
      const position = positionRef.current;

      const next = {
        x: position.x + velocity.x * delta,
        y: position.y + velocity.y * delta,
      };

      positionRef.current = next;
      setBird(next);

      const distance = Math.hypot(
        next.x - TARGET.x,
        next.y - TARGET.y
      );

      if (distance <= TARGET.radius) {
        setPigHit(true);
        setLaunched(false);
        animationRef.current = null;
        return;
      }

      velocity.x *= Math.pow(airResistance, delta);
      velocity.y += gravity * delta;

      if (
        next.x < -40 ||
        next.x > SCENE_WIDTH + 40 ||
        next.y > SCENE_HEIGHT + 40 ||
        next.y < -40
      ) {
        setLaunched(false);
        animationRef.current = null;
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = null;
    };
  }, [launched, pigHit]);

  const playerName = user?.name || user?.email || "Player";

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-lime-200 p-4 text-slate-800 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-lg backdrop-blur-md">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-emerald-700">
              Fling
            </h1>
            <p className="text-sm text-slate-600">
              Aim carefully. Fling boldly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-slate-700">
              Welcome, {playerName}!
            </p>

            <button
              type="button"
              onClick={logoutPlayer}
              className="rounded-xl bg-rose-500 px-4 py-2 font-bold text-white shadow transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
            >
              Log out
            </button>
          </div>
        </header>


        <section className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-md">
          <div>
            <h2 className="text-xl font-extrabold">
              Level 1: The First Fling
            </h2>
            <p className="text-sm text-slate-600">
              Pull the bird backward, then release to launch it.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-100 px-4 py-2 font-bold text-emerald-800">
              Shots: {shots}
            </span>

            <button
              type="button"
              onClick={resetLevel}
              className="rounded-xl bg-slate-800 px-4 py-2 font-bold text-white transition hover:bg-slate-700"
            >
              Reset
            </button>
          </div>
        </section>


        <section className="overflow-hidden rounded-3xl border-4 border-white/80 bg-sky-100 shadow-2xl">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
            className="block w-full touch-none select-none"
            style={{ aspectRatio: "800 / 450" }}
            onPointerMove={moveAim}
            onPointerUp={releaseBird}
            onPointerCancel={releaseBird}
          >

            <rect
              width={SCENE_WIDTH}
              height={SCENE_HEIGHT}
              fill="#bae6fd"
            />


            <g fill="#ffffff" opacity="0.9">
              <ellipse cx="130" cy="75" rx="48" ry="18" />
              <circle cx="110" cy="65" r="22" />
              <circle cx="140" cy="57" r="28" />
              <circle cx="165" cy="70" r="19" />

              <ellipse cx="530" cy="85" rx="48" ry="16" />
              <circle cx="510" cy="75" r="21" />
              <circle cx="540" cy="67" r="26" />
              <circle cx="565" cy="80" r="17" />
            </g>


            <path
              d="M0 300 Q150 190 300 300 T600 280 T800 300 V450 H0Z"
              fill="#86efac"
            />


            <rect
              x="0"
              y="360"
              width={SCENE_WIDTH}
              height="90"
              fill="#65a30d"
            />
            <path
              d="M0 360 Q200 345 400 365 T800 355"
              fill="none"
              stroke="#4d7c0f"
              strokeWidth="5"
            />


            <path
              d="M125 360 L145 275 Q150 260 160 275 L185 360"
              fill="none"
              stroke="#92400e"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />


            <path
              d={
                aiming
                  ? `M145 278 L${bird.x} ${bird.y}`
                  : `M145 278 L${START.x} ${START.y}`
              }
              fill="none"
              stroke="#78350f"
              strokeWidth="5"
              strokeLinecap="round"
            />


            <g>
              <rect
                x="620"
                y="325"
                width="130"
                height="15"
                rx="4"
                fill="#b45309"
              />
              <rect
                x="638"
                y="295"
                width="18"
                height="30"
                rx="3"
                fill="#d97706"
              />
              <rect
                x="715"
                y="295"
                width="18"
                height="30"
                rx="3"
                fill="#d97706"
              />
              <rect
                x="625"
                y="280"
                width="125"
                height="12"
                rx="3"
                fill="#f59e0b"
              />
            </g>


            <g>
              <circle
                cx={TARGET.x}
                cy={TARGET.y}
                r="21"
                fill={pigHit ? "#86efac" : "#4ade80"}
                stroke="#15803d"
                strokeWidth="3"
              />
              <ellipse
                cx={TARGET.x}
                cy={TARGET.y + 5}
                rx="10"
                ry="7"
                fill="#bbf7d0"
              />
              <circle
                cx={TARGET.x - 7}
                cy={TARGET.y - 5}
                r="2.5"
                fill="#14532d"
              />
              <circle
                cx={TARGET.x + 7}
                cy={TARGET.y - 5}
                r="2.5"
                fill="#14532d"
              />
              <ellipse
                cx={TARGET.x - 8}
                cy={TARGET.y - 20}
                rx="7"
                ry="10"
                fill="#4ade80"
                stroke="#15803d"
                strokeWidth="2"
              />
              <ellipse
                cx={TARGET.x + 8}
                cy={TARGET.y - 20}
                rx="7"
                ry="10"
                fill="#4ade80"
                stroke="#15803d"
                strokeWidth="2"
              />
            </g>


            <g
              onPointerDown={startAim}
              className={launched ? "" : "cursor-grab"}
            >
              <circle
                cx={bird.x}
                cy={bird.y}
                r="19"
                fill="#f87171"
                stroke="#b91c1c"
                strokeWidth="3"
              />
              <circle
                cx={bird.x + 6}
                cy={bird.y - 5}
                r="5"
                fill="white"
              />
              <circle
                cx={bird.x + 8}
                cy={bird.y - 5}
                r="2.5"
                fill="#111827"
              />
              <path
                d={`M${bird.x + 16} ${bird.y} l12 5 l-12 4 Z`}
                fill="#facc15"
                stroke="#ca8a04"
                strokeWidth="1"
              />
              <path
                d={`M${bird.x - 15} ${bird.y + 4} l-10 8 l13 -2 Z`}
                fill="#dc2626"
              />
            </g>


            {pigHit && (
              <g>
                <rect
                  x="190"
                  y="125"
                  width="420"
                  height="150"
                  rx="24"
                  fill="#ffffff"
                  opacity="0.95"
                />
                <text
                  x="400"
                  y="180"
                  textAnchor="middle"
                  fontSize="34"
                  fontWeight="900"
                  fill="#15803d"
                >
                  Level Complete!
                </text>
                <text
                  x="400"
                  y="218"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="600"
                  fill="#334155"
                >
                  Great shot! You hit the target.
                </text>
                <text
                  x="400"
                  y="247"
                  textAnchor="middle"
                  fontSize="15"
                  fill="#64748b"
                >
                  Press Reset to play again.
                </text>
              </g>
            )}
          </svg>
        </section>

        <p className="mt-4 text-center text-sm font-medium text-slate-600">
          Tip: Pull the bird to the left and slightly down to launch it toward
          the target.
        </p>
      </div>
    </main>
  );
}
