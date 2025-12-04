import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Move, Info } from 'lucide-react';

export const FerrisWheel: React.FC = () => {
  // Angle in radians, initialized to PI/6 (30 degrees)
  const [angle, setAngle] = useState<number>(Math.PI / 6);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Constants for visualization
  const RADIUS = 160;
  const CENTER = { x: 250, y: 250 };
  const WHEEL_SPOKES = 12;

  // Calculate coordinates based on current angle
  // Note: SVG Y axis is down, so we invert sin for visual Y
  const rawCos = Math.cos(angle);
  const rawSin = Math.sin(angle);
  
  const pointX = CENTER.x + RADIUS * rawCos;
  const pointY = CENTER.y - RADIUS * rawSin; // Subtract because SVG Y grows downwards

  // Handle interaction
  const updateAngle = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left - CENTER.x;
    const y = rect.top + CENTER.y - clientY; // Invert mouse Y to match Cartesian
    
    // Calculate angle from -PI to PI
    let newAngle = Math.atan2(y, x);
    
    // Normalize to 0 to 2PI for easier reading
    if (newAngle < 0) {
      newAngle += 2 * Math.PI;
    }
    setAngle(newAngle);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      updateAngle(e.clientX, e.clientY);
    }
  }, [isDragging, updateAngle]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      updateAngle(touch.clientX, touch.clientY);
    }
  }, [isDragging, updateAngle]);

  const handleEnd = () => setIsDragging(false);

  // Global event listeners for drag release outside SVG
  useEffect(() => {
    const handleGlobalEnd = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, []);

  // Formatters
  // We use a cleaner rounding for the input value to prevent floating point jitter
  const displayDegrees = Math.round((angle * 180 / Math.PI) * 10) / 10;
  const radText = (angle / Math.PI).toFixed(2) + 'π';
  
  // Handler for manual degree input
  const handleDegreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setAngle((val * Math.PI) / 180);
    }
  };
  
  // Dynamic colors based on quadrants
  const getQuadrantColor = () => {
    // Normalize angle for color logic
    const normalized = angle % (2 * Math.PI);
    const positiveAngle = normalized < 0 ? normalized + 2 * Math.PI : normalized;
    
    if (positiveAngle < Math.PI / 2) return 'text-emerald-600';
    if (positiveAngle < Math.PI) return 'text-blue-600';
    if (positiveAngle < 3 * Math.PI / 2) return 'text-orange-600';
    return 'text-rose-600';
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Visualization Area */}
      <div className="flex-1 bg-slate-50 p-4 flex flex-col items-center justify-center relative select-none">
        <h2 className="absolute top-4 left-4 text-lg font-semibold text-slate-700 flex items-center gap-2">
          <Move className="w-5 h-5" /> 拖动小车旋转摩天轮
        </h2>
        
        <svg
          ref={svgRef}
          width="500"
          height="500"
          viewBox="0 0 500 500"
          className="w-full max-w-[500px] h-auto cursor-pointer touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
        >
          {/* Defs for gradients */}
          <defs>
            <radialGradient id="wheelGradient" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
            </radialGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.2"/>
            </filter>
          </defs>

          {/* Coordinate System Grid */}
          <line x1="20" y1={CENTER.y} x2="480" y2={CENTER.y} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1={CENTER.x} y1="480" x2={CENTER.x} y2="20" stroke="#94a3b8" strokeWidth="2" />
          <text x="485" y={CENTER.y + 5} className="text-sm fill-slate-500">X</text>
          <text x={CENTER.x - 10} y="15" className="text-sm fill-slate-500">Y</text>

          {/* Wheel Structure (Unit Circle) */}
          <circle 
            cx={CENTER.x} 
            cy={CENTER.y} 
            r={RADIUS} 
            fill="url(#wheelGradient)" 
            stroke="#64748b" 
            strokeWidth="4" 
          />
          
          {/* Spokes */}
          {Array.from({ length: WHEEL_SPOKES }).map((_, i) => {
            const spokeAngle = (i * 2 * Math.PI) / WHEEL_SPOKES;
            return (
              <line
                key={i}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={CENTER.x + RADIUS * Math.cos(spokeAngle)}
                y2={CENTER.y - RADIUS * Math.sin(spokeAngle)}
                stroke="#cbd5e1"
                strokeWidth="2"
              />
            );
          })}

          {/* Projections (The Core Analogy) */}
          {/* Cosine Projection (Horizontal) */}
          <line 
            x1={pointX} 
            y1={pointY} 
            x2={pointX} 
            y2={CENTER.y} 
            stroke="#f43f5e" 
            strokeWidth="2" 
            strokeDasharray="5,5" 
          />
          <line 
            x1={CENTER.x} 
            y1={CENTER.y} 
            x2={pointX} 
            y2={CENTER.y} 
            stroke="#f43f5e" 
            strokeWidth="3" 
          />
          
          {/* Sine Projection (Vertical) */}
          <line 
            x1={pointX} 
            y1={pointY} 
            x2={CENTER.x} 
            y2={pointY} 
            stroke="#3b82f6" 
            strokeWidth="2" 
            strokeDasharray="5,5" 
          />
          <line 
            x1={CENTER.x} 
            y1={CENTER.y} 
            x2={CENTER.x} 
            y2={pointY} 
            stroke="#3b82f6" 
            strokeWidth="3" 
          />

          {/* The Radius Arm */}
          <line 
            x1={CENTER.x} 
            y1={CENTER.y} 
            x2={pointX} 
            y2={pointY} 
            stroke="#475569" 
            strokeWidth="3" 
          />

          {/* The Angle Arc */}
          <path
            d={`M ${CENTER.x + 40} ${CENTER.y} A 40 40 0 ${angle % (2*Math.PI) > Math.PI ? 1 : 0} 0 ${CENTER.x + 40 * Math.cos(-angle)} ${CENTER.y + 40 * Math.sin(-angle)}`}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
          <text x={CENTER.x + 15} y={CENTER.y - 15} className="fill-violet-600 text-sm font-bold">θ</text>

          {/* The Rider/Cabin (Draggable Point) */}
          <g style={{ cursor: 'grab' }} filter="url(#shadow)">
            <circle cx={pointX} cy={pointY} r="16" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <circle cx={pointX} cy={pointY} r="4" fill="#78350f" />
            {/* Simple Person Icon */}
            <path 
              d={`M ${pointX} ${pointY+4} L ${pointX-3} ${pointY+10} M ${pointX} ${pointY+4} L ${pointX+3} ${pointY+10}`} 
              stroke="#78350f" strokeWidth="1.5" 
            />
          </g>

          {/* Center Hub */}
          <circle cx={CENTER.x} cy={CENTER.y} r="6" fill="#475569" />

        </svg>
      </div>

      {/* Info Panel */}
      <div className="w-full lg:w-96 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-500" />
            实时数据
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            观察当摩天轮旋转时，坐标值（红色与蓝色线段）是如何变化的。您可以拖动左侧摩天轮，或在下方直接输入角度。
          </p>

          <div className="space-y-4">
            {/* Angle Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">角度 (Angle)</span>
              <div className="flex justify-between items-center mt-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={displayDegrees}
                    onChange={handleDegreeChange}
                    className="w-24 px-2 py-1 text-lg font-mono text-slate-700 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    step="15"
                  />
                  <span className="text-xl font-mono text-slate-700">°</span>
                </div>
                <span className="text-lg font-mono text-violet-600">{radText} rad</span>
              </div>
            </div>

            {/* Coordinates Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">单位圆坐标 P(x, y)</span>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-rose-500 font-bold">x = cos(θ)</span>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200 min-w-[80px] text-right">
                    {rawCos.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-blue-500 font-bold">y = sin(θ)</span>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200 min-w-[80px] text-right">
                    {rawSin.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trig Values Card */}
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">三角函数值</span>
              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="flex justify-between border-b border-indigo-200 pb-2">
                  <span className="text-slate-600">正弦 sin(θ)</span>
                  <span className={`font-mono font-bold ${getQuadrantColor()}`}>{rawSin.toFixed(4)}</span>
                </div>
                <div className="flex justify-between border-b border-indigo-200 pb-2">
                  <span className="text-slate-600">余弦 cos(θ)</span>
                  <span className={`font-mono font-bold ${getQuadrantColor()}`}>{rawCos.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">正切 tan(θ)</span>
                  <span className="font-mono font-bold text-slate-700">
                    {Math.abs(rawCos) < 0.001 ? "∞" : (rawSin / rawCos).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800">
          <strong>核心类比：</strong> 摩天轮小车的高度对应 <span className="text-blue-600 font-bold">sin(θ)</span>，小车距离中心的水平距离对应 <span className="text-rose-600 font-bold">cos(θ)</span>。
        </div>
      </div>
    </div>
  );
};