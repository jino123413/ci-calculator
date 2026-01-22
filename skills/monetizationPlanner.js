/**
 * MonetizationPlannerSkill - 수익화 전략 스킬
 *
 * 앱 아이디어에 적합한 수익화 모델과 전략을 제안합니다.
 */

import BaseSkill from './BaseSkill';

export default class MonetizationPlannerSkill extends BaseSkill {
  constructor() {
    super({
      name: 'MonetizationPlanner',
      description: '앱인토스 미니앱의 수익화 모델 및 전략 수립',
      version: '1.0.0',
      category: 'business',
      inputSchema: {
        idea: { type: 'object', required: true, description: '앱 아이디어' },
        targetRevenue: { type: 'string', required: false, description: '목표 수익 규모' },
        userBase: { type: 'number', required: false, description: '예상 사용자 수' },
      },
      outputSchema: {
        primaryModel: { type: 'object', description: '주요 수익 모델' },
        secondaryModels: { type: 'array', description: '보조 수익 모델' },
        projections: { type: 'object', description: '수익 예측' },
        implementation: { type: 'object', description: '구현 가이드' },
      },
    });

    // 수익화 모델 데이터베이스
    this.monetizationModels = {
      freemium: {
        name: '프리미엄 (Freemium)',
        description: '기본 무료 + 프리미엄 기능 유료',
        pros: ['낮은 진입 장벽', '넓은 사용자 기반', '업셀 기회'],
        cons: ['낮은 전환율 (2-5%)', '무료 사용자 서버 비용'],
        bestFor: ['생산성', '라이프스타일', '학습'],
        conversionRate: { low: 0.02, mid: 0.03, high: 0.05 },
        arpu: { low: 3000, mid: 5000, high: 9900 },
        examples: ['프리미엄 기능 잠금 해제', '광고 제거', '고급 분석'],
      },
      subscription: {
        name: '구독 (Subscription)',
        description: '월/연 정기 결제',
        pros: ['안정적 수익', '높은 LTV', '예측 가능'],
        cons: ['높은 해지율 관리 필요', '가치 증명 필수'],
        bestFor: ['콘텐츠', '학습', '생산성'],
        conversionRate: { low: 0.01, mid: 0.025, high: 0.04 },
        arpu: { low: 4900, mid: 9900, high: 19900 },
        examples: ['월간/연간 구독', '티어별 플랜'],
      },
      inAppPurchase: {
        name: '인앱 구매',
        description: '일회성 아이템/기능 구매',
        pros: ['즉각적 수익', '유연한 가격 설정'],
        cons: ['지속적 콘텐츠 필요', '변동성'],
        bestFor: ['게임', '커스터마이징', '콘텐츠'],
        conversionRate: { low: 0.015, mid: 0.03, high: 0.05 },
        arpu: { low: 1000, mid: 3000, high: 10000 },
        examples: ['테마 구매', '아이템 구매', '기능 해금'],
      },
      advertising: {
        name: '광고',
        description: '배너, 네이티브, 리워드 광고',
        pros: ['완전 무료 서비스 가능', '스케일에 비례'],
        cons: ['UX 저하', '수익 한계'],
        bestFor: ['미디어', '유틸리티', '게임'],
        rpm: { low: 500, mid: 2000, high: 5000 }, // 1000회 노출당
        examples: ['배너 광고', '네이티브 광고', '리워드 비디오'],
      },
      affiliate: {
        name: '제휴/커미션',
        description: '제품/서비스 추천 수수료',
        pros: ['높은 마진', '사용자 부담 없음'],
        cons: ['제휴 확보 필요', '신뢰성 관리'],
        bestFor: ['금융', '커머스', '여행'],
        commissionRate: { low: 0.01, mid: 0.03, high: 0.1 },
        examples: ['상품 추천', '금융상품 추천', '서비스 소개'],
      },
      transaction: {
        name: '거래 수수료',
        description: '거래/중개 수수료',
        pros: ['사용에 비례', '확장성'],
        cons: ['거래량 필요', '경쟁 압박'],
        bestFor: ['커머스', '공동구매', 'P2P'],
        feeRate: { low: 0.01, mid: 0.03, high: 0.05 },
        examples: ['판매 수수료', '정산 수수료', '중개료'],
      },
      b2b: {
        name: 'B2B/엔터프라이즈',
        description: '기업 대상 솔루션 판매',
        pros: ['높은 객단가', '안정적 계약'],
        cons: ['긴 영업 주기', '커스터마이징 요구'],
        bestFor: ['생산성', 'HR', '협업'],
        arpu: { low: 50000, mid: 200000, high: 1000000 },
        examples: ['팀 플랜', '기업 라이선스', 'API 제공'],
      },
    };

    // 카테고리별 추천 모델
    this.categoryRecommendations = {
      finance: ['freemium', 'affiliate', 'subscription'],
      lifestyle: ['freemium', 'subscription', 'inAppPurchase'],
      productivity: ['freemium', 'subscription', 'b2b'],
      social: ['freemium', 'advertising', 'inAppPurchase'],
      learning: ['subscription', 'freemium', 'inAppPurchase'],
      commerce: ['affiliate', 'transaction', 'advertising'],
    };
  }

  async execute(input, context = {}) {
    const { idea, targetRevenue = 'medium', userBase = 10000 } = input;
    const category = idea.category || 'lifestyle';

    // 1. 적합한 수익 모델 분석
    const modelAnalysis = this.analyzeModels(idea, category);

    // 2. 주요 수익 모델 선정
    const primaryModel = this.selectPrimaryModel(modelAnalysis, idea);

    // 3. 보조 수익 모델 선정
    const secondaryModels = this.selectSecondaryModels(modelAnalysis, primaryModel);

    // 4. 가격 전략 수립
    const pricingStrategy = this.developPricingStrategy(primaryModel, idea, category);

    // 5. 수익 예측
    const projections = this.calculateProjections(
      primaryModel,
      secondaryModels,
      userBase,
      pricingStrategy
    );

    // 6. 구현 로드맵
    const implementation = this.createImplementationPlan(primaryModel, secondaryModels);

    // 7. 프리미엄 기능 제안
    const premiumFeatures = this.suggestPremiumFeatures(idea);

    // 8. KPI 설정
    const kpis = this.defineKPIs(primaryModel, projections);

    return {
      modelAnalysis,
      primaryModel: {
        ...primaryModel,
        pricingStrategy,
      },
      secondaryModels,
      projections,
      implementation,
      premiumFeatures,
      kpis,
      recommendation: this.generateRecommendation(primaryModel, projections),
    };
  }

  analyzeModels(idea, category) {
    const recommendedModels = this.categoryRecommendations[category] || ['freemium'];
    const analysis = [];

    for (const modelKey of Object.keys(this.monetizationModels)) {
      const model = this.monetizationModels[modelKey];
      const fitScore = this.calculateModelFit(model, idea, category, recommendedModels);

      analysis.push({
        key: modelKey,
        ...model,
        fitScore,
        isRecommended: recommendedModels.includes(modelKey),
      });
    }

    return analysis.sort((a, b) => b.fitScore - a.fitScore);
  }

  calculateModelFit(model, idea, category, recommendedModels) {
    let score = 0;

    // 카테고리 추천 여부 (40점)
    if (model.bestFor.includes(category)) score += 40;
    else if (model.bestFor.some((c) => this.isRelatedCategory(c, category))) score += 20;

    // 기능과의 적합성 (30점)
    if (idea.features) {
      const featureText = idea.features.join(' ').toLowerCase();
      if (featureText.includes('프리미엄') && model.name.includes('프리미엄')) score += 30;
      if (featureText.includes('구독') && model.name.includes('구독')) score += 30;
      if (featureText.includes('광고') && model.name.includes('광고')) score += 30;
    }

    // 타겟 사용자 적합성 (20점)
    if (idea.target) {
      const targetLower = idea.target.toLowerCase();
      if (targetLower.includes('직장인') && model.name === 'B2B/엔터프라이즈') score += 20;
      if (targetLower.includes('학생') && model.name.includes('프리미엄')) score += 20;
    }

    // 앱인토스 적합성 (10점)
    if (['freemium', 'subscription', 'inAppPurchase'].includes(model.key)) score += 10;

    return Math.min(100, score);
  }

  isRelatedCategory(modelCategory, ideaCategory) {
    const relations = {
      생산성: ['productivity', 'learning'],
      콘텐츠: ['learning', 'lifestyle'],
      게임: ['lifestyle', 'social'],
      미디어: ['social', 'learning'],
    };

    for (const [key, values] of Object.entries(relations)) {
      if (modelCategory.includes(key) && values.includes(ideaCategory)) return true;
    }
    return false;
  }

  selectPrimaryModel(modelAnalysis, idea) {
    const topModel = modelAnalysis[0];

    return {
      key: topModel.key,
      name: topModel.name,
      description: topModel.description,
      pros: topModel.pros,
      cons: topModel.cons,
      fitScore: topModel.fitScore,
      rationale: `${idea.title}의 카테고리(${idea.category})와 타겟 사용자(${idea.target})를 고려할 때, ${topModel.name} 모델이 가장 적합합니다.`,
    };
  }

  selectSecondaryModels(modelAnalysis, primaryModel) {
    return modelAnalysis
      .filter((m) => m.key !== primaryModel.key && m.fitScore >= 40)
      .slice(0, 2)
      .map((m) => ({
        key: m.key,
        name: m.name,
        description: m.description,
        fitScore: m.fitScore,
        synergy: this.assessSynergy(primaryModel.key, m.key),
      }));
  }

  assessSynergy(primary, secondary) {
    const synergies = {
      'freemium-advertising': 'HIGH - 무료 사용자에게 광고 노출',
      'freemium-affiliate': 'MEDIUM - 프리미엄 사용자에게 제휴 제안',
      'subscription-b2b': 'HIGH - 개인에서 팀으로 확장',
      'advertising-affiliate': 'MEDIUM - 광고와 제휴 병행',
    };

    return synergies[`${primary}-${secondary}`] || synergies[`${secondary}-${primary}`] || 'LOW';
  }

  developPricingStrategy(primaryModel, idea, category) {
    const model = this.monetizationModels[primaryModel.key];

    if (primaryModel.key === 'freemium' || primaryModel.key === 'subscription') {
      return {
        tiers: [
          {
            name: 'Free',
            price: 0,
            features: ['기본 기능 모두 사용', '제한된 사용량', '광고 포함'],
            target: '대부분의 사용자',
          },
          {
            name: 'Pro',
            price: model.arpu?.mid || 5900,
            billing: 'monthly',
            features: ['모든 기능 잠금 해제', '광고 제거', '우선 지원'],
            target: '헤비 유저',
            recommended: true,
          },
          {
            name: 'Pro (연간)',
            price: (model.arpu?.mid || 5900) * 10,
            billing: 'yearly',
            features: ['Pro 기능 + 2개월 무료', '독점 기능 조기 접근'],
            target: '장기 사용자',
            discount: '17% 할인',
          },
        ],
        positioning: 'Value-based Pricing',
        competitorComparison: '유사 서비스 대비 20-30% 저렴',
        promotions: [
          '첫 달 50% 할인',
          '친구 초대 시 1개월 무료',
          '연간 결제 시 2개월 추가',
        ],
      };
    }

    if (primaryModel.key === 'advertising') {
      return {
        adTypes: [
          { type: '배너 광고', placement: '하단 고정', rpm: 1000 },
          { type: '네이티브 광고', placement: '피드 내', rpm: 2500 },
          { type: '리워드 비디오', placement: '보상 획득 시', rpm: 5000 },
        ],
        frequency: '세션당 최대 3회',
        userExperience: '핵심 기능에는 광고 없음',
      };
    }

    if (primaryModel.key === 'affiliate') {
      return {
        partnerTypes: ['금융상품', '관련 서비스', '이커머스'],
        commissionStructure: {
          cpa: '가입/구매당 1,000-10,000원',
          revShare: '거래 금액의 1-5%',
        },
        disclosure: '제휴 마케팅 명시 (법적 요구사항)',
      };
    }

    return {
      note: '상세 가격 전략은 시장 테스트 후 조정 권장',
    };
  }

  calculateProjections(primaryModel, secondaryModels, userBase, pricingStrategy) {
    const model = this.monetizationModels[primaryModel.key];
    const scenarios = {};

    // 시나리오별 예측
    ['conservative', 'moderate', 'optimistic'].forEach((scenario) => {
      const multiplier = { conservative: 0.7, moderate: 1, optimistic: 1.5 }[scenario];

      let monthlyRevenue = 0;
      let conversionRate = 0;

      if (model.conversionRate) {
        conversionRate = model.conversionRate.mid * multiplier;
        const payingUsers = Math.floor(userBase * conversionRate);
        const arpu = pricingStrategy.tiers?.[1]?.price || model.arpu?.mid || 5000;
        monthlyRevenue = payingUsers * arpu;
      } else if (model.rpm) {
        // 광고 모델
        const dailyViews = userBase * 5; // 1인당 5회 노출 가정
        const monthlyViews = dailyViews * 30;
        monthlyRevenue = (monthlyViews / 1000) * (model.rpm.mid * multiplier);
      } else if (model.feeRate) {
        // 거래 수수료 모델
        const avgTransaction = 30000;
        const transactionsPerUser = 2;
        const monthlyGMV = userBase * avgTransaction * transactionsPerUser * 0.3; // 30% 활성
        monthlyRevenue = monthlyGMV * (model.feeRate.mid * multiplier);
      }

      scenarios[scenario] = {
        monthlyRevenue: Math.round(monthlyRevenue),
        yearlyRevenue: Math.round(monthlyRevenue * 12),
        payingUsers: model.conversionRate
          ? Math.floor(userBase * conversionRate)
          : 'N/A',
        conversionRate: model.conversionRate
          ? (conversionRate * 100).toFixed(2) + '%'
          : 'N/A',
      };
    });

    return {
      userBase,
      scenarios,
      growthAssumptions: {
        userGrowth: '월 10% 성장 가정',
        conversionImprovement: '분기별 0.5%p 개선 가정',
      },
      breakeven: this.calculateBreakeven(scenarios.moderate.monthlyRevenue),
    };
  }

  calculateBreakeven(monthlyRevenue) {
    const estimatedMonthlyCosts = {
      server: 100000,
      marketing: 500000,
      operation: 200000,
      total: 800000,
    };

    const monthsToBreakeven =
      monthlyRevenue > 0
        ? Math.ceil(estimatedMonthlyCosts.total / monthlyRevenue)
        : 'N/A';

    return {
      estimatedMonthlyCosts,
      monthsToBreakeven,
      note: monthsToBreakeven !== 'N/A' && monthsToBreakeven <= 12
        ? '1년 내 손익분기 달성 가능'
        : '초기 투자 또는 사용자 확대 필요',
    };
  }

  createImplementationPlan(primaryModel, secondaryModels) {
    const phases = [
      {
        phase: 'Phase 1: MVP (무료)',
        duration: '0-2개월',
        focus: '사용자 확보 및 제품 검증',
        monetization: '수익화 없음 (사용자 경험 우선)',
        goals: ['MAU 1,000명', '핵심 기능 검증', '사용자 피드백 수집'],
      },
      {
        phase: 'Phase 2: 소프트 런칭',
        duration: '2-4개월',
        focus: '수익 모델 테스트',
        monetization: `${primaryModel.name} 모델 도입`,
        goals: ['유료 전환 테스트', '가격 최적화', 'MAU 5,000명'],
      },
      {
        phase: 'Phase 3: 스케일업',
        duration: '4-8개월',
        focus: '수익 극대화',
        monetization: secondaryModels.length > 0
          ? `${secondaryModels[0].name} 병행`
          : '주력 모델 최적화',
        goals: ['MAU 20,000명', '월 매출 500만원', 'LTV/CAC > 3'],
      },
    ];

    return {
      phases,
      paymentIntegration: {
        recommended: '토스페이먼츠',
        alternatives: ['아임포트', 'Stripe'],
        features: ['정기 결제', '인앱 결제', '간편 결제'],
      },
      legalRequirements: [
        '전자상거래법 준수',
        '환불 정책 명시',
        '개인정보처리방침',
        '자동결제 동의 절차',
      ],
    };
  }

  suggestPremiumFeatures(idea) {
    const baseFeatures = idea.features || [];

    return {
      mustHave: [
        '광고 제거',
        '무제한 사용',
        '데이터 내보내기',
      ],
      recommended: [
        `${baseFeatures[0] || '핵심 기능'} 고급 옵션`,
        '상세 분석 리포트',
        '우선 고객 지원',
        '얼리 엑세스',
      ],
      premium: [
        'API 접근',
        '팀 협업 기능',
        '맞춤 설정',
        '데이터 백업',
      ],
      freeVsPaid: {
        free: ['기본 기능', '제한된 사용량', '기본 지원'],
        paid: ['전체 기능', '무제한 사용', '우선 지원', '광고 없음'],
      },
    };
  }

  defineKPIs(primaryModel, projections) {
    return {
      acquisition: [
        { metric: 'MAU', target: '10,000+', period: '6개월' },
        { metric: 'DAU/MAU', target: '30%+', period: '3개월' },
        { metric: 'CAC', target: '< 5,000원', period: 'ongoing' },
      ],
      conversion: [
        { metric: '무료→유료 전환율', target: '3%+', period: '6개월' },
        { metric: '평균 전환 기간', target: '< 14일', period: 'ongoing' },
      ],
      revenue: [
        { metric: 'MRR', target: projections.scenarios.moderate.monthlyRevenue, period: '6개월' },
        { metric: 'ARPU', target: '5,000원+', period: 'ongoing' },
        { metric: 'LTV', target: '50,000원+', period: '12개월' },
      ],
      retention: [
        { metric: 'D7 Retention', target: '40%+', period: '3개월' },
        { metric: 'D30 Retention', target: '20%+', period: '6개월' },
        { metric: '구독 유지율', target: '85%+', period: 'monthly' },
      ],
    };
  }

  generateRecommendation(primaryModel, projections) {
    const monthlyRevenue = projections.scenarios.moderate.monthlyRevenue;

    return {
      summary: `${primaryModel.name} 모델을 주력으로 시작하는 것을 권장합니다.`,
      rationale: primaryModel.rationale,
      expectedOutcome: `예상 월 매출: ${monthlyRevenue.toLocaleString()}원 (사용자 ${projections.userBase.toLocaleString()}명 기준)`,
      nextSteps: [
        '무료 버전으로 사용자 확보 우선',
        'PMF 달성 후 유료 기능 도입',
        '가격 A/B 테스트로 최적점 탐색',
        '보조 수익 모델 점진적 도입',
      ],
      risks: [
        '초기 무료 사용자 이탈 가능',
        '경쟁사 가격 압박',
        '플랫폼 정책 변경',
      ],
      mitigation: [
        '강력한 무료 기능으로 습관화',
        '차별화된 프리미엄 가치 제공',
        '다양한 수익원 확보',
      ],
    };
  }
}
