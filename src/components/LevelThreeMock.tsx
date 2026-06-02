/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldAlert, Play, CheckCircle2, RotateCcw, Award } from 'lucide-react';

export default function LevelThreeMock() {
  const [noiseLevel, setNoiseLevel] = useState(15);
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [missionStatus, setMissionStatus] = useState<'idle' | 'running' | 'success'>('idle');

  const startMission = () => {
    setMissionStatus('running');
    setTimeout(() => {
      setMissionStatus('success');
    }, 2000);
  };

  const resetMission = () => {
    setMissionStatus('idle');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in text-sm select-none">
      
      {/* Level 3 Configuration Controller */}
      <div className="lg:col-span-6 p-5 bg-panel border border-brand-cyan/15 rounded-2xl shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-cyan" />
            <span>3단계 문제 해결 미션 패널</span>
          </h3>
          <span className="text-[10px] uppercase font-bold text-brand-lime bg-brand-lime-dim/10 px-2 py-0.5 rounded border border-brand-lime/30 shadow">
            MISSION MODULE
          </span>
        </div>

        <p className="text-xs text-text-muted leading-relaxed font-semibold">
          3단계는 교차로 판단 실패, 지면 반사로 인한 <strong>센서 노이즈</strong>, 선 이탈 시 보정 방향을 잃어버리는 예외 상황을 감지하고 스스로 극복하는 실전 마이크로 알고리즘을 체험합니다. (직접 작동 가능)
        </p>

        {/* Noise Configuration Slider */}
        <div className="space-y-1.5 bg-panel-light/60 p-3.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-text-main">
            <span>환경 노이즈 강도 (지면 난반사)</span>
            <span className="text-sm font-black text-brand-cyan">{noiseLevel}%</span>
          </div>
          <p className="text-[10px] text-text-muted">노이즈가 크면 로봇 센서값이 요동쳐 엉뚱한 정진 진행을 일으킵니다.</p>
          <input
            type="range"
            min="5"
            max="45"
            step="5"
            value={noiseLevel}
            onChange={(e) => setNoiseLevel(Number(e.target.value))}
            className="w-full h-1.5 rounded bg-line-dark cursor-pointer accent-brand-cyan"
          />
        </div>

        {/* Filter Toggle Switch */}
        <div className="flex items-center justify-between p-3.5 bg-panel-light/60 border border-white/5 rounded-xl">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-text-main block">이동 평균 필터 (Moving Average Filter)</span>
            <p className="text-[10px] text-text-muted">급격하게 변하는 일시적 노이즈를 부드럽게 무력화합니다.</p>
          </div>

          <button
            onClick={() => setFilterEnabled(!filterEnabled)}
            className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
              filterEnabled ? 'bg-brand-lime' : 'bg-line-dark'
            }`}
          >
            <span className={`w-4 h-4 bg-bg-secondary rounded-full absolute top-1 transition-all ${
              filterEnabled ? 'left-7' : 'left-1'
            }`} />
          </button>
        </div>

        {/* Action button triggers mockup run */}
        <div className="pt-2 flex gap-3">
          {missionStatus === 'idle' && (
            <button
              onClick={startMission}
              className="flex-1 py-3 bg-brand-cyan hover:bg-brand-cyan/85 active:scale-98 text-bg-primary font-black rounded-xl text-center cursor-pointer transition-all shadow-md shadow-brand-cyan/10"
            >
              미션 테스트 주행 시작
            </button>
          )}

          {missionStatus === 'running' && (
            <div className="flex-1 py-3 bg-brand-warning/10 border border-brand-warning/20 text-brand-warning font-black rounded-xl text-center">
              주행 중... 장애물 및 노이즈 필터링 검출 시도
            </div>
          )}

          {missionStatus === 'success' && (
            <div className="flex-1 flex gap-2">
              <div className="flex-1 py-3 bg-brand-lime-dim/20 border border-brand-lime/20 text-brand-lime font-black rounded-xl text-center flex items-center justify-center gap-1.5 animate-bounce-subtle">
                <Award className="w-4.5 h-4.5" />
                <span>미션 클리어 대성공!</span>
              </div>
              <button
                onClick={resetMission}
                className="p-3 bg-panel-light/60 hover:bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                title="다시 하기"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid Layout map mockup */}
      <div className="lg:col-span-6 p-5 bg-panel border border-brand-lime/15 rounded-2xl shadow-xl flex flex-col justify-between h-full">
        <div>
          <h3 className="font-black text-brand-lime text-base sm:text-lg flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
            <Award className="w-5 h-5 text-brand-lime" />
            <span>3단계 코스 미션 맵 모형</span>
          </h3>

          <div className="relative min-h-[300px] bg-[#0c1424] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center p-4">
            
            {/* Grid gridlines to feel tech-look */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Path visualization */}
            <svg className="absolute inset-0 w-full h-full text-brand-cyan/10" viewBox="0 0 400 300" fill="none">
              {/* Intersection map sketch */}
              <path d="M 50 150 L 350 150" stroke="currentColor" strokeWidth="24" strokeLinecap="round" />
              <path d="M 200 50 L 200 250" stroke="currentColor" strokeWidth="24" strokeLinecap="round" />
              
              {/* Active path flow line animation */}
              <path d="M 50 150 L 350 150" stroke={filterEnabled ? '#c8f04a' : '#ff6b6b'} strokeWidth="2" strokeDasharray="5,6" />
              <path d="M 200 50 L 200 250" stroke="#4dd8ff" strokeWidth="1" strokeDasharray="3,3" />
            </svg>

            {/* Simulated target robot animation */}
            <div className={`absolute w-8 h-8 rounded-lg bg-white border border-brand-lime shadow-xl shadow-brand-lime/20 flex items-center justify-center transition-all duration-2000 ${
              missionStatus === 'idle' ? 'left-6 top-[134px]' :
              missionStatus === 'running' ? 'left-[184px] top-[134px]' :
              'left-[314px] top-[134px] scale-110 border-brand-lime'
            }`}>
              <div className="w-2.5 h-2.5 bg-brand-cyan rounded-full animate-ping" />
            </div>

            {/* Informational HUD overlay */}
            <div className="absolute top-3 left-3 bg-black/60 px-2 py-1.5 rounded-lg border border-white/5 text-[9px] font-mono text-brand-cyan">
              GPS_LAT: 37.56 // GPS_LNG: 126.97<br />
              FILTER_RELIANCE: {filterEnabled ? 'EXCELLENT' : 'CRITICAL_NO_FILTER'}<br />
              SENSOR_NOISE: {noiseLevel}%
            </div>

            {/* Warning indicator */}
            {!filterEnabled && (
              <div className="absolute bottom-3 right-3 bg-brand-danger/15 border border-brand-danger/30 text-brand-danger px-2 py-1 rounded-md text-[9px] font-bold animate-pulse">
                ⚠️ 노이즈 필터 꺼짐: 주행 탈선 우려 높음
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 p-4 bg-panel-light/60 rounded-xl border border-white/5 text-xs leading-relaxed text-text-muted font-medium">
          💡 <span className="text-brand-lime font-semibold">학생 미션 목표:</span> 센서가 교차로(+) 영역에 들어가면 검정과 흰색 보정 판정이 먹통이 됩니다. 양측 센서 수치가 동시에 대폭 급락함을 계산하고 "교차로 모드"를 기동하여 직진 패스를 지켜내는 알고리즘을 훈련해보세요!
        </div>
      </div>

    </div>
  );
}
