/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StepId = 'step1' | 'step2' | 'step3';

export interface AppState {
  currentReflection: number; // 0 ~ 100
  targetReflection: number; // 0 ~ 100
  blackReflection: number; // 0 ~ 100
  whiteReflection: number; // 0 ~ 100
  isPlaying: boolean;
}

export interface CalibrationPreset {
  name: string;
  description: string;
  action: string;
}
