/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState } from '../types';
import { BookOpen, Sparkles, CheckCircle, Flame } from 'lucide-react';

interface ExplanationPanelProps {
  state: AppState;
}

export default function ExplanationPanel({ state }: ExplanationPanelProps) {
  const { currentReflection, targetReflection } = state;
  const diff = currentReflection - targetReflection;

  // Render the dynamic narrative explanation based on state differential
  let explanationContent = null;
  if (Math.abs(diff) <= 3) {
    explanationContent = (
      <span>
        현재 반사값(<strong className="text-brand-cyan">{currentReflection}</strong>)이 기준값(
        <strong className="text-brand-lime">{targetReflection}</strong>)과 거의 같으므로, 센서가 {' '}
        <strong className="text-brand-warning">경계선 근처</strong>에 있습니다. 로봇은 현재 위치를 유지하며{' '}
        <strong className="text-brand-cyan">직진에 가까운 상태</strong>입니다.
      </span>
    );
  } else if (diff < 0) {
    explanationContent = (
      <span>
        현재 반사값(<strong className="text-brand-cyan">{currentReflection}</strong>)이 기준값(
        <strong className="text-brand-lime">{targetReflection}</strong>)보다 작으므로, 센서가 {' '}
        <strong className="text-brand-cyan">검정색 쪽</strong>에 있습니다. 차이(
        <strong className="text-brand-danger">{diff}</strong>)가 음수이므로 로봇은{' '}
        <strong className="text-[#c8f04a]">흰색 쪽으로 보정하여</strong> 경계선(기준값 위치)을 맞추려고 합니다.
      </span>
    );
  } else {
    explanationContent = (
      <span>
        현재 반사값(<strong className="text-brand-cyan">{currentReflection}</strong>)이 기준값(
        <strong className="text-brand-lime">{targetReflection}</strong>)보다 크므로, 센서가 {' '}
        <strong className="text-brand-lime">흰색 쪽(바깥)</strong>에 있습니다. 차이(
        <strong className="text-brand-danger">+{diff}</strong>)가 양수이므로 로봇은{' '}
        <strong className="text-brand-cyan">검정선 쪽으로 보정하여</strong> 경계선(기준값 위치)을 맞추려고 합니다.
      </span>
    );
  }

  // Threshold alerts warning trigger
  let targetWarning = '';
  let warningBadgeClass = 'text-brand-lime border-brand-lime/10 bg-brand-lime-dim/5';
  if (targetReflection <= 25) {
    targetWarning = '기준값이 너무 낮아 검정선 안쪽을 따라가며 탈선에 취약해질 수 있습니다.';
    warningBadgeClass = 'text-brand-warning border-brand-warning/30 bg-brand-warning/10';
  } else if (targetReflection >= 75) {
    targetWarning = '기준값이 너무 높아 흰색 바닥 쪽으로 차체가 완전히 이탈해 멀어질 수 있습니다.';
    warningBadgeClass = 'text-brand-danger border-brand-danger/30 bg-brand-danger/10';
  } else {
    targetWarning = '기준값이 안정적인 중간 범위에 설정되어 있어 경계선을 원활하게 따라갈 수 있는 상태입니다.';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 select-none animate-fade-in text-sm sm:text-base">
      
      {/* Dynamic Explanation Card */}
      <div className="lg:col-span-7 flex flex-col justify-between p-5 bg-panel border border-brand-cyan/15 rounded-2xl shadow-xl">
        <div>
          <h4 className="text-text-main font-black text-base flex items-center gap-2 mb-3.5 pb-2 border-b border-white/5">
            <BookOpen className="w-5 h-5 text-brand-cyan" />
            <span>상호작용적 실시간 설명</span>
          </h4>
          <div className="text-text-muted leading-relaxed font-semibold">
            {explanationContent}
          </div>
        </div>

        <div className={`mt-5 p-3 rounded-xl border ${warningBadgeClass} flex items-center gap-2.5 transition-colors duration-300`}>
          <Flame className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-bold leading-normal">{targetWarning}</p>
        </div>
      </div>

      {/* Observation Checklist Points & Core Concepts Card */}
      <div className="lg:col-span-5 p-5 bg-panel border border-brand-lime/15 rounded-2xl shadow-xl flex flex-col justify-between">
        <div>
          <h4 className="text-text-main font-black text-base flex items-center gap-2 mb-3 px-1">
            <Sparkles className="w-5 h-5 text-brand-lime" />
            <span>관찰 포인트 및 핵심 개념</span>
          </h4>
          
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2 text-xs font-medium text-text-muted">
              <CheckCircle className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
              <span>슬라이더를 움직여 현재 반사값이 변할 때 로봇 위치가 어떻게 바뀌는지 관찰하세요.</span>
            </li>
            <li className="flex items-start gap-2 text-xs font-medium text-text-muted">
              <CheckCircle className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
              <span>기준값을 높이거나 낮추면 목표 경계선이 어떻게 이동하는지 확인하세요.</span>
            </li>
            <li className="flex items-start gap-2 text-xs font-medium text-text-muted">
              <CheckCircle className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
              <span>로봇이 완벽한 직선 주행을 하려면 차이 값이 0에 가까워야 합니다.</span>
            </li>
            <li className="flex items-start gap-2 text-xs font-medium text-text-muted">
              <CheckCircle className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
              <span>기준값이 과하게 낮거나 높을 때 센서가 오인 탈선할 문제를 예측해 보세요.</span>
            </li>
          </ul>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-text-muted leading-relaxed font-semibold">
          💡 <span className="text-brand-lime font-bold">교육 요약:</span> 센서는 검정에서 빛을 많이 흡수하여 낮은 값(0~25)을 읽고, 흰색에서 반사율이 높아 높은 값(75~100)을 읽습니다. 라인 팔로잉은 검정이 아닌 검정/흰색 경계면(중간값)을 목표선으로 추적합니다!
        </div>
      </div>

    </div>
  );
}
