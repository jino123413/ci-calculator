# 📊 분석 요약 - apps-in-toss-examples 적용 결과

## 🎯 목표

`apps-in-toss-examples` 저장소 분석을 통해 복리 계산기에 필요한 구조를 파악하고 적용

---

## 🔍 주요 발견사항

### 1. 프레임워크 구조

앱인토스는 **두 가지 프레임워크**를 지원합니다:

#### A. WebView 방식

- **패키지**: `@apps-in-toss/web-framework`
- **사용 기술**: React, Vue, jQuery 등 웹 기술
- **설정 파일**: `granite.config.ts`
- **빌드 도구**: Vite, Rsbuild, Webpack 등
- **장점**:
  - 웹 개발 경험 그대로 활용
  - 빠른 개발
  - 다양한 프레임워크 선택 가능
- **단점**:
  - 네이티브 기능 제한적
  - 성능이 React Native보다 낮을 수 있음

**예제**: `weekly-todo-react`, `random-balls`

#### B. React Native 방식 (Granite/Bedrock)

- **패키지**: `@apps-in-toss/framework`, `@granite-js/react-native`
- **사용 기술**: React Native + TDS
- **설정 파일**: `bedrock.config.ts` (또는 `granite.config.ts`)
- **필수**: TDS React Native 컴포넌트
- **장점**:
  - 네이티브 성능
  - TDS 표준 준수
  - 더 많은 네이티브 기능 접근
- **단점**:
  - 학습 곡선
  - 웹 코드 직접 재사용 불가

**예제**: `with-storage`, `with-app-login`, `with-camera`

### 2. 예제 분석

#### weekly-todo-react (WebView)

```typescript
// granite.config.ts
export default defineConfig({
  appName: 'weekly-todo-react',
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'rsbuild dev',
      build: 'rsbuild build',
    },
  },
  brand: {
    displayName: '위클리 투두 - 리액트',
    icon: 'https://...',
    primaryColor: '#3B70E3',
  },
});
```

**주요 특징**:
- Rsbuild 번들러 사용
- React 18 + CSS Modules
- 파일 기반 라우팅

#### with-storage (React Native)

```typescript
// granite.config.ts
export default defineConfig({
  scheme: 'intoss',
  appName: 'with-storage',
  plugins: [
    appsInToss({
      brand: { ... },
      permissions: [],
    }),
    router(),
  ],
});
```

**Storage 사용**:
```typescript
import { Storage } from '@apps-in-toss/framework';

// 저장
await Storage.setItem('key', 'value');

// 불러오기
const value = await Storage.getItem('key');

// 삭제
await Storage.removeItem('key');
```

---

## ✅ 복리 계산기에 적용한 것

### 1. React Native + TDS 방식 선택

**이유**:
- TDS 표준 필수 준수 (비게임 앱)
- 더 나은 성능
- 네이티브 기능 활용 (Storage)
- 출시 심사 유리

### 2. bedrock.config.ts 생성

```typescript
export default defineConfig({
  scheme: 'intoss',
  appName: 'compound-interest-calculator',
  plugins: [
    appsInToss({
      brand: {
        displayName: '복리 계산기',
        primaryColor: '#3182F6',
        icon: 'https://...',
        bridgeColorMode: 'basic',
      },
      permissions: [],
    }),
    router(),
  ],
});
```

**적용 사항**:
- ✅ 앱 이름: `compound-interest-calculator`
- ✅ 브랜드: 복리 계산기
- ✅ 색상: TDS blue600 (#3182F6)
- ✅ 플러그인: appsInToss + router

### 3. Storage Hook 구현

`with-storage` 예제를 기반으로 구현:

```typescript
// src/hooks/useStorage.ts
export function useStorage<T>(key: string, defaultValue: T | null) {
  const [storedValue, setStoredValue] = useState<T | null>(defaultValue);
  const [loading, setLoading] = useState(false);

  // 저장, 불러오기, 삭제 메서드
  // ...
}
```

**적용 효과**:
- ✅ 입력값 자동 저장
- ✅ 앱 재실행 시 복원
- ✅ Toast 알림

### 4. 프로젝트 구조

```
src/
├── pages/
│   └── index.tsx              # 메인 페이지
├── components/
│   └── CompoundInterestCalculator.tsx
├── hooks/
│   └── useStorage.ts          # ⭐ Storage Hook
├── stores/
│   └── calculatorStore.ts
├── utils/
│   └── compoundInterest.ts
└── types/
    └── index.ts

bedrock.config.ts              # ⭐ 앱인토스 설정
package.json
```

---

## 📦 필요한 패키지

### 필수 의존성

```json
{
  "dependencies": {
    "@apps-in-toss/framework": "^1.0.0",
    "@granite-js/plugin-router": "^0.1.21",
    "@granite-js/react-native": "^1.0.0",
    "@toss/tds-react-native": "^1.0.0",
    "react": "^18.2.0",
    "react-native": "^0.72.0",
    "zustand": "^4.4.0"
  }
}
```

### TDS NPM 토큰

TDS React Native는 비공개 패키지이므로 **npm 토큰** 필요:

1. https://tossmini-docs.toss.im/tds-react-native/setup-npm/ 참고
2. 토스 디자인 시스템 그룹 초대 필요
3. `.npmrc` 또는 `.yarnrc.yml`에 토큰 설정

---

## 🧪 테스트 방법

### 1. 샌드박스 앱 사용

**단계**:
1. 샌드박스 앱 설치
2. 개발자 로그인
3. 개발 모드로 앱 실행

**자세한 내용**: `SANDBOX_TESTING.md` 참고

### 2. 개발 서버 연결

#### Android
```bash
adb reverse tcp:8081 tcp:8081
npm run dev
```

#### iOS
```bash
# bedrock.config.ts에 로컬 IP 설정
# host: '192.168.0.10'
npm run dev
```

---

## 🚀 출시 프로세스

전체 프로세스: `LAUNCH_ROADMAP.md` 참고

**요약**:

1. **개발**: 1주
   - UI 구현
   - 비즈니스 로직
   - Storage 통합

2. **테스트**: 1주
   - 로컬 테스트
   - 샌드박스 테스트
   - 품질 보증

3. **빌드**: 1일
   - `npm run build`
   - `.ait` 번들 생성
   - 메타데이터 준비

4. **출시**: 1-2주
   - 콘솔 업로드
   - 출시 신청
   - 심사 대기

---

## 📊 예제별 적용 가능성

### ✅ 적용됨

- [x] **with-storage**: Storage Hook 구현
- [x] **프로젝트 구조**: src/, bedrock.config.ts
- [x] **TDS 컴포넌트**: 모든 UI 요소

### 🔜 추후 적용 가능

- [ ] **with-app-login**: 사용자별 데이터 저장
- [ ] **with-rewarded-ad**: 광고 수익화
- [ ] **with-share-link**: 공유 기능
- [ ] **with-haptic-feedback**: 햅틱 피드백

---

## 💡 핵심 인사이트

### 1. TDS 필수 사용

비게임 앱은 **TDS 컴포넌트 사용이 필수**입니다.

```typescript
// ✅ 올바름
import { Button, colors } from '@toss/tds-react-native';
<Button type="primary">저장</Button>

// ❌ 잘못됨
<TouchableOpacity style={{ backgroundColor: '#3182F6' }}>
  <Text>저장</Text>
</TouchableOpacity>
```

### 2. Storage는 필수 기능

대부분의 미니앱은 **Storage**를 사용합니다:
- 사용자 설정
- 입력값 저장
- 임시 데이터
- 오프라인 지원

### 3. 샌드박스 앱 중요

**샌드박스 앱**을 통한 테스트가 출시 성공의 핵심입니다:
- 실제 환경과 동일
- 핫 리로드 지원
- 빠른 피드백

### 4. 심사 기준

앱인토스 심사는 **엄격**합니다:
- TDS 표준 필수
- 다크 패턴 금지
- 성능 기준 (< 2초)
- 모든 기능 정상 작동

---

## 📁 생성된 파일

### 설정 파일

1. **bedrock.config.ts**
   - 앱인토스 설정
   - 브랜드, 권한, 플러그인

2. **package.json**
   - 의존성 관리
   - 스크립트

3. **tsconfig.json**
   - TypeScript 설정
   - 경로 alias

### 소스 파일

4. **src/hooks/useStorage.ts**
   - Storage Hook
   - 자동 저장/복원

5. **src/stores/calculatorStore.ts**
   - Zustand 스토어
   - 히스토리 추가

6. **src/components/CompoundInterestCalculator.tsx**
   - 메인 컴포넌트
   - Storage 통합
   - Toast 알림

### 문서 파일

7. **SANDBOX_TESTING.md**
   - 테스트 가이드
   - 문제 해결
   - 체크리스트

8. **LAUNCH_ROADMAP.md**
   - 출시 프로세스
   - 타임라인
   - 체크리스트

---

## 🎓 학습 자료

### 필수

1. **DEV_STANDARD.md** - TDS 표준
2. **docs/apps-in-toss-developer-guide.md** - 전체 가이드
3. **docs/tds-react-native-components.json** - 컴포넌트 레퍼런스

### 추천

1. [앱인토스 개발자 센터](https://developers-apps-in-toss.toss.im/)
2. [TDS 문서](https://tossmini-docs.toss.im/tds-react-native/)
3. [예제 저장소](https://github.com/toss/apps-in-toss-examples)

---

## 🔮 다음 단계

### 즉시 가능

1. **개발 서버 실행**
   ```bash
   npm install
   npm run dev
   ```

2. **샌드박스 테스트**
   - 샌드박스 앱 설치
   - 개발자 로그인
   - 앱 실행

### 1-2주 후

3. **빌드 & 출시**
   ```bash
   npm run build
   # 콘솔 업로드
   ```

4. **심사 대기**
   - 7-10 영업일

### 출시 후

5. **모니터링**
   - Analytics 확인
   - 사용자 피드백

6. **지속 개선**
   - 버그 수정
   - 기능 추가

---

**요약**: 앱인토스 예제 저장소 분석을 통해 복리 계산기에 **Storage 기능**, **bedrock.config.ts 설정**, **샌드박스 테스트 프로세스**를 성공적으로 적용했습니다! 🎉
