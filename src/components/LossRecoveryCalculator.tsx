import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@toss/tds-react-native';

/**
 * 투자 손실 복구 계산기
 * 손실률에 따라 원금 복구에 필요한 수익률을 보여줍니다
 */
export default function LossRecoveryCalculator() {
  // 손실률별 복구에 필요한 수익률 계산
  const calculateRecoveryRate = (lossRate: number) => {
    return (lossRate / (1 - lossRate)) * 100;
  };

  const lossScenarios = [
    { loss: 5, color: '#FEF2E8' },
    { loss: 10, color: '#FDE8E8' },
    { loss: 20, color: '#FCE0E0' },
    { loss: 30, color: '#FBD5D5' },
    { loss: 40, color: '#F9C5C5' },
    { loss: 50, color: '#F7B0B0' },
    { loss: 60, color: '#F59090' },
    { loss: 70, color: '#F37070' },
    { loss: 80, color: '#F15050' },
    { loss: 90, color: '#EF3030' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(value)) + '원';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text typography="h5" fontWeight="bold">
          📉 투자 손실 복구 공식
        </Text>
        <Text typography="body2" style={[styles.greyText, { marginTop: 8 }]}>
          손실이 발생했을 때 원금을 회복하려면 얼마의 수익률이 필요할까요?
        </Text>
      </View>

      <View style={styles.exampleSection}>
        <View style={styles.exampleCard}>
          <Text typography="body3" style={styles.greyText}>
            예시
          </Text>
          <Text typography="body1" style={{ marginTop: 4 }}>
            1,000만원 투자 후 <Text style={styles.redText} fontWeight="bold">20% 손실</Text>
          </Text>
          <Text typography="body1" style={{ marginTop: 4 }}>
            → 현재 자산: {formatCurrency(8000000)}
          </Text>
          <Text typography="body1" style={{ marginTop: 8 }}>
            원금 복구에 필요한 수익률: <Text style={styles.blueText} fontWeight="bold">25%</Text>
          </Text>
          <Text typography="body3" style={[styles.greyText, { marginTop: 4 }]}>
            800만원의 25% = 200만원 수익
          </Text>
        </View>
      </View>

      <View style={styles.tableSection}>
        <Text typography="h6" fontWeight="bold" style={{ marginBottom: 12 }}>
          손실률별 복구 수익률
        </Text>

        <View style={styles.table}>
          {/* 헤더 */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.cell, styles.lossCell]}>
              <Text typography="body3" fontWeight="bold" style={styles.headerText}>
                손실률
              </Text>
            </View>
            <View style={[styles.cell, styles.currentCell]}>
              <Text typography="body3" fontWeight="bold" style={styles.headerText}>
                현재 자산
              </Text>
            </View>
            <View style={[styles.cell, styles.recoveryCell]}>
              <Text typography="body3" fontWeight="bold" style={styles.headerText}>
                복구 수익률
              </Text>
            </View>
          </View>

          {/* 데이터 행 */}
          {lossScenarios.map((scenario, index) => {
            const lossRate = scenario.loss / 100;
            const currentValue = 10000000 * (1 - lossRate);
            const recoveryRate = calculateRecoveryRate(lossRate);

            return (
              <View
                key={scenario.loss}
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 1 ? '#f8f9fa' : '#ffffff' },
                ]}
              >
                <View style={[styles.cell, styles.lossCell]}>
                  <Text
                    typography="body2"
                    fontWeight="bold"
                    style={[styles.redText, { fontSize: 16 }]}
                  >
                    -{scenario.loss}%
                  </Text>
                </View>
                <View style={[styles.cell, styles.currentCell]}>
                  <Text typography="body3" style={styles.greyText}>
                    {formatCurrency(currentValue)}
                  </Text>
                </View>
                <View style={[styles.cell, styles.recoveryCell]}>
                  <Text
                    typography="body2"
                    fontWeight="bold"
                    style={[styles.blueText, { fontSize: 16 }]}
                  >
                    +{recoveryRate.toFixed(2)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.insightSection}>
        <View style={styles.insightCard}>
          <Text typography="body1" fontWeight="bold" style={{ marginBottom: 8 }}>
            💡 핵심 인사이트
          </Text>
          <Text typography="body2" style={[styles.greyText, { lineHeight: 22 }]}>
            • 손실률이 클수록 복구에 필요한 수익률은 기하급수적으로 증가합니다
            {'\n'}• 50% 손실 시 100% 수익(2배)이 필요합니다
            {'\n'}• 손실을 최소화하는 것이 장기 투자의 핵심입니다
            {'\n'}• 분산 투자로 큰 손실을 방지하세요
          </Text>
        </View>
      </View>

      <View style={styles.formulaSection}>
        <Text typography="body3" fontWeight="bold" style={{ marginBottom: 4 }}>
          계산 공식
        </Text>
        <View style={styles.formulaBox}>
          <Text typography="body3" style={styles.greyText}>
            복구 수익률 = (손실률 ÷ (1 - 손실률)) × 100
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 16,
  },
  exampleSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  exampleCard: {
    backgroundColor: '#FFF8F0',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5CC',
  },
  tableSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lossCell: {
    flex: 1,
  },
  currentCell: {
    flex: 1.5,
  },
  recoveryCell: {
    flex: 1.2,
  },
  headerText: {
    color: '#191F28',
  },
  greyText: {
    color: '#6B7684',
  },
  redText: {
    color: '#F04452',
  },
  blueText: {
    color: '#3182F6',
  },
  insightSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7E0F4',
  },
  formulaSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  formulaBox: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
});
