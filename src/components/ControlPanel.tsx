/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState } from '../types';
import { Calculator, Info, AlertCircle } from 'lucide-react';

interface ControlPanelProps {
  state: AppState;
  onStateChange: (updates: Partial<AppState>) => void;
}

export default function ControlPanel({ state, onStateChange }: ControlPanelProps) {
  const { currentReflection, targetReflection, blackReflection, whiteReflection } = state;

  const diff = currentReflection - targetReflection;
  
  // Determine state logic
  let stateTitle = '경계선 근처';
  let stateShort = '경계선';
  let stateColorClass = 'text-brand-warning border-brand-warning/30 bg-brand-warning/5';
  let stateDesc = '센서가 로봇이 추적하고자 하는 최적의 경계선(기준값)에 인접해 있습니다.';
  
  if (diff < -3) {
    stateTitle = '검정 쪽 치우침';
    stateShort = '검정 쪽';
    stateColorClass = 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/5';
    stateDesc = '센서가 선 안쪽 어두운 검정색 영역에 너무 많이 밀려들어 갔습니다.';
  } else if (diff > 3) {
    stateTitle = '흰색 쪽 치우침';
    stateShort = '흰색 쪽';
    stateColorClass = 'text-[#c8f04a] border-[#c8f04a]/30 bg-[#c8f04a]/5';
    stateDesc = '센서가 경계선을 벗어나 바깥쪽 밝은 흰색 바닥 영역으로 빠져나갔습니다.';
  }

  // Calculate actual mid value for formula block
  const calculatedMid = Math.round((blackReflection + whiteReflection) / 2);

  return (
    <div className="flex flex-col gap-5 p-5 bg-panel border border-brand-cyan/15 rounded-2xl shadow-xl">
      
      {/* 1. Current Reflection Intensity Slider */}
      <div className="p-4 bg-panel-light/60 border border-white/[0.04] rounded-xl hover:border-brand-cyan/20 transition-all duration-300">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-text-main">
            <span>현재 반사값</span>
            <span className="group relative cursor-pointer" title="센서가 현재 바닥에서 읽어 들인 빛 반사 강도입니다.">
              <Info className="w-3.5 h-3.5 text-text-muted" />
            </span>
          </div>

          <div className="px-3.5 py-1.5 text-center border border-brand-cyan/20 bg-brand-cyan-dim rounded-xl text-brand-cyan font-black text-xl min-w-[75px]">
            {currentReflection}
            <span className="text-[10px] text-text-muted font-semibold block mt-0.5">/100</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-text-muted mb-1.5 font-medium">
              <span>0 (검정선 내부)</span>
              <span>100 (흰색 바닥)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentReflection}
              onChange={(e) => onStateChange({ currentReflection: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-line-dark cursor-pointer text-brand-cyan accent-brand-cyan hover:accent-brand-cyan/80"
              style={{
                background: `linear-gradient(to right, #4dd8ff ${currentReflection}%, #18304f ${currentReflection}%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Target (Threshold) Slider */}
      <div className="p-4 bg-panel-light/60 border border-white/[0.04] rounded-xl hover:border-brand-lime/20 transition-all duration-300">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-text-main">
            <span>기준값 (Threshold)</span>
            <span className="group relative cursor-pointer" title="검정선과 흰색바닥 경계선을 추적하기 위한 가상의 목표 반사값입니다.">
              <Info className="w-3.5 h-3.5 text-text-muted" />
            </span>
          </div>

          <div className="px-3.5 py-1.5 text-center border border-brand-lime/20 bg-brand-lime-dim rounded-xl text-brand-lime font-black text-xl min-w-[75px]">
            {targetReflection}
            <span className="text-[10px] text-text-muted font-semibold block mt-0.5">/100</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-text-muted mb-1.5 font-medium">
              <span>0 (극단적 검정)</span>
              <span>100 (극단적 흰색)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={targetReflection}
              onChange={(e) => onStateChange({ targetReflection: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-line-dark cursor-pointer text-brand-lime accent-brand-lime hover:accent-brand-lime/80"
              style={{
                background: `linear-gradient(to right, #c8f04a ${targetReflection}%, #18304f ${targetReflection}%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Base Calibration Inputs & Calculation formulas block */}
      <div className="p-4 bg-panel-light/40 border border-white/5 rounded-xl space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-muted">검정색 대표 반사값</label>
            <input
              type="number"
              min="0"
              max="100"
              value={blackReflection}
              onChange={(e) => onStateChange({ blackReflection: Math.max(0, Math.min(100, Number(e.target.value))) })}
              className="w-full px-3 py-2 text-sm bg-bg-primary text-text-main border border-white/10 rounded-xl focus:border-brand-cyan/50 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-muted">흰색 대표 반사값</label>
            <input
              type="number"
              min="0"
              max="100"
              value={whiteReflection}
              onChange={(e) => onStateChange({ whiteReflection: Math.max(0, Math.min(100, Number(e.target.value))) })}
              className="w-full px-3 py-2 text-sm bg-bg-primary text-text-main border border-white/10 rounded-xl focus:border-brand-cyan/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2 border-t border-white/5">
          <button
            onClick={() => {
              const mid = Math.round((blackReflection + whiteReflection) / 2);
              const clampedMid = Math.max(0, Math.min(100, mid));
              onStateChange({ targetReflection: clampedMid });
            }}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-brand-cyan hover:bg-brand-cyan/85 active:scale-98 text-bg-primary font-bold text-sm rounded-xl cursor-pointer transition-all duration-200 shadow-md shadow-brand-cyan/10"
          >
            <Calculator className="w-4 h-4" />
            <span>중간값 계산</span>
          </button>

          <div className="text-[11px] text-text-muted leading-relaxed font-semibold bg-black/15 p-2.5 rounded-lg border border-white/5">
            <span className="text-brand-lime font-bold">기준값 = (검정 + 흰색) / 2</span>
            <div className="mt-1 font-mono text-[10px] text-white bg-black/25 px-1.5 py-0.5 rounded inline-block">
              ({blackReflection} + {whiteReflection}) / 2 = {calculatedMid}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
