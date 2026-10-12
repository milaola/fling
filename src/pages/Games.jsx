
import { useRef, useState } from "react";

const START = { x: 155, y: 335 };

export default function Games() {
  const svgRef = useRef(null);

  const [bird, setBird] = useState(START);
  const [aiming, setAiming] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [pigHit, setPigHit] = useState(false);
  const [shots, setShots] = useState(0);

  
  const getPoint = (event) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * 800,
      y: ((event.clientY - rect.top) / rect.height) * 450,
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

    setBird({
      x: Math.max(90, Math.min(200, point.x)),
      y: Math.max(260, Math.min(360, point.y)),
    });
  };

  
  const stopAim = () => {
    setAiming(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-lime-100 p-4 sm:p-6">
      
      <header className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Fling
          </h1>
          <p className="text-sm text-slate-600">Puzzle playground</p>
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
              Drag the bird backwards to aim.
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
            aria-label="Fling game scene with a bird and a target"
            onPointerMove={moveAim}
            onPointerUp={stopAim}
            onPointerCancel={stopAim}
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
                cursor: aiming ? "grabbing" : "grab",
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

           
            <g>
              <circle cx="685" cy="287" r="18" fill="#a3e635" />
              <circle cx="679" cy="282" r="3" fill="#1f2937" />
              <circle cx="691" cy="282" r="3" fill="#1f2937" />
              <path
                d="M679 293 Q685 300 692 293"
                stroke="#1f2937"
                strokeWidth="2"
                fill="none"
              />
            </g>

         
            {aiming && (
              <g opacity="0.7">
                <circle cx="230" cy="310" r="4" fill="white" />
                <circle cx="270" cy="290" r="3" fill="white" />
                <circle cx="310" cy="275" r="2" fill="white" />
              </g>
            )}
          </svg>
        </div>

        
        <div className="mt-4 rounded-xl bg-white/80 p-4 text-center shadow-sm">
          <p className="font-medium text-slate-700">
            {aiming
              ? "Keep dragging to adjust your aim."
              : "Grab the bird and drag it to aim."}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Launching the bird will be added in the next commit.
          </p>
        </div>
      </main>
    </div>
  );
}
