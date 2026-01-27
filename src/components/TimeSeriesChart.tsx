import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@toss/tds-react-native';

interface TimeSeriesChartProps {
  principal: number;
  rate: number;
  years: number;
  monthly: number;
}

interface YearData {
  year: number;
  principal: number;
  total: number;
  interest: number;
  returnRate: number;
}

export default function TimeSeriesChart({ principal, rate, years, monthly }: TimeSeriesChartProps) {
  const calculateYearlyData = (): YearData[] => {
    const data: YearData[] = [];
    const r = rate / 100;
    const monthlyRate = r / 12;

    for (let year = 1; year <= Math.min(years, 10); year++) {
      const totalPrincipal = principal + monthly * year * 12;
      let totalAmount = principal * Math.pow(1 + r, year);

      if (monthly > 0) {
        const months = year * 12;
        totalAmount += monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      }

      const interest = totalAmount - totalPrincipal;
      const returnRate = totalPrincipal > 0 ? (interest / totalPrincipal) * 100 : 0;

      data.push({
        year,
        principal: Math.round(totalPrincipal),
        total: Math.round(totalAmount),
        interest: Math.round(interest),
        returnRate,
      });
    }

    return data;
  };

  const yearlyData = calculateYearlyData();
  const maxTotal = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].total : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  return (
    <View style={styles.container}>
      <Text typography="h6" fontWeight="bold" style={styles.title}>
        연도별 투자 성장 분석
      </Text>
      <Text typography="body3" style={styles.description}>
        연도별 원금과 수익의 증가 추이를 확인하세요
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* 헤더 */}
          <View style={styles.tableRow}>
            <View style={[styles.cell, styles.headerCell, styles.yearCell]}>
              <Text typography="body3" fontWeight="bold" style={styles.headerText}>
                연도
              </Text>
            </View>
            <View style={[styles.cell, styles.headerCell]}>
              <Text typography="body3" fontWeight="bold" style={styles.headerText}>
                투자 원금
              </Text>
            </View>
            <View style={[styles.cell, styles.headerCell]}>
              <Text typography="body3" fontWeight="bold" style={styles.headerText}>
                총 자산
              </Text>
            </View>
            <View style={[styles.cell, styles.headerCell, styles.interestCell]}>
              <Text typography="body3" fontWeight="bold" style={styles.headerText}>
                수익금 (수익률)
              </Text>
            </View>
          </View>

          {/* 데이터 행 */}
          {yearlyData.map((item, index) => (
            <View key={item.year} style={[styles.tableRow, index % 2 === 1 && styles.oddRow]}>
              <View style={[styles.cell, styles.yearCell]}>
                <Text typography="body3" fontWeight="semiBold">
                  {item.year}년
                </Text>
              </View>
              <View style={styles.cell}>
                <Text typography="body3" style={styles.greyText}>
                  {formatCurrency(item.principal)}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text typography="body3" fontWeight="semiBold">
                  {formatCurrency(item.total)}
                </Text>
              </View>
              <View style={[styles.cell, styles.interestCell]}>
                <Text typography="body3" style={styles.blueText} fontWeight="semiBold">
                  {formatCurrency(item.interest)} ({item.returnRate.toFixed(1)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {years > 10 && (
        <Text typography="body3" style={[styles.greyText, styles.footnote]}>
          * 처음 10년간의 데이터만 표시됩니다
        </Text>
      )}

      {/* 시계열 바 그래프 */}
      <View style={styles.chartContainer}>
        <Text typography="body2" fontWeight="bold" style={styles.chartTitle}>
          자산 성장 그래프
        </Text>
        {yearlyData.map((item) => {
          const totalBarWidth = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
          const principalBarWidth = maxTotal > 0 ? (item.principal / maxTotal) * 100 : 0;

          return (
            <View key={item.year} style={styles.barRow}>
              <Text typography="body3" fontWeight="semiBold" style={styles.barLabel}>
                {item.year}년
              </Text>
              <View style={styles.barContainer}>
                <View style={[styles.barTotal, { width: `${totalBarWidth}%` }]}>
                  <View style={[styles.barPrincipal, { width: `${principalBarWidth > 0 ? (principalBarWidth / totalBarWidth) * 100 : 0}%` }]} />
                </View>
              </View>
              <Text typography="body3" style={styles.barValue}>
                {item.returnRate.toFixed(1)}%
              </Text>
            </View>
          );
        })}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#B0D4FF' }]} />
            <Text typography="body3" style={styles.greyText}>원금</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3182F6' }]} />
            <Text typography="body3" style={styles.greyText}>수익금 포함</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    color: '#6B7684',
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  oddRow: {
    backgroundColor: '#f8f9fa',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
    minWidth: 100,
  },
  yearCell: {
    minWidth: 50,
  },
  interestCell: {
    minWidth: 140,
  },
  headerCell: {
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    color: '#191F28',
  },
  greyText: {
    color: '#6B7684',
  },
  blueText: {
    color: '#3182F6',
  },
  footnote: {
    marginTop: 12,
    textAlign: 'center',
  },
  chartContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  chartTitle: {
    marginBottom: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    width: 36,
    color: '#6B7684',
  },
  barContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barTotal: {
    height: '100%',
    backgroundColor: '#3182F6',
    borderRadius: 4,
    justifyContent: 'center',
  },
  barPrincipal: {
    height: '100%',
    backgroundColor: '#B0D4FF',
    borderRadius: 4,
  },
  barValue: {
    width: 44,
    textAlign: 'right',
    color: '#3182F6',
    fontWeight: '600',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
