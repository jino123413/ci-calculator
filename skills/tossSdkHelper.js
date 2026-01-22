/**
 * TossSdkHelperSkill - 토스 SDK 연동 도우미 스킬
 *
 * 앱인토스 개발에 필요한 토스 SDK 연동 가이드와 코드를 제공합니다.
 */

import BaseSkill from './BaseSkill';

export default class TossSdkHelperSkill extends BaseSkill {
  constructor() {
    super({
      name: 'TossSdkHelper',
      description: '토스 SDK 연동 가이드 및 코드 생성',
      version: '1.0.0',
      category: 'integration',
      inputSchema: {
        idea: { type: 'object', required: true, description: '앱 아이디어' },
        requiredFeatures: { type: 'array', required: false, description: '필요한 토스 기능' },
      },
      outputSchema: {
        sdkGuide: { type: 'object', description: 'SDK 연동 가이드' },
        integrationCode: { type: 'array', description: '연동 코드' },
        examples: { type: 'array', description: '예제 코드' },
      },
    });

    // 토스 SDK 기능 목록
    this.tossFeatures = {
      auth: {
        name: '토스 로그인',
        description: '토스 계정으로 간편 로그인',
        required: true,
        methods: ['getTossLoginToken', 'getUserProfile', 'logout'],
        permissions: ['user.profile.read'],
      },
      payment: {
        name: '토스페이',
        description: '토스페이 결제 연동',
        required: false,
        methods: ['requestPayment', 'getPaymentResult', 'cancelPayment'],
        permissions: ['payment.request'],
      },
      transfer: {
        name: '송금',
        description: '토스 송금 기능',
        required: false,
        methods: ['requestTransfer', 'getTransferHistory'],
        permissions: ['transfer.request'],
      },
      notification: {
        name: '알림',
        description: '푸시 알림 발송',
        required: false,
        methods: ['requestNotificationPermission', 'sendLocalNotification'],
        permissions: ['notification.send'],
      },
      share: {
        name: '공유',
        description: '앱 외부 공유',
        required: false,
        methods: ['shareToKakao', 'shareToSMS', 'copyToClipboard'],
        permissions: [],
      },
      analytics: {
        name: '분석',
        description: '사용자 행동 분석',
        required: false,
        methods: ['logEvent', 'setUserProperty', 'getSessionId'],
        permissions: [],
      },
      storage: {
        name: '데이터 저장',
        description: '토스 클라우드 스토리지',
        required: false,
        methods: ['saveData', 'loadData', 'deleteData'],
        permissions: ['storage.read', 'storage.write'],
      },
    };
  }

  async execute(input, context = {}) {
    const { idea, requiredFeatures = ['auth'] } = input;

    // 1. 필요 기능 분석
    const analyzedFeatures = this.analyzeRequiredFeatures(idea, requiredFeatures);

    // 2. SDK 설정 가이드
    const setupGuide = this.generateSetupGuide();

    // 3. 연동 코드 생성
    const integrationCode = this.generateIntegrationCode(analyzedFeatures);

    // 4. 사용 예제 생성
    const examples = this.generateExamples(analyzedFeatures, idea);

    // 5. 권한 요청 가이드
    const permissionsGuide = this.generatePermissionsGuide(analyzedFeatures);

    // 6. 에러 처리 가이드
    const errorHandling = this.generateErrorHandling();

    // 7. 테스트 가이드
    const testingGuide = this.generateTestingGuide();

    // 8. 베스트 프랙티스
    const bestPractices = this.generateBestPractices();

    return {
      analyzedFeatures,
      setupGuide,
      integrationCode,
      examples,
      permissionsGuide,
      errorHandling,
      testingGuide,
      bestPractices,
    };
  }

  analyzeRequiredFeatures(idea, requiredFeatures) {
    const features = ['auth', ...requiredFeatures];

    // 아이디어 기반 추가 기능 추천
    if (idea.category === 'finance' || idea.category === 'commerce') {
      if (!features.includes('payment')) features.push('payment');
    }

    if (idea.category === 'social') {
      if (!features.includes('share')) features.push('share');
      if (!features.includes('transfer')) features.push('transfer');
    }

    if (idea.features?.some((f) => f.includes('알림'))) {
      if (!features.includes('notification')) features.push('notification');
    }

    return [...new Set(features)].map((key) => ({
      key,
      ...this.tossFeatures[key],
      isAutoRecommended: !requiredFeatures.includes(key) && key !== 'auth',
    }));
  }

  generateSetupGuide() {
    return {
      title: '토스 SDK 설정 가이드',
      steps: [
        {
          step: 1,
          title: '앱인토스 개발자 등록',
          description: '토스 개발자 포털에서 앱인토스 개발자로 등록합니다.',
          links: ['https://developers.toss.im/'],
        },
        {
          step: 2,
          title: '앱 생성 및 키 발급',
          description: '새 앱을 생성하고 Client ID와 Client Secret을 발급받습니다.',
          notes: ['개발용/운영용 키가 별도로 발급됩니다', '키는 안전하게 보관하세요'],
        },
        {
          step: 3,
          title: 'SDK 설치',
          code: `
# npm
npm install @tosspayments/toss-sdk

# 또는 CDN (index.html에 추가)
<script src="https://js.tosspayments.com/v1/toss-sdk.js"></script>
          `.trim(),
        },
        {
          step: 4,
          title: 'SDK 초기화',
          code: `
// src/lib/toss.ts
import TossSDK from '@tosspayments/toss-sdk';

export const toss = new TossSDK({
  clientId: import.meta.env.VITE_TOSS_CLIENT_ID,
  environment: import.meta.env.DEV ? 'sandbox' : 'production',
});

// 초기화
export async function initToss() {
  await toss.init();
  console.log('Toss SDK initialized');
}
          `.trim(),
        },
        {
          step: 5,
          title: '환경 변수 설정',
          code: `
# .env.local
VITE_TOSS_CLIENT_ID=your_client_id
VITE_TOSS_CLIENT_SECRET=your_client_secret
          `.trim(),
          warning: '.env 파일은 절대 Git에 커밋하지 마세요',
        },
      ],
    };
  }

  generateIntegrationCode(features) {
    const code = [];

    // 기본 SDK 유틸리티
    code.push({
      path: 'src/lib/toss/index.ts',
      description: '토스 SDK 메인 모듈',
      content: `
import TossSDK from '@tosspayments/toss-sdk';

class TossService {
  private sdk: TossSDK | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;

    this.sdk = new TossSDK({
      clientId: import.meta.env.VITE_TOSS_CLIENT_ID,
      environment: import.meta.env.DEV ? 'sandbox' : 'production',
    });

    await this.sdk.init();
    this.initialized = true;
  }

  getSDK() {
    if (!this.sdk) {
      throw new Error('Toss SDK not initialized. Call init() first.');
    }
    return this.sdk;
  }

  isInitialized() {
    return this.initialized;
  }
}

export const tossService = new TossService();
export default tossService;
      `.trim(),
    });

    // 각 기능별 코드 생성
    for (const feature of features) {
      if (feature.key === 'auth') {
        code.push(this.generateAuthCode());
      }
      if (feature.key === 'payment') {
        code.push(this.generatePaymentCode());
      }
      if (feature.key === 'notification') {
        code.push(this.generateNotificationCode());
      }
      if (feature.key === 'share') {
        code.push(this.generateShareCode());
      }
      if (feature.key === 'analytics') {
        code.push(this.generateAnalyticsCode());
      }
    }

    // React Hook
    code.push({
      path: 'src/hooks/useToss.ts',
      description: '토스 SDK React Hook',
      content: `
import { useEffect, useState } from 'react';
import tossService from '../lib/toss';

export function useToss() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    tossService
      .init()
      .then(() => setIsReady(true))
      .catch(setError);
  }, []);

  return {
    isReady,
    error,
    sdk: isReady ? tossService.getSDK() : null,
  };
}
      `.trim(),
    });

    return code;
  }

  generateAuthCode() {
    return {
      path: 'src/lib/toss/auth.ts',
      description: '토스 로그인 인증',
      content: `
import tossService from './index';

export interface TossUser {
  id: string;
  name: string;
  email?: string;
  profileImage?: string;
}

export async function login(): Promise<TossUser> {
  const sdk = tossService.getSDK();

  try {
    const result = await sdk.auth.login({
      scopes: ['user.profile.read'],
    });

    // 토큰 저장
    localStorage.setItem('toss_token', result.accessToken);

    // 사용자 정보 조회
    const user = await getUserProfile();
    return user;
  } catch (error) {
    console.error('Toss login failed:', error);
    throw error;
  }
}

export async function getUserProfile(): Promise<TossUser> {
  const sdk = tossService.getSDK();

  const profile = await sdk.auth.getUserProfile();

  return {
    id: profile.userId,
    name: profile.name,
    email: profile.email,
    profileImage: profile.profileImage,
  };
}

export async function logout(): Promise<void> {
  const sdk = tossService.getSDK();

  await sdk.auth.logout();
  localStorage.removeItem('toss_token');
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem('toss_token');
}

// React Hook
import { useState, useCallback } from 'react';

export function useTossAuth() {
  const [user, setUser] = useState<TossUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await login();
      setUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isLoggedIn: !!user,
    login: handleLogin,
    logout: handleLogout,
  };
}
      `.trim(),
    };
  }

  generatePaymentCode() {
    return {
      path: 'src/lib/toss/payment.ts',
      description: '토스페이 결제',
      content: `
import tossService from './index';

export interface PaymentRequest {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
}

export interface PaymentResult {
  paymentKey: string;
  orderId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'CANCELLED';
}

export async function requestPayment(request: PaymentRequest): Promise<PaymentResult> {
  const sdk = tossService.getSDK();

  try {
    const result = await sdk.payment.requestPayment({
      amount: request.amount,
      orderId: request.orderId,
      orderName: request.orderName,
      customerName: request.customerName,
      successUrl: window.location.origin + '/payment/success',
      failUrl: window.location.origin + '/payment/fail',
    });

    return {
      paymentKey: result.paymentKey,
      orderId: result.orderId,
      amount: result.amount,
      status: 'SUCCESS',
    };
  } catch (error: any) {
    if (error.code === 'USER_CANCEL') {
      return {
        paymentKey: '',
        orderId: request.orderId,
        amount: request.amount,
        status: 'CANCELLED',
      };
    }
    throw error;
  }
}

export async function verifyPayment(paymentKey: string, orderId: string, amount: number) {
  // 서버에서 결제 검증 API 호출
  const response = await fetch('/api/payment/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!response.ok) {
    throw new Error('Payment verification failed');
  }

  return response.json();
}

// React Hook
import { useState, useCallback } from 'react';

export function useTossPayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  const pay = useCallback(async (request: PaymentRequest) => {
    setIsProcessing(true);
    try {
      const result = await requestPayment(request);
      setResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    pay,
    isProcessing,
    result,
  };
}
      `.trim(),
    };
  }

  generateNotificationCode() {
    return {
      path: 'src/lib/toss/notification.ts',
      description: '푸시 알림',
      content: `
import tossService from './index';

export async function requestNotificationPermission(): Promise<boolean> {
  const sdk = tossService.getSDK();

  try {
    const result = await sdk.notification.requestPermission();
    return result.granted;
  } catch (error) {
    console.error('Notification permission request failed:', error);
    return false;
  }
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  triggerAt: Date
): Promise<string> {
  const sdk = tossService.getSDK();

  const result = await sdk.notification.schedule({
    title,
    body,
    triggerAt: triggerAt.toISOString(),
  });

  return result.notificationId;
}

export async function cancelNotification(notificationId: string): Promise<void> {
  const sdk = tossService.getSDK();
  await sdk.notification.cancel(notificationId);
}
      `.trim(),
    };
  }

  generateShareCode() {
    return {
      path: 'src/lib/toss/share.ts',
      description: '공유 기능',
      content: `
import tossService from './index';

export interface ShareContent {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
}

export async function shareToKakao(content: ShareContent): Promise<void> {
  const sdk = tossService.getSDK();

  await sdk.share.kakao({
    title: content.title,
    description: content.description,
    imageUrl: content.imageUrl,
    link: content.url,
  });
}

export async function shareNative(content: ShareContent): Promise<void> {
  if (navigator.share) {
    await navigator.share({
      title: content.title,
      text: content.description,
      url: content.url,
    });
  } else {
    // Fallback: 클립보드 복사
    await copyToClipboard(content.url || window.location.href);
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
      `.trim(),
    };
  }

  generateAnalyticsCode() {
    return {
      path: 'src/lib/toss/analytics.ts',
      description: '분석 이벤트',
      content: `
import tossService from './index';

export function logEvent(eventName: string, params?: Record<string, any>): void {
  const sdk = tossService.getSDK();

  sdk.analytics.logEvent(eventName, {
    ...params,
    timestamp: new Date().toISOString(),
  });
}

export function setUserProperty(key: string, value: string | number | boolean): void {
  const sdk = tossService.getSDK();
  sdk.analytics.setUserProperty(key, value);
}

export function logScreenView(screenName: string): void {
  logEvent('screen_view', { screen_name: screenName });
}

export function logButtonClick(buttonName: string, context?: string): void {
  logEvent('button_click', { button_name: buttonName, context });
}

export function logFeatureUsed(featureName: string, action?: string): void {
  logEvent('feature_used', { feature_name: featureName, action });
}

// React Hook for automatic screen tracking
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScreenTracking() {
  const location = useLocation();

  useEffect(() => {
    logScreenView(location.pathname);
  }, [location.pathname]);
}
      `.trim(),
    };
  }

  generateExamples(features, idea) {
    return [
      {
        title: '로그인 버튼 구현',
        code: `
import { useTossAuth } from '../lib/toss/auth';
import { Button } from '../components/common/Button';

function LoginButton() {
  const { isLoggedIn, isLoading, login, logout, user } = useTossAuth();

  if (isLoggedIn) {
    return (
      <div>
        <p>안녕하세요, {user?.name}님!</p>
        <Button variant="outline" onClick={logout}>
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={login}
      loading={isLoading}
    >
      토스로 로그인
    </Button>
  );
}
        `.trim(),
      },
      {
        title: '결제 버튼 구현',
        code: `
import { useTossPayment } from '../lib/toss/payment';
import { Button } from '../components/common/Button';
import { toast } from '../components/common/Toast';

function PaymentButton({ amount, productName }: { amount: number; productName: string }) {
  const { pay, isProcessing } = useTossPayment();

  const handlePayment = async () => {
    const result = await pay({
      amount,
      orderId: \`order_\${Date.now()}\`,
      orderName: productName,
    });

    if (result.status === 'SUCCESS') {
      toast('결제가 완료되었습니다!', 'success');
    } else if (result.status === 'CANCELLED') {
      toast('결제가 취소되었습니다.', 'info');
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handlePayment}
      loading={isProcessing}
      fullWidth
    >
      {amount.toLocaleString()}원 결제하기
    </Button>
  );
}
        `.trim(),
      },
      {
        title: '공유 버튼 구현',
        code: `
import { shareNative, copyToClipboard } from '../lib/toss/share';
import { Button } from '../components/common/Button';
import { toast } from '../components/common/Toast';

function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    try {
      await shareNative({ title, url });
    } catch {
      await copyToClipboard(url);
      toast('링크가 복사되었습니다!', 'success');
    }
  };

  return (
    <Button variant="secondary" onClick={handleShare}>
      공유하기
    </Button>
  );
}
        `.trim(),
      },
    ];
  }

  generatePermissionsGuide(features) {
    const allPermissions = features.flatMap((f) => f.permissions || []);
    const uniquePermissions = [...new Set(allPermissions)];

    return {
      title: '권한 요청 가이드',
      requiredPermissions: uniquePermissions,
      bestPractices: [
        '필요한 시점에만 권한 요청 (Lazy Permission)',
        '권한이 필요한 이유를 사용자에게 미리 설명',
        '권한 거부 시 대체 기능 제공',
        '설정에서 권한을 다시 요청할 수 있는 방법 안내',
      ],
      implementation: `
// 권한 요청 전 설명 모달
function PermissionExplainModal({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Modal isOpen onClose={() => {}}>
      <div className="text-center p-4">
        <div className="text-4xl mb-4">🔔</div>
        <h2 className="text-lg font-semibold mb-2">알림 권한이 필요해요</h2>
        <p className="text-gray-600 mb-4">
          중요한 업데이트를 놓치지 않도록 알림을 보내드릴게요.
        </p>
        <Button variant="primary" onClick={onConfirm} fullWidth>
          알림 허용하기
        </Button>
      </div>
    </Modal>
  );
}
      `.trim(),
    };
  }

  generateErrorHandling() {
    return {
      title: '에러 처리 가이드',
      commonErrors: [
        { code: 'NOT_INITIALIZED', message: 'SDK가 초기화되지 않음', solution: 'init() 호출 확인' },
        { code: 'AUTH_FAILED', message: '인증 실패', solution: '토큰 갱신 또는 재로그인' },
        { code: 'USER_CANCEL', message: '사용자 취소', solution: '정상 케이스로 처리' },
        { code: 'NETWORK_ERROR', message: '네트워크 오류', solution: '재시도 로직 구현' },
        { code: 'PERMISSION_DENIED', message: '권한 거부', solution: '대체 기능 제공' },
      ],
      implementation: `
// 전역 에러 핸들러
function handleTossError(error: any) {
  switch (error.code) {
    case 'USER_CANCEL':
      // 사용자 취소는 무시
      return;

    case 'AUTH_FAILED':
      // 재로그인 유도
      toast('다시 로그인해주세요.', 'warning');
      logout();
      break;

    case 'NETWORK_ERROR':
      toast('네트워크 연결을 확인해주세요.', 'error');
      break;

    default:
      console.error('Toss SDK Error:', error);
      toast('오류가 발생했습니다. 다시 시도해주세요.', 'error');
  }
}

// 사용 예시
try {
  await login();
} catch (error) {
  handleTossError(error);
}
      `.trim(),
    };
  }

  generateTestingGuide() {
    return {
      title: '테스트 가이드',
      environments: {
        sandbox: '개발/테스트용 환경, 실제 결제 없음',
        production: '운영 환경, 실제 결제 발생',
      },
      testAccounts: {
        description: '토스 개발자 포털에서 테스트 계정 발급',
        usage: '샌드박스 환경에서 결제 테스트 가능',
      },
      mockGuide: `
// 테스트용 Mock
export const mockTossSDK = {
  auth: {
    login: jest.fn().mockResolvedValue({
      accessToken: 'mock_token',
    }),
    getUserProfile: jest.fn().mockResolvedValue({
      userId: 'mock_user',
      name: '테스트 사용자',
    }),
    logout: jest.fn().mockResolvedValue(undefined),
  },
  payment: {
    requestPayment: jest.fn().mockResolvedValue({
      paymentKey: 'mock_payment_key',
      orderId: 'mock_order',
      amount: 10000,
    }),
  },
};

// Jest 설정
jest.mock('../lib/toss', () => ({
  default: mockTossSDK,
  tossService: {
    init: jest.fn().mockResolvedValue(undefined),
    getSDK: () => mockTossSDK,
  },
}));
      `.trim(),
    };
  }

  generateBestPractices() {
    return [
      {
        title: '초기화는 앱 시작 시 한 번만',
        description: 'SDK 초기화는 비용이 크므로 앱 시작 시 한 번만 수행',
        code: `
// App.tsx
useEffect(() => {
  tossService.init().catch(console.error);
}, []);
        `.trim(),
      },
      {
        title: '토큰 갱신 자동화',
        description: 'Access Token 만료 전 자동 갱신',
        code: `
// Axios Interceptor로 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshTossToken();
      error.config.headers.Authorization = \`Bearer \${newToken}\`;
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
        `.trim(),
      },
      {
        title: '에러 로깅',
        description: 'SDK 에러는 반드시 로깅하여 디버깅에 활용',
        code: `
try {
  await tossOperation();
} catch (error) {
  logEvent('toss_sdk_error', {
    operation: 'payment',
    error_code: error.code,
    error_message: error.message,
  });
  throw error;
}
        `.trim(),
      },
      {
        title: '사용자 경험 우선',
        description: 'SDK 로딩 중에도 앱 사용 가능하도록 설계',
        code: `
function App() {
  const { isReady } = useToss();

  return (
    <div>
      {/* SDK 로딩과 관계없이 기본 UI 표시 */}
      <MainContent />

      {/* SDK 필요한 기능만 조건부 렌더링 */}
      {isReady && <PaymentButton />}
    </div>
  );
}
        `.trim(),
      },
    ];
  }
}
