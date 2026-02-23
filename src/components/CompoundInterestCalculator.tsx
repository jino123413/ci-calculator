import { useState } from 'react';
import { useInterstitialAd } from '../hooks/useInterstitialAd';
import TimeSeriesChart from './TimeSeriesChart';
import LossRecoveryCalculator from './LossRecoveryCalculator';
import BannerAd from './BannerAd';

const INTERSTITIAL_AD_ID = 'ait.v2.live.6a9582ec4e524364';
const BANNER_AD_ID = 'ait.v2.live.c77420f77f184750';

export default function CompoundInterestCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'recovery'>('calculator');
  const [principal, setPrincipal] = useState('10000000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('10');
  const [monthly, setMonthly] = useState('0');
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { showAd } = useInterstitialAd(INTERSTITIAL_AD_ID);

  const calculate = () => {
    setIsCalculating(true);

    const p = Number(principal) || 0;
    const r = (Number(rate) || 0) / 100;
    const y = Number(years) || 0;
    const m = Number(monthly) || 0;

    let finalAmount = p * Math.pow(1 + r, y);

    if (m > 0) {
      const monthlyRate = r / 12;
      const months = y * 12;
      finalAmount += m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const totalPrincipal = p + m * y * 12;
    const totalInterest = finalAmount - totalPrincipal;

    setTimeout(() => {
      setResult({
        finalAmount,
        totalPrincipal,
        totalInterest,
      });
      setIsCalculating(false);
    }, 300);
  };

  const handleReset = () => {
    showAd({
      onDismiss: () => {
        setResult(null);
        setPrincipal('10000000');
        setRate('5');
        setYears('10');
        setMonthly('0');
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(value)) + '원';
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f5f5f5]">
      {/* 헤더 */}
      <div className="bg-primary py-5 px-5 pt-6 flex items-center justify-center">
        <h2 className="text-white font-bold text-lg">나만의 복리계산기</h2>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex bg-white border-b border-[#e9ecef]">
        <button
          className={`flex-1 py-4 text-center text-sm border-b-2 transition-colors ${
            activeTab === 'calculator'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-[#6B7684]'
          }`}
          onClick={() => setActiveTab('calculator')}
        >
          복리 계산
        </button>
        <button
          className={`flex-1 py-4 text-center text-sm border-b-2 transition-colors ${
            activeTab === 'recovery'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-[#6B7684]'
          }`}
          onClick={() => setActiveTab('recovery')}
        >
          손실 복구 공식
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'calculator' ? (
        <div className="flex-1 overflow-y-auto pb-8">
          {/* 입력 섹션 */}
          <div className="bg-white m-4 mt-4 p-5 rounded-xl shadow-sm">
            <h3 className="font-bold text-base mb-4">투자 정보 입력</h3>

            <div className="mb-4">
              <label className="block text-xs text-[#6B7684] mb-1.5">초기 투자금 (원)</label>
              <input
                type="number"
                className="w-full bg-[#F8F9FA] rounded-lg px-4 py-3 text-base outline-none border border-transparent focus:border-primary transition-colors"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="10000000"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs text-[#6B7684] mb-1.5">연 수익률 (%)</label>
              <input
                type="number"
                className="w-full bg-[#F8F9FA] rounded-lg px-4 py-3 text-base outline-none border border-transparent focus:border-primary transition-colors"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="5"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs text-[#6B7684] mb-1.5">투자 기간 (년)</label>
              <input
                type="number"
                className="w-full bg-[#F8F9FA] rounded-lg px-4 py-3 text-base outline-none border border-transparent focus:border-primary transition-colors"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs text-[#6B7684] mb-1.5">월 추가 투자 (원)</label>
              <input
                type="number"
                className="w-full bg-[#F8F9FA] rounded-lg px-4 py-3 text-base outline-none border border-transparent focus:border-primary transition-colors"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                placeholder="0"
              />
            </div>

            <button
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-base disabled:opacity-50 active:opacity-80 transition-opacity"
              onClick={calculate}
              disabled={isCalculating}
            >
              {isCalculating ? '계산 중...' : '계산하기'}
            </button>
          </div>

          {/* 로딩 인디케이터 */}
          {isCalculating && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#6B7684] mt-3">계산 중...</p>
            </div>
          )}

          {/* 결과 섹션 */}
          {result && !isCalculating && (
            <div className="bg-white mx-4 p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-base mb-4">계산 결과</h3>

              <div className="flex justify-between items-center py-3 border-b border-[#f0f0f0]">
                <span className="text-sm text-[#6B7684]">최종 금액</span>
                <span className="font-semibold">{formatCurrency(result.finalAmount)}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-[#f0f0f0]">
                <span className="text-sm text-[#6B7684]">총 투자 원금</span>
                <span className="font-semibold">{formatCurrency(result.totalPrincipal)}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-[#f0f0f0]">
                <span className="text-sm text-[#6B7684]">총 수익 (이자)</span>
                <span className="font-semibold text-primary">{formatCurrency(result.totalInterest)}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-[#f0f0f0]">
                <span className="text-sm text-[#6B7684]">수익률</span>
                <span className="font-semibold text-primary">
                  {((result.totalInterest / result.totalPrincipal) * 100).toFixed(2)}%
                </span>
              </div>

              {/* 새로 계산하기 버튼 */}
              <div className="mt-5 flex justify-center">
                <button
                  className="bg-[#F4F4F4] px-6 py-3 rounded-lg active:opacity-70 transition-opacity"
                  onClick={handleReset}
                >
                  <span className="text-sm font-bold text-[#6B7684]">새로 계산하기</span>
                </button>
              </div>
            </div>
          )}

          {/* 배너 광고 */}
          {result && !isCalculating && (
            <div className="mx-4 mt-4">
              <BannerAd adGroupId={BANNER_AD_ID} />
            </div>
          )}

          {/* 시계열 그래프 섹션 */}
          {result && !isCalculating && (
            <div className="mx-4 mt-4">
              <TimeSeriesChart
                principal={Number(principal)}
                rate={Number(rate)}
                years={Number(years)}
                monthly={Number(monthly)}
              />
            </div>
          )}
        </div>
      ) : (
        <LossRecoveryCalculator />
      )}
    </div>
  );
}
