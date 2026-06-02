/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StepId } from '../types';
import { Layers, Activity, ShieldCheck, Lock } from 'lucide-react';

interface StepTabsProps {
  currentStep: StepId;
  onStepChange: (step: StepId) => void;
}

export default function StepTabs({ currentStep, onStepChange }: StepTabsProps) {
  const steps = [
    {
      id: 'step1' as StepId,
      name: '1단계 반사값과 경계선',
      desc: '센서의 빛 반사값과 중심 기준선',
      icon: Layers,
      locked: false,
    },
    {
      id: 'step2' as StepId,
      name: '2단계 PD 제어',
      desc: '오차, 비례(P), 미분(D) 제어',
      icon: Activity,
      locked: false, // Make it clickable so they see the placeholder mockup!
    },
    {
      id: 'step3' as StepId,
      name: '3단계 문제 해결',
      desc: '교차로 및 급커브 이탈 복귀',
      icon: ShieldCheck,
      locked: false, // Make it clickable
    },
  ];

  return (
    <nav className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1 mb-5 bg-panel-light/40 border border-white/5 rounded-2xl select-none">
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;

        return (
          <button
            key={step.id}
            onClick={() => onStepChange(step.id)}
            className={`relative flex items-center gap-3.5 p-3.5 rounded-xl text-left cursor-pointer transition-all duration-300 ${
              isActive
                ? 'bg-panel-light text-brand-cyan border border-brand-cyan/20 shadow-lg shadow-black/30'
                : 'text-text-muted hover:text-text-main hover:bg-white/5 border border-transparent'
            }`}
          >
            {/* Active Indicator Top Light */}
            {isActive && (
              <span className="absolute top-0 left-4 right-4 h-0.5 bg-brand-cyan shadow-cyan rounded-full" />
            )}

            <div className={`p-2.5 rounded-lg ${
              isActive ? 'bg-brand-cyan-dim border border-brand-cyan/30' : 'bg-black/20 border border-white/5'
            }`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-text-main block truncate">
                  {step.name}
                </span>
                {step.id !== 'step1' && (
                  <span className="flex items-center gap-0.5 px-1 py-0.2 text-[10px] bg-brand-lime-dim border border-brand-lime/20 text-brand-lime rounded-md font-semibold">
                    연습용
                  </span>
                )}
              </div>
              <span className="text-[11px] text-text-muted mt-0.5 block truncate">
                {step.desc}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
