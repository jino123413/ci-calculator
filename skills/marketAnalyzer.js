/**
 * MarketAnalyzerSkill - 시장 및 경쟁 분석 스킬
 *
 * 앱 아이디어의 시장 잠재력, 경쟁 환경, 포지셔닝 전략을 분석합니다.
 */

import BaseSkill from './BaseSkill';

export default class MarketAnalyzerSkill extends BaseSkill {
  constructor() {
    super({
      name: 'MarketAnalyzer',
      description: '앱 아이디어의 시장 분석 및 경쟁 환경 평가',
      version: '1.0.0',
      category: 'analysis',
      inputSchema: {
        idea: { type: 'object', required: true, description: '분석할 앱 아이디어' },
        analysisDepth: { type: 'string', required: false, description: 'quick | standard | deep' },
      },
      outputSchema: {
        marketSize: { type: 'object', description: '시장 규모 분석' },
        competitors: { type: 'array', description: '경쟁사 분석' },
        opportunities: { type: 'array', description: '기회 요인' },
        threats: { type: 'array', description: '위협 요인' },
        positioning: { type: 'object', description: '포지셔닝 전략' },
      },
    });

    // 카테고리별 시장 데이터 (추정치)
    this.marketData = {
      finance: {
        marketSize: '국내 핀테크 시장 약 30조원 (2024)',
        growth: '연평균 15% 성장',
        keyPlayers: ['토스', '카카오뱅크', '네이버페이', '뱅크샐러드'],
        trends: ['MZ세대 금융', '자동화 투자', '마이크로 금융', '구독 경제'],
        userPain: ['복잡한 금융상품', '저축 동기 부족', '과소비', '금융 문맹'],
      },
      lifestyle: {
        marketSize: '국내 라이프스타일 앱 시장 약 5조원',
        growth: '연평균 12% 성장',
        keyPlayers: ['챌린저스', '루틴', '미라클 모닝'],
        trends: ['셀프케어', '마이크로 습관', '디지털 디톡스', '마음챙김'],
        userPain: ['습관 형성 실패', '동기부여 부족', '시간 관리', '스트레스'],
      },
      productivity: {
        marketSize: '국내 생산성 앱 시장 약 3조원',
        growth: '연평균 10% 성장',
        keyPlayers: ['노션', '슬랙', '투두이스트', '포레스트'],
        trends: ['AI 자동화', '노코드', '협업 도구', '딥워크'],
        userPain: ['미루기 습관', '집중력 저하', '정보 과부하', '회의 피로'],
      },
      social: {
        marketSize: '국내 소셜 플랫폼 시장 약 10조원',
        growth: '연평균 8% 성장',
        keyPlayers: ['인스타그램', '당근마켓', '소모임', '블라인드'],
        trends: ['버티컬 커뮤니티', '로컬 소셜', '익명성', '관계의 깊이'],
        userPain: ['관계 단절', '새 친구 사귀기', '소속감 부족', '신뢰 문제'],
      },
      learning: {
        marketSize: '국내 에듀테크 시장 약 8조원',
        growth: '연평균 18% 성장',
        keyPlayers: ['듀오링고', '클래스101', '밀리의서재', 'Coursera'],
        trends: ['마이크로러닝', 'AI 튜터', '게이미피케이션', '실시간 피드백'],
        userPain: ['시간 부족', '학습 지속 실패', '비용', '맞춤형 부족'],
      },
      commerce: {
        marketSize: '국내 이커머스 시장 약 200조원',
        growth: '연평균 10% 성장',
        keyPlayers: ['쿠팡', '네이버쇼핑', '무신사', '당근마켓'],
        trends: ['라이브커머스', '큐레이션', '공동구매', '중고거래'],
        userPain: ['가격 비교 피로', '충동구매', '배송 지연', '신뢰성'],
      },
    };

    // 앱인토스 특화 분석 요소
    this.tossEcosystem = {
      userBase: '월간 활성 사용자 2,000만+',
      demographics: 'MZ세대 중심 (20-40대)',
      strengths: ['간편 결제', '금융 데이터', '높은 신뢰도', '간편 인증'],
      appInTossOpportunities: [
        '기존 토스 사용자에게 즉각적 노출',
        '별도 설치 없이 바로 사용',
        '토스 금융 데이터와 연계 가능',
        '토스 UI/UX 일관성으로 진입 장벽 낮음',
      ],
    };
  }

  async execute(input, context = {}) {
    const { idea, analysisDepth = 'standard' } = input;
    const category = idea.category || 'lifestyle';

    // 1. 시장 규모 분석
    const marketSize = this.analyzeMarketSize(category, idea);

    // 2. 경쟁사 분석
    const competitors = this.analyzeCompetitors(category, idea);

    // 3. SWOT 분석
    const swot = this.performSWOT(idea, category);

    // 4. 기회 분석
    const opportunities = this.identifyOpportunities(idea, category);

    // 5. 위협 분석
    const threats = this.identifyThreats(idea, category);

    // 6. 포지셔닝 전략
    const positioning = this.developPositioning(idea, category, competitors);

    // 7. 시장 진입 전략
    const entryStrategy = this.developEntryStrategy(idea, category);

    // 8. 토스 생태계 분석
    const tossAnalysis = this.analyzeTossEcosystem(idea);

    // 9. 전체 점수 산출
    const marketScore = this.calculateMarketScore(
      marketSize,
      competitors,
      swot,
      opportunities,
      threats
    );

    return {
      marketSize,
      competitors,
      swot,
      opportunities,
      threats,
      positioning,
      entryStrategy,
      tossAnalysis,
      marketScore,
      recommendation: this.generateRecommendation(marketScore, idea),
    };
  }

  analyzeMarketSize(category, idea) {
    const data = this.marketData[category] || this.marketData.lifestyle;

    return {
      total: data.marketSize,
      growth: data.growth,
      tam: '전체 시장 (TAM): ' + data.marketSize,
      sam: `서비스 가능 시장 (SAM): 토스 사용자 중 ${category} 관심층 약 500만명`,
      som: '목표 시장 (SOM): 첫해 MAU 10만명, 연말 50만명',
      trends: data.trends,
      tossOpportunity: `토스 앱인토스 플랫폼 내 ${category} 카테고리 선점 가능`,
    };
  }

  analyzeCompetitors(category, idea) {
    const data = this.marketData[category] || this.marketData.lifestyle;

    const competitors = data.keyPlayers.map((name) => ({
      name,
      type: 'direct',
      strengths: this.inferCompetitorStrengths(name),
      weaknesses: this.inferCompetitorWeaknesses(name),
      marketShare: this.estimateMarketShare(name, category),
    }));

    // 간접 경쟁자 추가
    competitors.push({
      name: '기존 토스 기능',
      type: 'indirect',
      strengths: ['이미 설치됨', '높은 신뢰도'],
      weaknesses: ['전문 기능 부족', '커스터마이징 제한'],
      marketShare: 'N/A',
    });

    return {
      direct: competitors.filter((c) => c.type === 'direct'),
      indirect: competitors.filter((c) => c.type === 'indirect'),
      competitiveAdvantage: this.identifyCompetitiveAdvantage(idea),
      differentiators: [
        '토스 네이티브 경험',
        idea.features?.[0] || '핵심 차별화 기능',
        '간편한 접근성 (설치 불필요)',
        '토스 금융 데이터 연동',
      ],
    };
  }

  performSWOT(idea, category) {
    const data = this.marketData[category] || this.marketData.lifestyle;

    return {
      strengths: [
        '토스 플랫폼 내 즉각적 노출',
        '별도 앱 설치 불필요',
        '토스 인증/결제 연동 용이',
        `${idea.features?.[0] || '핵심 기능'}에 집중한 단순함`,
        'MZ세대 타겟 최적화',
      ],
      weaknesses: [
        '토스 앱 의존성',
        '제한된 네이티브 기능',
        '신규 브랜드 인지도 부족',
        '토스 정책 변경 리스크',
      ],
      opportunities: [
        '앱인토스 생태계 초기 시장 선점',
        ...data.trends.map((t) => `${t} 트렌드 활용`),
        '토스 사용자 기반 빠른 성장',
        '토스 프로모션/마케팅 지원',
      ],
      threats: [
        '유사 서비스 진입 가능성',
        '토스의 자체 기능화 가능성',
        '경쟁사의 앱인토스 진입',
        '사용자 앱 피로도',
      ],
    };
  }

  identifyOpportunities(idea, category) {
    const data = this.marketData[category] || this.marketData.lifestyle;

    return [
      {
        opportunity: '앱인토스 초기 시장 선점',
        impact: 'HIGH',
        timeframe: '즉시',
        description: '앱인토스 생태계가 성장하는 시점에 조기 진입하여 선점 효과',
      },
      {
        opportunity: '토스 사용자 기반 활용',
        impact: 'HIGH',
        timeframe: '단기',
        description: '2,000만+ 토스 사용자에게 자연스러운 노출 가능',
      },
      {
        opportunity: `${data.trends[0]} 트렌드 연계`,
        impact: 'MEDIUM',
        timeframe: '중기',
        description: `${data.trends[0]} 트렌드와 연계하여 시장 확대`,
      },
      {
        opportunity: '토스 금융 데이터 연동',
        impact: 'HIGH',
        timeframe: '중기',
        description: '토스의 금융 데이터를 활용한 차별화된 서비스',
      },
      {
        opportunity: '버티컬 커뮤니티 구축',
        impact: 'MEDIUM',
        timeframe: '장기',
        description: `${category} 관심사 기반 커뮤니티로 확장`,
      },
    ];
  }

  identifyThreats(idea, category) {
    return [
      {
        threat: '토스 자체 기능화',
        probability: 'MEDIUM',
        impact: 'HIGH',
        mitigation: '독자적인 사용자 기반 및 브랜드 구축, 빠른 혁신 속도 유지',
      },
      {
        threat: '경쟁 앱 진입',
        probability: 'HIGH',
        impact: 'MEDIUM',
        mitigation: '선점 효과 극대화, 지속적인 기능 개선, 사용자 로열티 구축',
      },
      {
        threat: '플랫폼 정책 변경',
        probability: 'LOW',
        impact: 'HIGH',
        mitigation: '토스 가이드라인 준수, 정책 변화 모니터링',
      },
      {
        threat: '사용자 피로도',
        probability: 'MEDIUM',
        impact: 'MEDIUM',
        mitigation: '과도한 알림 자제, 핵심 가치 집중, 사용자 피드백 반영',
      },
    ];
  }

  developPositioning(idea, category, competitors) {
    return {
      statement: `${idea.title}는 ${idea.target || '사용자'}를 위한 ${idea.description}로,
토스 앱 내에서 ${idea.features?.[0] || '핵심 기능'}을 가장 간편하게 제공합니다.`,
      targetSegment: idea.target || this.marketData[category]?.demographics,
      keyBenefit: `가장 간편한 ${category} 경험`,
      reasonToBelieve: [
        '토스 네이티브 앱으로 최적화된 UX',
        '3초 안에 시작할 수 있는 간편함',
        '토스 금융 데이터와의 자연스러운 연동',
      ],
      competitiveFrame: `기존 ${category} 앱 대비 진입장벽 90% 감소`,
      perceptualMap: {
        xAxis: '기능의 복잡도 (단순 ↔ 복합)',
        yAxis: '접근성 (어려움 ↔ 쉬움)',
        position: '단순 + 쉬움 영역 (우측 상단)',
        competitors: competitors.direct?.slice(0, 3).map((c) => ({
          name: c.name,
          position: '복합 + 중간 영역',
        })),
      },
    };
  }

  developEntryStrategy(idea, category) {
    return {
      phase1: {
        name: '소프트 런칭',
        duration: '4주',
        goals: ['핵심 기능 검증', '초기 사용자 피드백', '버그 수정'],
        tactics: [
          '베타 사용자 1,000명 모집',
          'SNS 바이럴 마케팅',
          '초기 사용자 인터뷰',
        ],
        kpis: ['DAU 500+', '리텐션 D7 > 20%'],
      },
      phase2: {
        name: '그로스 단계',
        duration: '8주',
        goals: ['사용자 확대', '기능 고도화', '바이럴 루프 구축'],
        tactics: [
          '토스 피처드 노출 추진',
          '인플루언서 협업',
          '친구 초대 이벤트',
          'A/B 테스트 최적화',
        ],
        kpis: ['MAU 50,000+', '리텐션 D30 > 15%'],
      },
      phase3: {
        name: '수익화 단계',
        duration: '지속',
        goals: ['수익 모델 검증', '지속 가능한 성장'],
        tactics: [
          '프리미엄 기능 출시',
          '광고 또는 제휴 모델',
          '구독 모델 테스트',
        ],
        kpis: ['ARPU 향상', 'LTV/CAC > 3'],
      },
    };
  }

  analyzeTossEcosystem(idea) {
    return {
      ...this.tossEcosystem,
      fitScore: this.calculateTossFit(idea),
      integrationOpportunities: [
        {
          feature: '토스 송금',
          applicability: idea.category === 'finance' || idea.category === 'social' ? 'HIGH' : 'MEDIUM',
          useCase: '친구 간 정산, 챌린지 보상 등',
        },
        {
          feature: '토스 결제',
          applicability: idea.category === 'commerce' ? 'HIGH' : 'MEDIUM',
          useCase: '프리미엄 기능 결제, 서비스 구매',
        },
        {
          feature: '토스 알림',
          applicability: 'HIGH',
          useCase: '리마인더, 업데이트 알림',
        },
        {
          feature: '토스 프로필',
          applicability: 'HIGH',
          useCase: '사용자 인증, 소셜 기능',
        },
      ],
      recommendedTossFeatures: this.recommendTossFeatures(idea),
    };
  }

  calculateTossFit(idea) {
    let score = 0;

    // 카테고리 적합성
    if (['finance', 'commerce'].includes(idea.category)) score += 30;
    else if (['lifestyle', 'productivity'].includes(idea.category)) score += 25;
    else score += 20;

    // 기능 단순성 (앱인토스 철학)
    if (idea.features?.length <= 4) score += 25;
    else if (idea.features?.length <= 6) score += 15;
    else score += 5;

    // MZ세대 타겟
    if (idea.target?.includes('20') || idea.target?.includes('30')) score += 20;
    else score += 10;

    // 습관성/리텐션 잠재력
    score += 15;

    // 토스 연동 가능성
    if (idea.tossIntegration?.length > 0) score += 10;

    return Math.min(100, score);
  }

  recommendTossFeatures(idea) {
    const recommendations = ['토스 로그인 (필수)'];

    if (idea.category === 'finance' || idea.category === 'commerce') {
      recommendations.push('토스페이 결제 연동');
      recommendations.push('토스 송금 기능');
    }

    if (idea.category === 'social') {
      recommendations.push('토스 친구 목록 연동');
      recommendations.push('토스 송금 (정산용)');
    }

    recommendations.push('토스 푸시 알림');

    return recommendations;
  }

  calculateMarketScore(marketSize, competitors, swot, opportunities, threats) {
    let score = 0;

    // 시장 매력도 (30점)
    if (marketSize.growth?.includes('15') || marketSize.growth?.includes('18')) score += 30;
    else if (marketSize.growth?.includes('10') || marketSize.growth?.includes('12')) score += 25;
    else score += 20;

    // 경쟁 환경 (25점)
    const competitorCount = competitors.direct?.length || 0;
    if (competitorCount <= 3) score += 25;
    else if (competitorCount <= 5) score += 20;
    else score += 15;

    // 기회 (25점)
    const highImpactOpps = opportunities.filter((o) => o.impact === 'HIGH').length;
    score += Math.min(25, highImpactOpps * 8);

    // 위협 (20점 감점 기준)
    const highRiskThreats = threats.filter(
      (t) => t.probability === 'HIGH' && t.impact === 'HIGH'
    ).length;
    score += 20 - highRiskThreats * 5;

    return {
      total: Math.min(100, Math.max(0, score)),
      breakdown: {
        marketAttractiveness: '시장 매력도',
        competitiveEnvironment: '경쟁 환경',
        opportunities: '기회 요인',
        threats: '위협 요인',
      },
      grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
    };
  }

  generateRecommendation(marketScore, idea) {
    const grade = marketScore.grade;

    const recommendations = {
      A: {
        verdict: '강력 추천',
        summary: `${idea.title}는 시장 잠재력이 매우 높습니다. 빠른 실행을 권장합니다.`,
        nextSteps: [
          'MVP 개발 즉시 시작',
          '소규모 베타 테스트 진행',
          '토스 담당자와 피처드 협의',
        ],
      },
      B: {
        verdict: '추천',
        summary: `${idea.title}는 좋은 기회입니다. 차별화 전략을 명확히 하면 성공 가능성이 높습니다.`,
        nextSteps: [
          '경쟁사 대비 차별점 강화',
          '타겟 사용자 니즈 검증',
          'MVP로 시장 반응 테스트',
        ],
      },
      C: {
        verdict: '조건부 추천',
        summary: `${idea.title}는 잠재력이 있으나 리스크 요소가 있습니다. 추가 검증이 필요합니다.`,
        nextSteps: [
          '타겟 사용자 인터뷰 진행',
          '경쟁사 분석 심화',
          '피봇 가능성 열어두기',
        ],
      },
      D: {
        verdict: '재검토 필요',
        summary: `${idea.title}는 현재 형태로는 리스크가 높습니다. 아이디어 수정을 권장합니다.`,
        nextSteps: [
          '문제 정의 재검토',
          '타겟 시장 재설정',
          '대안 아이디어 탐색',
        ],
      },
    };

    return recommendations[grade];
  }

  // 헬퍼 메서드들
  inferCompetitorStrengths(name) {
    const strengths = {
      토스: ['높은 사용자 기반', '강력한 브랜드'],
      카카오뱅크: ['카카오 생태계', '편리한 UX'],
      네이버페이: ['네이버 연동', '포인트 시스템'],
      뱅크샐러드: ['데이터 분석', '금융 통합'],
      챌린저스: ['챌린지 전문성', '커뮤니티'],
      노션: ['올인원 솔루션', '협업 기능'],
      듀오링고: ['게이미피케이션', '글로벌 콘텐츠'],
    };
    return strengths[name] || ['인지도', '기존 사용자'];
  }

  inferCompetitorWeaknesses(name) {
    return ['복잡한 기능', '높은 학습 곡선', '무거운 앱 용량'];
  }

  estimateMarketShare(name, category) {
    const shares = {
      토스: '35%',
      카카오뱅크: '25%',
      네이버페이: '20%',
    };
    return shares[name] || '5-10%';
  }

  identifyCompetitiveAdvantage(idea) {
    return [
      '토스 네이티브 앱으로 최적화된 성능',
      '설치 없이 바로 사용 가능',
      `${idea.features?.[0] || '핵심 기능'}에 집중한 단순함`,
      '토스 사용자에게 자연스러운 접근성',
    ];
  }
}
