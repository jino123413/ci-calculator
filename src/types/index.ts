/**
 * 공통 타입 정의
 */

// 복리 계산 입력 타입
export interface CompoundInterestInput {
  principal: number; // 원금
  rate: number; // 연 이자율 (%)
  years: number; // 투자 기간 (년)
  monthlyContribution?: number; // 월 추가 납입액
  compoundFrequency?: 'yearly' | 'monthly' | 'daily'; // 복리 계산 주기
}

// 복리 계산 결과 타입
export interface CompoundInterestResult {
  finalAmount: number; // 최종 금액
  totalPrincipal: number; // 총 원금
  totalInterest: number; // 총 이자
  yearlyBreakdown: YearlyBreakdown[]; // 연도별 상세
}

// 연도별 상세 타입
export interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

// 영수증 타입
export interface Receipt {
  id: string;
  date: string;
  storeName: string;
  items: ReceiptItem[];
  total: number;
}

// 영수증 항목 타입
export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
