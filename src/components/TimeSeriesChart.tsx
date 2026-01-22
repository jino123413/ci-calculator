import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@toss/tds-react-native';

interface TimeSeriesChartProps {
  principal: number;
  rate: number;
  years: number;
  monthly: number;
}

export default function TimeSeriesChart({ principal, rate, years, monthly }: TimeSeriesChartProps) {
  // 연도별 데이터 계산
  const calculateYearlyData = () => {
    const data: Array<{ year: number; principal: number; total: number; interest: number }> = [];

    const r = rate / 100;
    const monthlyRate = r / 12;

    for (let year = 1; year <= Math.min(years, 10); year++) {
      // 원금 계산 (초기 원금 + 월 추가 투자 * 개월수)
      const totalPrincipal = principal + monthly * year * 12;

      // 복리 계산
      let totalAmount = principal * Math.pow(1 + r, year);

      // 월 추가 투자 계산
      if (monthly > 0) {
        const months = year * 12;
        totalAmount += monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      }

      const interest = totalAmount - totalPrincipal;

      data.push({
        year,
        principal: Math.round(totalPrincipal),
        total: Math.round(totalAmount),
        interest: Math.round(interest),
      });
    }

    return data;
  };

  const yearlyData = calculateYearlyData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  return (
    <View style={styles.container}>
      <Text typography="h6" fontWeight="bold" style={styles.title}>
        📊 연도별 투자 성장 분석
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
            <View style={[styles.cell, styles.headerCell]}>
              <Text typography="body3" fontWeight="bold" style={styles.headerText}>
                수익금
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
              <View style={styles.cell}>
                <Text typography="body3" style={styles.blueText} fontWeight="semiBold">
                  {formatCurrency(item.interest)}
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
    minWidth: 60,
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
});
