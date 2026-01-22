/**
 * LaunchPlannerSkill - 출시 전략 수립 스킬
 *
 * 앱인토스 앱의 출시 전략과 마케팅 계획을 수립합니다.
 */

import BaseSkill from './BaseSkill';

export default class LaunchPlannerSkill extends BaseSkill {
  constructor() {
    super({
      name: 'LaunchPlanner',
      description: '앱인토스 앱 출시 전략 및 마케팅 계획 수립',
      version: '1.0.0',
      category: 'strategy',
      inputSchema: {
        idea: { type: 'object', required: true, description: '앱 아이디어' },
        resources: { type: 'object', required: false, description: '가용 리소스 (예산, 인력)' },
        timeline: { type: 'string', required: false, description: '목표 출시일' },
      },
      outputSchema: {
        launchPlan: { type: 'object', description: '출시 계획' },
        marketingPlan: { type: 'object', description: '마케팅 계획' },
        checkList: { type: 'array', description: '출시 체크리스트' },
      },
    });
  }

  async execute(input, context = {}) {
    const { idea, resources = {}, timeline = '8주' } = input;

    // 1. 출시 일정 수립
    const schedule = this.createLaunchSchedule(idea, timeline);

    // 2. 마케팅 전략 수립
    const marketingPlan = this.createMarketingPlan(idea, resources);

    // 3. 출시 전 체크리스트
    const prelaunchChecklist = this.createPrelaunchChecklist(idea);

    // 4. 베타 테스트 계획
    const betaPlan = this.createBetaPlan(idea);

    // 5. 앱인토스 마켓 등록 가이드
    const marketRegistration = this.createMarketRegistrationGuide(idea);

    // 6. 초기 유저 획득 전략
    const acquisitionStrategy = this.createAcquisitionStrategy(idea, resources);

    // 7. KPI 및 목표 설정
    const goals = this.setLaunchGoals(idea);

    // 8. 위기 대응 계획
    const contingencyPlan = this.createContingencyPlan();

    // 9. 출시 후 로드맵
    const postLaunchRoadmap = this.createPostLaunchRoadmap(idea);

    return {
      schedule,
      marketingPlan,
      prelaunchChecklist,
      betaPlan,
      marketRegistration,
      acquisitionStrategy,
      goals,
      contingencyPlan,
      postLaunchRoadmap,
      summary: this.generateSummary(schedule, goals),
    };
  }

  createLaunchSchedule(idea, timeline) {
    const weeks = parseInt(timeline) || 8;

    return {
      totalWeeks: weeks,
      phases: [
        {
          name: 'Phase 1: 개발 완료',
          duration: `Week 1-${Math.ceil(weeks * 0.5)}`,
          tasks: [
            { task: 'MVP 기능 구현 완료', owner: '개발팀', status: 'pending' },
            { task: '내부 QA 테스트', owner: 'QA', status: 'pending' },
            { task: '버그 수정', owner: '개발팀', status: 'pending' },
            { task: '성능 최적화', owner: '개발팀', status: 'pending' },
          ],
        },
        {
          name: 'Phase 2: 베타 테스트',
          duration: `Week ${Math.ceil(weeks * 0.5) + 1}-${Math.ceil(weeks * 0.75)}`,
          tasks: [
            { task: '베타 테스터 모집', owner: '마케팅', status: 'pending' },
            { task: '베타 버전 배포', owner: '개발팀', status: 'pending' },
            { task: '피드백 수집 및 분석', owner: 'PM', status: 'pending' },
            { task: '우선순위 버그 수정', owner: '개발팀', status: 'pending' },
          ],
        },
        {
          name: 'Phase 3: 출시 준비',
          duration: `Week ${Math.ceil(weeks * 0.75) + 1}-${weeks - 1}`,
          tasks: [
            { task: '앱인토스 마켓 등록 신청', owner: 'PM', status: 'pending' },
            { task: '마케팅 자료 준비', owner: '마케팅', status: 'pending' },
            { task: '보도자료/SNS 콘텐츠 제작', owner: '마케팅', status: 'pending' },
            { task: '최종 QA', owner: 'QA', status: 'pending' },
          ],
        },
        {
          name: 'Phase 4: 런칭',
          duration: `Week ${weeks}`,
          tasks: [
            { task: '정식 버전 배포', owner: '개발팀', status: 'pending' },
            { task: '마케팅 캠페인 시작', owner: '마케팅', status: 'pending' },
            { task: '모니터링 시작', owner: '개발팀', status: 'pending' },
            { task: '고객 지원 체계 가동', owner: 'CS', status: 'pending' },
          ],
        },
      ],
      milestones: [
        { name: '개발 완료', week: Math.ceil(weeks * 0.5), critical: true },
        { name: '베타 출시', week: Math.ceil(weeks * 0.5) + 1, critical: true },
        { name: '마켓 승인', week: weeks - 1, critical: true },
        { name: '정식 출시', week: weeks, critical: true },
      ],
    };
  }

  createMarketingPlan(idea, resources) {
    const budget = resources.budget || 'low';
    const features = idea.features || ['핵심 기능'];

    return {
      positioning: {
        tagline: `${idea.title} - ${idea.description}`,
        keyMessages: [
          `가장 간편한 ${features[0]}`,
          '토스 앱에서 바로 사용',
          '설치 없이 빠르게 시작',
        ],
        tone: 'friendly, simple, trustworthy',
      },
      channels: [
        {
          channel: '토스 앱인토스 마켓',
          priority: 'high',
          cost: 'free',
          tactics: ['앱 설명 최적화', '스크린샷 제작', '피처드 신청'],
        },
        {
          channel: 'SNS (인스타그램, 트위터)',
          priority: 'high',
          cost: budget === 'high' ? 'paid' : 'organic',
          tactics: ['티저 콘텐츠', '사용 팁 시리즈', '사용자 후기 공유'],
        },
        {
          channel: '커뮤니티',
          priority: 'medium',
          cost: 'free',
          tactics: ['관련 커뮤니티 활동', 'AMA 세션', '얼리 어답터 모집'],
        },
        {
          channel: '인플루언서',
          priority: budget === 'high' ? 'high' : 'low',
          cost: 'paid',
          tactics: ['리뷰 협찬', '공동 콘텐츠 제작'],
        },
        {
          channel: 'PR',
          priority: 'medium',
          cost: 'free/paid',
          tactics: ['보도자료 배포', '미디어 인터뷰'],
        },
      ],
      campaigns: [
        {
          name: '사전 등록 캠페인',
          timing: '출시 2주 전',
          goal: '관심 유저 1,000명 확보',
          tactics: [
            'SNS 티저 공개',
            '사전 등록 시 특별 혜택 제공',
            '카운트다운 콘텐츠',
          ],
        },
        {
          name: '런칭 캠페인',
          timing: '출시 당일 ~ 1주',
          goal: 'DAU 1,000명 달성',
          tactics: [
            '런칭 이벤트 (첫 사용자 혜택)',
            '친구 초대 이벤트',
            'SNS 바이럴 콘텐츠',
          ],
        },
        {
          name: '그로스 캠페인',
          timing: '출시 2주 ~ 4주',
          goal: 'MAU 5,000명 달성',
          tactics: [
            '사용자 후기 캠페인',
            '기능 업데이트 홍보',
            '제휴 마케팅',
          ],
        },
      ],
      contentPlan: {
        prelaunch: [
          { type: '티저 이미지', count: 5, timing: 'D-14 ~ D-7' },
          { type: '기능 소개 영상', count: 1, timing: 'D-7' },
          { type: '카운트다운 스토리', count: 7, timing: 'D-7 ~ D-1' },
        ],
        launch: [
          { type: '런칭 공지', count: 1, timing: 'D-day' },
          { type: '사용법 가이드', count: 3, timing: 'D-day ~ D+3' },
          { type: '사용자 팁', count: 5, timing: 'D+1 ~ D+7' },
        ],
        ongoing: [
          { type: '사용자 후기', count: '주 2회', timing: 'ongoing' },
          { type: '업데이트 공지', count: '필요시', timing: 'ongoing' },
          { type: '이벤트/프로모션', count: '월 1회', timing: 'ongoing' },
        ],
      },
    };
  }

  createPrelaunchChecklist(idea) {
    return {
      product: [
        { item: 'MVP 기능 구현 완료', critical: true, checked: false },
        { item: '주요 버그 수정 완료', critical: true, checked: false },
        { item: '성능 최적화 (로딩 2초 이내)', critical: true, checked: false },
        { item: '오프라인 대응 처리', critical: false, checked: false },
        { item: '에러 핸들링 및 메시지', critical: true, checked: false },
        { item: '분석 이벤트 설정', critical: false, checked: false },
      ],
      design: [
        { item: 'UI/UX 최종 검수', critical: true, checked: false },
        { item: '앱 아이콘 및 스플래시 화면', critical: true, checked: false },
        { item: '스크린샷 (마켓용)', critical: true, checked: false },
        { item: '프로모션 이미지', critical: false, checked: false },
      ],
      legal: [
        { item: '이용약관 작성', critical: true, checked: false },
        { item: '개인정보처리방침 작성', critical: true, checked: false },
        { item: '앱인토스 정책 검토', critical: true, checked: false },
      ],
      marketing: [
        { item: '앱 설명문 작성', critical: true, checked: false },
        { item: '키워드/태그 설정', critical: true, checked: false },
        { item: 'SNS 계정 준비', critical: false, checked: false },
        { item: '런칭 콘텐츠 제작', critical: false, checked: false },
      ],
      operations: [
        { item: '모니터링 대시보드 설정', critical: true, checked: false },
        { item: '에러 알림 설정 (Sentry 등)', critical: true, checked: false },
        { item: '고객 지원 채널 준비', critical: false, checked: false },
        { item: 'FAQ 문서 작성', critical: false, checked: false },
      ],
    };
  }

  createBetaPlan(idea) {
    return {
      objectives: [
        '핵심 기능 사용성 검증',
        '치명적 버그 발견 및 수정',
        '성능 이슈 파악',
        '초기 사용자 피드백 수집',
      ],
      timeline: {
        recruitment: '1주차: 베타 테스터 모집',
        testing: '2주차: 베타 테스트 진행',
        feedback: '2주차: 피드백 수집',
        iteration: '3주차: 수정 및 반영',
      },
      testerCriteria: {
        count: '50-100명',
        profile: [
          '토스 앱 주 3회 이상 사용자',
          `${idea.category} 관심 사용자`,
          '피드백 제공 의향 있는 사용자',
        ],
      },
      recruitmentChannels: [
        'SNS 공개 모집',
        '지인 네트워크',
        '관련 커뮤니티',
        '사전 등록자 중 선발',
      ],
      feedbackMethods: [
        { method: '인앱 피드백 버튼', priority: 'high' },
        { method: '간단 설문 (3문항 이내)', priority: 'high' },
        { method: '1:1 인터뷰 (핵심 사용자)', priority: 'medium' },
        { method: '사용 데이터 분석', priority: 'high' },
      ],
      successCriteria: [
        'Critical 버그 0건',
        '주요 플로우 완료율 80% 이상',
        '평균 만족도 4.0/5.0 이상',
        '재사용 의향 70% 이상',
      ],
      rewards: [
        '정식 버전 프리미엄 1개월 무료',
        '베타 테스터 뱃지',
        '특별 감사 크레딧',
      ],
    };
  }

  createMarketRegistrationGuide(idea) {
    return {
      process: [
        {
          step: 1,
          title: '개발자 등록',
          description: '토스 개발자 포털에서 개발자 계정 생성',
          requirements: ['사업자등록증 (필요시)', '개인정보', '연락처'],
        },
        {
          step: 2,
          title: '앱 정보 입력',
          description: '앱 기본 정보 및 상세 설명 작성',
          requirements: [
            '앱 이름',
            '카테고리 선택',
            '상세 설명 (500자 이상 권장)',
            '태그/키워드',
          ],
        },
        {
          step: 3,
          title: '에셋 업로드',
          description: '앱 아이콘 및 스크린샷 업로드',
          requirements: [
            '앱 아이콘 (512x512px)',
            '스크린샷 최소 3장',
            '프로모션 배너 (옵션)',
          ],
        },
        {
          step: 4,
          title: '앱 빌드 업로드',
          description: '앱 번들 파일 업로드',
          requirements: ['빌드 파일', '버전 정보', '업데이트 노트'],
        },
        {
          step: 5,
          title: '심사 제출',
          description: '앱인토스 심사 제출',
          requirements: ['테스트 계정 (필요시)', '심사 노트'],
        },
        {
          step: 6,
          title: '심사 통과 및 출시',
          description: '심사 통과 후 마켓 게시',
          timeline: '심사 기간 약 3-7일',
        },
      ],
      guidelines: [
        '토스 디자인 가이드라인 준수',
        '사용자 데이터 처리 정책 준수',
        '앱인토스 콘텐츠 정책 준수',
        '결제 정책 준수 (유료 기능 시)',
      ],
      tips: [
        '심사 전 자체 체크리스트 검토',
        '명확하고 간결한 앱 설명 작성',
        '스크린샷에 핵심 기능 강조',
        '테스트 계정 정보 명확히 제공',
      ],
      commonRejectionReasons: [
        '버그 또는 크래시',
        '불명확한 앱 설명',
        '디자인 가이드라인 위반',
        '개인정보 처리 정책 미흡',
      ],
    };
  }

  createAcquisitionStrategy(idea, resources) {
    return {
      phase1: {
        name: '시드 유저 확보',
        target: '500명',
        tactics: [
          {
            name: '지인 네트워크',
            cost: 'free',
            expectedUsers: 50,
            effort: 'low',
          },
          {
            name: '커뮤니티 홍보',
            cost: 'free',
            expectedUsers: 100,
            effort: 'medium',
          },
          {
            name: '사전 등록 이벤트',
            cost: 'low',
            expectedUsers: 200,
            effort: 'medium',
          },
          {
            name: 'SNS 오가닉',
            cost: 'free',
            expectedUsers: 150,
            effort: 'high',
          },
        ],
      },
      phase2: {
        name: '초기 성장',
        target: '5,000명',
        tactics: [
          {
            name: '친구 초대 프로그램',
            cost: 'medium',
            expectedUsers: 1500,
            effort: 'low',
          },
          {
            name: '토스 피처드',
            cost: 'free',
            expectedUsers: 2000,
            effort: 'medium',
          },
          {
            name: 'SNS 광고',
            cost: 'medium',
            expectedUsers: 1000,
            effort: 'medium',
          },
          {
            name: '인플루언서 협업',
            cost: resources.budget === 'high' ? 'high' : 'skip',
            expectedUsers: 500,
            effort: 'medium',
          },
        ],
      },
      viralLoops: [
        {
          name: '공유 기능',
          description: '성과/결과 공유 시 친구 유입',
          k_factor: 0.3,
        },
        {
          name: '초대 보상',
          description: '친구 초대 시 양측에 혜택',
          k_factor: 0.5,
        },
        {
          name: '챌린지/경쟁',
          description: '친구와 함께하는 기능으로 유입',
          k_factor: 0.4,
        },
      ],
      retentionTactics: [
        '푸시 알림 (리마인더)',
        '스트릭/연속 사용 보상',
        '개인화된 콘텐츠',
        '주기적 업데이트 공지',
      ],
    };
  }

  setLaunchGoals(idea) {
    return {
      week1: {
        dau: 500,
        downloads: 1000,
        retention_d1: 0.4,
        crashFree: 0.99,
      },
      month1: {
        mau: 5000,
        dau: 1000,
        retention_d7: 0.25,
        retention_d30: 0.15,
        nps: 30,
      },
      month3: {
        mau: 20000,
        dau: 5000,
        retention_d30: 0.2,
        revenue: idea.revenue ? 1000000 : 0,
        marketRating: 4.5,
      },
      tracking: {
        tools: ['Google Analytics', 'Mixpanel', 'Sentry'],
        dashboards: ['실시간 DAU', '리텐션 코호트', '에러 모니터링'],
        reviews: ['일간 지표 체크', '주간 리뷰 미팅', '월간 전략 회의'],
      },
    };
  }

  createContingencyPlan() {
    return {
      scenarios: [
        {
          scenario: '심각한 버그 발생',
          trigger: '크래시율 > 1% 또는 Critical 버그',
          response: [
            '즉시 공지사항 게시',
            '핫픽스 긴급 배포',
            '영향받은 사용자 개별 안내',
          ],
          owner: '개발팀 + PM',
        },
        {
          scenario: '서버 장애',
          trigger: 'API 응답 실패 > 5%',
          response: [
            '장애 공지 게시',
            '백업 서버 전환',
            '원인 분석 및 수정',
          ],
          owner: '인프라팀',
        },
        {
          scenario: '부정적 여론',
          trigger: 'SNS/커뮤니티 부정 반응 급증',
          response: [
            '상황 모니터링',
            '공식 입장 준비',
            '빠른 대응/개선 약속',
          ],
          owner: '마케팅 + PM',
        },
        {
          scenario: '예상보다 낮은 성과',
          trigger: '목표 대비 50% 미만 달성',
          response: [
            '원인 분석 (제품/마케팅)',
            '빠른 A/B 테스트',
            '마케팅 전략 조정',
          ],
          owner: 'PM + 마케팅',
        },
      ],
      communication: {
        internalChannel: 'Slack #launch-war-room',
        externalChannel: '앱 내 공지 + SNS',
        escalation: 'PM → TL → 경영진',
      },
    };
  }

  createPostLaunchRoadmap(idea) {
    return {
      month1: {
        focus: '안정화 및 피드백 반영',
        priorities: [
          '긴급 버그 수정',
          '핵심 사용자 피드백 반영',
          '성능 모니터링 및 최적화',
        ],
        features: ['버그 수정', '사용성 개선'],
      },
      month2_3: {
        focus: '기능 확장',
        priorities: [
          '요청 기능 추가',
          '리텐션 개선 기능',
          '바이럴 기능 강화',
        ],
        features: ['알림 기능 강화', '친구 기능', '데이터 분석 리포트'],
      },
      month4_6: {
        focus: '수익화 및 스케일업',
        priorities: [
          '프리미엄 기능 출시',
          '마케팅 확대',
          '파트너십 구축',
        ],
        features: ['프리미엄 플랜', '제휴 기능', '고급 분석'],
      },
      ongoing: {
        activities: [
          '주간 업데이트 배포',
          '월간 기능 업데이트',
          '분기별 대형 업데이트',
          '지속적인 피드백 수집',
        ],
      },
    };
  }

  generateSummary(schedule, goals) {
    return {
      totalTimeline: `${schedule.totalWeeks}주`,
      keyMilestones: schedule.milestones.filter((m) => m.critical).map((m) => m.name),
      launchGoals: {
        week1: `DAU ${goals.week1.dau}명`,
        month1: `MAU ${goals.month1.mau}명`,
        month3: `MAU ${goals.month3.mau}명`,
      },
      criticalPath: [
        '개발 완료',
        '베타 테스트 성공',
        '마켓 심사 통과',
        '정식 출시',
      ],
      nextSteps: [
        '출시 일정 확정',
        '팀별 담당자 지정',
        '체크리스트 작성 시작',
        '베타 테스터 모집 준비',
      ],
    };
  }
}
