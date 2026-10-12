
import { useEffect, useRef, useState } from "react";

const START = { x: 155, y: 335 };
const SCENE_WIDTH = 800;
const SCENE_HEIGHT = 450;

export default function Games() {
  const svgRef = useRef(null);
  const animationRef = useRef(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ ...START });
  const previousTimeRef = useRef(null);

  const [bird, setBird] = useState(START);
  const [aiming, setAiming] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [pigHit, setPigHit] = useState(false);
  const [shots, setShots] = useState(0);

 
  const getPoint = (event) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * SCENE_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * SCENE_HEIGHT,
    };
  };

  
  const startAim = (event) => {
    if (launched || pigHit) return;

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setAiming(true);
  };

  
  const moveAim = (event) => {
    if (!aiming || launched) return;

    const point = getPoint(event);

    const next = {
      x: Math.max(90, Math.min(200, point.x)),
      y: Math.max(260, Math.min(360, point.y)),
    };

    positionRef.current = next;
    setBird(next);
  };


  const releaseBird = () => {
    if (!aiming || launched) return;

    const dx = START.x - positionRef.current.x;
    const dy = START.y - positionRef.current.y;

    
    velocityRef.current = {
      x: dx * 0.16,
      y: dy * 0.16,
    };

    previousTimeRef.current = null;

    setAiming(false);
    setLaunched(true);
    setShots((previous) => previous + 1);
  };

  
  useEffect(() => {
    if (!launched) return;

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
      const current = positionRef.current;

      const next = {
        x: current.x + velocity.x * delta,
        y: current.y + velocity.y * delta,
      };

      velocity.x *= Math.pow(airResistance, delta);
      velocity.y += gravity * delta;

      positionRef.current = next;
      setBird(next);

     
      if (
        next.x > SCENE_WIDTH + 30 ||
        next.y > SCENE_HEIGHT + 30 ||
        next.x < -30
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
        animationRef.current = null;
      }
    };
  }, [launched]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-lime-100 p-4 sm:p-6">
   
      <header className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Fling
          </h1>
          <p className="text-sm text-slate-600">
            Puzzle playground
          </p>
        </div>

        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          Level 1
        </span>
      </header>

      <main className="mx-auto max-w-5xl">
       
        <section className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Ready to Fling?
            </h2>
            <p className="text-sm text-slate-600">
              Pull the bird backwards, then release.
            </p>
          </div>

          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-800">
            Shots: {shots}
          </span>
        </section>

        
        <div className="overflow-hidden rounded-2xl border-4 border-white bg-sky-300 shadow-xl">
          <svg
            ref={svgRef}
            viewBox="0 0 800 450"
            className="block w-full select-none"
            role="img"
            aria-label="Fling puzzle game scene"
            onPointerMove={moveAim}
            onPointerUp={releaseBird}
            onPointerCancel={releaseBird}
            style={{ touchAction: "none" }}
          >
            
            <rect width="800" height="450" fill="#7dd3fc" />

            
            <g fill="white">
              <circle cx="130" cy="80" r="28" />
              <circle cx="160" cy="70" r="36" />
              <circle cx="192" cy="82" r="25" />

              <circle cx="480" cy="95" r="22" />
              <circle cx="508" cy="82" r="30" />
              <circle cx="538" cy="96" r="22" />
            </g>

            
            <path d="M0 300 L150 150 L300 300 Z" fill="#86efac" />
            <path d="M220 300 L400 130 L580 300 Z" fill="#4ade80" />
            <path d="M460 300 L620 170 L800 300 Z" fill="#86efac" />

            
            <rect y="360" width="800" height="90" fill="#65a30d" />
            <path d="M0 360 Q200 345 400 360 T800 360" fill="#84cc16" />

            <path
              d="M130 360 L145 275 M160 360 L145 275"
              stroke="#854d0e"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />

         
            {aiming && (
              <line
                x1="145"
                y1="285"
                x2={bird.x}
                y2={bird.y}
                stroke="#78350f"
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}

            
            <g
              transform={`translate(${bird.x} ${bird.y})`}
              onPointerDown={startAim}
              style={{
                cursor: launched ? "default" : aiming ? "grabbing" : "grab",
                touchAction: "none",
              }}
            >
              <circle r="18" fill="#ef4444" />
              <circle cx="6" cy="-5" r="5" fill="white" />
              <circle cx="7" cy="-5" r="2.5" fill="#111827" />
              <path d="M16 2 L29 7 L16 11 Z" fill="#facc15" />
              <path
                d="M-8 10 Q0 16 7 9"
                stroke="#b91c1c"
                strokeWidth="2"
                fill="none"
              />
            </g>

           
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

      
        <div className="mt-4 rounded-xl bg-white/80 p-4 text-center shadow-sm">
          <p className="font-medium text-slate-700">
            {aiming
              ? "Adjust your aim, then release!"
              : launched
                ? "Watch your bird fly!"
                : "Grab the bird and pull it backwards."}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {pigHit
              ? "Target hit!"
              : "Try different pull angles and strengths."}
          </p>
        </div>
      </main>
    </div>
  );
}
