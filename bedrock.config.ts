import { appsInToss } from '@apps-in-toss/framework/plugins';
import { router } from '@granite-js/plugin-router';
import { defineConfig } from '@granite-js/react-native/config';

/**
 * 앱인토스 React Native (Bedrock) 설정
 * 앱 이름: ci-calculator (복리 계산기)
 */
export default defineConfig({
  // 앱 스킴 (intoss 고정)
  scheme: 'intoss',

  // 앱 이름 (콘솔에 등록된 이름과 동일)
  appName: 'ci-calculator',

  plugins: [
    // 앱인토스 플러그인
    appsInToss({
      brand: {
        // 화면에 표시될 앱 이름
        displayName: '복리 계산기',

        // 앱 기본 색상 (TDS blue600)
        primaryColor: '#3182F6',

        // 앱 아이콘 URL (반드시 HTTPS)
        icon: 'https://raw.githubusercontent.com/jino123413/ci-calculator/main/public/icon.png',

        // 브리지 색상 모드
        bridgeColorMode: 'basic',
      },

      // 권한 설정 (Storage는 자동 포함)
      permissions: ['AppsInTossAdMob'],
    }),

    // 라우터 플러그인 (파일 기반 라우팅)
    router(),
  ],
});
