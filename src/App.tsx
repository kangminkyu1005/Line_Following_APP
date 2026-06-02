/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/Header';
import StepTabs from './components/StepTabs';
import ControlPanel from './components/ControlPanel';
import SimulationPanel from './components/SimulationPanel';
import ExplanationPanel from './components/ExplanationPanel';
import GuideModal from './components/GuideModal';
import LevelTwoMock from './components/LevelTwoMock';
import LevelThreeMock from './components/LevelThreeMock';
import { AppState, StepId } from './types';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('step1');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Core level evaluation state values
  const [state, setState] = useState<AppState>({
    currentReflection: 35,
    targetReflection: 50,
    blackReflection: 12,
    whiteReflection: 92,
    isPlaying: true, // default to true so the simulation starts alive!
  });

  const handleStateChange = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handlePresetAction = (action: string) => {
    switch (action) {
      case 'calculate-mid': {
        const mid = Math.round((state.blackReflection + state.whiteReflection) / 2);
        const clampedMid = Math.max(0, Math.min(100, mid));
        setState((prev) => ({ ...prev, targetReflection: clampedMid }));
        break;
      }
      case 'inside-black': {
        const current = Math.max(0, Math.min(100, state.targetReflection - 10));
        setState((prev) => ({ ...prev, currentReflection: current }));
        break;
      }
      case 'near-boundary': {
        setState((prev) => ({ ...prev, currentReflection: state.targetReflection }));
        break;
      }
      case 'white-side': {
        const current = Math.max(0, Math.min(100, state.targetReflection + 10));
        setState((prev) => ({ ...prev, currentReflection: current }));
        break;
      }
      case 'lower-target': {
        const target = Math.max(0, Math.min(100, state.targetReflection - 5));
        setState((prev) => ({ ...prev, targetReflection: target }));
        break;
      }
      case 'raise-target': {
        const target = Math.max(0, Math.min(100, state.targetReflection + 5));
        setState((prev) => ({ ...prev, targetReflection: target }));
        break;
      }
      case 'reset': {
        setState({
          currentReflection: 35,
          targetReflection: 50,
          blackReflection: 12,
          whiteReflection: 92,
          isPlaying: true,
        });
        break;
      }
    }
  };

  return (
    <div className="min-h-screen text-text-main flex flex-col transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 flex-1 flex flex-col gap-4">
        
        {/* Header navigation bar */}
        <Header onOpenGuide={() => setIsGuideOpen(true)} />

        {/* Multi-Step Interactive Course Tabs */}
        <StepTabs currentStep={currentStep} onStepChange={setCurrentStep} />

        {/* Main interactive panel structure */}
        <main className="flex-1">
          {currentStep === 'step1' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Controller inputs */}
                <ControlPanel 
                  state={state} 
                  onStateChange={handleStateChange} 
                />

                {/* Right Interactive Simulator */}
                <SimulationPanel 
                  state={state} 
                  onStateChange={handleStateChange} 
                  onPresetAction={handlePresetAction}
                />

              </div>

              {/* Lower Dynamic Educational Explanation and Checklist points */}
              <ExplanationPanel state={state} />
            </div>
          )}

          {currentStep === 'step2' && <LevelTwoMock />}

          {currentStep === 'step3' && <LevelThreeMock />}
        </main>

        {/* Footer info strip */}
        <footer className="mt-8 pt-4 border-t border-white/5 text-center text-xs text-text-muted select-none">
          대구대학교 컴퓨터정보공학과 창의공학 실천 프로젝트 © 2026. All rights reserved.
        </footer>

      </div>

      {/* Embedded interactive guide overlay modal popup */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
