/**
 * FeedbackAnalyzerSkill - 사용자 피드백 분석 스킬
 *
 * 사용자 피드백을 분석하고 개선점을 도출합니다.
 */

import BaseSkill from './BaseSkill';

export default class FeedbackAnalyzerSkill extends BaseSkill {
  constructor() {
    super({
      name: 'FeedbackAnalyzer',
      description: '사용자 피드백 분석 및 개선점 도출',
      version: '1.0.0',
      category: 'analysis',
      inputSchema: {
        feedbacks: { type: 'array', required: true, description: '피드백 목록' },
        idea: { type: 'object', required: false, description: '앱 아이디어 (컨텍스트용)' },
      },
      outputSchema: {
        summary: { type: 'object', description: '피드백 요약' },
        insights: { type: 'array', description: '인사이트' },
        recommendations: { type: 'array', description: '개선 권장사항' },
      },
    });

    // 감성 분석 키워드
    this.sentimentKeywords = {
      positive: ['좋아요', '최고', '편리', '유용', '만족', '추천', '좋습니다', '감사', '훌륭', '대박'],
      negative: ['불편', '어려워', '느려요', '버그', '오류', '실망', '별로', '안돼요', '문제', '짜증'],
      neutral: ['보통', '그냥', '평범', '무난'],
    };

    // 카테고리 키워드
    this.categoryKeywords = {
      ux: ['UI', 'UX', '디자인', '버튼', '화면', '인터페이스', '레이아웃', '색상'],
      performance: ['느려', '빨라', '로딩', '속도', '반응', '멈춤', '렉', '버벅'],
      feature: ['기능', '추가', '없어', '있으면', '원해', '필요'],
      bug: ['버그', '오류', '에러', '안돼', '작동', '문제', '고장'],
      content: ['콘텐츠', '내용', '정보', '데이터', '업데이트'],
    };
  }

  async execute(input, context = {}) {
    const { feedbacks, idea } = input;

    if (!feedbacks || feedbacks.length === 0) {
      return {
        summary: { totalCount: 0, message: '분석할 피드백이 없습니다.' },
        insights: [],
        recommendations: [],
      };
    }

    // 1. 피드백 전처리
    const processedFeedbacks = this.preprocessFeedbacks(feedbacks);

    // 2. 감성 분석
    const sentimentAnalysis = this.analyzeSentiment(processedFeedbacks);

    // 3. 카테고리 분류
    const categoryAnalysis = this.categorizeByTopic(processedFeedbacks);

    // 4. 키워드 추출
    const keywordAnalysis = this.extractKeywords(processedFeedbacks);

    // 5. 트렌드 분석 (시간순 변화)
    const trendAnalysis = this.analyzeTrends(processedFeedbacks);

    // 6. 인사이트 도출
    const insights = this.deriveInsights(
      sentimentAnalysis,
      categoryAnalysis,
      keywordAnalysis,
      idea
    );

    // 7. 개선 권장사항 생성
    const recommendations = this.generateRecommendations(insights, categoryAnalysis);

    // 8. 우선순위 점수 산출
    const prioritizedIssues = this.prioritizeIssues(categoryAnalysis, sentimentAnalysis);

    return {
      summary: {
        totalCount: feedbacks.length,
        sentimentDistribution: sentimentAnalysis.distribution,
        averageSentiment: sentimentAnalysis.average,
        topCategories: categoryAnalysis.topCategories,
        topKeywords: keywordAnalysis.topKeywords,
      },
      sentimentAnalysis,
      categoryAnalysis,
      keywordAnalysis,
      trendAnalysis,
      insights,
      recommendations,
      prioritizedIssues,
      rawAnalysis: {
        positiveFeedbacks: processedFeedbacks.filter((f) => f.sentiment === 'positive'),
        negativeFeedbacks: processedFeedbacks.filter((f) => f.sentiment === 'negative'),
      },
    };
  }

  preprocessFeedbacks(feedbacks) {
    return feedbacks.map((feedback, index) => {
      const text = typeof feedback === 'string' ? feedback : feedback.text || feedback.content;
      const date = feedback.date || feedback.createdAt || new Date().toISOString();
      const rating = feedback.rating || null;

      return {
        id: feedback.id || index,
        text,
        date,
        rating,
        cleanText: this.cleanText(text),
        wordCount: text.split(/\s+/).length,
      };
    });
  }

  cleanText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  analyzeSentiment(feedbacks) {
    const results = feedbacks.map((feedback) => {
      let positiveScore = 0;
      let negativeScore = 0;

      const text = feedback.cleanText;

      // 키워드 기반 점수
      for (const keyword of this.sentimentKeywords.positive) {
        if (text.includes(keyword)) positiveScore += 1;
      }
      for (const keyword of this.sentimentKeywords.negative) {
        if (text.includes(keyword)) negativeScore += 1;
      }

      // 평점 반영
      if (feedback.rating) {
        if (feedback.rating >= 4) positiveScore += 2;
        else if (feedback.rating <= 2) negativeScore += 2;
      }

      let sentiment = 'neutral';
      if (positiveScore > negativeScore) sentiment = 'positive';
      else if (negativeScore > positiveScore) sentiment = 'negative';

      const score = (positiveScore - negativeScore) / Math.max(1, positiveScore + negativeScore);

      return {
        ...feedback,
        sentiment,
        sentimentScore: score,
        positiveScore,
        negativeScore,
      };
    });

    const distribution = {
      positive: results.filter((r) => r.sentiment === 'positive').length,
      negative: results.filter((r) => r.sentiment === 'negative').length,
      neutral: results.filter((r) => r.sentiment === 'neutral').length,
    };

    const totalScore = results.reduce((sum, r) => sum + r.sentimentScore, 0);
    const average = results.length > 0 ? totalScore / results.length : 0;

    return {
      results,
      distribution,
      average: Math.round(average * 100) / 100,
      summary: average > 0.2 ? '전반적으로 긍정적' : average < -0.2 ? '개선이 필요함' : '보통',
    };
  }

  categorizeByTopic(feedbacks) {
    const categories = {};

    for (const category of Object.keys(this.categoryKeywords)) {
      categories[category] = {
        count: 0,
        feedbacks: [],
        sentiment: { positive: 0, negative: 0, neutral: 0 },
      };
    }

    for (const feedback of feedbacks) {
      const text = feedback.cleanText;

      for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
        const hasKeyword = keywords.some((k) => text.includes(k.toLowerCase()));

        if (hasKeyword) {
          categories[category].count++;
          categories[category].feedbacks.push(feedback);
          categories[category].sentiment[feedback.sentiment]++;
        }
      }
    }

    // 카테고리별 정렬
    const topCategories = Object.entries(categories)
      .filter(([_, data]) => data.count > 0)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, data]) => ({
        name,
        count: data.count,
        percentage: Math.round((data.count / feedbacks.length) * 100),
        sentimentRatio: data.count > 0
          ? Math.round((data.sentiment.negative / data.count) * 100)
          : 0,
      }));

    return {
      categories,
      topCategories,
    };
  }

  extractKeywords(feedbacks) {
    const wordFrequency = {};
    const stopWords = ['이', '가', '을', '를', '의', '에', '로', '으로', '은', '는', '도', '만', '요', '입니다', '있어요', '없어요'];

    for (const feedback of feedbacks) {
      const words = feedback.cleanText.split(/\s+/);

      for (const word of words) {
        if (word.length < 2 || stopWords.includes(word)) continue;

        if (!wordFrequency[word]) {
          wordFrequency[word] = {
            count: 0,
            sentiments: { positive: 0, negative: 0, neutral: 0 },
          };
        }

        wordFrequency[word].count++;
        wordFrequency[word].sentiments[feedback.sentiment]++;
      }
    }

    const topKeywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
      .map(([word, data]) => ({
        word,
        count: data.count,
        sentimentBias: data.sentiments.negative > data.sentiments.positive ? 'negative' : 'positive',
      }));

    return {
      wordFrequency,
      topKeywords,
    };
  }

  analyzeTrends(feedbacks) {
    // 날짜별 그룹화
    const byDate = {};

    for (const feedback of feedbacks) {
      const date = feedback.date.split('T')[0];

      if (!byDate[date]) {
        byDate[date] = { count: 0, sentimentSum: 0, feedbacks: [] };
      }

      byDate[date].count++;
      byDate[date].sentimentSum += feedback.sentimentScore || 0;
      byDate[date].feedbacks.push(feedback);
    }

    // 날짜순 정렬
    const trend = Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date,
        count: data.count,
        averageSentiment: Math.round((data.sentimentSum / data.count) * 100) / 100,
      }));

    // 트렌드 방향 계산
    let trendDirection = 'stable';
    if (trend.length >= 2) {
      const recent = trend.slice(-3);
      const older = trend.slice(0, 3);
      const recentAvg = recent.reduce((sum, t) => sum + t.averageSentiment, 0) / recent.length;
      const olderAvg = older.reduce((sum, t) => sum + t.averageSentiment, 0) / older.length;

      if (recentAvg - olderAvg > 0.1) trendDirection = 'improving';
      else if (recentAvg - olderAvg < -0.1) trendDirection = 'declining';
    }

    return {
      trend,
      trendDirection,
      summary: {
        improving: '최근 피드백이 긍정적으로 개선되고 있습니다.',
        declining: '최근 부정적인 피드백이 증가하고 있습니다. 주의가 필요합니다.',
        stable: '피드백 트렌드가 안정적입니다.',
      }[trendDirection],
    };
  }

  deriveInsights(sentimentAnalysis, categoryAnalysis, keywordAnalysis, idea) {
    const insights = [];

    // 감성 분석 기반 인사이트
    if (sentimentAnalysis.average < -0.2) {
      insights.push({
        type: 'warning',
        title: '전반적인 만족도 개선 필요',
        description: `부정적인 피드백 비율이 ${sentimentAnalysis.distribution.negative}건으로 높습니다.`,
        priority: 'high',
      });
    } else if (sentimentAnalysis.average > 0.3) {
      insights.push({
        type: 'success',
        title: '높은 사용자 만족도',
        description: '사용자들이 전반적으로 앱에 만족하고 있습니다.',
        priority: 'low',
      });
    }

    // 카테고리 기반 인사이트
    for (const category of categoryAnalysis.topCategories.slice(0, 3)) {
      if (category.sentimentRatio > 50) {
        insights.push({
          type: 'issue',
          title: `${this.getCategoryLabel(category.name)} 관련 이슈`,
          description: `${category.count}건의 피드백 중 ${category.sentimentRatio}%가 부정적입니다.`,
          category: category.name,
          priority: category.sentimentRatio > 70 ? 'high' : 'medium',
        });
      }
    }

    // 키워드 기반 인사이트
    const negativeKeywords = keywordAnalysis.topKeywords
      .filter((k) => k.sentimentBias === 'negative' && k.count >= 3);

    if (negativeKeywords.length > 0) {
      insights.push({
        type: 'pattern',
        title: '반복되는 불만 키워드',
        description: `"${negativeKeywords.map((k) => k.word).join('", "')}" 관련 불만이 자주 언급됩니다.`,
        keywords: negativeKeywords,
        priority: 'medium',
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  getCategoryLabel(category) {
    const labels = {
      ux: 'UI/UX',
      performance: '성능',
      feature: '기능',
      bug: '버그',
      content: '콘텐츠',
    };
    return labels[category] || category;
  }

  generateRecommendations(insights, categoryAnalysis) {
    const recommendations = [];

    for (const insight of insights) {
      if (insight.type === 'warning' || insight.type === 'issue') {
        let recommendation = null;

        switch (insight.category) {
          case 'ux':
            recommendation = {
              title: 'UX 개선 권장',
              actions: [
                '사용자 인터뷰를 통한 pain point 파악',
                'UI 컴포넌트 재검토 및 일관성 확보',
                '사용성 테스트 진행',
              ],
              effort: 'medium',
              impact: 'high',
            };
            break;
          case 'performance':
            recommendation = {
              title: '성능 최적화 필요',
              actions: [
                '번들 크기 분석 및 최적화',
                '이미지/리소스 lazy loading 적용',
                'API 응답 시간 모니터링 및 개선',
              ],
              effort: 'high',
              impact: 'high',
            };
            break;
          case 'bug':
            recommendation = {
              title: '버그 수정 우선',
              actions: [
                '에러 로그 분석 및 재현',
                '테스트 커버리지 확대',
                'QA 프로세스 강화',
              ],
              effort: 'varies',
              impact: 'critical',
            };
            break;
          case 'feature':
            recommendation = {
              title: '기능 개선/추가 검토',
              actions: [
                '요청된 기능 우선순위 정리',
                '경쟁사 벤치마킹',
                'MVP 범위 내 빠른 구현',
              ],
              effort: 'medium',
              impact: 'medium',
            };
            break;
          default:
            recommendation = {
              title: '일반 개선 사항',
              actions: [
                '피드백 패턴 심층 분석',
                '팀 내 논의를 통한 해결책 도출',
              ],
              effort: 'low',
              impact: 'medium',
            };
        }

        if (recommendation) {
          recommendations.push({
            ...recommendation,
            relatedInsight: insight.title,
            priority: insight.priority,
          });
        }
      }
    }

    return recommendations;
  }

  prioritizeIssues(categoryAnalysis, sentimentAnalysis) {
    const issues = [];

    for (const [category, data] of Object.entries(categoryAnalysis.categories)) {
      if (data.count === 0) continue;

      const negativeRatio = data.sentiment.negative / data.count;
      const volume = data.count;

      // 점수 계산: 부정 비율 * 볼륨
      const score = negativeRatio * Math.log(volume + 1) * 100;

      if (score > 10) {
        issues.push({
          category,
          label: this.getCategoryLabel(category),
          score: Math.round(score),
          negativeCount: data.sentiment.negative,
          totalCount: data.count,
          priority: score > 50 ? 'critical' : score > 30 ? 'high' : 'medium',
          sampleFeedbacks: data.feedbacks
            .filter((f) => f.sentiment === 'negative')
            .slice(0, 3)
            .map((f) => f.text),
        });
      }
    }

    return issues.sort((a, b) => b.score - a.score);
  }
}
