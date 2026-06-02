/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Lightbulb, TrendingUp, HelpCircle, Footprints } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-panel p-6 rounded-2xl border border-brand-cyan/25 shadow-2xl overflow-y-auto max-h-[85vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors p-1 hover:bg-white/5 rounded-lg"
          aria-label="가이드 닫기"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <HelpCircle className="w-8 h-8 text-brand-cyan" />
          <h2 className="text-2xl font-bold text-text-main">라인 팔로잉 학습 가이드</h2>
        </div>

        {/* Content */}
        <div className="space-y-6 text-text-muted text-sm sm:text-base leading-relaxed">
          
          <div className="bg-panel-light p-4 rounded-xl border border-white/5">
            <h3 className="text-brand-cyan font-bold flex items-center gap-2 mb-2 text-base">
              <Lightbulb className="w-5 h-5" />
              1. 반사값(Reflection Value)이란?
            </h3>
            <p>
              로봇 바닥에 장착된 <strong>컬러 센서(또는 조도 센서)</strong>는 바닥을 향해 빛을 비춘 뒤 되돌아오는 빛의 양을 측정합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li><span className="text-brand-cyan font-semibold">검정색선</span>은 빛을 대부분 흡수하므로 반사값이 매우 낮습니다. (예: 10 ~ 20)</li>
              <li><span className="text-brand-lime font-semibold">흰색바닥</span>은 빛을 대부분 반사하므로 반사값이 매우 높습니다. (예: 80 ~ 100)</li>
            </ul>
          </div>

          <div className="bg-panel-light p-4 rounded-xl border border-white/5">
            <h3 className="text-brand-lime font-bold flex items-center gap-2 mb-2 text-base">
              <TrendingUp className="w-5 h-5" />
              2. 왜 경계선(Boundary)을 따라갈까?
            </h3>
            <p>
              검정색 한가운데나 흰색 바닥 한가운데에서는 센서값이 항상 일정하여 로봇이 왼쪽인지 오른쪽인지 이탈 방향을 구별할 수 없습니다.
            </p>
            <p className="mt-2 font-medium text-text-main">
              따라서 로봇은 <strong>검정색 선과 흰색 바닥의 경계면(중간 회색 부분)</strong>을 기준값으로 정하고, 센서가 이 기준값을 계속 보며 나아가도록 조향합니다.
            </p>
          </div>

          <div className="bg-panel-light p-4 rounded-xl border border-white/5">
            <h3 className="text-brand-blue font-bold flex items-center gap-2 mb-2 text-base">
              <Footprints className="w-5 h-5" />
              3. 1단계 학습 방법
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm mt-1">
              <li>
                <strong>현재 반사값 슬라이더</strong>를 움직여보세요. 로봇의 실제 센서 위치가 검정색 중심과 흰색 바닥 사이에서 어떻게 회전 조향되어야 하는지 알 수 있습니다.
              </li>
              <li>
                <strong>중간값 계산 버튼</strong>을 클릭해보세요. 현재 검정색값과 흰색값의 산술평균인 중간값이 설정되며, 이 값이 가장 이상적인 <strong>기준값</strong>이 됩니다.
              </li>
              <li>
                하단의 <strong>설명 카드</strong>와 <strong>관찰 포인트</strong>를 읽으며, 로봇의 보정 방향 논리가 어떻게 구현되는지 이해해보세요.
              </li>
            </ol>
          </div>

        </div>

        {/* Confirm Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-brand-cyan text-bg-primary font-bold rounded-xl hover:bg-brand-cyan/80 transition-colors shadow-lg cursor-pointer"
          >
            이해했습니다
          </button>
        </div>

      </div>
    </div>
  );
}
