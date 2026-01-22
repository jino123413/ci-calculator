import React from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, typography } from '@toss/tds-react-native';
import type { YearlyBreakdown } from '@types/index';

/**
 * 복리 계산 시계열 그래프 컴포넌트
 * TDS 색상과 디자인 시스템 준수
 */

interface CompoundInterestChartProps {
  yearlyBreakdown: YearlyBreakdown[];
}

export default function CompoundInterestChart({ yearlyBreakdown }: CompoundInterestChartProps) {
  if (!yearlyBreakdown || yearlyBreakdown.length === 0) {
    return null;
  }

  const screenWidth = Dimensions.get('window').width - 40; // 패딩 제외

  // 차트 데이터 준비
  const labels = yearlyBreakdown.map((item) => `${item.year}년`);
  const balanceData = yearlyBreakdown.map((item) => item.balance);
  const principalData = yearlyBreakdown.map((item) => item.principal);

  // 최대값 계산 (Y축 스케일)
  const maxValue = Math.max(...balanceData);
  const yAxisMax = Math.ceil(maxValue / 1000000) * 1000000; // 백만 단위로 올림

  // 차트 설정
  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(49, 130, 246, ${opacity})`, // TDS blue600
    labelColor: (opacity = 1) => `rgba(107, 118, 132, ${opacity})`, // TDS grey600
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.blue600,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // 실선
      stroke: colors.grey200,
      strokeWidth: 1,
    },
  };

  // 데이터셋
  const data = {
    labels: labels.length > 10 ? labels.filter((_, i) => i % 2 === 0) : labels, // 10년 초과 시 2년 간격
    datasets: [
      {
        data: balanceData,
        color: (opacity = 1) => `rgba(49, 130, 246, ${opacity})`, // 최종 금액 (파란색)
        strokeWidth: 3,
      },
      {
        data: principalData,
        color: (opacity = 1) => `rgba(107, 118, 132, ${opacity})`, // 원금 (회색)
        strokeWidth: 2,
        withDots: false,
      },
    ],
    legend: ['최종 금액', '원금'],
  };

  // Y축 레이블 포맷
  const formatYLabel = (value: string) => {
    const num = parseInt(value);
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(0)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    }
    return value;
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <typography.Headline3 style={{ marginBottom: 16, color: colors.grey900 }}>
        투자 성장 그래프
      </typography.Headline3>

      {/* 범례 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 16,
          gap: 24,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 16,
              height: 3,
              backgroundColor: colors.blue600,
              borderRadius: 2,
            }}
          />
          <typography.Caption1 style={{ color: colors.grey700 }}>최종 금액</typography.Caption1>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 16,
              height: 3,
              backgroundColor: colors.grey600,
              borderRadius: 2,
            }}
          />
          <typography.Caption1 style={{ color: colors.grey700 }}>원금</typography.Caption1>
        </View>
      </View>

      {/* 차트 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={data}
          width={Math.max(screenWidth, yearlyBreakdown.length * 60)}
          height={220}
          chartConfig={chartConfig}
          bezier // 부드러운 곡선
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          formatYLabel={formatYLabel}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
        />
      </ScrollView>

      {/* 설명 */}
      <View
        style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: colors.grey50,
          borderRadius: 8,
        }}
      >
        <typography.Caption2 style={{ color: colors.grey600, lineHeight: 18 }}>
          파란색 선은 복리 효과가 적용된 최종 금액이고, 회색 선은 투자한 원금이에요. 두 선의 간격이
          이자 수익이에요.
        </typography.Caption2>
      </View>
    </View>
  );
}
