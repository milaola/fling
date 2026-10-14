
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const START = { x: 155, y: 335 };
const POWER = 9;
const GRAVITY = 450;
const MAX_PULL = 95;
const GROUND_Y = 405;

const LEVELS = [
  {
    name: "Green Valley",
    target: { x: 700, y: 325, radius: 25 },
    obstacles: [],
    description: "Aim carefully and hit the target!",
  },
  {
    name: "Rocky Ridge",
    target: { x: 740, y: 285, radius: 25 },
    obstacles: [
      { x: 440, y: 320, width: 42, height: 100 },
    ],
    description: "Watch out for the obstacle!",
  },
  {
    name: "Sky High",
    target: { x: 785, y: 240, radius: 25 },
    obstacles: [
      { x: 420, y: 300, width: 42, height: 120 },
      { x: 580, y: 255, width: 42, height: 165 },
    ],
    description: "Two obstacles. Can you make the shot?",
  },
];

export default function Games() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [levelIndex, setLevelIndex] = useState(0);
  const [bird, setBird] = useState({ ...START });
  const [aimPoint, setAimPoint] = useState({ ...START });
  const [aiming, setAiming] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [shots, setShots] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [message, setMessage] = useState("");

  const svgRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef({ ...START });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(null);
  const aimingRef = useRef(false);

  const level = LEVELS[levelIndex];

  const stopAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    lastTimeRef.current = null;
  }, []);

  const resetLevel = useCallback(() => {
    stopAnimation();

    positionRef.current = { ...START };
    velocityRef.current = { x: 0, y: 0 };
    lastTimeRef.current = null;
    aimingRef.current = false;

    setBird({ ...START });
    setAimPoint({ ...START });
    setAiming(false);
    setLaunched(false);
    setShots(0);
    setGameStatus("playing");
    setMessage("");
  }, [stopAnimation]);

  const getPoint = useCallback((event) => {
    const svg = svgRef.current;
    if (!svg) return null;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const matrix = svg.getScreenCTM();
    if (!matrix) return null;

    const transformed = point.matrixTransform(matrix.inverse());

    return {
      x: transformed.x,
      y: transformed.y,
    };
  }, []);

  const handlePointerDown = (event) => {
    if (gameStatus !== "playing" || launched) return;

    const point = getPoint(event);
    if (!point) return;

    const distance = Math.hypot(
      point.x - START.x,
      point.y - START.y
    );

    if (distance > 55) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    aimingRef.current = true;
    setAiming(true);
    setAimPoint({ ...START });
  };

  const handlePointerMove = (event) => {
    if (!aimingRef.current) return;

    const point = getPoint(event);
    if (!point) return;

    let dx = point.x - START.x;
    let dy = point.y - START.y;

   
    dx = Math.min(dx, 0);

    const distance = Math.hypot(dx, dy);

    if (distance > MAX_PULL) {
      const scale = MAX_PULL / distance;
      dx *= scale;
      dy *= scale;
    }

    const nextPoint = {
      x: START.x + dx,
      y: START.y + dy,
    };

    positionRef.current = nextPoint;
    setBird(nextPoint);
    setAimPoint(nextPoint);
  };

  const releaseBird = (event) => {
    if (!aimingRef.current) return;


      handleAimRelease(positionRef.current);
      };

  const handleAimRelease = (point) => {
    if (!aimingRef.current) return;

    aimingRef.current = false;
    setAiming(false);

    const dx = START.x - point.x;
    const dy = START.y - point.y;
    const pullDistance = Math.hypot(dx, dy);

    if (pullDistance < 8) {
      positionRef.current = { ...START };
      setBird({ ...START });
      setAimPoint({ ...START });
      return;
    }

    velocityRef.current = {
      x: dx * POWER,
      y: dy * POWER,
    };

    setShots((previous) => previous + 1);
    setLaunched(true);
  };

  useEffect(() => {
    if (!launched || gameStatus !== "playing") return;

    let frameId = null;
    let previousTime = null;
    let finished = false;

    const finish = (status, text) => {
      if (finished) return;
      finished = true;

      setGameStatus(status);
      setMessage(text);
      setLaunched(false);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      animationRef.current = null;
    };

    const animate = (time) => {
      if (finished) return;

      if (previousTime === null) previousTime = time;

      const dt = Math.min((time - previousTime) / 1000, 0.03);
      previousTime = time;

      const current = positionRef.current;
      const velocity = velocityRef.current;

      const next = {
        x: current.x + velocity.x * dt,
        y: current.y + velocity.y * dt,
      };

      velocity.y += GRAVITY * dt;

      positionRef.current = next;
      setBird(next);

      const target = level.target;
      const distanceToTarget = Math.hypot(
        next.x - target.x,
        next.y - target.y
      );

      if (distanceToTarget <= target.radius + 12) {
        finish("won", "Great shot! You hit the target!");
        return;
      }

      
      const hitObstacle = level.obstacles.some((obstacle) => {
        return (
          next.x + 12 >= obstacle.x &&
          next.x - 12 <= obstacle.x + obstacle.width &&
          next.y + 12 >= obstacle.y &&
          next.y - 12 <= obstacle.y + obstacle.height
        );
      });

      if (hitObstacle) {
        finish("missed", "Oh no! You hit an obstacle.");
        return;
      }

      if (
        next.y + 12 >= GROUND_Y ||
        next.x > 990 ||
        next.x < -30 ||
        next.y < -80
      ) {
        finish("missed", "Missed! Adjust your aim and try again.");
        return;
      }

      frameId = requestAnimationFrame(animate);
      animationRef.current = frameId;
    };

    frameId = requestAnimationFrame(animate);
    animationRef.current = frameId;

    return () => {
      finished = true;

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      if (animationRef.current === frameId) {
        animationRef.current = null;
      }
    };
  }, [launched, gameStatus, level]);

  useEffect(() => {
    return () => stopAnimation();
  }, [stopAnimation]);

  const nextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((previous) => previous + 1);

      
      stopAnimation();
      positionRef.current = { ...START };
      velocityRef.current = { x: 0, y: 0 };
      aimingRef.current = false;

      setBird({ ...START });
      setAimPoint({ ...START });
      setAiming(false);
      setLaunched(false);
      setShots(0);
      setGameStatus("playing");
      setMessage("");
    }
  };

  const handleLogout = async () => {
    stopAnimation();
    await logout();
    navigate("/login");
  };

  const allLevelsCompleted =
    gameStatus === "won" && levelIndex === LEVELS.length - 1;

  return (
    <div className="h-dvh min-h-[480px] overflow-hidden bg-sky-300 text-white">
      <header className="relative z-10 flex h-14 items-center justify-between gap-3 bg-indigo-950 px-4 shadow-lg sm:px-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black italic tracking-wider text-amber-400">
            FLING
          </span>
          <span className="hidden rounded-full bg-indigo-800 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-200 sm:inline">
            Puzzle adventure
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-indigo-100 sm:inline">
            Welcome,{" "}
            <strong className="text-amber-300">
              {user?.name || user?.email || "Player"}
            </strong>
          </span>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-indigo-700 px-3 py-1.5 text-sm font-semibold transition hover:bg-indigo-800"
          >
            Log out
          </button>
        </div>
      </header>

    
      <main className="relative h-[calc(100dvh-56px)] min-h-[424px]">
        <svg
          ref={svgRef}
          viewBox="0 0 960 540"
          preserveAspectRatio="xMidYMid meet"
          className={`absolute inset-0 h-full w-full touch-none select-none ${aiming ? "cursor-grabbing" : launched ? "cursor-default" : "cursor-grab"
            }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={releaseBird}
          onPointerCancel={releaseBird}
          role="img"
          aria-label="Fling puzzle game. Drag the blue bird backwards and release it to hit the green target."
        >
          <defs>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="65%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>

            <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#647fb8" />
              <stop offset="100%" stopColor="#354b82" />
            </linearGradient>

            <linearGradient id="hillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>

            <linearGradient id="grassGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#4d7c0f" />
            </linearGradient>

            <linearGradient id="woodGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

       
          <rect width="960" height="540" fill="url(#skyGradient)" />

          
          <g fill="#ffffff" opacity="0.72">
            <g transform="translate(250 90)">
              <ellipse cx="0" cy="14" rx="45" ry="15" />
              <circle cx="-20" cy="5" r="20" />
              <circle cx="5" cy="-7" r="28" />
              <circle cx="30" cy="6" r="20" />
            </g>

            <g transform="translate(700 105) scale(0.8)">
              <ellipse cx="0" cy="14" rx="45" ry="15" />
              <circle cx="-20" cy="5" r="20" />
              <circle cx="5" cy="-7" r="28" />
              <circle cx="30" cy="6" r="20" />
            </g>

            <g transform="translate(470 45) scale(0.55)">
              <ellipse cx="0" cy="14" rx="45" ry="15" />
              <circle cx="-20" cy="5" r="20" />
              <circle cx="5" cy="-7" r="28" />
              <circle cx="30" cy="6" r="20" />
            </g>
          </g>

          
          <path
            d="M0 310 L110 190 L175 265 L275 145 L380 280 L480 185 L590 290 L710 170 L840 285 L920 210 L960 255 L960 420 L0 420 Z"
            fill="url(#mountainGradient)"
          />

          <path
            d="M110 190 L142 226 L125 221 L110 238 L95 222 Z"
            fill="#e0f2fe"
            opacity="0.9"
          />
          <path
            d="M275 145 L315 202 L291 191 L275 207 L255 192 Z"
            fill="#f0f9ff"
            opacity="0.95"
          />
          <path
            d="M710 170 L748 214 L724 206 L710 222 L693 207 Z"
            fill="#e0f2fe"
            opacity="0.9"
          />

       
          <path
            d="M0 330 Q130 265 255 335 T510 330 T770 320 T960 300 L960 440 L0 440 Z"
            fill="#38bdf8"
          />

          <path
            d="M0 360 Q130 310 260 355 T520 355 T780 345 T960 330 L960 440 L0 440 Z"
            fill="url(#hillGradient)"
          />

   
          <path
            d="M0 380 Q120 350 230 380 T460 375 T700 365 T960 360 L960 430 L0 430 Z"
            fill="#0891b2"
            opacity="0.6"
          />

          <g stroke="#bae6fd" strokeWidth="3" opacity="0.55" strokeLinecap="round">
            <path d="M520 380 h55" />
            <path d="M605 392 h35" />
            <path d="M760 374 h60" />
            <path d="M835 390 h30" />
            <path d="M300 390 h42" />
          </g>

          
          <ellipse
            cx="480"
            cy="414"
            rx="470"
            ry="20"
            fill="#14532d"
            opacity="0.25"
            filter="url(#softShadow)"
          />

          <rect x="0" y="395" width="960" height="145" fill="url(#grassGradient)" />
          <path d="M0 395 Q140 380 260 396 T510 395 T770 390 T960 395 L960 410 L0 410 Z" fill="#a3e635" />

          
          <g stroke="#3f6212" strokeWidth="2" strokeLinecap="round" opacity="0.65">
            {Array.from({ length: 35 }, (_, i) => (
              <path
                key={i}
                d={`M${15 + i * 28} 405 l-4 -8 m4 8 l5 -6`}
              />
            ))}
          </g>

         
          <ellipse cx={START.x} cy="398" rx="38" ry="7" fill="#365314" opacity="0.35" />

          <path
            d="M135 401 L151 328 Q154 315 164 325 L177 401 Z"
            fill="#78350f"
            stroke="#451a03"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <path
            d="M151 335 L132 288 Q128 278 136 273 Q144 269 149 281 L164 318"
            fill="none"
            stroke="#92400e"
            strokeWidth="13"
            strokeLinecap="round"
          />

          <path
            d="M158 322 L178 280 Q183 269 191 275 Q198 280 192 291 L171 335"
            fill="none"
            stroke="#92400e"
            strokeWidth="13"
            strokeLinecap="round"
          />

          <path
            d="M137 285 L157 330"
            fill="none"
            stroke="#d97706"
            strokeWidth="3"
            strokeLinecap="round"
          />

          
          <path
            d="M151 350 Q159 354 167 349 M149 370 Q158 374 170 368"
            fill="none"
            stroke="#b45309"
            strokeWidth="2"
            opacity="0.8"
          />

          
          {aiming && (
            <g>
              {Array.from({ length: 12 }, (_, i) => {
                const dx = START.x - bird.x;
                const dy = START.y - bird.y;
                const speed = Math.hypot(dx, dy) * POWER;
                const vx = speed > 0 ? (dx / Math.hypot(dx, dy)) * speed : 0;
                const vy = speed > 0 ? (dy / Math.hypot(dx, dy)) * speed : 0;
                const t = (i + 1) * 0.09;

                return (
                  <circle
                    key={i}
                    cx={bird.x + vx * t}
                    cy={bird.y + vy * t + 0.5 * GRAVITY * t * t}
                    r={Math.max(2, 4 - i * 0.18)}
                    fill="#ffffff"
                    opacity={0.85 - i * 0.055}
                  />
                );
              })}
            </g>
          )}

        
          <path
            d={`M137 285 Q${(137 + bird.x) / 2} ${(285 + bird.y) / 2 - 5} ${bird.x} ${bird.y}`}
            fill="none"
            stroke="#78350f"
            strokeWidth="5"
            strokeLinecap="round"
          />

          
          <g>
            <ellipse
              cx={level.target.x}
              cy="399"
              rx="82"
              ry="8"
              fill="#365314"
              opacity="0.3"
            />

          
            <rect
              x={level.target.x - 58}
              y={level.target.y - 40}
              width="16"
              height={440 - (level.target.y - 40)}
              rx="2"
              fill="url(#woodGradient)"
              stroke="#78350f"
              strokeWidth="3"
            />

            <rect
              x={level.target.x + 42}
              y={level.target.y - 40}
              width="16"
              height={440 - (level.target.y - 40)}
              rx="2"
              fill="url(#woodGradient)"
              stroke="#78350f"
              strokeWidth="3"
            />

           
            <rect
              x={level.target.x - 72}
              y={level.target.y - 45}
              width="144"
              height="16"
              rx="3"
              fill="url(#woodGradient)"
              stroke="#78350f"
              strokeWidth="3"
            />

            
            <path
              d={`M${level.target.x - 55} ${level.target.y + 25} L${level.target.x + 42} ${level.target.y + 80}`}
              stroke="#92400e"
              strokeWidth="10"
              strokeLinecap="round"
            />

            <path
              d={`M${level.target.x + 48} ${level.target.y + 25} L${level.target.x - 42} ${level.target.y + 80}`}
              stroke="#92400e"
              strokeWidth="10"
              strokeLinecap="round"
            />

           
            <path
              d={`M${level.target.x - 48} ${level.target.y - 38} v8 M${level.target.x + 50} ${level.target.y - 38} v8`}
              stroke="#fbbf24"
              strokeWidth="2"
            />
          </g>

         
          {level.obstacles.map((obstacle, index) => (
            <g key={`${levelIndex}-${index}`}>
              <rect
                x={obstacle.x}
                y={obstacle.y}
                width={obstacle.width}
                height={obstacle.height}
                rx="4"
                fill="url(#woodGradient)"
                stroke="#78350f"
                strokeWidth="3"
              />

              <path
                d={`M${obstacle.x + 8} ${obstacle.y + 8} v${obstacle.height - 16} M${obstacle.x + obstacle.width - 8} ${obstacle.y + 8} v${obstacle.height - 16}`}
                stroke="#fbbf24"
                strokeWidth="2"
                opacity="0.65"
              />
            </g>
          ))}

          
          <g transform={`translate(${level.target.x} ${level.target.y})`}>
            <ellipse
              cx="-18"
              cy="-22"
              rx="12"
              ry="15"
              fill="#4d7c0f"
              stroke="#365314"
              strokeWidth="3"
              transform="rotate(-25 -18 -22)"
            />

            <ellipse
              cx="18"
              cy="-22"
              rx="12"
              ry="15"
              fill="#4d7c0f"
              stroke="#365314"
              strokeWidth="3"
              transform="rotate(25 18 -22)"
            />

            
            <circle
              r="26"
              fill="#84cc16"
              stroke="#3f6212"
              strokeWidth="3"
            />

           
            <ellipse cx="-9" cy="-6" rx="6" ry="8" fill="#ffffff" />
            <ellipse cx="9" cy="-6" rx="6" ry="8" fill="#ffffff" />
            <circle cx="-8" cy="-5" r="3" fill="#172554" />
            <circle cx="10" cy="-5" r="3" fill="#172554" />

            
            <ellipse
              cx="0"
              cy="8"
              rx="14"
              ry="10"
              fill="#bef264"
              stroke="#4d7c0f"
              strokeWidth="2"
            />

            <ellipse cx="-5" cy="8" rx="2.5" ry="3.5" fill="#365314" />
            <ellipse cx="5" cy="8" rx="2.5" ry="3.5" fill="#365314" />

            <path
              d="M-7 17 Q0 22 7 17"
              fill="none"
              stroke="#365314"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

         
          <g transform={`translate(${bird.x} ${bird.y})`}>
            {!launched && (
              <ellipse
                cx="0"
                cy="17"
                rx="16"
                ry="5"
                fill="#0c4a6e"
                opacity="0.2"
              />
            )}

            
            <path
              d="M-15 3 L-25 -4 L-23 6 L-31 8 L-20 13 Z"
              fill="#0369a1"
              stroke="#075985"
              strokeWidth="2"
              strokeLinejoin="round"
            />

           
            <circle
              r="17"
              fill="#38bdf8"
              stroke="#075985"
              strokeWidth="3"
            />

          
            <ellipse
              cx="-3"
              cy="5"
              rx="9"
              ry="6"
              fill="#0284c7"
              transform="rotate(-25 -3 5)"
            />

            
            <path
              d="M-7 -14 Q-14 -25 -3 -23 Q2 -22 1 -15"
              fill="#0284c7"
              stroke="#075985"
              strokeWidth="2"
            />

         
            <ellipse cx="6" cy="-5" rx="6" ry="7" fill="#ffffff" />
            <ellipse cx="7" cy="-4" rx="3" ry="4" fill="#172554" />
            <circle cx="8" cy="-6" r="1.3" fill="#ffffff" />

          
            <path
              d="M13 1 L26 5 L14 10 Z"
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            
            <circle cx="5" cy="7" r="3" fill="#7dd3fc" opacity="0.8" />
          </g>

         
          {aiming && (
            <path
              d={`M190 282 Q${(190 + bird.x) / 2} ${(282 + bird.y) / 2} ${bird.x} ${bird.y}`}
              fill="none"
              stroke="#451a03"
              strokeWidth="5"
              strokeLinecap="round"
            />
          )}
        </svg>

       
        <div className="pointer-events-none absolute left-3 top-3 right-3 flex items-start justify-between gap-2 sm:left-6 sm:right-6 sm:top-5">
          <div className="max-w-[65%] rounded-2xl border border-white/30 bg-indigo-950/80 px-4 py-3 shadow-lg backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
              Level {levelIndex + 1} of {LEVELS.length}
            </p>

            <h1 className="mt-0.5 text-lg font-black leading-tight sm:text-2xl">
              {level.name}
            </h1>

            <p className="mt-1 text-xs text-indigo-100 sm:text-sm">
              {level.description}
            </p>
          </div>

          <div className="rounded-2xl border border-white/30 bg-indigo-950/80 px-3 py-2 text-right shadow-lg backdrop-blur-sm sm:px-4 sm:py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
              Shots
            </p>
            <p className="text-2xl font-black text-amber-300">{shots}</p>
          </div>
        </div>

        {gameStatus === "playing" && !launched && !aiming && (
          <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/40 bg-indigo-950/75 px-4 py-2 text-center text-xs font-semibold shadow-lg backdrop-blur-sm sm:bottom-8 sm:text-sm">
            <span className="mr-2 text-amber-300">↖</span>
            Drag the bird backwards, then release!
          </div>
        )}

        {aiming && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-indigo-950/80 px-4 py-2 text-xs font-bold text-amber-300 shadow-lg">
            Release to Fling!
          </div>
        )}

        
        <button
          onClick={resetLevel}
          className="absolute bottom-3 right-3 rounded-xl border border-white/50 bg-white/90 px-3 py-2 text-xs font-bold text-indigo-950 shadow-lg transition hover:scale-105 hover:bg-white sm:bottom-6 sm:right-6 sm:px-4 sm:text-sm"
        >
          ↻ Reset level
        </button>

        
        {gameStatus !== "playing" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-indigo-950/55 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl border border-white/30 bg-indigo-950/95 p-6 text-center shadow-2xl sm:p-8">
              {gameStatus === "won" ? (
                <>
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-4xl shadow-lg">
                    🎉
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                    Level completed
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    {allLevelsCompleted ? "You did it!" : "Great shot!"}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-indigo-100">
                    {allLevelsCompleted
                      ? "Amazing! You have completed every level in Fling."
                      : `You conquered ${level.name}. Ready for the next challenge?`}
                  </p>

                  <div className="mt-5 rounded-xl bg-indigo-900/80 px-4 py-3">
                    <p className="text-xs text-indigo-300">Shots taken</p>
                    <p className="mt-1 text-2xl font-black text-amber-300">
                      {shots}
                    </p>
                  </div>

                  {allLevelsCompleted ? (
                    <button
                      onClick={() => {
                        setLevelIndex(0);
                        resetLevel();
                      }}
                      className="mt-5 w-full rounded-xl bg-amber-400 px-5 py-3 font-black text-indigo-950 transition hover:bg-amber-300"
                    >
                      Play Again
                    </button>
                  ) : (
                    <button
                      onClick={nextLevel}
                      className="mt-5 w-full rounded-xl bg-amber-400 px-5 py-3 font-black text-indigo-950 transition hover:bg-amber-300"
                    >
                      Next Level →
                    </button>
                  )}

                  <button
                    onClick={resetLevel}
                    className="mt-3 w-full rounded-xl border border-indigo-700 px-5 py-3 font-semibold text-white transition hover:bg-indigo-900"
                  >
                    Replay This Level
                  </button>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-4xl">
                    💥
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-300">
                    Not quite!
                  </p>

                  <h2 className="mt-2 text-3xl font-black">Missed!</h2>

                  <p className="mt-3 text-sm leading-relaxed text-indigo-100">
                    {message || "Your bird missed the target."} Try changing your angle or pulling the bird back further.
                  </p>

                  <button
                    onClick={resetLevel}
                    className="mt-6 w-full rounded-xl bg-amber-400 px-5 py-3 font-black text-indigo-950 transition hover:bg-amber-300"
                  >
                    Try Again
                  </button>

                  <button
                    onClick={() => {
                      setLevelIndex(0);
                      resetLevel();
                    }}
                    className="mt-3 w-full rounded-xl border border-indigo-700 px-5 py-3 font-semibold text-white transition hover:bg-indigo-900"
                  >
                    Restart from Level 1
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
