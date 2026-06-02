/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HelpCircle, Maximize2, Minimize2, Cpu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onOpenGuide: () => void;
}

export default function Header({ onOpenGuide }: HeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 mb-4 select-none">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-brand-cyan border border-brand-cyan/20 bg-brand-cyan-dim shadow-cyan">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
            라인 팔로잉 학습 <span className="text-brand-cyan font-semibold text-xs py-0.5 px-1.5 border border-brand-cyan/30 rounded-md bg-brand-cyan-dim ml-2">v1.2</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">로봇 컬러 센서와 컴퓨터 알고리즘 시뮬레이터</p>
        </div>
      </div>

      <div className="flex items-center gap-2自 w-full sm:w-auto self-stretch sm:self-auto justify-end">
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-2 px-4 py-2 text-sm text-text-main hover:text-brand-cyan border border-white/10 hover:border-brand-cyan/40 bg-panel-light/60 hover:bg-brand-cyan-dim rounded-xl cursor-pointer transition-all duration-200"
        >
          <HelpCircle className="w-4 h-4" />
          <span>가이드 보기</span>
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 text-text-muted hover:text-text-main hover:bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-colors"
          title="전체화면"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
