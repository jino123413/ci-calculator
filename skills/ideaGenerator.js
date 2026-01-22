/**
 * IdeaGeneratorSkill - AI 기반 앱 아이디어 생성 스킬
 *
 * 사용자의 관심사, 키워드, 트렌드를 분석하여
 * 앱인토스에 최적화된 미니앱 아이디어를 생성합니다.
 */

import BaseSkill from './BaseSkill';

export default class IdeaGeneratorSkill extends BaseSkill {
  constructor() {
    super({
      name: 'IdeaGenerator',
      description: '사용자 입력 기반 앱인토스 미니앱 아이디어 생성',
      version: '1.0.0',
      category: 'ideation',
      inputSchema: {
        keywords: { type: 'array', required: false, description: '관심 키워드 목록' },
        category: { type: 'string', required: false, description: '앱 카테고리' },
        targetUsers: { type: 'string', required: false, description: '타겟 사용자' },
        problemToSolve: { type: 'string', required: false, description: '해결하고자 하는 문제' },
        preferences: { type: 'object', required: false, description: '선호 설정' },
      },
      outputSchema: {
        ideas: { type: 'array', description: '생성된 아이디어 목록' },
        reasoning: { type: 'string', description: '아이디어 생성 근거' },
      },
    });

    // 카테고리별 아이디어 패턴
    this.ideaPatterns = {
      finance: [
        { pattern: '절약 + 게이미피케이션', examples: ['소비 챌린지', '저축 게임'] },
        { pattern: '가계부 + 자동화', examples: ['자동 분류', 'AI 예산'] },
        { pattern: '투자 + 교육', examples: ['모의 투자', '금융 퀴즈'] },
        { pattern: '결제 + 최적화', examples: ['할부 계산기', '카드 혜택 비교'] },
        { pattern: '공유 + 정산', examples: ['더치페이', '모임 통장 관리'] },
      ],
      lifestyle: [
        { pattern: '습관 + 트래킹', examples: ['루틴 메이트', '습관 스코어'] },
        { pattern: '일기 + 감정', examples: ['감사 일기', '무드 트래커'] },
        { pattern: '건강 + 리마인더', examples: ['물 마시기', '스트레칭 알림'] },
        { pattern: '취미 + 기록', examples: ['독서 기록', '영화 리뷰'] },
        { pattern: '목표 + 성취', examples: ['버킷리스트', '30일 챌린지'] },
      ],
      productivity: [
        { pattern: '집중 + 타이머', examples: ['5분 집중', '포모도로 라이트'] },
        { pattern: '메모 + 정리', examples: ['빠른 메모', 'AI 요약'] },
        { pattern: '일정 + 우선순위', examples: ['시간 경매', '투두 랭킹'] },
        { pattern: '회의 + 기록', examples: ['회의록 정리', '액션아이템 추출'] },
        { pattern: '학습 + 반복', examples: ['플래시카드', '간격 복습'] },
      ],
      social: [
        { pattern: '질문 + 대화', examples: ['질문 릴레이', '대화 주제 생성'] },
        { pattern: '매칭 + 관심사', examples: ['취미 친구', '동네 모임'] },
        { pattern: '공유 + 나눔', examples: ['품앗이', '재능 교환'] },
        { pattern: '투표 + 의견', examples: ['그룹 투표', '익명 피드백'] },
        { pattern: '챌린지 + 경쟁', examples: ['그룹 챌린지', '팀 대결'] },
      ],
      learning: [
        { pattern: '마이크로 + 학습', examples: ['3분 지식', '한입 강의'] },
        { pattern: '언어 + 일상', examples: ['오늘의 영단어', '생활 표현'] },
        { pattern: '퀴즈 + 보상', examples: ['상식 퀴즈', '지식 배틀'] },
        { pattern: '멘토링 + Q&A', examples: ['전문가 질문', '1:1 조언'] },
        { pattern: '스킬 + 인증', examples: ['기술 뱃지', '학습 포트폴리오'] },
      ],
      commerce: [
        { pattern: '비교 + 추천', examples: ['가격 비교', '리뷰 요약'] },
        { pattern: '알림 + 가격', examples: ['가격 추적', '할인 알림'] },
        { pattern: '공동구매 + 로컬', examples: ['동네 공구', '그룹 할인'] },
        { pattern: '절약 + 행동', examples: ['충동구매 방지', '대기 챌린지'] },
        { pattern: '리뷰 + 신뢰', examples: ['진짜 리뷰', '구매 인증'] },
      ],
    };

    // 트렌드 키워드
    this.trendKeywords = [
      { keyword: 'AI', weight: 1.5, combinations: ['자동화', '추천', '분석', '예측'] },
      { keyword: '숏폼', weight: 1.3, combinations: ['짧은', '빠른', '마이크로'] },
      { keyword: 'MZ세대', weight: 1.2, combinations: ['재미', '공유', '인증'] },
      { keyword: '친환경', weight: 1.1, combinations: ['지속가능', '에코', '절약'] },
      { keyword: '로컬', weight: 1.2, combinations: ['동네', '지역', '근처'] },
      { keyword: '웰니스', weight: 1.3, combinations: ['건강', '마음', '휴식'] },
      { keyword: '소셜', weight: 1.2, combinations: ['함께', '공유', '연결'] },
    ];

    // 앱인토스 특화 제약조건
    this.constraints = {
      maxFeatures: 4,
      focusOnSimplicity: true,
      requireTossIntegration: true,
      quickValueDelivery: true,
      habitFormation: true,
    };
  }

  async execute(input, context = {}) {
    const {
      keywords = [],
      category = null,
      targetUsers = null,
      problemToSolve = null,
      preferences = {},
    } = input;

    const ideas = [];
    const reasoning = [];

    // 1. 카테고리 기반 아이디어 생성
    if (category && this.ideaPatterns[category]) {
      const categoryIdeas = this.generateCategoryIdeas(category, keywords);
      ideas.push(...categoryIdeas);
      reasoning.push(`카테고리 '${category}'에서 ${categoryIdeas.length}개의 아이디어 생성`);
    }

    // 2. 키워드 기반 아이디어 생성
    if (keywords.length > 0) {
      const keywordIdeas = this.generateKeywordIdeas(keywords);
      ideas.push(...keywordIdeas);
      reasoning.push(`키워드 분석을 통해 ${keywordIdeas.length}개의 아이디어 도출`);
    }

    // 3. 문제 해결 기반 아이디어 생성
    if (problemToSolve) {
      const problemIdeas = this.generateProblemSolvingIdeas(problemToSolve);
      ideas.push(...problemIdeas);
      reasoning.push(`문제 해결 관점에서 ${problemIdeas.length}개의 아이디어 제안`);
    }

    // 4. 트렌드 반영
    const trendEnhancedIdeas = this.applyTrends(ideas);

    // 5. 앱인토스 최적화 적용
    const optimizedIdeas = this.optimizeForToss(trendEnhancedIdeas);

    // 6. 중복 제거 및 정렬
    const uniqueIdeas = this.deduplicateAndRank(optimizedIdeas, preferences);

    // 7. 타겟 사용자 맞춤화
    const finalIdeas = targetUsers
      ? this.customizeForTarget(uniqueIdeas, targetUsers)
      : uniqueIdeas;

    return {
      ideas: finalIdeas.slice(0, 10),
      reasoning: reasoning.join('. '),
      metadata: {
        totalGenerated: ideas.length,
        afterDedup: uniqueIdeas.length,
        finalCount: finalIdeas.length,
        appliedFilters: Object.keys(preferences),
      },
    };
  }

  generateCategoryIdeas(category, keywords) {
    const patterns = this.ideaPatterns[category] || [];
    const ideas = [];

    for (const { pattern, examples } of patterns) {
      const [concept1, concept2] = pattern.split(' + ');

      ideas.push({
        title: this.generateTitle(concept1, concept2, keywords),
        description: this.generateDescription(concept1, concept2),
        category,
        pattern,
        features: this.generateFeatures(concept1, concept2),
        target: this.inferTarget(category),
        revenue: this.suggestRevenue(category),
        complexity: this.assessComplexity(pattern),
        tossIntegration: this.suggestTossIntegration(category),
        score: 0.7 + Math.random() * 0.3,
      });
    }

    return ideas;
  }

  generateKeywordIdeas(keywords) {
    const ideas = [];
    const combinations = this.generateCombinations(keywords, 2);

    for (const combo of combinations.slice(0, 5)) {
      const matchedCategory = this.findMatchingCategory(combo);

      ideas.push({
        title: this.generateTitleFromKeywords(combo),
        description: `${combo.join('과 ')}를 결합한 새로운 서비스`,
        category: matchedCategory,
        keywords: combo,
        features: this.generateFeaturesFromKeywords(combo),
        target: '관련 관심사를 가진 사용자',
        revenue: '프리미엄 기능 구독',
        complexity: 'medium',
        tossIntegration: ['토스 로그인', '결제 연동'],
        score: 0.6 + Math.random() * 0.3,
      });
    }

    return ideas;
  }

  generateProblemSolvingIdeas(problem) {
    const problemKeywords = this.extractKeywords(problem);
    const ideas = [];

    // 문제 유형 분류
    const problemType = this.classifyProblem(problem);

    const solutions = {
      time: ['자동화', '리마인더', '간소화', '템플릿'],
      money: ['비교', '추적', '알림', '절약'],
      habit: ['트래킹', '챌린지', '보상', '커뮤니티'],
      social: ['매칭', '공유', '그룹', '피드백'],
      learning: ['마이크로 러닝', '퀴즈', '반복', '게이미피케이션'],
    };

    const relevantSolutions = solutions[problemType] || solutions.habit;

    for (const solution of relevantSolutions.slice(0, 2)) {
      ideas.push({
        title: `${problemKeywords[0] || '스마트'} ${solution}`,
        description: `'${problem.slice(0, 30)}...' 문제를 ${solution}로 해결`,
        category: this.findMatchingCategory(problemKeywords),
        problemStatement: problem,
        solution,
        features: [
          `${solution} 핵심 기능`,
          '간편한 사용성',
          '진행 상황 확인',
          '알림 기능',
        ],
        target: '해당 문제를 겪는 사용자',
        revenue: '프리미엄 기능 또는 광고',
        complexity: 'medium',
        score: 0.65 + Math.random() * 0.25,
      });
    }

    return ideas;
  }

  applyTrends(ideas) {
    return ideas.map((idea) => {
      const applicableTrends = this.trendKeywords.filter((trend) =>
        trend.combinations.some(
          (combo) =>
            idea.title.includes(combo) ||
            idea.description.includes(combo) ||
            (idea.features && idea.features.some((f) => f.includes(combo)))
        )
      );

      if (applicableTrends.length > 0) {
        const trendBoost = applicableTrends.reduce((sum, t) => sum + t.weight - 1, 0);
        return {
          ...idea,
          score: Math.min(1, idea.score + trendBoost * 0.1),
          trends: applicableTrends.map((t) => t.keyword),
        };
      }

      return idea;
    });
  }

  optimizeForToss(ideas) {
    return ideas.map((idea) => ({
      ...idea,
      tossOptimization: {
        quickStart: '앱 실행 후 3초 내 핵심 기능 접근 가능',
        simpleUI: '최소한의 화면으로 목표 달성',
        tossDesign: '토스 디자인 시스템 적용',
        financialLink: '토스 금융 데이터 연계 가능성',
      },
      features: idea.features.slice(0, this.constraints.maxFeatures),
    }));
  }

  deduplicateAndRank(ideas, preferences) {
    // 제목 기반 중복 제거
    const seen = new Set();
    const unique = ideas.filter((idea) => {
      const key = idea.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // 점수 기반 정렬
    return unique.sort((a, b) => b.score - a.score);
  }

  customizeForTarget(ideas, targetUsers) {
    const targetLower = targetUsers.toLowerCase();

    const targetModifiers = {
      '20대': { tone: 'casual', features: ['소셜 공유', '게이미피케이션'] },
      '30대': { tone: 'professional', features: ['효율성', '데이터 분석'] },
      직장인: { tone: 'efficient', features: ['빠른 실행', '알림'] },
      학생: { tone: 'fun', features: ['친구 기능', '저렴한'] },
      주부: { tone: 'practical', features: ['가계부', '가족 관리'] },
    };

    let modifier = null;
    for (const [key, value] of Object.entries(targetModifiers)) {
      if (targetLower.includes(key)) {
        modifier = value;
        break;
      }
    }

    if (modifier) {
      return ideas.map((idea) => ({
        ...idea,
        target: targetUsers,
        targetOptimization: modifier,
      }));
    }

    return ideas;
  }

  // 유틸리티 메서드들
  generateTitle(concept1, concept2, keywords) {
    const templates = [
      `${concept1} 메이트`,
      `스마트 ${concept1}`,
      `${concept1} ${concept2}`,
      `오늘의 ${concept1}`,
      `${concept1} 챌린지`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  generateDescription(concept1, concept2) {
    return `${concept1}과 ${concept2}를 결합한 간편한 서비스`;
  }

  generateFeatures(concept1, concept2) {
    return [
      `${concept1} 핵심 기능`,
      `${concept2} 연동`,
      '간편한 시작',
      '진행 상황 확인',
    ];
  }

  generateTitleFromKeywords(keywords) {
    return keywords.join(' ') + ' 앱';
  }

  generateFeaturesFromKeywords(keywords) {
    return keywords.map((k) => `${k} 기능`).concat(['알림', '기록']);
  }

  generateCombinations(arr, size) {
    const result = [];
    const combine = (start, combo) => {
      if (combo.length === size) {
        result.push([...combo]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        combo.push(arr[i]);
        combine(i + 1, combo);
        combo.pop();
      }
    };
    combine(0, []);
    return result;
  }

  findMatchingCategory(keywords) {
    const categoryKeywords = {
      finance: ['돈', '절약', '투자', '저축', '가계부', '결제'],
      lifestyle: ['습관', '건강', '일기', '루틴', '취미'],
      productivity: ['집중', '시간', '메모', '회의', '일정'],
      social: ['친구', '모임', '공유', '커뮤니티', '매칭'],
      learning: ['학습', '공부', '영어', '지식', '교육'],
      commerce: ['쇼핑', '가격', '할인', '구매', '리뷰'],
    };

    for (const [category, words] of Object.entries(categoryKeywords)) {
      if (keywords.some((k) => words.some((w) => k.includes(w)))) {
        return category;
      }
    }
    return 'lifestyle';
  }

  extractKeywords(text) {
    // 간단한 키워드 추출 (실제로는 NLP 활용)
    const stopWords = ['이', '가', '을', '를', '의', '에', '로', '하다', '있다', '되다'];
    return text
      .split(/\s+/)
      .filter((w) => w.length > 1 && !stopWords.includes(w))
      .slice(0, 5);
  }

  classifyProblem(problem) {
    const problemLower = problem.toLowerCase();
    if (problemLower.includes('시간') || problemLower.includes('바쁜')) return 'time';
    if (problemLower.includes('돈') || problemLower.includes('비용')) return 'money';
    if (problemLower.includes('습관') || problemLower.includes('꾸준')) return 'habit';
    if (problemLower.includes('친구') || problemLower.includes('사람')) return 'social';
    if (problemLower.includes('배우') || problemLower.includes('공부')) return 'learning';
    return 'habit';
  }

  inferTarget(category) {
    const targets = {
      finance: '재테크에 관심있는 20-40대',
      lifestyle: '자기계발을 원하는 모든 연령',
      productivity: '바쁜 직장인, 학생',
      social: '새로운 관계를 원하는 사용자',
      learning: '배움에 관심있는 전 연령',
      commerce: '스마트한 소비를 원하는 소비자',
    };
    return targets[category] || '일반 사용자';
  }

  suggestRevenue(category) {
    const revenues = {
      finance: '프리미엄 분석 기능, 제휴 금융상품',
      lifestyle: '프리미엄 테마/기능 구독',
      productivity: 'B2B 구독, 프리미엄 기능',
      social: '프리미엄 매칭, 광고',
      learning: '프리미엄 콘텐츠 구독',
      commerce: '제휴 수수료, 광고',
    };
    return revenues[category] || '프리미엄 기능 구독';
  }

  assessComplexity(pattern) {
    const complexPatterns = ['자동화', 'AI', '분석', '매칭'];
    if (complexPatterns.some((p) => pattern.includes(p))) return 'high';
    return 'medium';
  }

  suggestTossIntegration(category) {
    const integrations = {
      finance: ['토스 계좌 연동', '송금 기능', '결제 데이터'],
      lifestyle: ['토스 로그인', '포인트 연동'],
      productivity: ['토스 로그인', '알림'],
      social: ['토스 로그인', '송금 정산'],
      learning: ['토스 로그인', '결제'],
      commerce: ['토스페이', '포인트'],
    };
    return integrations[category] || ['토스 로그인'];
  }
}
