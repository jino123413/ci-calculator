/**
 * SpecWriterSkill - 상세 기획서 자동 생성 스킬
 *
 * 선택된 아이디어를 바탕으로 개발자와 AI 에이전트가
 * 바로 작업할 수 있는 상세 기획서를 생성합니다.
 */

import BaseSkill from './BaseSkill';

export default class SpecWriterSkill extends BaseSkill {
  constructor() {
    super({
      name: 'SpecWriter',
      description: '앱 아이디어를 상세 개발 기획서로 변환',
      version: '1.0.0',
      category: 'documentation',
      inputSchema: {
        idea: { type: 'object', required: true, description: '앱 아이디어 객체' },
        detailLevel: { type: 'string', required: false, description: 'basic | detailed | comprehensive' },
        outputFormat: { type: 'string', required: false, description: 'json | markdown | both' },
        includeCode: { type: 'boolean', required: false, description: '코드 예시 포함 여부' },
      },
      outputSchema: {
        spec: { type: 'object', description: '생성된 기획서' },
        markdown: { type: 'string', description: '마크다운 형식 기획서' },
      },
    });

    // 기획서 섹션 템플릿
    this.sectionTemplates = {
      metadata: this.generateMetadata,
      overview: this.generateOverview,
      technicalRequirements: this.generateTechRequirements,
      features: this.generateFeatureSpecs,
      dataModels: this.generateDataModels,
      apiEndpoints: this.generateApiEndpoints,
      uiComponents: this.generateUIComponents,
      userFlows: this.generateUserFlows,
      developmentPhases: this.generateDevPhases,
      security: this.generateSecuritySpecs,
      analytics: this.generateAnalytics,
      testing: this.generateTestingStrategy,
      monitoring: this.generateMonitoring,
      successCriteria: this.generateSuccessCriteria,
    };

    // 기술 스택 프리셋
    this.techStackPresets = {
      simple: {
        frontend: ['React 18+', 'TypeScript'],
        stateManagement: ['React Context API', 'Local Storage'],
        styling: ['Tailwind CSS'],
        testing: ['Jest'],
      },
      standard: {
        frontend: ['React 18+', 'TypeScript', 'Vite'],
        stateManagement: ['Zustand', 'React Query'],
        styling: ['Tailwind CSS', 'Framer Motion'],
        testing: ['Jest', 'React Testing Library'],
      },
      advanced: {
        frontend: ['React 18+', 'TypeScript', 'Vite', 'PWA'],
        stateManagement: ['Zustand', 'React Query', 'Immer'],
        styling: ['Tailwind CSS', 'Framer Motion', 'Radix UI'],
        testing: ['Jest', 'React Testing Library', 'Playwright'],
        monitoring: ['Sentry', 'Analytics'],
      },
    };
  }

  async execute(input, context = {}) {
    const {
      idea,
      detailLevel = 'detailed',
      outputFormat = 'both',
      includeCode = true,
    } = input;

    // 기획서 생성
    const spec = this.generateFullSpec(idea, detailLevel, includeCode);

    // 출력 형식에 따른 반환
    const result = { spec };

    if (outputFormat === 'markdown' || outputFormat === 'both') {
      result.markdown = this.convertToMarkdown(spec, idea);
    }

    if (outputFormat === 'json' || outputFormat === 'both') {
      result.json = JSON.stringify(spec, null, 2);
    }

    return result;
  }

  generateFullSpec(idea, detailLevel, includeCode) {
    const spec = {};

    // 메타데이터
    spec.metadata = {
      appName: idea.title,
      category: idea.category || '기타',
      platform: '앱인토스 (Toss Mini App)',
      generatedDate: new Date().toISOString().split('T')[0],
      version: '1.0.0',
      detailLevel,
    };

    // 개요
    spec.overview = {
      description: idea.description,
      targetUsers: idea.target,
      keyValue: `${idea.title}는 ${idea.description}로, ${idea.target}에게 핵심 가치를 제공합니다.`,
      businessModel: idea.revenue,
      uniqueSellingPoints: this.generateUSPs(idea),
    };

    // 기술 요구사항
    const techPreset = this.selectTechPreset(idea);
    spec.technicalRequirements = {
      platform: {
        environment: '앱인토스 WebView',
        minTossAppVersion: '최신 버전',
        supportedOS: ['iOS 14+', 'Android 8.0+'],
        screenOrientation: 'portrait',
      },
      techStack: techPreset,
      performance: {
        initialLoadTime: '< 2초',
        interactionDelay: '< 300ms',
        bundleSize: '< 500KB',
        apiResponseTime: '< 1초',
        targetFPS: 60,
      },
      tossIntegration: idea.tossIntegration || ['토스 로그인'],
    };

    // 기능 명세
    spec.features = this.generateDetailedFeatures(idea, includeCode);

    // 데이터 모델
    spec.dataModels = this.generateDataModels(idea);

    // API 엔드포인트
    spec.apiEndpoints = this.generateApiEndpoints(idea);

    // UI 컴포넌트
    spec.uiComponents = this.generateUIComponents(idea);

    // 사용자 플로우
    spec.userFlows = this.generateUserFlows(idea);

    // 개발 단계
    if (detailLevel === 'detailed' || detailLevel === 'comprehensive') {
      spec.developmentPhases = this.generateDevPhases(idea);
    }

    // 보안 고려사항
    spec.security = this.generateSecuritySpecs();

    // 분석 이벤트
    spec.analytics = this.generateAnalytics(idea);

    // 테스트 전략
    if (detailLevel === 'comprehensive') {
      spec.testing = this.generateTestingStrategy(idea);
      spec.monitoring = this.generateMonitoring();
    }

    // 성공 기준
    spec.successCriteria = this.generateSuccessCriteria(idea);

    return spec;
  }

  generateUSPs(idea) {
    return [
      `${idea.title}만의 독특한 접근 방식`,
      '토스 사용자를 위한 최적화된 경험',
      '간단하고 직관적인 사용법',
      idea.features?.[0] ? `핵심 기능: ${idea.features[0]}` : '핵심 가치 제공',
    ];
  }

  selectTechPreset(idea) {
    const complexity = idea.complexity || 'medium';
    if (complexity === 'high') return this.techStackPresets.advanced;
    if (complexity === 'low') return this.techStackPresets.simple;
    return this.techStackPresets.standard;
  }

  generateDetailedFeatures(idea, includeCode) {
    const features = idea.features || ['핵심 기능 1', '핵심 기능 2', '핵심 기능 3', '핵심 기능 4'];

    return features.map((feature, idx) => {
      const featureSpec = {
        id: `F${String(idx + 1).padStart(3, '0')}`,
        name: feature,
        priority: idx < 2 ? 'HIGH' : 'MEDIUM',
        description: `${feature} 기능을 구현하여 사용자가 핵심 가치를 경험할 수 있도록 합니다.`,
        userStory: `사용자로서, 나는 ${feature.toLowerCase()}을(를) 원합니다. 그래야 앱의 핵심 가치를 경험할 수 있습니다.`,
        acceptanceCriteria: [
          `사용자는 ${feature}를 명확하게 확인할 수 있어야 함`,
          `${feature} 동작 시 즉각적인 피드백이 제공되어야 함`,
          '에러 발생 시 사용자 친화적인 메시지가 표시되어야 함',
          '오프라인 상태에서도 기본적인 기능이 동작해야 함',
        ],
        technicalImplementation: {
          components: [`${this.toPascalCase(feature)}Component`, `${this.toPascalCase(feature)}Container`],
          hooks: [`use${this.toPascalCase(feature)}`],
          apis: [`/api/${this.toKebabCase(feature)}`],
          stateManagement: `${this.toCamelCase(feature)}Store`,
        },
      };

      if (includeCode) {
        featureSpec.codeExample = this.generateCodeExample(feature, idx);
      }

      return featureSpec;
    });
  }

  generateCodeExample(feature, idx) {
    const componentName = this.toPascalCase(feature);
    return {
      component: `
// components/${componentName}.tsx
import React from 'react';
import { use${componentName} } from '../hooks/use${componentName}';

interface ${componentName}Props {
  onComplete?: () => void;
}

export function ${componentName}({ onComplete }: ${componentName}Props) {
  const { data, isLoading, execute } = use${componentName}();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">${feature}</h2>
      {/* 구현 내용 */}
    </div>
  );
}`,
      hook: `
// hooks/use${componentName}.ts
import { useState, useCallback } from 'react';
import { api } from '../api';

export function use${componentName}() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const result = await api.${this.toCamelCase(feature)}(params);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, execute };
}`,
    };
  }

  generateDataModels(idea) {
    return {
      User: {
        description: '사용자 정보',
        fields: [
          { name: 'userId', type: 'string', required: true, description: '토스 사용자 고유 ID' },
          { name: 'userName', type: 'string', required: true, description: '사용자 이름' },
          { name: 'profileImage', type: 'string', required: false, description: '프로필 이미지 URL' },
          { name: 'createdAt', type: 'timestamp', required: true, description: '가입 일시' },
          { name: 'lastLoginAt', type: 'timestamp', required: false, description: '마지막 로그인' },
          { name: 'preferences', type: 'json', required: false, description: '사용자 설정' },
        ],
      },
      Activity: {
        description: '사용자 활동 기록',
        fields: [
          { name: 'activityId', type: 'string', required: true, description: '활동 고유 ID' },
          { name: 'userId', type: 'string', required: true, description: '사용자 ID (FK)' },
          { name: 'type', type: 'enum', required: true, description: '활동 유형' },
          { name: 'data', type: 'json', required: false, description: '활동 데이터' },
          { name: 'timestamp', type: 'timestamp', required: true, description: '발생 시각' },
        ],
      },
      [`${this.toPascalCase(idea.title)}Record`]: {
        description: `${idea.title} 관련 핵심 데이터`,
        fields: [
          { name: 'recordId', type: 'string', required: true, description: '레코드 고유 ID' },
          { name: 'userId', type: 'string', required: true, description: '사용자 ID (FK)' },
          { name: 'status', type: 'enum', required: true, description: '상태 (active/completed/archived)' },
          { name: 'metadata', type: 'json', required: false, description: '추가 메타데이터' },
          { name: 'createdAt', type: 'timestamp', required: true, description: '생성 일시' },
          { name: 'updatedAt', type: 'timestamp', required: true, description: '수정 일시' },
        ],
      },
    };
  }

  generateApiEndpoints(idea) {
    return [
      {
        method: 'GET',
        path: '/api/user/profile',
        description: '사용자 프로필 정보 조회',
        authentication: 'Required (Toss Token)',
        rateLimit: '100/min',
        request: { params: [] },
        response: {
          success: { userId: 'string', userName: 'string', profile: 'object' },
          errors: ['401 Unauthorized', '500 Internal Server Error'],
        },
      },
      {
        method: 'POST',
        path: '/api/activity/create',
        description: '새로운 활동 생성',
        authentication: 'Required (Toss Token)',
        rateLimit: '30/min',
        request: {
          body: { type: 'string', data: 'object' },
        },
        response: {
          success: { activityId: 'string', status: 'success' },
          errors: ['400 Bad Request', '401 Unauthorized'],
        },
      },
      {
        method: 'GET',
        path: '/api/activity/list',
        description: '사용자 활동 목록 조회',
        authentication: 'Required (Toss Token)',
        rateLimit: '100/min',
        request: {
          params: [
            { name: 'limit', type: 'number', default: 20, description: '조회 개수' },
            { name: 'offset', type: 'number', default: 0, description: '시작 위치' },
            { name: 'type', type: 'string', optional: true, description: '활동 유형 필터' },
          ],
        },
        response: {
          success: { activities: 'array', total: 'number', hasMore: 'boolean' },
          errors: ['401 Unauthorized'],
        },
      },
      {
        method: 'PUT',
        path: '/api/activity/:id',
        description: '활동 정보 수정',
        authentication: 'Required (Toss Token)',
        rateLimit: '30/min',
        request: {
          params: [{ name: 'id', type: 'string', required: true }],
          body: { data: 'object' },
        },
        response: {
          success: { updated: 'boolean' },
          errors: ['400 Bad Request', '404 Not Found'],
        },
      },
      {
        method: 'DELETE',
        path: '/api/activity/:id',
        description: '활동 삭제',
        authentication: 'Required (Toss Token)',
        rateLimit: '30/min',
        request: {
          params: [{ name: 'id', type: 'string', required: true }],
        },
        response: {
          success: { deleted: 'boolean' },
          errors: ['404 Not Found'],
        },
      },
    ];
  }

  generateUIComponents(idea) {
    return {
      pages: [
        {
          name: 'HomePage',
          route: '/',
          description: '앱의 메인 화면',
          components: ['Header', 'MainContent', 'QuickActions', 'BottomNav'],
          dataFlow: '앱 실행 시 사용자 데이터 로드, 주요 기능 표시',
          layoutType: 'scroll',
        },
        {
          name: 'ActivityPage',
          route: '/activity',
          description: '활동 내역 및 상세 화면',
          components: ['ActivityHeader', 'FilterTabs', 'ActivityList', 'EmptyState'],
          dataFlow: '페이지네이션으로 활동 데이터 로드',
          layoutType: 'infinite-scroll',
        },
        {
          name: 'CreatePage',
          route: '/create',
          description: '새로운 항목 생성 화면',
          components: ['FormHeader', 'InputFields', 'ValidationMessages', 'SubmitButton'],
          dataFlow: '폼 입력 → 유효성 검사 → API 호출 → 결과 처리',
          layoutType: 'form',
        },
        {
          name: 'SettingsPage',
          route: '/settings',
          description: '설정 및 프로필 화면',
          components: ['ProfileSection', 'SettingsList', 'VersionInfo', 'LogoutButton'],
          dataFlow: '설정 값 로드 및 저장',
          layoutType: 'list',
        },
      ],
      sharedComponents: [
        { name: 'Button', props: ['label', 'onClick', 'variant', 'disabled', 'loading'], description: '재사용 버튼' },
        { name: 'Card', props: ['children', 'className', 'onClick', 'hoverable'], description: '카드 컨테이너' },
        { name: 'Input', props: ['value', 'onChange', 'placeholder', 'type', 'error'], description: '입력 필드' },
        { name: 'Modal', props: ['isOpen', 'onClose', 'title', 'children'], description: '모달 다이얼로그' },
        { name: 'Toast', props: ['message', 'type', 'duration'], description: '토스트 알림' },
        { name: 'LoadingSpinner', props: ['size', 'color'], description: '로딩 표시' },
        { name: 'ErrorBoundary', props: ['fallback', 'onError'], description: '에러 경계' },
        { name: 'EmptyState', props: ['icon', 'title', 'description', 'action'], description: '빈 상태 표시' },
      ],
      designTokens: {
        colors: {
          primary: '#3182F6',
          secondary: '#4E5968',
          success: '#00C853',
          warning: '#FF9100',
          error: '#FF5252',
          background: '#F9FAFB',
        },
        spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
        borderRadius: { sm: '8px', md: '12px', lg: '16px', full: '9999px' },
        typography: {
          h1: { size: '24px', weight: 700 },
          h2: { size: '20px', weight: 600 },
          body: { size: '16px', weight: 400 },
          caption: { size: '14px', weight: 400 },
        },
      },
    };
  }

  generateUserFlows(idea) {
    return [
      {
        flowName: '첫 사용자 온보딩',
        description: '신규 사용자가 앱을 처음 실행했을 때의 경험',
        steps: [
          { step: 1, action: '앱 실행', screen: 'SplashScreen', duration: '1초', notes: '브랜드 로고 표시' },
          { step: 2, action: '토스 인증', screen: 'AuthCheck', duration: '자동', notes: '토스 SDK 인증' },
          { step: 3, action: '온보딩 가이드', screen: 'OnboardingScreen', duration: '사용자 제어', notes: '3단계 슬라이드' },
          { step: 4, action: '권한 요청', screen: 'PermissionScreen', duration: '사용자 제어', notes: '알림 권한 등' },
          { step: 5, action: '메인 화면 진입', screen: 'HomePage', duration: '-', notes: '핵심 기능 노출' },
        ],
      },
      {
        flowName: '핵심 기능 사용',
        description: '사용자가 앱의 주요 기능을 사용하는 흐름',
        steps: [
          { step: 1, action: '메인 화면 진입', screen: 'HomePage', duration: '-' },
          { step: 2, action: 'CTA 버튼 클릭', screen: 'HomePage', duration: '사용자 제어' },
          { step: 3, action: '데이터 입력', screen: 'CreatePage', duration: '사용자 제어' },
          { step: 4, action: '확인 및 제출', screen: 'ConfirmModal', duration: '사용자 제어' },
          { step: 5, action: '결과 확인', screen: 'ResultScreen', duration: '2초' },
          { step: 6, action: '공유 또는 완료', screen: 'ResultScreen', duration: '사용자 제어' },
        ],
      },
      {
        flowName: '재방문 사용자',
        description: '기존 사용자가 앱을 다시 방문했을 때',
        steps: [
          { step: 1, action: '앱 실행', screen: 'SplashScreen', duration: '0.5초' },
          { step: 2, action: '자동 로그인', screen: 'HomePage', duration: '자동' },
          { step: 3, action: '이전 활동 확인', screen: 'HomePage', duration: '-', notes: '마지막 활동 요약 표시' },
          { step: 4, action: '빠른 액션', screen: 'HomePage', duration: '사용자 제어' },
        ],
      },
    ];
  }

  generateDevPhases(idea) {
    return [
      {
        phase: 'Phase 1: MVP',
        goals: ['핵심 기능 1-2개 구현', '기본 UI/UX 완성', '토스 SDK 연동'],
        deliverables: [
          '사용자 인증 및 프로필',
          idea.features?.[0] || '핵심 기능 1',
          idea.features?.[1] || '핵심 기능 2',
          '기본 데이터 저장/조회',
        ],
        milestones: ['디자인 완료', '프론트엔드 구현', 'API 연동', '내부 테스트'],
      },
      {
        phase: 'Phase 2: Enhancement',
        goals: ['추가 기능 구현', '사용자 경험 개선', '성능 최적화'],
        deliverables: [
          idea.features?.[2] || '추가 기능 1',
          idea.features?.[3] || '추가 기능 2',
          '알림 기능',
          '데이터 시각화',
          'UI 폴리싱',
        ],
        milestones: ['기능 추가', '성능 최적화', 'A/B 테스트 준비'],
      },
      {
        phase: 'Phase 3: Launch',
        goals: ['베타 테스트', '버그 수정', '앱인토스 마켓 등록'],
        deliverables: [
          '베타 사용자 피드백 반영',
          '성능 모니터링 설정',
          '앱인토스 마켓 심사 준비',
          '런칭 마케팅 준비',
        ],
        milestones: ['베타 릴리즈', '피드백 반영', '정식 출시'],
      },
    ];
  }

  generateSecuritySpecs() {
    return {
      authentication: [
        '토스 SDK를 통한 OAuth 2.0 기반 인증',
        'Access Token의 안전한 저장 (Secure Storage)',
        'Token 갱신 로직 구현',
      ],
      dataProtection: [
        '민감한 데이터 암호화 저장',
        'HTTPS 필수 적용',
        '개인정보 최소 수집 원칙',
      ],
      apiSecurity: [
        'Rate Limiting 구현',
        'Input Validation 및 Sanitization',
        'CORS 설정',
      ],
      clientSecurity: [
        'XSS 공격 방어',
        'CSRF 토큰 사용',
        '민감한 정보 콘솔 로깅 금지',
      ],
    };
  }

  generateAnalytics(idea) {
    return {
      events: [
        { name: 'app_opened', description: '앱 실행', params: ['timestamp', 'source'] },
        { name: 'onboarding_completed', description: '온보딩 완료', params: ['duration'] },
        { name: 'feature_used', description: '기능 사용', params: ['feature_name', 'action'] },
        { name: 'content_created', description: '콘텐츠 생성', params: ['content_type'] },
        { name: 'share_clicked', description: '공유 클릭', params: ['share_target'] },
        { name: 'error_occurred', description: '에러 발생', params: ['error_type', 'error_message'] },
        { name: 'session_ended', description: '세션 종료', params: ['session_duration', 'actions_count'] },
      ],
      metrics: [
        { name: 'DAU', formula: '일일 순 방문자 수' },
        { name: 'Retention D1/D7/D30', formula: 'N일 후 재방문율' },
        { name: 'Feature Adoption', formula: '기능별 사용률' },
        { name: 'Session Duration', formula: '평균 세션 시간' },
        { name: 'Conversion Rate', formula: '목표 달성률' },
      ],
    };
  }

  generateTestingStrategy(idea) {
    return {
      unitTests: {
        coverage: '80% 이상',
        targets: ['유틸리티 함수', 'Custom Hooks', '상태 관리 로직', 'API 클라이언트'],
        tools: ['Jest', 'React Testing Library'],
      },
      integrationTests: {
        coverage: '핵심 플로우 100%',
        targets: ['사용자 인증 플로우', 'CRUD 작업', 'API 연동'],
        tools: ['Jest', 'MSW (Mock Service Worker)'],
      },
      e2eTests: {
        coverage: '주요 시나리오',
        targets: ['온보딩 플로우', '핵심 기능 플로우', '에러 핸들링'],
        tools: ['Playwright', 'Cypress'],
      },
      manualTests: {
        targets: ['UI/UX 검증', '크로스 브라우저', '다양한 디바이스'],
      },
    };
  }

  generateMonitoring() {
    return {
      errorTracking: {
        tool: 'Sentry',
        config: ['에러 그룹화', '사용자 컨텍스트', 'Source Maps'],
      },
      performance: {
        metrics: ['LCP', 'FID', 'CLS', 'API 응답 시간'],
        thresholds: { LCP: '2.5s', FID: '100ms', CLS: '0.1' },
      },
      alerts: [
        { condition: '에러율 > 1%', action: 'Slack 알림' },
        { condition: 'API 응답 > 2초', action: '담당자 호출' },
        { condition: 'Crash-free < 99%', action: '긴급 대응' },
      ],
    };
  }

  generateSuccessCriteria(idea) {
    return [
      '앱 실행 후 2초 이내에 메인 화면 로딩 완료',
      `${idea.features?.[0] || '핵심 기능'} 사용자 만족도 4.0/5.0 이상`,
      '출시 후 1개월 내 MAU 1,000명 이상 달성',
      'D7 Retention Rate 30% 이상',
      'Crash-free Rate 99.5% 이상 유지',
      '앱 스토어 평점 4.5 이상',
    ];
  }

  convertToMarkdown(spec, idea) {
    return `# ${spec.metadata.appName} - 상세 기획서

## 메타데이터
- **앱 이름**: ${spec.metadata.appName}
- **카테고리**: ${spec.metadata.category}
- **플랫폼**: ${spec.metadata.platform}
- **생성일**: ${spec.metadata.generatedDate}
- **버전**: ${spec.metadata.version}

---

## 1. 개요

### 설명
${spec.overview.description}

### 타겟 사용자
${spec.overview.targetUsers}

### 핵심 가치
${spec.overview.keyValue}

### 비즈니스 모델
${spec.overview.businessModel}

### 차별점 (USP)
${spec.overview.uniqueSellingPoints.map((usp) => `- ${usp}`).join('\n')}

---

## 2. 기술 요구사항

### 플랫폼
| 항목 | 값 |
|------|-----|
| 환경 | ${spec.technicalRequirements.platform.environment} |
| 최소 토스 앱 버전 | ${spec.technicalRequirements.platform.minTossAppVersion} |
| 지원 OS | ${spec.technicalRequirements.platform.supportedOS.join(', ')} |
| 화면 방향 | ${spec.technicalRequirements.platform.screenOrientation} |

### 기술 스택
- **Frontend**: ${spec.technicalRequirements.techStack.frontend.join(', ')}
- **상태 관리**: ${spec.technicalRequirements.techStack.stateManagement.join(', ')}
- **스타일링**: ${spec.technicalRequirements.techStack.styling.join(', ')}
- **테스팅**: ${spec.technicalRequirements.techStack.testing.join(', ')}

### 성능 목표
| 지표 | 목표 |
|------|------|
| 초기 로딩 | ${spec.technicalRequirements.performance.initialLoadTime} |
| 인터랙션 지연 | ${spec.technicalRequirements.performance.interactionDelay} |
| 번들 크기 | ${spec.technicalRequirements.performance.bundleSize} |
| API 응답 | ${spec.technicalRequirements.performance.apiResponseTime} |

---

## 3. 기능 명세

${spec.features
  .map(
    (f) => `### ${f.id}: ${f.name}
- **우선순위**: ${f.priority}
- **설명**: ${f.description}

**User Story**
> ${f.userStory}

**Acceptance Criteria**
${f.acceptanceCriteria.map((c) => `- [ ] ${c}`).join('\n')}

**기술 구현**
- Components: \`${f.technicalImplementation.components.join('`, `')}\`
- Hooks: \`${f.technicalImplementation.hooks.join('`, `')}\`
- APIs: \`${f.technicalImplementation.apis.join('`, `')}\`
`
  )
  .join('\n---\n\n')}

---

## 4. 데이터 모델

${Object.entries(spec.dataModels)
  .map(
    ([name, model]) => `### ${name}
${model.description}

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
${model.fields.map((f) => `| ${f.name} | ${f.type} | ${f.required ? 'O' : 'X'} | ${f.description} |`).join('\n')}`
  )
  .join('\n\n')}

---

## 5. API 엔드포인트

${spec.apiEndpoints
  .map(
    (ep) => `### \`${ep.method}\` ${ep.path}
${ep.description}

- **인증**: ${ep.authentication}
- **Rate Limit**: ${ep.rateLimit}
`
  )
  .join('\n')}

---

## 6. UI 컴포넌트

### 페이지 구조
${spec.uiComponents.pages.map((p) => `- **${p.name}** (\`${p.route}\`): ${p.description}`).join('\n')}

### 공통 컴포넌트
${spec.uiComponents.sharedComponents.map((c) => `- **${c.name}**: ${c.description}`).join('\n')}

---

## 7. 사용자 플로우

${spec.userFlows
  .map(
    (flow) => `### ${flow.flowName}
${flow.description}

${flow.steps.map((s) => `${s.step}. ${s.action} → [${s.screen}]`).join('\n')}`
  )
  .join('\n\n')}

---

## 8. 보안 고려사항

### 인증
${spec.security.authentication.map((s) => `- ${s}`).join('\n')}

### 데이터 보호
${spec.security.dataProtection.map((s) => `- ${s}`).join('\n')}

### API 보안
${spec.security.apiSecurity.map((s) => `- ${s}`).join('\n')}

---

## 9. 성공 기준

${spec.successCriteria.map((c) => `- [ ] ${c}`).join('\n')}

---

## 코딩 에이전트 지침

이 기획서를 Claude Code 또는 다른 AI 코딩 에이전트에게 전달하여 개발을 시작하세요.

### 추천 프로젝트 초기화
\`\`\`bash
npm create vite@latest ${this.toKebabCase(idea.title)} -- --template react-ts
cd ${this.toKebabCase(idea.title)}
npm install
npm install zustand @tanstack/react-query tailwindcss
\`\`\`

### 폴더 구조
\`\`\`
src/
├── components/
│   ├── common/
│   └── features/
├── pages/
├── api/
├── hooks/
├── stores/
├── types/
└── utils/
\`\`\`

---
*Generated by AppsInToss Agent SpecWriter*
`;
  }

  // 유틸리티 메서드
  toPascalCase(str) {
    return str
      .split(/[\s_-]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  }

  toCamelCase(str) {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  toKebabCase(str) {
    return str
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9가-힣-]/g, '');
  }
}
