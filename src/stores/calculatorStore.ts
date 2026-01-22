import { create } from 'zustand';
import type { CompoundInterestInput, CompoundInterestResult } from '@types/index';
import { calculateCompoundInterest } from '@utils/compoundInterest';

interface CalculatorState {
  // 입력값
  input: CompoundInterestInput;
  // 계산 결과
  result: CompoundInterestResult | null;
  // 계산 히스토리
  history: CompoundInterestResult[];
  // 계산 실행
  calculate: () => void;
  // 입력값 업데이트
  updateInput: (input: Partial<CompoundInterestInput>) => void;
  // 히스토리에 추가
  addToHistory: (result: CompoundInterestResult) => void;
  // 히스토리 삭제
  clearHistory: () => void;
  // 초기화
  reset: () => void;
  // 입력값 복원
  restoreInput: (input: CompoundInterestInput) => void;
}

const defaultInput: CompoundInterestInput = {
  principal: 10000000, // 1천만원
  rate: 5, // 5%
  years: 10, // 10년
  monthlyContribution: 0,
  compoundFrequency: 'yearly',
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  input: defaultInput,
  result: null,
  history: [],

  calculate: () => {
    const { input, addToHistory } = get();
    const result = calculateCompoundInterest(input);
    set({ result });

    // 히스토리에 추가 (최대 10개)
    addToHistory(result);
  },

  updateInput: (newInput) => {
    set((state) => ({
      input: { ...state.input, ...newInput },
    }));
  },

  addToHistory: (result) => {
    set((state) => {
      const newHistory = [result, ...state.history].slice(0, 10);
      return { history: newHistory };
    });
  },

  clearHistory: () => {
    set({ history: [] });
  },

  reset: () => {
    set({
      input: defaultInput,
      result: null,
    });
  },

  restoreInput: (input) => {
    set({ input });
  },
}));
