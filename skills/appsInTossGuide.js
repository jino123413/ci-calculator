/**
 * AppsInTossGuideSkill
 *
 * 앱인토스 개발 가이드를 제공하는 스킬
 * 크롤링된 공식 문서 데이터를 기반으로 개발자에게 가이드 제공
 */

import BaseSkill from './BaseSkill.js';
import fs from 'fs';
import path from 'path';

class AppsInTossGuideSkill extends BaseSkill {
  constructor() {
    super();
    this.guideData = null;
    this.loadGuideData();
  }

  /**
   * 가이드 데이터 로드
   */
  loadGuideData() {
    try {
      const guidePath = path.join(process.cwd(), 'docs', 'apps-in-toss-complete-guide.json');
      const data = fs.readFileSync(guidePath, 'utf8');
      this.guideData = JSON.parse(data);
    } catch (error) {
      console.warn('Failed to load guide data:', error.message);
      this.guideData = null;
    }
  }

  getMetadata() {
    return {
      name: 'appsInTossGuide',
      description: '앱인토스 개발 가이드 제공 (디자인, WebView, React Native, API, SDK 등)',
      version: '1.0.0',
      author: 'Apps in Toss Team',
      tags: ['guide', 'documentation', 'reference', 'apps-in-toss'],
      inputSchema: {
        topic: {
          type: 'string',
          required: true,
          description: '가이드 주제 (design, webview, reactnative, tds, authentication, payment, marketing, launch, api, sdk)',
          enum: ['design', 'webview', 'reactnative', 'tds', 'authentication', 'payment', 'marketing', 'launch', 'api', 'sdk', 'all']
        },
        subtopic: {
          type: 'string',
          required: false,
          description: '세부 주제 (선택사항)'
        },
        format: {
          type: 'string',
          required: false,
          default: 'summary',
          description: '응답 형식 (summary, detailed, code, checklist)',
          enum: ['summary', 'detailed', 'code', 'checklist']
        }
      }
    };
  }

  validateInput(input) {
    const errors = [];

    if (!input.topic) {
      errors.push('topic은 필수 파라미터입니다');
    }

    const validTopics = ['design', 'webview', 'reactnative', 'tds', 'authentication', 'payment', 'marketing', 'launch', 'api', 'sdk', 'all'];
    if (input.topic && !validTopics.includes(input.topic)) {
      errors.push(`topic은 다음 중 하나여야 합니다: ${validTopics.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async execute(input) {
    if (!this.guideData) {
      return {
        success: false,
        error: 'Guide data not loaded. Please check if docs/apps-in-toss-complete-guide.json exists.'
      };
    }

    const { topic, subtopic, format = 'summary' } = input;

    switch (topic) {
      case 'design':
        return this.getDesignGuide(subtopic, format);

      case 'webview':
        return this.getWebViewGuide(subtopic, format);

      case 'reactnative':
        return this.getReactNativeGuide(subtopic, format);

      case 'tds':
        return this.getTDSGuide(subtopic, format);

      case 'authentication':
        return this.getAuthenticationGuide(subtopic, format);

      case 'payment':
        return this.getPaymentGuide(subtopic, format);

      case 'marketing':
        return this.getMarketingGuide(subtopic, format);

      case 'launch':
        return this.getLaunchGuide(format);

      case 'api':
        return this.getAPIGuide(subtopic, format);

      case 'sdk':
        return this.getSDKGuide(format);

      case 'all':
        return this.getAllGuides();

      default:
        return {
          success: false,
          error: `Unknown topic: ${topic}`
        };
    }
  }

  /**
   * 디자인 가이드
   */
  getDesignGuide(subtopic, format) {
    const designData = this.guideData.design;

    if (subtopic === 'branding') {
      return {
        success: true,
        guide: {
          title: '브랜딩 가이드라인',
          data: designData.brandingGuidelines,
          tips: [
            '로고는 600×600px 정사각형, 각진 모서리',
            '한글 이름 사용 권장',
            '브랜드 컬러는 Hex 형식',
            '라이트/다크 모드 모두 배경 필요'
          ]
        }
      };
    }

    if (subtopic === 'ux-writing') {
      return {
        success: true,
        guide: {
          title: 'UX 라이팅 가이드',
          data: designData.uxWriting,
          examples: [
            { wrong: '저장됐어요', right: '저장했어요' },
            { wrong: '사용할 수 없어요', right: '연결하면 사용할 수 있어요' },
            { wrong: '사용자께', right: '사용자에게' }
          ]
        }
      };
    }

    if (subtopic === 'dark-pattern') {
      return {
        success: true,
        guide: {
          title: '다크 패턴 방지 정책',
          data: designData.darkPatternPrevention,
          criticalRules: [
            '진입 시 전면 바텀시트 금지',
            '이탈 시 동의 요청 금지',
            '거절 옵션 필수 제공',
            '광고 타이밍 조절',
            '명확한 CTA 문구'
          ]
        }
      };
    }

    // 전체 디자인 가이드
    return {
      success: true,
      guide: {
        title: '디자인 가이드 전체',
        sections: {
          branding: designData.brandingGuidelines,
          uxWriting: designData.uxWriting,
          darkPattern: designData.darkPatternPrevention,
          tds: designData.tds
        },
        quickStart: [
          '1. 로고 준비 (600×600px, 각진 모서리)',
          '2. 브랜드 컬러 결정 (Hex)',
          '3. UX 라이팅 원칙 숙지 (해요체)',
          '4. 다크 패턴 회피',
          '5. TDS 컴포넌트 활용'
        ]
      }
    };
  }

  /**
   * WebView 개발 가이드
   */
  getWebViewGuide(subtopic, format) {
    const webviewData = this.guideData.development.webview;

    if (format === 'code') {
      return {
        success: true,
        guide: {
          title: 'WebView 코드 예제',
          setup: {
            newProject: 'npm create vite@latest my-app -- --template react-ts',
            install: 'npm install @apps-in-toss/web-framework',
            init: 'npx ait init'
          },
          config: `// granite.config.ts
export default {
  appName: 'my-mini-app',
  displayName: '내 미니앱',
  primaryColor: '#3182F6',
  icon: '/icon.png',
  web: {
    host: 'localhost',
    port: 8081,
    commands: {
      dev: 'npm run dev',
      build: 'npm run build'
    },
    outdir: 'dist'
  }
}`,
          testing: {
            local: 'npm run dev',
            android: 'adb reverse tcp:8081 tcp:8081',
            ios: 'WiFi 연결 + IP 주소 입력'
          }
        }
      };
    }

    if (format === 'checklist') {
      return {
        success: true,
        guide: {
          title: 'WebView 개발 체크리스트',
          checklist: [
            { item: 'Vite + React + TypeScript 프로젝트 생성', done: false },
            { item: '@apps-in-toss/web-framework 설치', done: false },
            { item: 'granite.config.ts 설정', done: false },
            { item: 'TDS 컴포넌트 설치 (비게임 필수)', done: false },
            { item: '로컬 개발 서버 실행 확인', done: false },
            { item: 'Android/iOS 테스트 완료', done: false },
            { item: '빌드 출력 디렉토리 확인', done: false },
            { item: '콘솔에 앱 등록', done: false }
          ]
        }
      };
    }

    return {
      success: true,
      guide: {
        title: 'WebView 개발 가이드',
        data: webviewData,
        keyPoints: [
          'Vite + React + TypeScript 권장',
          'granite.config.ts 필수 설정',
          '비게임 앱은 TDS 필수',
          'build 출력이 outdir과 일치해야 함',
          'Android는 adb reverse로 포트 포워딩'
        ]
      }
    };
  }

  /**
   * React Native 개발 가이드
   */
  getReactNativeGuide(subtopic, format) {
    const rnData = this.guideData.development.reactNative;

    if (format === 'code') {
      return {
        success: true,
        guide: {
          title: 'React Native 코드 예제',
          setup: 'npm create granite-app',
          config: `// granite.config.ts
export default {
  appName: 'my-mini-app',
  displayName: '내 미니앱',
  primaryColor: '#3182F6',
  icon: 'https://example.com/icon.png'
}`,
          routing: `// pages/index.tsx → intoss://my-mini-app
// pages/detail.tsx → intoss://my-mini-app/detail
// pages/item/[id].tsx → intoss://my-mini-app/item/:id`,
          register: `// pages/_app.tsx
import { AppsInToss } from '@apps-in-toss/framework';

export default AppsInToss.registerApp(AppContainer, { context });`
        }
      };
    }

    return {
      success: true,
      guide: {
        title: 'React Native 개발 가이드',
        data: rnData,
        keyPoints: [
          'Granite 앱 생성으로 시작',
          '파일 기반 라우팅 (Next.js 방식)',
          'intoss:// URL scheme 사용',
          'TDS React Native 필수 (비게임)',
          '.ait 번들 파일 생성'
        ]
      }
    };
  }

  /**
   * TDS 가이드
   */
  getTDSGuide(subtopic, format) {
    const tdsData = this.guideData.design.tds;

    return {
      success: true,
      guide: {
        title: 'TDS (Toss Design System) 가이드',
        overview: tdsData.overview,
        benefits: tdsData.benefits,
        components: tdsData.components,
        typography: tdsData.typography,
        docs: {
          webview: tdsData.webviewDocs,
          reactNative: tdsData.reactNativeDocs
        },
        usageNote: '비게임 WebView/React Native 앱은 TDS 필수 사용'
      }
    };
  }

  /**
   * 인증 가이드
   */
  getAuthenticationGuide(subtopic, format) {
    const authData = this.guideData.authentication;

    if (subtopic === 'toss-login') {
      return {
        success: true,
        guide: {
          title: '토스 로그인 가이드',
          flow: authData.tossLogin.flow,
          tokenLifecycle: authData.tossLogin.tokenLifecycle,
          apiEndpoints: authData.tossLogin.apiEndpoints,
          encryption: authData.tossLogin.encryption,
          example: `// SDK 사용 예제
import { Login } from '@apps-in-toss/web-framework';

const { code, referrer } = await Login.appLogin();
// code: Authorization Code (10분 유효)
// referrer: "sandbox" 또는 "DEFAULT"`
        }
      };
    }

    return {
      success: true,
      guide: {
        title: '인증 시스템 전체 가이드',
        tossLogin: authData.tossLogin,
        gameLogin: authData.gameLogin,
        tossAuth: authData.tossAuth,
        criticalNote: '토스 로그인만 허용 (타 로그인 불가)'
      }
    };
  }

  /**
   * 결제 가이드
   */
  getPaymentGuide(subtopic, format) {
    const paymentData = this.guideData.payment;

    if (subtopic === 'toss-pay') {
      if (format === 'code') {
        return {
          success: true,
          guide: {
            title: '토스페이 코드 예제',
            createPayment: `// 1. 결제 생성
POST https://pay-apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/pay/make-payment
Headers: { "x-toss-user-key": "{userKey}" }
Body: {
  "orderNo": "ORDER123456",
  "productDesc": "상품명",
  "amount": 10000,
  "amountTaxFree": 0,
  "isTestPayment": false
}`,
            executePayment: `// 2. 결제 실행
POST /api-partner/v1/apps-in-toss/pay/execute-payment
Body: {
  "paymentId": "{paymentId}",
  "orderNo": "ORDER123456"
}`
          }
        };
      }

      return {
        success: true,
        guide: {
          title: '토스페이 가이드',
          flow: paymentData.tossPay.flow,
          baseUrl: paymentData.tossPay.baseUrl,
          endpoints: paymentData.tossPay.apiEndpoints,
          requiredParams: paymentData.tossPay.requiredParams,
          states: paymentData.tossPay.transactionStates,
          errorCodes: paymentData.tossPay.errorCodes
        }
      };
    }

    if (subtopic === 'iap') {
      return {
        success: true,
        guide: {
          title: '인앱 구매 (IAP) 가이드',
          requirements: paymentData.iap.requirements,
          flow: paymentData.iap.flow,
          sdkMethods: paymentData.iap.sdkMethods,
          criticalScenarios: paymentData.iap.criticalScenarios,
          warning: '결제 완료 but 상품 미지급 시 getPendingOrders()로 복구 필수!'
        }
      };
    }

    return {
      success: true,
      guide: {
        title: '결제 시스템 전체 가이드',
        tossPay: paymentData.tossPay,
        iap: paymentData.iap,
        criticalNote: '토스페이만 허용 (타 결제 수단 불가)'
      }
    };
  }

  /**
   * 마케팅 가이드
   */
  getMarketingGuide(subtopic, format) {
    const marketingData = this.guideData.marketing;

    if (subtopic === 'analytics') {
      if (format === 'code') {
        return {
          success: true,
          guide: {
            title: '애널리틱스 코드 예제',
            clickEvent: `import { Analytics } from "@apps-in-toss/web-framework";

document.getElementById("subscribeBtn").addEventListener("click", () => {
  Analytics.click({ button_name: "subscribe_button" });
});`,
            impressionEvent: `const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      Analytics.impression({
        item_id: entry.target.dataset.itemId,
        item_category: "premium_product"
      });
      observer.disconnect();
    }
  },
  { threshold: 0.1 }
);

observer.observe(document.getElementById("productItem"));`
          }
        };
      }

      return {
        success: true,
        guide: {
          title: '애널리틱스 가이드',
          overview: marketingData.analytics.overview,
          loggingTypes: marketingData.analytics.loggingTypes,
          bestPractices: marketingData.analytics.bestPractices,
          requirements: marketingData.analytics.requirements
        }
      };
    }

    if (subtopic === 'ads') {
      return {
        success: true,
        guide: {
          title: '인앱 광고 가이드',
          overview: marketingData.ads.overview,
          adTypes: marketingData.ads.adTypes,
          implementation: marketingData.ads.implementation,
          bestPractices: marketingData.ads.bestPractices,
          warning: '테스트 ID 사용 필수! 프로덕션 ID 사용 시 계정 페널티'
        }
      };
    }

    return {
      success: true,
      guide: {
        title: '마케팅 & 분석 전체 가이드',
        push: marketingData.push,
        analytics: marketingData.analytics,
        ads: marketingData.ads
      }
    };
  }

  /**
   * 출시 가이드
   */
  getLaunchGuide(format) {
    const launchData = this.guideData.launch;

    if (format === 'checklist') {
      return {
        success: true,
        guide: {
          title: '출시 체크리스트',
          checklist: launchData.nonGameChecklist.submissionChecklist.map(item => ({
            item: item.replace('[ ]', '').trim(),
            done: false,
            category: this.categorizeLaunchItem(item)
          }))
        }
      };
    }

    return {
      success: true,
      guide: {
        title: '출시 가이드',
        nonGame: launchData.nonGameChecklist,
        game: launchData.gameChecklist,
        criticalRequirements: [
          '라이트 모드만 (다크모드 ❌)',
          '핀치 줌 비활성화',
          '응답 시간 2초 이내',
          '토스 로그인만 허용',
          '토스페이만 허용',
          '다크 패턴 금지',
          '테스트 ID 제거'
        ]
      }
    };
  }

  categorizeLaunchItem(item) {
    if (item.includes('다크모드') || item.includes('핀치')) return '시스템';
    if (item.includes('네비게이션') || item.includes('메뉴')) return '네비게이션';
    if (item.includes('응답') || item.includes('데이터')) return '성능';
    if (item.includes('대비') || item.includes('터치') || item.includes('스크린')) return '접근성';
    if (item.includes('로그인') || item.includes('로그아웃')) return '인증';
    if (item.includes('결제') || item.includes('환불')) return '결제';
    if (item.includes('광고') || item.includes('푸시')) return '광고/메시징';
    return '기타';
  }

  /**
   * API 가이드
   */
  getAPIGuide(subtopic, format) {
    const apiData = this.guideData.api;

    return {
      success: true,
      guide: {
        title: 'API 레퍼런스',
        overview: apiData.overview,
        infrastructure: apiData.infrastructure,
        endpoints: apiData.endpoints,
        responseFormat: apiData.responseFormat,
        restrictions: apiData.restrictions,
        quickReference: {
          auth: 'POST /api-partner/v1/apps-in-toss/user/oauth2/*',
          payment: 'POST /api-partner/v1/apps-in-toss/pay/*',
          promotion: 'POST /api-partner/v1/apps-in-toss/promotion/*',
          messaging: 'POST /api-partner/v1/apps-in-toss/messenger/*'
        }
      }
    };
  }

  /**
   * SDK 가이드
   */
  getSDKGuide(format) {
    const sdkData = this.guideData.sdk;

    return {
      success: true,
      guide: {
        title: 'SDK 레퍼런스',
        overview: sdkData.overview,
        categories: sdkData.categories,
        frameworks: sdkData.frameworks,
        quickStart: {
          webview: 'import { Login, Payment, Analytics } from "@apps-in-toss/web-framework"',
          reactNative: 'import { AppsInToss, Login, Payment } from "@apps-in-toss/framework"'
        }
      }
    };
  }

  /**
   * 전체 가이드 개요
   */
  getAllGuides() {
    return {
      success: true,
      guide: {
        title: '앱인토스 개발 가이드 전체',
        metadata: this.guideData.metadata,
        sitemap: this.guideData.sitemap,
        keyTakeaways: this.guideData.keyTakeaways,
        resources: this.guideData.resources,
        availableTopics: [
          'design - 디자인 가이드 (브랜딩, UX 라이팅, 다크 패턴, TDS)',
          'webview - WebView 개발 가이드',
          'reactnative - React Native 개발 가이드',
          'tds - TDS (Toss Design System) 가이드',
          'authentication - 인증 시스템 (토스 로그인, 게임 로그인, 토스 인증)',
          'payment - 결제 시스템 (토스페이, IAP)',
          'marketing - 마케팅 & 분석 (푸시, 애널리틱스, 광고)',
          'launch - 출시 가이드 & 체크리스트',
          'api - API 레퍼런스',
          'sdk - SDK 레퍼런스'
        ]
      }
    };
  }
}

export default AppsInTossGuideSkill;
