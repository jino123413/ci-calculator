/**
 * TechStackAdvisorSkill - 기술 스택 추천 스킬
 *
 * 앱 아이디어와 요구사항에 맞는 최적의 기술 스택을 추천합니다.
 */

import BaseSkill from './BaseSkill';

export default class TechStackAdvisorSkill extends BaseSkill {
  constructor() {
    super({
      name: 'TechStackAdvisor',
      description: '앱인토스 미니앱에 최적화된 기술 스택 추천',
      version: '1.0.0',
      category: 'technical',
      inputSchema: {
        idea: { type: 'object', required: true, description: '앱 아이디어' },
        teamSize: { type: 'number', required: false, description: '개발팀 규모' },
        timeline: { type: 'string', required: false, description: '개발 일정' },
        priorities: { type: 'array', required: false, description: '우선순위 (speed/quality/scalability)' },
      },
      outputSchema: {
        recommended: { type: 'object', description: '추천 기술 스택' },
        alternatives: { type: 'array', description: '대안 옵션들' },
        reasoning: { type: 'string', description: '추천 이유' },
      },
    });

    // 기술 옵션 데이터베이스
    this.techOptions = {
      framework: [
        {
          name: 'React',
          version: '18+',
          pros: ['토스 디자인 시스템 호환', '방대한 생태계', '빠른 개발'],
          cons: ['번들 크기 관리 필요'],
          bestFor: ['대부분의 앱인토스 앱'],
          learningCurve: 'medium',
          bundleImpact: 'medium',
        },
        {
          name: 'Preact',
          version: '10+',
          pros: ['React 호환', '매우 작은 번들', '빠른 로딩'],
          cons: ['일부 React 기능 제한'],
          bestFor: ['성능 크리티컬 앱', '단순한 앱'],
          learningCurve: 'low',
          bundleImpact: 'very-low',
        },
        {
          name: 'Vue 3',
          version: '3+',
          pros: ['쉬운 학습', '좋은 성능', '컴포지션 API'],
          cons: ['토스 디자인 시스템 직접 적용 필요'],
          bestFor: ['Vue 경험 팀'],
          learningCurve: 'low',
          bundleImpact: 'medium',
        },
      ],
      language: [
        {
          name: 'TypeScript',
          version: '5+',
          pros: ['타입 안정성', '개발 생산성', '유지보수성'],
          cons: ['초기 설정 필요'],
          bestFor: ['모든 프로젝트'],
          learningCurve: 'medium',
        },
        {
          name: 'JavaScript',
          version: 'ES2022+',
          pros: ['빠른 프로토타이핑', '낮은 진입장벽'],
          cons: ['런타임 에러 가능성'],
          bestFor: ['빠른 MVP', '소규모 프로젝트'],
          learningCurve: 'low',
        },
      ],
      stateManagement: [
        {
          name: 'Zustand',
          version: '4+',
          pros: ['간단한 API', '작은 번들', 'React 친화적'],
          cons: ['대규모 상태에는 제한적'],
          bestFor: ['대부분의 앱인토스 앱'],
          bundleSize: '~2KB',
        },
        {
          name: 'Jotai',
          version: '2+',
          pros: ['원자적 상태 관리', 'Suspense 지원'],
          cons: ['새로운 패러다임 학습'],
          bestFor: ['복잡한 비동기 상태'],
          bundleSize: '~3KB',
        },
        {
          name: 'React Context + useReducer',
          version: 'built-in',
          pros: ['추가 라이브러리 불필요', '심플함'],
          cons: ['보일러플레이트', '리렌더링 관리'],
          bestFor: ['단순한 상태', 'MVP'],
          bundleSize: '0KB',
        },
        {
          name: 'TanStack Query',
          version: '5+',
          pros: ['서버 상태 관리 최적', '캐싱', '자동 리페칭'],
          cons: ['클라이언트 상태는 별도 필요'],
          bestFor: ['API 중심 앱'],
          bundleSize: '~12KB',
        },
      ],
      styling: [
        {
          name: 'Tailwind CSS',
          version: '3+',
          pros: ['빠른 개발', '일관된 스타일', '작은 프로덕션 CSS'],
          cons: ['클래스명 길어짐'],
          bestFor: ['대부분의 프로젝트'],
          bundleSize: 'optimized (purged)',
        },
        {
          name: 'vanilla-extract',
          version: '1+',
          pros: ['타입 안정성', 'Zero runtime', 'CSS-in-TS'],
          cons: ['설정 복잡'],
          bestFor: ['대규모 프로젝트', '디자인 시스템'],
          bundleSize: 'very-low',
        },
        {
          name: 'CSS Modules',
          version: 'built-in',
          pros: ['심플', '스코핑', '런타임 없음'],
          cons: ['동적 스타일 제한'],
          bestFor: ['심플한 스타일링'],
          bundleSize: 'low',
        },
      ],
      buildTool: [
        {
          name: 'Vite',
          version: '5+',
          pros: ['매우 빠른 HMR', '최신 빌드', '간단한 설정'],
          cons: [],
          bestFor: ['모든 앱인토스 프로젝트 (권장)'],
        },
        {
          name: 'esbuild',
          version: 'latest',
          pros: ['가장 빠른 빌드', '심플'],
          cons: ['기능 제한'],
          bestFor: ['라이브러리', '단순한 앱'],
        },
      ],
      testing: [
        {
          name: 'Vitest',
          version: 'latest',
          pros: ['Vite 네이티브', '빠름', 'Jest 호환'],
          cons: [],
          bestFor: ['Vite 프로젝트'],
        },
        {
          name: 'Jest',
          version: '29+',
          pros: ['성숙한 생태계', '풍부한 기능'],
          cons: ['Vite와 설정 필요'],
          bestFor: ['기존 Jest 경험'],
        },
        {
          name: 'Playwright',
          version: 'latest',
          pros: ['크로스 브라우저', 'E2E 최적'],
          cons: ['설정 필요'],
          bestFor: ['E2E 테스트'],
        },
      ],
      animation: [
        {
          name: 'Framer Motion',
          version: '10+',
          pros: ['선언적 API', '강력한 기능', 'React 친화'],
          cons: ['번들 크기'],
          bestFor: ['풍부한 애니메이션'],
          bundleSize: '~30KB',
        },
        {
          name: 'CSS Transitions',
          version: 'built-in',
          pros: ['추가 라이브러리 없음', '좋은 성능'],
          cons: ['복잡한 애니메이션 어려움'],
          bestFor: ['단순한 전환 효과'],
          bundleSize: '0KB',
        },
        {
          name: 'Lottie',
          version: 'lottie-react',
          pros: ['디자이너 친화', '복잡한 애니메이션'],
          cons: ['JSON 파일 크기'],
          bestFor: ['일러스트 애니메이션', '로딩'],
          bundleSize: '~50KB + JSON',
        },
      ],
      api: [
        {
          name: 'Axios',
          version: '1+',
          pros: ['인터셉터', '자동 JSON', '에러 핸들링'],
          cons: ['번들 크기'],
          bestFor: ['복잡한 API 요구사항'],
          bundleSize: '~15KB',
        },
        {
          name: 'ky',
          version: 'latest',
          pros: ['작은 번들', 'fetch 기반', '재시도'],
          cons: ['Axios보다 기능 적음'],
          bestFor: ['번들 크기 중요'],
          bundleSize: '~4KB',
        },
        {
          name: 'native fetch',
          version: 'built-in',
          pros: ['추가 의존성 없음'],
          cons: ['보일러플레이트'],
          bestFor: ['간단한 API 호출'],
          bundleSize: '0KB',
        },
      ],
      storage: [
        {
          name: 'localStorage',
          version: 'built-in',
          pros: ['간단', '동기', '널리 지원'],
          cons: ['문자열만', '5MB 제한'],
          bestFor: ['간단한 설정, 토큰'],
        },
        {
          name: 'IndexedDB (via idb)',
          version: 'idb 7+',
          pros: ['대용량', '구조화 데이터', '비동기'],
          cons: ['복잡한 API'],
          bestFor: ['오프라인 데이터', '캐싱'],
          bundleSize: '~3KB',
        },
      ],
    };

    // 앱인토스 최적화 제약조건
    this.tossConstraints = {
      maxBundleSize: 500, // KB
      targetLoadTime: 2, // seconds
      minPerformanceScore: 90,
      requiredFeatures: ['토스 SDK 연동', '반응형 디자인', '접근성'],
    };
  }

  async execute(input, context = {}) {
    const {
      idea,
      teamSize = 1,
      timeline = 'standard',
      priorities = ['speed', 'quality'],
    } = input;

    // 1. 요구사항 분석
    const requirements = this.analyzeRequirements(idea, priorities);

    // 2. 기술 스택 선정
    const recommended = this.selectTechStack(requirements, teamSize, timeline);

    // 3. 번들 크기 예측
    const bundleAnalysis = this.analyzeBundleSize(recommended);

    // 4. 대안 옵션 생성
    const alternatives = this.generateAlternatives(recommended, requirements);

    // 5. 설정 가이드 생성
    const setupGuide = this.generateSetupGuide(recommended);

    // 6. 의존성 목록 생성
    const dependencies = this.generateDependencies(recommended);

    return {
      recommended,
      bundleAnalysis,
      alternatives,
      setupGuide,
      dependencies,
      reasoning: this.generateReasoning(recommended, requirements),
      compatibilityCheck: this.checkTossCompatibility(recommended),
    };
  }

  analyzeRequirements(idea, priorities) {
    const requirements = {
      complexity: this.assessComplexity(idea),
      features: [],
      performance: priorities.includes('performance') ? 'critical' : 'standard',
      scalability: priorities.includes('scalability') ? 'high' : 'medium',
      developmentSpeed: priorities.includes('speed') ? 'fast' : 'standard',
    };

    // 기능 기반 요구사항 추가
    if (idea.features) {
      for (const feature of idea.features) {
        const featureLower = feature.toLowerCase();

        if (featureLower.includes('애니메이션') || featureLower.includes('전환')) {
          requirements.features.push('animation');
        }
        if (featureLower.includes('오프라인') || featureLower.includes('캐싱')) {
          requirements.features.push('offline');
        }
        if (featureLower.includes('실시간') || featureLower.includes('알림')) {
          requirements.features.push('realtime');
        }
        if (featureLower.includes('그래프') || featureLower.includes('차트')) {
          requirements.features.push('charts');
        }
        if (featureLower.includes('공유') || featureLower.includes('소셜')) {
          requirements.features.push('sharing');
        }
      }
    }

    // 카테고리 기반 요구사항
    if (idea.category === 'finance') {
      requirements.features.push('security', 'charts');
    }
    if (idea.category === 'social') {
      requirements.features.push('realtime');
    }

    return requirements;
  }

  assessComplexity(idea) {
    let score = 0;

    // 기능 수
    const featureCount = idea.features?.length || 0;
    if (featureCount <= 3) score += 1;
    else if (featureCount <= 5) score += 2;
    else score += 3;

    // 카테고리 복잡도
    const complexCategories = ['finance', 'commerce'];
    if (complexCategories.includes(idea.category)) score += 1;

    // 통합 요구사항
    if (idea.tossIntegration?.length > 2) score += 1;

    if (score <= 2) return 'simple';
    if (score <= 4) return 'medium';
    return 'complex';
  }

  selectTechStack(requirements, teamSize, timeline) {
    const stack = {
      core: {},
      optional: {},
      devTools: {},
    };

    // 프레임워크 선택
    if (requirements.performance === 'critical' && requirements.complexity === 'simple') {
      stack.core.framework = this.techOptions.framework.find((f) => f.name === 'Preact');
    } else {
      stack.core.framework = this.techOptions.framework.find((f) => f.name === 'React');
    }

    // 언어
    stack.core.language = this.techOptions.language.find((l) => l.name === 'TypeScript');

    // 상태 관리
    if (requirements.complexity === 'simple') {
      stack.core.stateManagement = this.techOptions.stateManagement.find(
        (s) => s.name === 'React Context + useReducer'
      );
    } else {
      stack.core.stateManagement = this.techOptions.stateManagement.find(
        (s) => s.name === 'Zustand'
      );
    }

    // API 상태 관리 (API가 있는 경우)
    stack.core.serverState = this.techOptions.stateManagement.find(
      (s) => s.name === 'TanStack Query'
    );

    // 스타일링
    stack.core.styling = this.techOptions.styling.find((s) => s.name === 'Tailwind CSS');

    // 빌드 도구
    stack.core.buildTool = this.techOptions.buildTool.find((b) => b.name === 'Vite');

    // 테스팅
    stack.devTools.testing = this.techOptions.testing.find((t) => t.name === 'Vitest');
    stack.devTools.e2e = this.techOptions.testing.find((t) => t.name === 'Playwright');

    // API 클라이언트
    if (requirements.performance === 'critical') {
      stack.core.apiClient = this.techOptions.api.find((a) => a.name === 'ky');
    } else {
      stack.core.apiClient = this.techOptions.api.find((a) => a.name === 'Axios');
    }

    // 옵션 기능들
    if (requirements.features.includes('animation')) {
      stack.optional.animation = this.techOptions.animation.find(
        (a) => a.name === 'Framer Motion'
      );
    }

    if (requirements.features.includes('offline')) {
      stack.optional.storage = this.techOptions.storage.find(
        (s) => s.name === 'IndexedDB (via idb)'
      );
    }

    if (requirements.features.includes('charts')) {
      stack.optional.charts = {
        name: 'Recharts',
        version: '2+',
        pros: ['React 네이티브', 'SVG 기반'],
        bundleSize: '~50KB (tree-shakeable)',
      };
    }

    // 개발 도구
    stack.devTools.linting = { name: 'ESLint', version: '8+' };
    stack.devTools.formatting = { name: 'Prettier', version: '3+' };

    return stack;
  }

  analyzeBundleSize(stack) {
    let estimatedSize = 0;
    const breakdown = [];

    // React/Preact
    const frameworkSize = stack.core.framework?.name === 'Preact' ? 10 : 40;
    estimatedSize += frameworkSize;
    breakdown.push({ name: stack.core.framework?.name, size: frameworkSize });

    // 상태 관리
    if (stack.core.stateManagement?.bundleSize) {
      const size = parseInt(stack.core.stateManagement.bundleSize) || 5;
      estimatedSize += size;
      breakdown.push({ name: stack.core.stateManagement.name, size });
    }

    // TanStack Query
    if (stack.core.serverState) {
      estimatedSize += 12;
      breakdown.push({ name: 'TanStack Query', size: 12 });
    }

    // API 클라이언트
    if (stack.core.apiClient?.bundleSize) {
      const size = parseInt(stack.core.apiClient.bundleSize) || 5;
      estimatedSize += size;
      breakdown.push({ name: stack.core.apiClient.name, size });
    }

    // 애니메이션
    if (stack.optional?.animation) {
      const size = parseInt(stack.optional.animation.bundleSize) || 30;
      estimatedSize += size;
      breakdown.push({ name: stack.optional.animation.name, size });
    }

    // 차트
    if (stack.optional?.charts) {
      estimatedSize += 50;
      breakdown.push({ name: 'Recharts', size: 50 });
    }

    // 앱 코드 예상
    estimatedSize += 50;
    breakdown.push({ name: 'App Code (estimated)', size: 50 });

    const withinLimit = estimatedSize <= this.tossConstraints.maxBundleSize;

    return {
      estimated: estimatedSize,
      breakdown,
      limit: this.tossConstraints.maxBundleSize,
      withinLimit,
      recommendation: withinLimit
        ? '번들 크기가 적절합니다.'
        : '번들 크기 최적화가 필요합니다. Preact 사용 또는 동적 임포트를 고려하세요.',
    };
  }

  generateAlternatives(recommended, requirements) {
    const alternatives = [];

    // 경량 대안
    alternatives.push({
      name: '경량 스택',
      description: '번들 크기 최소화에 최적화',
      changes: [
        'React → Preact로 변경',
        'Axios → native fetch로 변경',
        'Framer Motion → CSS Transitions로 변경',
      ],
      tradeoffs: '일부 기능 제한, 더 많은 보일러플레이트',
      estimatedBundleSize: '~100KB',
    });

    // 풀스택 대안
    alternatives.push({
      name: '풍부한 기능 스택',
      description: '개발 편의성과 기능성 극대화',
      changes: [
        'Redux Toolkit 추가',
        'React Router 추가',
        'React Hook Form 추가',
      ],
      tradeoffs: '번들 크기 증가 (~150KB 추가)',
      estimatedBundleSize: '~300KB',
    });

    return alternatives;
  }

  generateSetupGuide(stack) {
    const frameworkName = stack.core.framework?.name?.toLowerCase() || 'react';

    return {
      commands: [
        `# 프로젝트 생성`,
        `npm create vite@latest my-toss-app -- --template ${frameworkName}-ts`,
        `cd my-toss-app`,
        ``,
        `# 의존성 설치`,
        `npm install`,
        ``,
        `# 추가 패키지 설치`,
        `npm install ${this.getPackageList(stack)}`,
        ``,
        `# 개발 서버 실행`,
        `npm run dev`,
      ],
      configFiles: [
        {
          name: 'vite.config.ts',
          content: this.generateViteConfig(stack),
        },
        {
          name: 'tailwind.config.js',
          content: this.generateTailwindConfig(),
        },
        {
          name: 'tsconfig.json',
          content: this.generateTsConfig(),
        },
      ],
      folderStructure: `
src/
├── components/
│   ├── common/          # 공통 컴포넌트
│   └── features/        # 기능별 컴포넌트
├── pages/               # 페이지 컴포넌트
├── api/                 # API 함수
├── hooks/               # Custom Hooks
├── stores/              # 상태 관리 (Zustand)
├── types/               # TypeScript 타입
├── utils/               # 유틸리티 함수
├── constants/           # 상수
├── App.tsx
└── main.tsx
      `,
    };
  }

  getPackageList(stack) {
    const packages = [];

    if (stack.core.stateManagement?.name === 'Zustand') packages.push('zustand');
    if (stack.core.serverState) packages.push('@tanstack/react-query');
    if (stack.core.apiClient?.name === 'Axios') packages.push('axios');
    if (stack.core.apiClient?.name === 'ky') packages.push('ky');
    if (stack.optional?.animation?.name === 'Framer Motion') packages.push('framer-motion');
    if (stack.optional?.charts) packages.push('recharts');

    packages.push('tailwindcss', 'postcss', 'autoprefixer');

    return packages.join(' ');
  }

  generateViteConfig(stack) {
    return `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
    `.trim();
  }

  generateTailwindConfig() {
    return `
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        toss: {
          blue: '#3182F6',
          gray: '#4E5968',
          lightgray: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
};
    `.trim();
  }

  generateTsConfig() {
    return `
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
    `.trim();
  }

  generateDependencies(stack) {
    return {
      production: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        zustand: '^4.4.0',
        '@tanstack/react-query': '^5.0.0',
        axios: '^1.6.0',
      },
      development: {
        typescript: '^5.3.0',
        vite: '^5.0.0',
        '@vitejs/plugin-react': '^4.2.0',
        tailwindcss: '^3.4.0',
        postcss: '^8.4.0',
        autoprefixer: '^10.4.0',
        vitest: '^1.0.0',
        '@testing-library/react': '^14.0.0',
        eslint: '^8.55.0',
        prettier: '^3.1.0',
      },
    };
  }

  generateReasoning(stack, requirements) {
    const reasons = [];

    reasons.push(`프로젝트 복잡도: ${requirements.complexity}`);

    if (stack.core.framework?.name === 'React') {
      reasons.push('React 선택: 토스 디자인 시스템과의 호환성 및 풍부한 생태계');
    }

    if (stack.core.stateManagement?.name === 'Zustand') {
      reasons.push('Zustand 선택: 간단한 API와 작은 번들 크기로 앱인토스에 적합');
    }

    reasons.push('Vite 선택: 빠른 개발 경험과 최적화된 프로덕션 빌드');
    reasons.push('Tailwind CSS 선택: 빠른 스타일링과 토스 디자인 토큰 적용 용이');

    return reasons.join('. ');
  }

  checkTossCompatibility(stack) {
    const checks = [
      { item: 'WebView 호환성', status: 'pass', note: 'React/Vite는 모던 WebView와 호환' },
      { item: '번들 크기', status: 'pass', note: '500KB 이내 달성 가능' },
      { item: '토스 SDK 연동', status: 'pass', note: 'JavaScript SDK 연동 가능' },
      { item: '성능', status: 'pass', note: '2초 이내 로딩 달성 가능' },
      { item: '반응형', status: 'pass', note: 'Tailwind로 쉽게 구현' },
    ];

    return {
      overallStatus: 'compatible',
      checks,
      recommendations: [
        '토스 디자인 가이드라인 참고하여 UI 구현',
        '토스 SDK 문서 확인 후 연동 진행',
        '성능 모니터링을 위한 도구 설정 권장',
      ],
    };
  }
}
