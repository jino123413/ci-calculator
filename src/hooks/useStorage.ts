import { Storage } from '@apps-in-toss/framework';
import { useCallback, useEffect, useState } from 'react';

/**
 * 앱인토스 Storage Hook
 *
 * 로컬 저장소에 데이터를 저장하고 불러오는 훅입니다.
 * 앱을 종료하고 다시 실행해도 데이터가 유지됩니다.
 */

interface UseStorageResult<T> {
  /** 저장된 값 */
  storedValue: T | null;
  /** 로딩 상태 */
  loading: boolean;
  /** 값 저장 */
  saveItem: (value: T) => Promise<void>;
  /** 값 삭제 */
  removeItem: () => Promise<void>;
  /** 값 다시 불러오기 */
  reloadItem: () => Promise<void>;
}

/**
 * Storage Hook
 *
 * @param key - 저장소 키
 * @param defaultValue - 기본값 (값이 없을 때 사용)
 * @returns Storage 훅 결과
 *
 * @example
 * ```typescript
 * const { storedValue, saveItem } = useStorage('calculator-result', null);
 *
 * // 저장
 * await saveItem({ principal: 10000000, rate: 5, years: 10 });
 *
 * // 불러오기
 * console.log(storedValue);
 * ```
 */
export function useStorage<T = string>(
  key: string,
  defaultValue: T | null = null
): UseStorageResult<T> {
  const [storedValue, setStoredValue] = useState<T | null>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);

  // 초기 로드
  useEffect(() => {
    loadItem();
  }, [key]);

  // 값 불러오기
  const loadItem = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await Storage.getItem(key);

      if (stored) {
        try {
          // JSON 파싱 시도
          const parsed = JSON.parse(stored);
          setStoredValue(parsed);
        } catch {
          // 파싱 실패 시 문자열 그대로 사용
          setStoredValue(stored as T);
        }
      } else {
        setStoredValue(defaultValue);
      }
    } catch (error) {
      console.error('Storage load error:', error);
      setStoredValue(defaultValue);
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue]);

  // 값 저장
  const saveItem = async (value: T) => {
    try {
      // 객체/배열은 JSON으로 직렬화
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      await Storage.setItem(key, stringValue);
      setStoredValue(value);
    } catch (error) {
      console.error('Storage save error:', error);
      throw error;
    }
  };

  // 값 삭제
  const removeItem = async () => {
    setLoading(true);
    try {
      await Storage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error('Storage remove error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    storedValue,
    loading,
    saveItem,
    removeItem,
    reloadItem: loadItem,
  };
}

/**
 * Storage 키 상수
 */
export const StorageKeys = {
  // 계산기 입력값
  CALCULATOR_INPUT: 'calculator_input',

  // 계산 결과 히스토리
  CALCULATOR_HISTORY: 'calculator_history',

  // 사용자 설정
  USER_PREFERENCES: 'user_preferences',
} as const;
