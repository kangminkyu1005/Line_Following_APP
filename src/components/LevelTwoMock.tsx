/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Settings, Play, Sliders, Info, HelpCircle } from 'lucide-react';

export default function LevelTwoMock() {
  const [kp, setKp] = useState(1.5);
  const [kd, setKd] = useState(0.8);
  const [speed, setSpeed] = useState(40);

  // Compute mock correction
  const error = 15; // Assume static mock error
  const pTerm = error * kp;
  const dTerm = -5 * kd; // Change speed mock derivative
  const totalCorrection = Math.round(pTerm + dTerm);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in text-sm select-none">
      
      {/* Control Panel (Mock Options) */}
      <div className="lg:col-span-6 p-5 bg-panel border border-brand-cyan/15 rounded-2xl shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-cyan" />
            <span>2단계 PD 제어 조작 패널</span>
          </h3>
          <span className="text-[10px] uppercase font-bold text-brand-lime bg-brand-lime-dim/10 px-2 py-0.5 rounded border border-brand-lime/30 shadow">
            PREVIEW ONLY
          </span>
        </div>

        <p className="text-xs text-text-muted leading-relaxed font-semibold">
          2단계에서는 1단계에서 구한 반사값 오차에 따라 모터를 부드럽게 감속/가속 조율하는 <strong>PD(비례 미분) 제어 알고리즘</strong>을 탐구합니다. (슬라이더 조작 가능)
        </p>

        {/* Kp Slider */}
        <div className="space-y-1 bg-panel-light/60 p-3.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-text-main">
            <span className="flex items-center gap-1.5 text-brand-cyan">비례 상수 (Kp)</span>
            <span className="text-sm font-black text-brand-cyan">{kp.toFixed(1)}</span>
          </div>
          <p className="text-[10px] text-text-muted">오차의 크기에 정비례하여 보정력을 행사하는 중심 상수입니다.</p>
          <input
            type="range"
            min="0.1"
            max="5.0"
            step="0.1"
            value={kp}
            onChange={(e) => setKp(Number(e.target.value))}
            className="w-full h-1.5 rounded bg-line-dark cursor-pointer accent-brand-cyan"
          />
        </div>

        {/* Kd Slider */}
        <div className="space-y-1 bg-panel-light/60 p-3.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-text-main">
            <span className="flex items-center gap-1.5 text-brand-lime">미분 상수 (Kd)</span>
            <span className="text-sm font-black text-brand-lime">{kd.toFixed(1)}</span>
          </div>
          <p className="text-[10px] text-text-muted">오차가 급격하게 변할 때 브레이크를 걸어주어 흔들림(오버슈트)을 잡아줍니다.</p>
          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.1"
            value={kd}
            onChange={(e) => setKd(Number(e.target.value))}
            className="w-full h-1.5 rounded bg-line-dark cursor-pointer accent-brand-lime"
          />
        </div>

        {/* Speed Slider */}
        <div className="space-y-1 bg-panel-light/60 p-3.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-text-main">
            <span>로봇 기본 속도</span>
            <span className="text-sm font-black text-white">{speed}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-1.5 rounded bg-line-dark cursor-pointer accent-white"
          />
        </div>

        {/* Diagnostic Calculations */}
        <div className="p-4 bg-black/25 rounded-xl border border-white/5 space-y-2">
          <span className="text-xs font-bold text-text-muted">실시간 PD 제어 모터 보정값 계산식</span>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <div className="p-2 bg-panel-light rounded border border-white/5">
              <span className="text-text-muted block text-[10px]">비례항 (Error * Kp)</span>
              <span className="text-brand-cyan text-sm">{error} * {kp.toFixed(1)} = <strong className="font-black">{(error * kp).toFixed(1)}</strong></span>
            </div>
            <div className="p-2 bg-panel-light rounded border border-white/5">
              <span className="text-text-muted block text-[10px]">미분항 (ΔError * Kd)</span>
              <span className="text-brand-lime text-sm">-5 * {kd.toFixed(1)} = <strong className="font-black">{(-5 * kd).toFixed(1)}</strong></span>
            </div>
          </div>
          <div className="text-center p-3.5 bg-brand-cyan-dim/10 rounded-xl border border-brand-cyan/20 text-brand-cyan">
            <span className="text-[10px] text-text-muted block font-bold">최종 조향 보정량 (P + D)</span>
            <span className="text-xl font-bold">{totalCorrection} (오른쪽 바퀴 {speed - totalCorrection}% / 왼쪽 바퀴 {speed + totalCorrection}%)</span>
          </div>
        </div>
      </div>

      {/* Simulator Frame Panel (Level 2 Mock representation) */}
      <div className="lg:col-span-6 p-5 bg-panel border border-brand-lime/15 rounded-2xl shadow-xl flex flex-col justify-between h-full">
        <div>
          <h3 className="font-black text-brand-lime text-base sm:text-lg flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
            <Settings className="w-5 h-5 text-brand-lime animate-spin-slow" />
            <span>2단계 PD 제어 시뮬레이터 (미리보기)</span>
          </h3>

          <div className="relative min-h-[300px] bg-[#f0f4f8] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center p-4">
            
            {/* Curvy oscillating track simulating PD correction limits */}
            <svg className="absolute inset-0 w-full h-full text-[#111]" viewBox="0 0 400 300" fill="none">
              <path d="M 180 0 Q 340 100 200 200 T 220 300" stroke="currentColor" strokeWidth="60" strokeLinecap="round" />
              <path d="M 180 0 Q 340 100 200 200 T 220 300" stroke="#ffd166" strokeWidth="4" strokeDasharray="6,8" strokeLinecap="round" />
            </svg>

            {/* Static overlay warning for mock */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-12 h-12 rounded-full bg-brand-lime/25 border border-brand-lime/45 flex items-center justify-center text-brand-lime mb-3 animate-pulse">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="font-black text-base text-text-main">2단계 가상 모드로 시뮬레이터 활성화됨</h4>
              <p className="text-xs text-text-muted max-w-sm mt-1 leading-relaxed font-semibold">
                위의 Kp 및 Kd 슬라이더를 통해 오버슈팅 방지와 비례 조향 감도를 사전에 조절해 볼 수 있습니다. 실제 2단계 로봇 조향 인터랙션은 추후 업그레이드됩니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 p-4 bg-panel-light/60 rounded-xl border border-white/5 text-xs leading-relaxed text-text-muted font-medium">
          💡 <span className="text-brand-cyan font-bold">라인 팔로잉 제어 핵심:</span> 단순히 켜고 끄는 제어(온/오프 제어)는 좌우로 격하게 흔들립니다. PD 제어를 사용하면 선의 곡률에 가깝게 부드럽고 우아한 곡선 주행이 가능하게 해줍니다.
        </div>
      </div>

    </div>
  );
}
