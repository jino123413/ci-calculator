import { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, TextField, Button } from '@toss/tds-react-native';
import TimeSeriesChart from './TimeSeriesChart';
import LossRecoveryCalculator from './LossRecoveryCalculator';

/**
 * 복리 계산기 - TDS 버전
 * 광고 기능은 샌드박스에서 지원되지 않아 제거됨
 */
export default function CompoundInterestCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'recovery'>('calculator');
  const [principal, setPrincipal] = useState('10000000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('10');
  const [monthly, setMonthly] = useState('0');
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 계산 수행 함수
  const performCalculation = () => {
    const p = Number(principal) || 0;
    const r = (Number(rate) || 0) / 100;
    const y = Number(years) || 0;
    const m = Number(monthly) || 0;

    // 복리 계산
    let finalAmount = p * Math.pow(1 + r, y);

    // 월 추가 투자 계산
    if (m > 0) {
      const monthlyRate = r / 12;
      const months = y * 12;
      finalAmount += m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const totalPrincipal = p + m * y * 12;
    const totalInterest = finalAmount - totalPrincipal;

    setResult({
      finalAmount,
      totalPrincipal,
      totalInterest,
    });

    setIsCalculating(false);
  };

  // 계산하기 버튼 클릭
  const calculate = () => {
    setIsCalculating(true);
    // 약간의 지연으로 로딩 애니메이션 표시
    setTimeout(() => {
      performCalculation();
    }, 300);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(value)) + '원';
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text typography="h4" fontWeight="bold" style={styles.headerText}>
          복리 계산기
        </Text>
      </View>

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'calculator' && styles.activeTab]}
          onPress={() => setActiveTab('calculator')}
        >
          <Text
            typography="body2"
            fontWeight={activeTab === 'calculator' ? 'bold' : 'regular'}
            style={activeTab === 'calculator' ? styles.activeTabText : styles.inactiveTabText}
          >
            💰 복리 계산
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recovery' && styles.activeTab]}
          onPress={() => setActiveTab('recovery')}
        >
          <Text
            typography="body2"
            fontWeight={activeTab === 'recovery' ? 'bold' : 'regular'}
            style={activeTab === 'recovery' ? styles.activeTabText : styles.inactiveTabText}
          >
            📉 손실 복구 공식
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탭 콘텐츠 */}
      {activeTab === 'calculator' ? (
        <ScrollView style={styles.tabContent}>

      {/* 입력 섹션 */}
      <View style={[styles.card, { marginTop: 16 }]}>
        <Text typography="h6" fontWeight="bold" style={styles.cardTitle}>
          투자 정보 입력
        </Text>

        <View style={styles.inputGroup}>
          <TextField
            variant="box"
            label="초기 투자금 (원)"
            value={principal}
            onChangeText={setPrincipal}
            keyboardType="number-pad"
            placeholder="10000000"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextField
            variant="box"
            label="연 수익률 (%)"
            value={rate}
            onChangeText={setRate}
            keyboardType="decimal-pad"
            placeholder="5"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextField
            variant="box"
            label="투자 기간 (년)"
            value={years}
            onChangeText={setYears}
            keyboardType="number-pad"
            placeholder="10"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextField
            variant="box"
            label="월 추가 투자 (원)"
            value={monthly}
            onChangeText={setMonthly}
            keyboardType="number-pad"
            placeholder="0"
          />
        </View>

        <Button size="large" onPress={calculate} disabled={isCalculating}>
          {isCalculating ? '계산 중...' : '계산하기'}
        </Button>
      </View>

      {/* 로딩 인디케이터 */}
      {isCalculating && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3182F6" />
          <Text typography="body2" style={[styles.greyText, { marginTop: 12 }]}>
            계산 중...
          </Text>
        </View>
      )}

      {/* 결과 섹션 */}
      {result && !isCalculating && (
        <View style={styles.card}>
          <Text typography="h6" fontWeight="bold" style={styles.cardTitle}>
            계산 결과
          </Text>

          <View style={styles.resultRow}>
            <Text typography="body2" style={styles.greyText}>
              최종 금액
            </Text>
            <Text typography="body1" fontWeight="semiBold">
              {formatCurrency(result.finalAmount)}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text typography="body2" style={styles.greyText}>
              총 투자 원금
            </Text>
            <Text typography="body1" fontWeight="semiBold">
              {formatCurrency(result.totalPrincipal)}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text typography="body2" style={styles.greyText}>
              총 수익 (이자)
            </Text>
            <Text typography="body1" fontWeight="semiBold" style={styles.blueText}>
              {formatCurrency(result.totalInterest)}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text typography="body2" style={styles.greyText}>
              수익률
            </Text>
            <Text typography="body1" fontWeight="semiBold" style={styles.blueText}>
              {((result.totalInterest / result.totalPrincipal) * 100).toFixed(2)}%
            </Text>
          </View>
        </View>
      )}

      {/* 시계열 그래프 섹션 */}
      {result && !isCalculating && (
        <View style={styles.chartSection}>
          <TimeSeriesChart
            principal={Number(principal)}
            rate={Number(rate)}
            years={Number(years)}
            monthly={Number(monthly)}
          />
        </View>
      )}
        </ScrollView>
      ) : (
        <LossRecoveryCalculator />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3182F6',
    padding: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3182F6',
  },
  activeTabText: {
    color: '#3182F6',
  },
  inactiveTabText: {
    color: '#6B7684',
  },
  tabContent: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  greyText: {
    color: '#6B7684',
  },
  blueText: {
    color: '#3182F6',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  chartSection: {
    margin: 16,
  },
});
