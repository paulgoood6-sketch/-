import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Settings, RefreshCw } from 'lucide-react';
import { PlotParams } from '../types';

export const FunctionPlotter: React.FC = () => {
  const defaultParams: PlotParams = {
    A: 1,
    omega: 1,
    phi: 0,
    k: 0
  };

  const [params, setParams] = useState<PlotParams>(defaultParams);

  // Generate data points for the chart
  const data = useMemo(() => {
    const points = [];
    const start = -2 * Math.PI;
    const end = 2 * Math.PI;
    const step = (end - start) / 200; // Resolution

    for (let x = start; x <= end; x += step) {
      // y = A * sin(ωx + φ) + k
      // Note: phi in UI is a coefficient of PI, so we multiply by Math.PI
      const y = params.A * Math.sin(params.omega * x + params.phi * Math.PI) + params.k;
      
      // Also generate standard sin(x) for comparison
      const standard = Math.sin(x);
      
      points.push({
        xVal: x,
        y: parseFloat(y.toFixed(3)),
        standard: parseFloat(standard.toFixed(3))
      });
    }
    return points;
  }, [params]);

  // Custom Tick Formatter for X Axis (converting number to π format)
  const formatXAxis = (tick: number) => {
    const piVal = tick / Math.PI;
    if (Math.abs(piVal) < 0.01) return '0';
    if (Math.abs(piVal - 1) < 0.01) return 'π';
    if (Math.abs(piVal + 1) < 0.01) return '-π';
    if (Math.abs(piVal - 2) < 0.01) return '2π';
    if (Math.abs(piVal + 2) < 0.01) return '-2π';
    if (Math.abs(piVal - 0.5) < 0.01) return 'π/2';
    if (Math.abs(piVal + 0.5) < 0.01) return '-π/2';
    return `${piVal.toFixed(1)}π`;
  };

  const handleReset = () => setParams(defaultParams);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            函数变换演示器
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-mono bg-slate-100 inline-block px-2 py-1 rounded">
            y = <span className="text-indigo-600 font-bold">{params.A}</span>sin(
            <span className="text-emerald-600 font-bold">{params.omega}</span>x +{' '}
            <span className="text-orange-600 font-bold">{params.phi}π</span>) +{' '}
            <span className="text-rose-600 font-bold">{params.k}</span>
          </p>
        </div>
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          重置参数
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Chart Area */}
        <div className="flex-1 p-4 min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="xVal" 
                tickFormatter={formatXAxis} 
                type="number" 
                domain={[-2 * Math.PI, 2 * Math.PI]} 
                ticks={[-2*Math.PI, -1.5*Math.PI, -Math.PI, -0.5*Math.PI, 0, 0.5*Math.PI, Math.PI, 1.5*Math.PI, 2*Math.PI]}
                stroke="#64748b"
              />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" />
              <Tooltip 
                labelFormatter={(v) => `x: ${formatXAxis(v as number)}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <ReferenceLine x={0} stroke="#94a3b8" />
              
              {/* Standard sin(x) for reference */}
              <Line 
                type="monotone" 
                dataKey="standard" 
                stroke="#cbd5e1" 
                strokeWidth={2} 
                dot={false} 
                strokeDasharray="5 5"
                name="y = sin(x)"
              />
              
              {/* Transformed Function */}
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={false} 
                animationDuration={300}
                name="Transformed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Controls Area */}
        <div className="w-full lg:w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto">
          <h3 className="font-semibold text-slate-700 mb-6">参数调整 (Parameter Control)</h3>
          
          <div className="space-y-8">
            {/* Amplitude (A) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-600">振幅 (A)</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">A =</span>
                  <input
                    type="number"
                    value={params.A}
                    onChange={(e) => setParams({ ...params, A: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-1 py-0.5 text-xs font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    step="0.1"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={params.A}
                onChange={(e) => setParams({ ...params, A: parseFloat(e.target.value) })}
                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-xs text-slate-400">改变波峰与波谷的高度，图像纵向伸缩。</p>
            </div>

            {/* Frequency (omega) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-600">角频率 (ω)</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">ω =</span>
                  <input
                    type="number"
                    value={params.omega}
                    onChange={(e) => setParams({ ...params, omega: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-1 py-0.5 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    step="0.1"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={params.omega}
                onChange={(e) => setParams({ ...params, omega: parseFloat(e.target.value) })}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-xs text-slate-400">改变周期的长短，图像横向伸缩。</p>
            </div>

            {/* Phase Shift (phi) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-600">初相 (φ)</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">φ =</span>
                  <input
                    type="number"
                    value={params.phi}
                    onChange={(e) => setParams({ ...params, phi: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-1 py-0.5 text-xs font-mono text-orange-700 bg-orange-50 border border-orange-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-orange-500"
                    step="0.125"
                  />
                  <span className="text-xs text-orange-700 font-mono">π</span>
                </div>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.125" // 1/8 steps
                value={params.phi}
                onChange={(e) => setParams({ ...params, phi: parseFloat(e.target.value) })}
                className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-xs text-slate-400 px-1">
                <span>-2π</span>
                <span>0</span>
                <span>2π</span>
              </div>
              <p className="text-xs text-slate-400">决定初始位置，图像左右平移。</p>
            </div>

            {/* Vertical Shift (k) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-600">偏置 (k)</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">k =</span>
                  <input
                    type="number"
                    value={params.k}
                    onChange={(e) => setParams({ ...params, k: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-1 py-0.5 text-xs font-mono text-rose-700 bg-rose-50 border border-rose-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-rose-500"
                    step="0.5"
                  />
                </div>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={params.k}
                onChange={(e) => setParams({ ...params, k: parseFloat(e.target.value) })}
                className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <p className="text-xs text-slate-400">改变平衡位置，图像上下平移。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};