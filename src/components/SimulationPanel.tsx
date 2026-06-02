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

  // Determine state logic matching ControlPanel
  let stateTitle = '경계선 근처';
  let stateDesc = '센서가 로봇이 추적하고자 하는 최적의 경계선(기준값)에 인접해 있습니다.';
  
  if (diff < -3) {
    stateTitle = '검정 쪽 치우침';
    stateDesc = '센서가 선 안쪽 어두운 검정색 영역에 너무 많이 밀려들어 갔습니다.';
  } else if (diff > 3) {
    stateTitle = '흰색 쪽 치우침';
    stateDesc = '센서가 경계선을 벗어나 바깥쪽 밝은 흰색 바닥 영역으로 빠져나갔습니다.';
  }

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

        {/* Steering Correction Guidance Arrow */}
        <div className="absolute right-[4%] sm:right-[12%] top-[24%] sm:top-[20%] flex flex-col items-center select-none z-10 transition-all duration-300">
          <div className="text-[8px] sm:text-[10px] font-bold text-[#c8f04a] bg-black/80 px-2 py-0.5 rounded border border-brand-lime/30 shadow-md whitespace-nowrap">
            보정 방향
          </div>
          
          {isOptimal ? (
            <div className="flex flex-col items-center mt-1.5">
              <span className="text-[20px] sm:text-[28px] font-black text-brand-blue drop-shadow-md leading-none animate-pulse">
                ↑
              </span>
              <span className="text-[8px] sm:text-[10px] font-extrabold text-brand-blue bg-black/85 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">
                유지 / 직진
              </span>
            </div>
          ) : diff < 0 ? (
            <div className="flex flex-col items-center mt-1">
              <span className="text-[32px] sm:text-[44px] font-black text-[#c8f04a] drop-shadow-[0_2px_8px_rgba(200,240,74,0.6)] leading-none">
                →
              </span>
              <span className="text-[8px] sm:text-[10px] font-extrabold text-[#c8f04a] bg-black/85 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">
                흰색 쪽으로 보정
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center mt-1">
              <span className="text-[32px] sm:text-[44px] font-black text-brand-cyan drop-shadow-[0_2px_8px_rgba(77,216,255,0.6)] leading-none">
                ←
              </span>
              <span className="text-[8px] sm:text-[10px] font-extrabold text-brand-cyan bg-black/85 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">
                검정색 쪽으로 보정
              </span>
            </div>
          )}
        </div>

        {/* Threshold target line on track border */}
        <motion.div 
          className="absolute top-0 bottom-0 w-0 border-l-[3px] border-dashed border-[#c8f04a]/75 drop-shadow-[0_0_4px_#c8f04a] z-10"
          animate={{ left: `${targetLineOffset}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        >
          {/* Target Boundary tag */}
          <div className="absolute top-[35%] transform translate-x-1 sm:translate-x-3 bg-brand-lime-dim/95 text-[#6c8612] border border-brand-lime/45 rounded-lg p-1.5 sm:p-2 text-[8px] sm:text-[10px] font-black leading-tight backdrop-blur shadow-md shadow-black/10 select-none whitespace-nowrap">
            <span className="text-bg-primary font-bold block mb-0.5 border-b border-[#6c8612]/30 pb-0.5 text-center">목표 경계선</span>
            기준값 ({targetReflection}) 위치
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
        </motion.div>

      </div>

      {/* 별도로 분리 표시되는 실시간 상태 및 반사값 범례 통합 보드 */}
      <div className="bg-[#0b172a] border border-[#1e293b] rounded-xl p-4 flex flex-col gap-3.5 select-none text-xs">
        {/* Top Header Row with Title */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="font-extrabold text-slate-300 text-[12px] flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-brand-cyan rounded-full" />
            현재 판단 상태 및 반사값 범례
          </span>
        </div>

        {/* 4 Metrics columns from the attached image */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* 1. 반사값 */}
          <div className="bg-[#070f1a] border border-[#1e293b] rounded-lg p-2.5 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-bold mb-0.5">반사값</span>
            <span className="text-base sm:text-lg font-black text-brand-cyan">{currentReflection}</span>
          </div>

          {/* 2. 기준값 */}
          <div className="bg-[#070f1a] border border-[#1e293b] rounded-lg p-2.5 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-bold mb-0.5">기준값</span>
            <span className="text-base sm:text-lg font-black text-brand-lime">{targetReflection}</span>
          </div>

          {/* 3. 차이 */}
          <div className="bg-[#070f1a] border border-[#1e293b] rounded-lg p-2.5 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-bold mb-0.5">차이</span>
            <span className={`text-base sm:text-lg font-black ${diff === 0 ? 'text-slate-300' : diff < 0 ? 'text-brand-cyan' : 'text-brand-warning'}`}>
              {diff > 0 ? `+${diff}` : diff}
            </span>
          </div>

          {/* 4. 방향 */}
          <div className="bg-[#070f1a] border border-[#1e293b] rounded-lg p-2.5 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-bold mb-0.5">방향</span>
            <span className={`text-xs sm:text-sm font-black ${isOptimal ? 'text-brand-warning' : diff < 0 ? 'text-brand-cyan' : 'text-[#c8f04a]'}`}>
              {isOptimal ? '경계선 유지' : diff < 0 ? '검정 쪽' : '흰색 쪽'}
            </span>
          </div>
        </div>

        {/* Dynamic status helper text banner as requested from image info */}
        <div className="bg-[#070f1a]/85 border border-brand-cyan/10 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${isOptimal ? 'bg-brand-warning animate-pulse' : diff < 0 ? 'bg-brand-cyan animate-pulse' : 'bg-[#c8f04a] animate-pulse'}`} />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[12px] font-black ${isOptimal ? 'text-brand-warning' : diff < 0 ? 'text-brand-cyan' : 'text-[#c8f04a]'}`}>
                  {stateTitle}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] leading-relaxed font-semibold text-slate-300 mt-0.5">
                {stateDesc}
              </p>
            </div>
          </div>
        </div>

        {/* 6 Preset change keys in bottom card as requested in image reference */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onPresetAction('inside-black')}
            className="py-2 px-1.5 text-center text-xs font-bold text-slate-200 hover:text-brand-cyan bg-[#070f1a]/60 border border-[#1e293b] hover:border-brand-cyan/45 hover:bg-brand-cyan/5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[48px]"
          >
            <span className="font-extrabold text-[11px] sm:text-[12px]">검정선 안쪽</span>
            <span className="text-[8.5px] text-slate-500 font-normal mt-0.5">현재 = 기준 - 10</span>
          </button>

          <button
            onClick={() => onPresetAction('near-boundary')}
            className="py-2 px-1.5 text-center text-xs font-bold text-slate-200 hover:text-brand-lime bg-[#070f1a]/60 border border-[#1e293b] hover:border-brand-lime/45 hover:bg-brand-lime/5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[48px]"
          >
            <span className="font-extrabold text-[11px] sm:text-[12px]">경계선 근처</span>
            <span className="text-[8.5px] text-slate-500 font-normal mt-0.5">현재 = 기준값</span>
          </button>

          <button
            onClick={() => onPresetAction('white-side')}
            className="py-2 px-1.5 text-center text-xs font-bold text-slate-200 hover:text-brand-blue bg-[#070f1a]/60 border border-[#1e293b] hover:border-brand-blue/45 hover:bg-brand-blue/5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[48px]"
          >
            <span className="font-extrabold text-[11px] sm:text-[12px]">흰색 쪽</span>
            <span className="text-[8.5px] text-slate-500 font-normal mt-0.5">현재 = 기준 + 10</span>
          </button>

          <button
            onClick={() => onPresetAction('lower-target')}
            className="py-2 px-1 text-center text-xs font-bold text-slate-200 hover:text-brand-lime bg-[#070f1a]/60 border border-[#1e293b] hover:border-brand-lime/40 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[48px]"
          >
            <span className="font-extrabold text-[11px] sm:text-[12px]">기준값 낮추기</span>
            <span className="text-[9px] text-[#c8f04a] font-extrabold mt-0.5">-5</span>
          </button>

          <button
            onClick={() => onPresetAction('raise-target')}
            className="py-2 px-1 text-center text-xs font-bold text-slate-200 hover:text-brand-lime bg-[#070f1a]/60 border border-[#1e293b] hover:border-brand-lime/40 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[48px]"
          >
            <span className="font-extrabold text-[11px] sm:text-[12px]">기준값 높이기</span>
            <span className="text-[9px] text-[#c8f04a] font-extrabold mt-0.5">+5</span>
          </button>

          <button
            onClick={() => onPresetAction('reset')}
            className="py-2 px-1 text-center text-xs font-bold text-[#f87171] bg-red-950/20 hover:bg-red-950/35 border border-red-900/40 hover:border-red-500/50 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[48px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="font-extrabold text-[11px] sm:text-[12px]">초기화</span>
          </button>
        </div>

        {/* Legend bar strip at the bottom */}
        <div className="border-t border-[#1e293b]/50 pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 select-none">
            <span className="font-bold text-slate-400 text-[10px]">반사값 범례</span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 sm:max-w-md">
            <span className="text-[10px] text-slate-400 font-extrabold whitespace-nowrap">0 ≈ 검정 (완전 흡수)</span>
            <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-black via-slate-600 to-white border border-white/5 shadow-inner" />
            <span className="text-[10px] text-slate-400 font-extrabold whitespace-nowrap">100 ≈ 흰색 (완전 반사)</span>
          </div>
        </div>
      </div>

    </div>
  );
}
