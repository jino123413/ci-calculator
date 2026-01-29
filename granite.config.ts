import { appsInToss } from '@apps-in-toss/framework/plugins';
import { router } from '@granite-js/plugin-router';
import { hermes } from '@granite-js/plugin-hermes';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  scheme: 'intoss',
  appName: 'ci-calculator',
  plugins: [
    appsInToss({
      brand: {
        displayName: '나만의 복리계산기',
        primaryColor: '#3182F6',
        icon: 'https://static.toss.im/appsintoss/16681/4eb608c8-5011-4b99-95c4-c186548afed9.png',
        bridgeColorMode: 'basic',
      },
      permissions: [],
    }),
    router(),
    hermes(),
  ],
});
