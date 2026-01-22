import type {
  CompoundInterestInput,
  CompoundInterestResult,
  YearlyBreakdown,
} from '@types/index';

/**
 * 복리 계산 유틸리티
 */
export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult {
  const {
    principal,
    rate,
    years,
    monthlyContribution = 0,
    compoundFrequency = 'yearly',
  } = input;

  const rateDecimal = rate / 100;
  const yearlyBreakdown: YearlyBreakdown[] = [];

  let totalPrincipal = principal;
  let currentBalance = principal;

  // 복리 계산 주기별 횟수
  const compoundsPerYear =
    compoundFrequency === 'yearly' ? 1 : compoundFrequency === 'monthly' ? 12 : 365;

  for (let year = 1; year <= years; year++) {
    const yearStartBalance = currentBalance;
    const yearlyContribution = monthlyContribution * 12;

    // 복리 계산: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
    const multiplier = Math.pow(1 + rateDecimal / compoundsPerYear, compoundsPerYear);
    const balanceGrowth = yearStartBalance * multiplier;

    let contributionGrowth = 0;
    if (monthlyContribution > 0) {
      // 월별 납입금의 복리 계산
      for (let month = 1; month <= 12; month++) {
        const monthsRemaining = 12 - month + 1;
        contributionGrowth +=
          monthlyContribution *
          Math.pow(1 + rateDecimal / compoundsPerYear, (compoundsPerYear * monthsRemaining) / 12);
      }
    }

    currentBalance = balanceGrowth + contributionGrowth;
    totalPrincipal += yearlyContribution;

    yearlyBreakdown.push({
      year,
      principal: totalPrincipal,
      interest: currentBalance - totalPrincipal,
      balance: currentBalance,
    });
  }

  const finalAmount = currentBalance;
  const totalInterest = finalAmount - totalPrincipal;

  return {
    finalAmount: Math.round(finalAmount),
    totalPrincipal: Math.round(totalPrincipal),
    totalInterest: Math.round(totalInterest),
    yearlyBreakdown,
  };
}

/**
 * 숫자를 통화 형식으로 포맷팅
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

/**
 * 백분율 포맷팅
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
