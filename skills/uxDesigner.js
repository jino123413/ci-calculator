/**
 * UXDesignerSkill - UI/UX 디자인 가이드 스킬
 *
 * 앱인토스에 최적화된 UI/UX 디자인 가이드와 컴포넌트 설계를 제공합니다.
 */

import BaseSkill from './BaseSkill';

export default class UXDesignerSkill extends BaseSkill {
  constructor() {
    super({
      name: 'UXDesigner',
      description: '앱인토스 미니앱의 UI/UX 디자인 가이드 및 컴포넌트 설계',
      version: '1.0.0',
      category: 'design',
      inputSchema: {
        idea: { type: 'object', required: true, description: '앱 아이디어' },
        style: { type: 'string', required: false, description: 'minimal | playful | professional' },
      },
      outputSchema: {
        designSystem: { type: 'object', description: '디자인 시스템' },
        wireframes: { type: 'array', description: '와이어프레임 가이드' },
        componentLibrary: { type: 'array', description: '컴포넌트 라이브러리' },
        uxPrinciples: { type: 'array', description: 'UX 원칙' },
      },
    });

    // 토스 디자인 시스템 기반 컬러
    this.tossColors = {
      blue: {
        50: '#E8F3FF',
        100: '#C9E2FF',
        200: '#90C2FF',
        300: '#64A8FF',
        400: '#4593FC',
        500: '#3182F6', // Primary
        600: '#2272EB',
        700: '#1B64DA',
        800: '#1957C2',
        900: '#194AA6',
      },
      gray: {
        50: '#F9FAFB',
        100: '#F2F4F6',
        200: '#E5E8EB',
        300: '#D1D6DB',
        400: '#B0B8C1',
        500: '#8B95A1',
        600: '#6B7684',
        700: '#4E5968',
        800: '#333D4B',
        900: '#191F28',
      },
      semantic: {
        success: '#00C853',
        warning: '#FF9100',
        error: '#FF5252',
        info: '#3182F6',
      },
    };

    // 타이포그래피 스케일
    this.typography = {
      display: { size: 32, weight: 700, lineHeight: 1.3 },
      headline1: { size: 24, weight: 700, lineHeight: 1.35 },
      headline2: { size: 20, weight: 600, lineHeight: 1.4 },
      headline3: { size: 18, weight: 600, lineHeight: 1.4 },
      body1: { size: 16, weight: 400, lineHeight: 1.5 },
      body2: { size: 14, weight: 400, lineHeight: 1.5 },
      caption: { size: 12, weight: 400, lineHeight: 1.4 },
      button: { size: 16, weight: 600, lineHeight: 1.25 },
    };

    // 스페이싱 스케일
    this.spacing = {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    };
  }

  async execute(input, context = {}) {
    const { idea, style = 'minimal' } = input;

    // 1. 디자인 시스템 생성
    const designSystem = this.createDesignSystem(idea, style);

    // 2. 와이어프레임 가이드 생성
    const wireframes = this.generateWireframes(idea);

    // 3. 컴포넌트 라이브러리 설계
    const componentLibrary = this.designComponentLibrary(idea);

    // 4. UX 원칙 정의
    const uxPrinciples = this.defineUXPrinciples(idea);

    // 5. 사용자 플로우 최적화
    const optimizedFlows = this.optimizeUserFlows(idea);

    // 6. 접근성 가이드
    const accessibility = this.createAccessibilityGuide();

    // 7. 마이크로인터랙션 설계
    const microInteractions = this.designMicroInteractions(idea);

    // 8. 반응형 가이드
    const responsiveGuide = this.createResponsiveGuide();

    return {
      designSystem,
      wireframes,
      componentLibrary,
      uxPrinciples,
      optimizedFlows,
      accessibility,
      microInteractions,
      responsiveGuide,
      cssVariables: this.generateCSSVariables(designSystem),
      tailwindConfig: this.generateTailwindExtension(designSystem),
    };
  }

  createDesignSystem(idea, style) {
    const styleModifiers = {
      minimal: { borderRadius: 'md', shadow: 'sm', animation: 'subtle' },
      playful: { borderRadius: 'lg', shadow: 'md', animation: 'bouncy' },
      professional: { borderRadius: 'sm', shadow: 'xs', animation: 'none' },
    };

    const modifier = styleModifiers[style] || styleModifiers.minimal;

    return {
      brand: {
        name: idea.title,
        primaryColor: this.tossColors.blue[500],
        secondaryColor: this.tossColors.gray[700],
        style,
      },
      colors: {
        ...this.tossColors,
        background: {
          primary: '#FFFFFF',
          secondary: this.tossColors.gray[50],
          tertiary: this.tossColors.gray[100],
        },
        text: {
          primary: this.tossColors.gray[900],
          secondary: this.tossColors.gray[600],
          tertiary: this.tossColors.gray[400],
          inverse: '#FFFFFF',
        },
        border: {
          light: this.tossColors.gray[200],
          default: this.tossColors.gray[300],
          strong: this.tossColors.gray[400],
        },
        interaction: {
          hover: this.tossColors.blue[50],
          active: this.tossColors.blue[100],
          focus: `0 0 0 2px ${this.tossColors.blue[500]}40`,
        },
      },
      typography: this.typography,
      spacing: this.spacing,
      borderRadius: {
        none: 0,
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
        default: modifier.borderRadius === 'lg' ? 16 : modifier.borderRadius === 'sm' ? 8 : 12,
      },
      shadow: {
        xs: '0 1px 2px rgba(0,0,0,0.05)',
        sm: '0 2px 4px rgba(0,0,0,0.05)',
        md: '0 4px 8px rgba(0,0,0,0.08)',
        lg: '0 8px 16px rgba(0,0,0,0.1)',
        xl: '0 16px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        duration: {
          fast: '150ms',
          normal: '250ms',
          slow: '400ms',
        },
        easing: {
          default: 'cubic-bezier(0.4, 0, 0.2, 1)',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        },
        style: modifier.animation,
      },
    };
  }

  generateWireframes(idea) {
    const features = idea.features || ['핵심 기능'];

    return [
      {
        name: 'Splash Screen',
        description: '앱 로딩 화면',
        layout: `
┌─────────────────────┐
│                     │
│                     │
│      [로고/아이콘]    │
│                     │
│      앱 이름         │
│                     │
│    [로딩 인디케이터]   │
│                     │
└─────────────────────┘
        `,
        notes: ['2초 이내 로딩', '브랜드 컬러 적용', '심플한 애니메이션'],
        components: ['Logo', 'LoadingSpinner'],
      },
      {
        name: 'Home Screen',
        description: '메인 화면',
        layout: `
┌─────────────────────┐
│ ← 헤더: ${idea.title}  │
├─────────────────────┤
│                     │
│ [핵심 콘텐츠 영역]    │
│                     │
│ ${features[0]}       │
│                     │
├─────────────────────┤
│ [빠른 액션 버튼들]    │
│                     │
│ ┌───┐ ┌───┐ ┌───┐  │
│ │ A │ │ B │ │ C │  │
│ └───┘ └───┘ └───┘  │
├─────────────────────┤
│ [하단 네비게이션]     │
│  홈  기록  설정      │
└─────────────────────┘
        `,
        notes: [
          'CTA 버튼은 화면 하단 thumb zone에 배치',
          '핵심 정보는 스크롤 없이 보이도록',
          '한 손 조작 최적화',
        ],
        components: ['Header', 'MainContent', 'QuickActions', 'BottomNav'],
      },
      {
        name: 'Feature Screen',
        description: '기능 상세 화면',
        layout: `
┌─────────────────────┐
│ ← 뒤로     완료 →   │
├─────────────────────┤
│                     │
│ [기능 타이틀]        │
│                     │
│ ┌─────────────────┐ │
│ │ 입력/선택 영역   │ │
│ │                 │ │
│ └─────────────────┘ │
│                     │
│ [안내 텍스트]        │
│                     │
├─────────────────────┤
│                     │
│ [    메인 CTA    ]  │
│                     │
└─────────────────────┘
        `,
        notes: [
          '목표 달성까지 최소 탭',
          '실시간 유효성 검사',
          '명확한 피드백',
        ],
        components: ['Header', 'InputSection', 'HelpText', 'CTAButton'],
      },
      {
        name: 'Result/Success Screen',
        description: '결과/성공 화면',
        layout: `
┌─────────────────────┐
│                     │
│    ✓ 성공 아이콘     │
│                     │
│   [성공 메시지]      │
│   "완료되었습니다"    │
│                     │
│   [상세 정보]        │
│                     │
├─────────────────────┤
│                     │
│ [   공유하기   ]    │
│                     │
│ [   홈으로   ]      │
│                     │
└─────────────────────┘
        `,
        notes: [
          '성취감을 주는 시각적 피드백',
          '다음 액션 제안',
          '공유 옵션 제공',
        ],
        components: ['SuccessIcon', 'Message', 'Details', 'ActionButtons'],
      },
      {
        name: 'Settings Screen',
        description: '설정 화면',
        layout: `
┌─────────────────────┐
│ ← 설정              │
├─────────────────────┤
│ [프로필 섹션]        │
│ 👤 사용자 이름       │
├─────────────────────┤
│ 알림 설정      [○ ]  │
│ 다크 모드      [  ○] │
│ 언어 설정      한국어 │
├─────────────────────┤
│ 이용약관        →    │
│ 개인정보처리방침 →    │
│ 버전 정보      1.0.0 │
├─────────────────────┤
│ [ 로그아웃 ]         │
└─────────────────────┘
        `,
        notes: ['그룹별 구분', '토글/선택 명확히', '중요도 순 배치'],
        components: ['ProfileSection', 'SettingsList', 'VersionInfo'],
      },
    ];
  }

  designComponentLibrary(idea) {
    return [
      {
        name: 'Button',
        description: '다용도 버튼 컴포넌트',
        variants: [
          { name: 'primary', bg: 'blue-500', text: 'white', usage: '주요 CTA' },
          { name: 'secondary', bg: 'gray-100', text: 'gray-900', usage: '보조 액션' },
          { name: 'outline', bg: 'transparent', border: 'gray-300', text: 'gray-700', usage: '덜 중요한 액션' },
          { name: 'ghost', bg: 'transparent', text: 'blue-500', usage: '텍스트 링크' },
          { name: 'danger', bg: 'red-500', text: 'white', usage: '삭제/위험 액션' },
        ],
        sizes: [
          { name: 'sm', height: 36, padding: '0 12px', fontSize: 14 },
          { name: 'md', height: 44, padding: '0 16px', fontSize: 16 },
          { name: 'lg', height: 52, padding: '0 20px', fontSize: 16 },
        ],
        states: ['default', 'hover', 'active', 'disabled', 'loading'],
        props: ['variant', 'size', 'disabled', 'loading', 'fullWidth', 'leftIcon', 'rightIcon'],
        code: `
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}
        `,
      },
      {
        name: 'Input',
        description: '텍스트 입력 필드',
        variants: ['default', 'search', 'password', 'number'],
        states: ['default', 'focus', 'error', 'disabled', 'readonly'],
        features: ['label', 'placeholder', 'helperText', 'errorMessage', 'clearButton', 'prefix', 'suffix'],
        props: ['type', 'value', 'onChange', 'placeholder', 'label', 'error', 'helperText', 'disabled'],
        code: `
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}
        `,
      },
      {
        name: 'Card',
        description: '콘텐츠 컨테이너',
        variants: ['default', 'outlined', 'elevated', 'interactive'],
        props: ['variant', 'padding', 'onClick', 'className'],
        usage: '관련 콘텐츠 그룹화, 리스트 아이템, 기능 카드',
      },
      {
        name: 'Modal',
        description: '모달 다이얼로그',
        variants: ['center', 'bottom-sheet', 'fullscreen'],
        features: ['backdrop', 'closeButton', 'animation', 'focusTrap'],
        props: ['isOpen', 'onClose', 'title', 'variant', 'showCloseButton'],
        animations: {
          center: 'fade + scale',
          bottomSheet: 'slide up',
          fullscreen: 'slide right',
        },
      },
      {
        name: 'Toast',
        description: '알림 메시지',
        variants: ['info', 'success', 'warning', 'error'],
        positions: ['top', 'bottom'],
        features: ['auto-dismiss', 'action button', 'progress'],
        props: ['message', 'type', 'duration', 'action', 'position'],
      },
      {
        name: 'List',
        description: '리스트 컴포넌트',
        variants: ['simple', 'detailed', 'selectable'],
        itemFeatures: ['avatar', 'title', 'subtitle', 'rightContent', 'onClick'],
        props: ['items', 'renderItem', 'onItemClick', 'emptyState'],
      },
      {
        name: 'BottomNav',
        description: '하단 네비게이션',
        maxItems: 5,
        itemFeatures: ['icon', 'label', 'badge'],
        activeIndicator: 'color change + scale',
      },
      {
        name: 'Header',
        description: '상단 헤더',
        variants: ['default', 'transparent', 'sticky'],
        features: ['backButton', 'title', 'rightActions', 'progressBar'],
        heights: { default: 56, large: 72 },
      },
      {
        name: 'Skeleton',
        description: '로딩 스켈레톤',
        variants: ['text', 'avatar', 'card', 'list'],
        animation: 'shimmer',
      },
      {
        name: 'EmptyState',
        description: '빈 상태 표시',
        features: ['icon/illustration', 'title', 'description', 'action'],
        usage: '데이터 없음, 검색 결과 없음, 에러 상태',
      },
    ];
  }

  defineUXPrinciples(idea) {
    return [
      {
        principle: '3초 법칙',
        description: '앱 실행 후 3초 내에 핵심 가치 전달',
        implementation: [
          '스플래시 화면 2초 이내',
          '메인 화면에서 즉시 핵심 기능 접근',
          '불필요한 온보딩 최소화',
        ],
        metric: 'Time to First Meaningful Interaction < 3s',
      },
      {
        principle: '한 손 사용 최적화',
        description: '엄지 손가락으로 모든 핵심 기능 접근',
        implementation: [
          'CTA 버튼 화면 하단 배치',
          '중요 액션은 thumb zone 내 배치',
          '상단 네비게이션 최소화',
        ],
        metric: '핵심 기능 도달 탭 수 < 3',
      },
      {
        principle: '즉각적 피드백',
        description: '모든 사용자 액션에 즉각적인 시각/촉각 피드백',
        implementation: [
          '버튼 탭 시 시각적 변화 (< 100ms)',
          'Haptic feedback 활용',
          '로딩 상태 명확히 표시',
        ],
        metric: 'Interaction Response Time < 100ms',
      },
      {
        principle: '인지 부하 최소화',
        description: '한 화면에 하나의 목표만 제시',
        implementation: [
          '화면당 주요 CTA 1개',
          '선택지 최대 5개 이하',
          '점진적 정보 공개 (Progressive Disclosure)',
        ],
        metric: 'Task Completion Rate > 90%',
      },
      {
        principle: '관용적 디자인',
        description: '실수를 예방하고, 쉽게 복구 가능하게',
        implementation: [
          '위험한 액션 전 확인 대화상자',
          '실행 취소(Undo) 기능 제공',
          '명확한 에러 메시지와 해결 방법',
        ],
        metric: 'Error Recovery Rate > 95%',
      },
      {
        principle: '일관성 유지',
        description: '토스 앱과 일관된 경험 제공',
        implementation: [
          '토스 디자인 시스템 준수',
          '동일 기능은 동일 패턴',
          '아이콘/용어 통일',
        ],
        metric: 'Learnability Score > 8/10',
      },
    ];
  }

  optimizeUserFlows(idea) {
    const features = idea.features || ['핵심 기능'];

    return {
      criticalPath: {
        name: '핵심 사용자 여정',
        goal: features[0],
        optimizedSteps: [
          { step: 1, action: '앱 실행', duration: '< 2초' },
          { step: 2, action: '메인 화면 확인', duration: '즉시' },
          { step: 3, action: 'CTA 탭', duration: '사용자' },
          { step: 4, action: '입력/선택', duration: '사용자' },
          { step: 5, action: '확인/완료', duration: '< 1초' },
        ],
        totalTaps: 3,
        optimization: '이상적인 플로우: 3탭 내 목표 달성',
      },
      onboarding: {
        recommendation: '점진적 온보딩',
        steps: [
          { type: 'permission', content: '필요한 권한만 요청', timing: '기능 사용 시점' },
          { type: 'tooltip', content: '컨텍스트 기반 가이드', timing: '첫 사용 시' },
          { type: 'empty-state', content: '빈 상태에서 시작 유도', timing: '첫 진입' },
        ],
        avoid: ['긴 튜토리얼', '강제 회원가입', '모든 권한 한번에 요청'],
      },
      retention: {
        triggers: [
          { type: '알림', content: `${features[0]} 리마인더`, frequency: '사용자 설정' },
          { type: '진행률', content: '스트릭/달성률 표시', location: '메인 화면' },
          { type: '보상', content: '마일스톤 달성 축하', timing: '목표 달성 시' },
        ],
      },
    };
  }

  createAccessibilityGuide() {
    return {
      colorContrast: {
        requirement: 'WCAG 2.1 AA 기준',
        minimumRatio: {
          normalText: '4.5:1',
          largeText: '3:1',
          uiComponents: '3:1',
        },
        implementation: '토스 컬러 시스템은 기본적으로 충족',
      },
      touchTarget: {
        minimum: '44x44px',
        recommended: '48x48px',
        spacing: '최소 8px 간격',
      },
      textScaling: {
        support: '최대 200% 확대 지원',
        implementation: 'rem/em 단위 사용',
      },
      screenReader: {
        requirements: [
          '모든 이미지에 alt 텍스트',
          '버튼에 명확한 레이블',
          '폼 필드에 연결된 라벨',
          '에러 상태 음성 안내',
        ],
      },
      motion: {
        preference: 'prefers-reduced-motion 미디어 쿼리 지원',
        implementation: '애니메이션 비활성화 옵션',
      },
    };
  }

  designMicroInteractions(idea) {
    return [
      {
        name: 'Button Press',
        trigger: '버튼 탭',
        animation: 'scale(0.98) + opacity 변화',
        duration: '100ms',
        css: `
.btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}`,
      },
      {
        name: 'Page Transition',
        trigger: '화면 이동',
        animation: 'slide-in from right',
        duration: '250ms',
        css: `
.page-enter {
  transform: translateX(100%);
}
.page-enter-active {
  transform: translateX(0);
  transition: transform 250ms ease-out;
}`,
      },
      {
        name: 'Pull to Refresh',
        trigger: '아래로 당기기',
        animation: '스피너 회전',
        feedback: 'haptic + visual',
      },
      {
        name: 'Success Feedback',
        trigger: '작업 완료',
        animation: '체크마크 draw + scale bounce',
        duration: '400ms',
      },
      {
        name: 'Error Shake',
        trigger: '입력 오류',
        animation: 'horizontal shake',
        duration: '300ms',
        css: `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}`,
      },
      {
        name: 'Skeleton Loading',
        trigger: '데이터 로딩',
        animation: 'shimmer gradient',
        duration: '1.5s infinite',
      },
      {
        name: 'Toast Appear',
        trigger: '알림 표시',
        animation: 'slide up + fade in',
        duration: '200ms',
      },
      {
        name: 'Modal Open',
        trigger: '모달 열기',
        animation: 'backdrop fade + content scale',
        duration: '200ms',
      },
    ];
  }

  createResponsiveGuide() {
    return {
      approach: 'Mobile-First',
      breakpoints: {
        sm: '360px - 기본 (최소 지원)',
        md: '390px - 표준 (iPhone 14 등)',
        lg: '428px - 대형 (Pro Max 등)',
      },
      strategy: [
        '고정 픽셀 대신 상대 단위 사용',
        'minmax(), clamp() 활용',
        '컨테이너 쿼리 고려',
      ],
      safeAreas: {
        top: 'env(safe-area-inset-top)',
        bottom: 'env(safe-area-inset-bottom)',
        implementation: '노치/홈 인디케이터 영역 고려',
      },
      flexibleLayouts: [
        'Flexbox 기반 레이아웃',
        '컨텐츠 기반 너비',
        '최소/최대 너비 설정',
      ],
    };
  }

  generateCSSVariables(designSystem) {
    return `
:root {
  /* Colors - Primary */
  --color-primary: ${designSystem.colors.blue[500]};
  --color-primary-light: ${designSystem.colors.blue[100]};
  --color-primary-dark: ${designSystem.colors.blue[700]};

  /* Colors - Gray Scale */
  --color-gray-50: ${designSystem.colors.gray[50]};
  --color-gray-100: ${designSystem.colors.gray[100]};
  --color-gray-200: ${designSystem.colors.gray[200]};
  --color-gray-300: ${designSystem.colors.gray[300]};
  --color-gray-400: ${designSystem.colors.gray[400]};
  --color-gray-500: ${designSystem.colors.gray[500]};
  --color-gray-600: ${designSystem.colors.gray[600]};
  --color-gray-700: ${designSystem.colors.gray[700]};
  --color-gray-800: ${designSystem.colors.gray[800]};
  --color-gray-900: ${designSystem.colors.gray[900]};

  /* Colors - Semantic */
  --color-success: ${designSystem.colors.semantic.success};
  --color-warning: ${designSystem.colors.semantic.warning};
  --color-error: ${designSystem.colors.semantic.error};
  --color-info: ${designSystem.colors.semantic.info};

  /* Spacing */
  --spacing-xs: ${designSystem.spacing.xs}px;
  --spacing-sm: ${designSystem.spacing.sm}px;
  --spacing-md: ${designSystem.spacing.md}px;
  --spacing-lg: ${designSystem.spacing.lg}px;
  --spacing-xl: ${designSystem.spacing.xl}px;

  /* Border Radius */
  --radius-sm: ${designSystem.borderRadius.sm}px;
  --radius-md: ${designSystem.borderRadius.md}px;
  --radius-lg: ${designSystem.borderRadius.lg}px;
  --radius-full: ${designSystem.borderRadius.full}px;

  /* Shadows */
  --shadow-sm: ${designSystem.shadow.sm};
  --shadow-md: ${designSystem.shadow.md};
  --shadow-lg: ${designSystem.shadow.lg};

  /* Animation */
  --duration-fast: ${designSystem.animation.duration.fast};
  --duration-normal: ${designSystem.animation.duration.normal};
  --duration-slow: ${designSystem.animation.duration.slow};
  --easing-default: ${designSystem.animation.easing.default};
}
    `.trim();
  }

  generateTailwindExtension(designSystem) {
    return {
      theme: {
        extend: {
          colors: {
            toss: {
              blue: designSystem.colors.blue,
              gray: designSystem.colors.gray,
            },
            success: designSystem.colors.semantic.success,
            warning: designSystem.colors.semantic.warning,
            error: designSystem.colors.semantic.error,
          },
          borderRadius: {
            DEFAULT: `${designSystem.borderRadius.default}px`,
          },
          boxShadow: {
            toss: designSystem.shadow.md,
          },
          transitionDuration: {
            fast: designSystem.animation.duration.fast,
            normal: designSystem.animation.duration.normal,
          },
        },
      },
    };
  }
}
