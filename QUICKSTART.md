# 🚀 빠른 시작 가이드 - React Native + TDS

## 📋 개요

이 프로젝트는 **React Native + TDS (Toss Design System)** 표준을 따르는 앱인토스 미니앱 프로젝트입니다.

**포함된 예제**: 복리 계산기 (TDS RN 표준 준수)

---

## 1️⃣ 환경 요구사항

- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0
- **앱인토스 CLI**: 최신 버전

---

## 2️⃣ 설치 (5분)

### Step 1: 의존성 설치

```bash
npm install
```

### Step 2: 앱인토스 초기화

```bash
npx ait init
```

### Step 3: 개발 서버 실행

```bash
npm run dev
```

---

## 3️⃣ 테스트

### Android

```bash
# ADB 포트 포워딩
adb reverse tcp:8081 tcp:8081
```

토스 앱에서 미니앱 실행

### iOS

- WiFi로 연결
- 로컬 네트워크 권한 허용
- 토스 앱에서 미니앱 실행

---

## 4️⃣ 프로젝트 구조

```
src/
├── pages/              # 파일 기반 라우팅
│   └── index.tsx       # 메인 페이지 (/)
├── components/         # 재사용 컴포넌트
│   └── CompoundInterestCalculator.tsx
├── stores/            # Zustand 상태 관리
│   └── calculatorStore.ts
├── utils/             # 유틸리티
│   └── compoundInterest.ts
├── types/             # TypeScript 타입
│   └── index.ts
└── App.tsx            # 앱 루트
```

---

## 5️⃣ 복리 계산기 사용법

### 기본 사용

```typescript
import CompoundInterestCalculator from '@components/CompoundInterestCalculator';

function MyPage() {
  return <CompoundInterestCalculator />;
}
```

### 스토어 직접 사용

```typescript
import { useCalculatorStore } from '@stores/calculatorStore';

function CustomCalculator() {
  const { input, result, calculate, updateInput } = useCalculatorStore();

  const handleCalculate = () => {
    updateInput({ principal: 10000000, rate: 5, years: 10 });
    calculate();
  };

  return (
    <Button onPress={handleCalculate}>
      계산하기
    </Button>
  );
}
```

### 유틸리티 함수 사용

```typescript
import { calculateCompoundInterest, formatCurrency } from '@utils/compoundInterest';

const result = calculateCompoundInterest({
  principal: 10000000,
  rate: 5,
  years: 10,
  monthlyContribution: 500000,
  compoundFrequency: 'yearly',
});

console.log(formatCurrency(result.finalAmount)); // "₩25,000,000"
```

---

## 6️⃣ TDS 컴포넌트 사용법

### ✅ 올바른 방법

```typescript
import { Button, TextField, colors, typography } from '@toss/tds-react-native';

// 색상 토큰 사용
<View style={{ backgroundColor: colors.blue500 }} />

// 타이포그래피 사용
<typography.Headline1>제목</typography.Headline1>

// 버튼
<Button type="primary" size="large">저장</Button>

// 텍스트 필드
<TextField variant="line" label="이름" />
```

### ❌ 잘못된 방법

```typescript
// 하드코딩된 색상 (금지!)
<View style={{ backgroundColor: '#3182F6' }} />

// 하드코딩된 폰트 크기 (금지!)
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>제목</Text>

// 일반 HTML 요소 (금지!)
<div>, <button>, <input>
```

---

## 7️⃣ 새 페이지 추가하기

### Step 1: 페이지 파일 생성

```bash
# src/pages/calculator.tsx 생성
```

```typescript
// src/pages/calculator.tsx
import React from 'react';
import { View } from 'react-native';
import { Navbar, typography, colors } from '@toss/tds-react-native';

export default function CalculatorPage() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.grey50 }}>
      <Navbar title="계산기" />
      <typography.Headline2>복리 계산기</typography.Headline2>
    </View>
  );
}
```

### Step 2: 라우팅 자동 적용

파일 기반 라우팅이므로 `/calculator` 경로로 자동 접근 가능

---

## 8️⃣ 새 컴포넌트 만들기

### TDS 표준 준수 템플릿

```typescript
// src/components/MyComponent.tsx
import React from 'react';
import { View } from 'react-native';
import { Button, colors, typography } from '@toss/tds-react-native';

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export default function MyComponent({ title, onPress }: MyComponentProps) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
      }}
    >
      <typography.Headline3 style={{ marginBottom: 16 }}>
        {title}
      </typography.Headline3>

      <Button type="primary" size="large" onPress={onPress}>
        실행
      </Button>
    </View>
  );
}
```

---

## 9️⃣ 빌드 & 배포

### 타입 체크

```bash
npm run type-check
```

### 린트

```bash
npm run lint
```

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과: `.ait/` 디렉토리에 생성

### 앱인토스 콘솔에 업로드

1. https://console-apps-in-toss.toss.im 접속
2. 프로젝트 선택
3. `.ait` 번들 업로드
4. 출시 심사 신청

---

## 🔧 문제 해결

### 1. TDS 컴포넌트 import 오류

```bash
npm install @toss/tds-react-native
```

### 2. 타입 오류

```bash
npm run type-check
```

오류 확인 후 `src/types/index.ts`에 타입 추가

### 3. 빌드 오류

```bash
# 캐시 삭제
rm -rf node_modules .ait
npm install
npm run build
```

### 4. 개발 서버 연결 안됨

**Android:**
```bash
adb reverse tcp:8081 tcp:8081
adb devices  # 기기 연결 확인
```

**iOS:**
- WiFi 동일 네트워크 확인
- 로컬 네트워크 권한 허용

---

## 📚 추가 문서

### 필독 문서

1. **DEV_STANDARD.md** - React Native + TDS 개발 표준 (⭐ 필독!)
2. **README.md** - 프로젝트 전체 개요
3. **docs/apps-in-toss-developer-guide.md** - 앱인토스 완전 가이드
4. **docs/tds-react-native-components.json** - TDS 컴포넌트 레퍼런스

### AI 스킬 사용

```javascript
import { skillManager } from './skills/SkillManager.js';

// TDS 컴포넌트 가이드
const guide = await skillManager.executeSkill('appsInTossGuide', {
  topic: 'tds',
  format: 'code'
});

// 아이디어 생성
const ideas = await skillManager.executeSkill('ideaGenerator', {
  category: 'finance'
});
```

---

## 📱 다음 단계

1. ✅ **개발 환경 구축** - 설치 완료
2. 📖 **DEV_STANDARD.md 읽기** - 표준 학습
3. 🎨 **TDS 컴포넌트 실습** - 버튼, 텍스트 필드 등
4. 🔨 **기능 개발** - 새 페이지/컴포넌트 추가
5. 🚀 **빌드 & 배포** - 앱인토스 콘솔 업로드

---

## 💡 유용한 명령어

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 타입 체크
npm run type-check

# 린트
npm run lint

# 빌드
npm run build

# 전체 검증
npm run type-check && npm run lint && npm run build
```

---

## 🎯 핵심 규칙

1. ✅ **TDS 필수 사용** - 모든 UI는 TDS 컴포넌트로
2. ✅ **색상 토큰 사용** - `colors.blue500` (하드코딩 금지)
3. ✅ **타이포그래피 사용** - `typography.Headline1` (폰트 크기 하드코딩 금지)
4. ✅ **TypeScript 사용** - 모든 파일은 `.ts` 또는 `.tsx`
5. ✅ **함수형 컴포넌트** - 클래스 컴포넌트 금지

---

**Happy Coding! 🚀**

**문의**: DEV_STANDARD.md의 체크리스트 참고
