/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RefreshCw, Layers } from 'lucide-react';
import { AppState } from '../types';

interface SimulationPanelProps {
  state: AppState;
  onStateChange: (updates: Partial<AppState>) => void;
  onPresetAction: (action: string) => void;
}

export default function SimulationPanel({ state, onStateChange, onPresetAction }: SimulationPanelProps) {
  const { currentReflection, targetReflection, isPlaying } = state;

  // We model the track center (middle of the black track) to be exactly at 50%.
  // The black track spans from 38% to 62% in the horizontal space (width 24%).
  // We map the values from [0, 100] to left offsets [44%, 80%] so that:
  // - At reflection = 0 (extreme black), the robot's center is at 44% (deep inside the black track).
  // - At reflection = 50 (target reflection), the robot's center is exactly at 62% (on the track right edge boundary).
  // - At reflection = 100 (extreme white), the robot's center is at 80% (deep on the right white floor).
  const robotLeftOffset = 44 + (currentReflection / 100) * 36;
  const targetLineOffset = 44 + (targetReflection / 100) * 36;

  const diff = currentReflection - targetReflection;
  const isOptimal = Math.abs(diff) <= 3;

  // Cosmetic state for robot jitter (vibration) matching isPlaying
  const [jitter, setJitter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isPlaying) {
      setJitter({ x: 0, y: 0 });
      return;
    }

    const interval = setInterval(() => {
      // Small randomized micro-movement simulating physical motor vibration
      const x = (Math.random() - 0.5) * 1.5;
      const y = (Math.random() - 0.5) * 1.5;
      setJitter({ x, y });
    }, 70);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col gap-4 p-5 bg-panel border border-brand-cyan/15 rounded-2xl shadow-xl h-full">
      
      {/* Simulation Terminal Header */}
      <div className="flex items-center justify-between gap-4 select-none">
        <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
          <Layers className="w-4.5 h-4.5 text-brand-cyan" />
          <span>시뮬레이션</span>
        </h3>

        <button
          onClick={() => onStateChange({ isPlaying: !isPlaying })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer transition-all duration-200 ${
            isPlaying
              ? 'bg-brand-danger/10 border-brand-danger/30 text-brand-danger hover:bg-brand-danger/15'
              : 'bg-brand-cyan-dim border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/20'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? '시뮬레이션 일시정지' : '시뮬레이션 시작'}</span>
        </button>
      </div>

      {/* Main Track Interactive Stage */}
      <div className="relative flex-1 min-h-[480px] bg-[#f0f4f8] rounded-xl border border-white/5 overflow-hidden shadow-inner flex items-center justify-center">
        
        {/* Straight Centered Black Track */}
        <div 
          className="absolute left-[38%] top-[-10%] h-[120%] bg-[#0f0f15] shadow-lg shadow-black/40"
          style={{
            width: '24%'
          }}
        />

        {/* Floor Label Backgrounds */}
        <div className="absolute left-[3%] sm:left-[8%] top-[12%] py-1 px-2 bg-white/75 text-slate-700 font-extrabold text-[9px] sm:text-xs rounded border border-black/10 select-none z-10 whitespace-nowrap">
          흰색 바닥 (Surface)
        </div>
        <div className="absolute left-[50%] -translate-x-1/2 top-[12%] py-1 px-2 bg-black/80 text-white font-extrabold text-[9px] sm:text-xs rounded border border-white/10 select-none z-10 whitespace-nowrap">
          검정선 (Track)
        </div>
        <div className="absolute right-[3%] sm:right-[8%] top-[12%] py-1 px-2 bg-white/75 text-slate-700 font-extrabold text-[9px] sm:text-xs rounded border border-black/10 select-none z-10 whitespace-nowrap">
          흰색 바닥 (Surface)
        </div>

        {/* Progress Vector Arrows (Constant Forward Flow) */}
        <div className="absolute left-[50%] -translate-x-1/2 top-[2%] flex flex-col items-center select-none z-10">
          <div className="text-[8px] sm:text-[10px] font-bold text-brand-blue bg-black/80 px-1.5 py-0.5 rounded border border-brand-blue/30 shadow-md whitespace-nowrap">
            진행 방향
          </div>
          <span className={`text-[28px] sm:text-[40px] font-black text-brand-blue drop-shadow-[0_2px_10px_rgba(105,198,255,0.7)] ${isPlaying ? 'animate-pulse' : ''} leading-none mt-0.5`}>
            ↑
          </span>
        </div>

        {/* Threshold target line on track border */}
        <motion.div 
          className="absolute top-0 bottom-0 w-0 border-l-[3px] border-dashed border-[#c8f04a]/75 drop-shadow-[0_0_4px_#c8f04a] z-10"
          animate={{ left: `${targetLineOffset}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        >
          {/* Target Boundary tag sitting straight on top of the green line like a map pin, pointing down */}
          <div className="absolute top-[18%] transform -translate-x-1/2 bg-slate-950/95 text-[#c8f04a] border border-[#c8f04a]/45 rounded-xl p-2 sm:p-2.5 text-[9px] sm:text-[11px] font-black leading-tight backdrop-blur shadow-xl shadow-black/45 select-none whitespace-nowrap z-25">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 pb-0.5 border-b border-[#c8f04a]/20 w-full justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8f04a] animate-pulse" />
                <span>목표 경계선</span>
              </div>
              <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold block mt-1">
                기준값 ({targetReflection}) 위치
              </span>
              
              {/* Minimal Speech bubble indicator triangle */}
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-950 absolute -bottom-[5px] left-1/2 -translate-x-1/2" />
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#c8f04a]/45 absolute -bottom-[6px] left-1/2 -translate-x-1/2 -z-10" />
            </div>
          </div>
        </motion.div>

        {/* Intelligent Robot Vehicle Model */}
        <motion.div 
          className="absolute bottom-[20%] w-0 h-[145px] z-20"
          animate={{
            left: `${robotLeftOffset}%`
          }}
          transition={{
            left: { type: 'spring', stiffness: 75, damping: 15 }
          }}
        >
          {/* Centered Robot Wrapper (Centers robot on left offset by half its width: -57.5px) */}
          <div 
            className="absolute top-0 w-[115px] h-[145px]"
            style={{
              left: '-57.5px',
              transform: `translate(${jitter.x}px, ${jitter.y}px)`
            }}
          >
            {/* Robot Shadow Chassis background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white to-[#dce4ec] rounded-2xl border-2 border-dashed border-black/20 shadow-2xl overflow-hidden flex flex-col justify-between p-2.5">
              
              {/* Wheels left & right */}
              <div className="absolute top-6 left-[-11px] w-[11px] h-[58px] bg-[#1d1e22] rounded-l-md border-l border-y border-black/30" />
              <div className="absolute top-6 right-[-11px] w-[11px] h-[58px] bg-[#1d1e22] rounded-r-md border-r border-y border-black/30" />

              {/* Smart Microcontroller Board Unit */}
              <div className="w-full h-[52px] bg-[#222e3d] rounded-xl relative flex flex-col items-center justify-center border-b-2 border-black/30 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan/25 animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-brand-cyan" />
                <span className="text-[10px] text-brand-cyan font-black block mt-1 select-none">현재 센서 위치</span>
              </div>

              {/* Downward light sensor emitter */}
              <div className="absolute top-[85px] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                {/* Emitter optic lens */}
                <motion.div 
                  className="w-5.5 h-5.5 rounded-full bg-brand-cyan shadow-lg border-2 border-white relative flex items-center justify-center text-text-main"
                  animate={{
                    boxShadow: `0 0 10px 4px rgba(77, 216, 255, 0.4), 0 0 16px 8px rgba(77, 216, 255, ${0.2 + (currentReflection / 100) * 0.4})`
                  }}
                  transition={{ type: 'spring', stiffness: 70, damping: 14 }}
                >
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </motion.div>
                <div className="text-[8px] font-black text-bg-primary/95 bg-white/90 border border-black/10 px-1 py-0.2 rounded mt-1 shadow-sm font-semibold select-none">
                  {currentReflection}
                </div>
              </div>
            </div>
          </div>

          {/* Compact Correction Direction box positioned dynamically on the left or right side of the robot chassis so it never clips or overflows the screen */}
          {(() => {
            // robotLeftOffset is between 44% and 80%. If it's on the right half (> 54%), place the box on the left of the robot. Otherwise, on the right.
            const isBoxOnRight = robotLeftOffset <= 54;
            const boxSideClass = isBoxOnRight ? 'left-[59px]' : 'right-[59px]';
            return (
              <div className={`absolute ${boxSideClass} top-[14px] select-none z-30 transition-all duration-300`}>
                {isOptimal ? (
                  <div className="flex flex-col items-center justify-center bg-[#070f1a]/95 border border-brand-blue/30 rounded-xl p-1.5 shadow-2xl shadow-black/60 backdrop-blur-sm w-[94px]">
                    <div className="text-[9px] font-black text-brand-blue flex items-center gap-1 leading-none">
                      <span className="w-1 h-1 rounded-full bg-brand-blue animate-ping" />
                      <span>보정: 유지</span>
                    </div>
                    <span className="text-lg font-black text-brand-blue leading-none mt-1 animate-pulse">↑</span>
                    <span className="text-[7.5px] text-slate-400 font-extrabold mt-0.5 leading-none">직진 유지</span>
                  </div>
                ) : diff < 0 ? (
                  <div className="flex flex-col items-center justify-center bg-[#070f1a]/95 border border-brand-lime/30 rounded-xl p-1.5 shadow-2xl shadow-black/60 backdrop-blur-sm w-[94px]">
                    <div className="text-[9px] font-black text-[#c8f04a] flex items-center gap-1 leading-none">
                      <span className="w-1 h-1 rounded-full bg-[#c8f04a] animate-pulse" />
                      <span>보정: 우회전</span>
                    </div>
                    <span className="text-xl font-black text-[#c8f04a] leading-none mt-0.5">→</span>
                    <span className="text-[7.5px] text-slate-400 font-extrabold mt-0.5 leading-none">흰색 쪽으로 보정</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-[#070f1a]/95 border border-brand-cyan/40 rounded-xl p-1.5 shadow-2xl shadow-black/60 backdrop-blur-sm w-[94px]">
                    <div className="text-[9px] font-black text-brand-cyan flex items-center gap-1 leading-none">
                      <span className="w-1 h-1 rounded-full bg-brand-cyan animate-pulse" />
                      <span>보정: 좌회전</span>
                    </div>
                    <span className="text-xl font-black text-brand-cyan leading-none mt-0.5">←</span>
                    <span className="text-[7.5px] text-slate-400 font-extrabold mt-0.5 leading-none">검정색 쪽으로 보정</span>
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>

      </div>

    </div>
  );
}
