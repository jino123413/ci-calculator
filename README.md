# 📱 앱인토스 프로젝트 - Receipt Tracker

> **프로젝트 표준**: React Native + TDS (Toss Design System)
> **플랫폼**: Apps in Toss (앱인토스)
> **최종 업데이트**: 2026-01-21

---

## 🎯 프로젝트 개요

이 프로젝트는 **토스 앱 내에서 실행되는 미니앱**으로, React Native와 TDS를 활용하여 개발됩니다.

### 기술 스택

- ✅ **프레임워크**: React Native (Granite Framework)
- ✅ **디자인 시스템**: TDS React Native (필수)
- ✅ **라우팅**: 파일 기반 라우팅
- ✅ **언어**: TypeScript
- ✅ **상태 관리**: React Hooks + Zustand
- ✅ **인증**: 토스 로그인 (필수)
- ✅ **결제**: 토스페이 (필수)

---

## 📁 프로젝트 구조

```
receipt-static/
├── 📄 DEV_STANDARD.md              # 개발 표준 가이드 (필독!)
├── 📁 docs/                        # 완전한 개발 문서
│   ├── README.md                   # 문서 가이드
│   ├── apps-in-toss-complete-guide.json  # 앱인토스 전체 가이드 (JSON)
│   ├── apps-in-toss-developer-guide.md   # 앱인토스 개발 가이드 (MD)
│   └── tds-react-native-components.json  # TDS 컴포넌트 레퍼런스
├── 📁 skills/                      # AI 에이전트 스킬 시스템 (11개)
│   ├── appsInTossGuide.js          # 앱인토스 가이드 스킬 ⭐ NEW!
│   ├── ideaGenerator.js            # 아이디어 생성 스킬
│   ├── specWriter.js               # 기획서 작성 스킬
│   ├── marketAnalyzer.js           # 시장 분석 스킬
│   ├── techStackAdvisor.js         # 기술 스택 추천 스킬
│   ├── monetizationPlanner.js      # 수익화 전략 스킬
│   ├── uxDesigner.js               # UX 디자인 스킬
│   ├── codeGenerator.js            # 코드 생성 스킬
│   ├── tossSdkHelper.js            # 토스 SDK 헬퍼 스킬
│   ├── feedbackAnalyzer.js         # 피드백 분석 스킬
│   ├── launchPlanner.js            # 출시 계획 스킬
│   ├── SkillManager.js             # 스킬 오케스트레이션
│   └── useSkills.js                # React Hooks 통합
├── 📁 pages/                       # 파일 기반 라우팅
├── 📁 components/                  # 재사용 컴포넌트
├── 📁 hooks/                       # 커스텀 Hooks
├── 📁 stores/                      # 상태 관리
├── 📁 utils/                       # 유틸리티
├── 📁 types/                       # TypeScript 타입
├── granite.config.ts               # 앱인토스 설정
├── package.json
└── tsconfig.json
```

---

## 🚀 빠른 시작

### 1. 프로젝트 생성 (최초 1회)

```bash
npm create granite-app
# 앱 이름: receipt-tracker
# 도구: prettier + eslint
```

### 2. 필수 패키지 설치

```bash
# 앱인토스 프레임워크
npm install @apps-in-toss/framework

# TDS React Native (필수!)
npm install @toss/tds-react-native

# 기타
npm install date-fns zustand
```

### 3. 프로젝트 초기화

```bash
npx ait init
```

### 4. 개발 서버 실행

```bash
npm run dev

# Android
adb reverse tcp:8081 tcp:8081

# iOS
# WiFi 연결 + 로컬 네트워크 권한
```

---

## 📚 핵심 문서

### 1. **DEV_STANDARD.md** ⭐ (필독!)
**React Native + TDS 표준 개발 가이드**
- 프로젝트 구조
- TDS 컴포넌트 사용법
- 코딩 규칙
- 상태 관리
- 테스트
- 체크리스트

👉 [DEV_STANDARD.md 바로가기](./DEV_STANDARD.md)

### 2. **docs/apps-in-toss-developer-guide.md**
**앱인토스 완전 개발 가이드**
- 시작하기
- 디자인 가이드 (브랜딩, UX 라이팅, 다크 패턴)
- 개발 가이드 (WebView, React Native, Unity)
- 인증 & 결제
- 마케팅 & 분석
- 출시 체크리스트
- API & SDK 레퍼런스

👉 [Developer Guide 바로가기](./docs/apps-in-toss-developer-guide.md)

### 3. **docs/tds-react-native-components.json**
**TDS React Native 완전 컴포넌트 레퍼런스**
- Foundation (Colors, Typography)
- 47+ 컴포넌트 문서
- Props 레퍼런스
- 코드 예제
- 베스트 프랙티스

👉 [TDS Components 바로가기](./docs/tds-react-native-components.json)

---

## 🎨 TDS 컴포넌트 빠른 참조

### 필수 Import

```typescript
import {
  Button,
  TextField,
  Toast,
  Dialog,
  Navbar,
  List,
  ListRow,
  Tab,
  Badge,
  Checkbox,
  Switch,
  colors
} from '@toss/tds-react-native';
```

### 주요 컴포넌트

| 컴포넌트 | 용도 | 예제 |
|---------|------|------|
| **Button** | 액션 트리거 | `<Button type="primary">저장</Button>` |
| **TextField** | 텍스트 입력 | `<TextField variant="line" label="이름" />` |
| **Toast** | 일시적 메시지 | `<Toast text="저장되었어요" />` |
| **Dialog** | 확인 요청 | `ConfirmDialog({ title: '삭제?' })` |
| **Navbar** | 상단 네비게이션 | `<Navbar title="홈" />` |
| **List** | 항목 목록 | `<List><ListRow /></List>` |
| **Tab** | 탭 네비게이션 | `<Tab><Tab.Item>탭1</Tab.Item></Tab>` |
| **Badge** | 상태 표시 | `<Badge type="green">완료</Badge>` |

### 컬러 사용

```typescript
// ✅ 올바른 방법
import { colors } from '@toss/tds-react-native';
<View style={{ backgroundColor: colors.blue500 }} />

// ❌ 잘못된 방법
<View style={{ backgroundColor: '#3182F6' }} />  // 금지!
```

---

## 🤖 AI 에이전트 스킬 시스템

### 사용 가능한 스킬 (11개)

1. **appsInTossGuide** ⭐ - 앱인토스 개발 가이드 제공
2. **ideaGenerator** - 미니앱 아이디어 생성
3. **specWriter** - 상세 기획서 작성
4. **marketAnalyzer** - 시장 분석 & SWOT
5. **techStackAdvisor** - 기술 스택 추천
6. **monetizationPlanner** - 수익화 전략
7. **uxDesigner** - UI/UX 디자인 가이드
8. **codeGenerator** - 보일러플레이트 코드 생성
9. **tossSdkHelper** - 토스 SDK 통합 가이드
10. **feedbackAnalyzer** - 사용자 피드백 분석
11. **launchPlanner** - 출시 계획 수립

### 사용 예제

```javascript
import { skillManager } from './skills/SkillManager.js';

// ⭐ NEW! 앱인토스 가이드 - TDS 컴포넌트 정보
const tdsGuide = await skillManager.executeSkill('appsInTossGuide', {
  topic: 'tds'
});

// TDS Toast 컴포넌트 사용법 (코드 예제)
const toastGuide = await skillManager.executeSkill('appsInTossGuide', {
  topic: 'tds',
  subtopic: 'toast',
  format: 'code'
});

// 아이디어 생성
const ideas = await skillManager.executeSkill('ideaGenerator', {
  category: 'finance'
});

// 기획서 작성
const spec = await skillManager.executeSkill('specWriter', {
  idea: selectedIdea,
  detailLevel: 'detailed'
});
```

---

## ✅ 필수 준수 사항

### 디자인

- ✅ **TDS 필수 사용** (비게임 앱)
- ✅ **컬러 토큰 사용** (하드코딩 금지)
- ✅ **타이포그래피 스케일 사용** (하드코딩 금지)
- ✅ **해요체 사용** (UX 라이팅)
- ✅ **다크 패턴 금지**

### 인증 & 결제

- ✅ **토스 로그인만 허용** (타 로그인 불가)
- ✅ **토스페이만 허용** (타 결제 수단 불가)

### 기술

- ✅ **라이트 모드만** (다크모드 ❌)
- ✅ **핀치 줌 비활성화** (지도 제외)
- ✅ **iframe 금지** (YouTube 제외)
- ✅ **TypeScript 사용**
- ✅ **함수형 컴포넌트 사용**

### 성능

- ✅ **응답 시간 2초 이내**
- ✅ **재연결 시 데이터 유지**
- ✅ **모든 기능 정상 작동**

---

## 🛠️ 개발 워크플로우

### 1. 아이디어 생성

```bash
# AI 스킬 사용
node scripts/generate-idea.js
```

### 2. 기획서 작성

```bash
# AI 스킬 사용
node scripts/write-spec.js
```

### 3. 개발

```bash
# 컴포넌트 작성 (TDS 사용)
# pages/ 에 페이지 추가
# components/ 에 컴포넌트 추가
```

### 4. 테스트

```bash
npm run type-check  # 타입 체크
npm run lint        # 린트
npm test            # 테스트
```

### 5. 빌드

```bash
npm run build       # .ait 번들 생성
```

### 6. 배포

```bash
# 앱인토스 콘솔에 .ait 파일 업로드
# 출시 심사 신청
```

---

## 📊 프로젝트 통계

### 크롤링된 문서

- **앱인토스 페이지**: 100+ 페이지
- **TDS 컴포넌트**: 47+ 컴포넌트
- **API 엔드포인트**: 15+
- **SDK 카테고리**: 8개

### 스킬 시스템

- **총 스킬 수**: 11개
- **워크플로우**: 4개
- **통합 방식**: React Hooks

---

## 🔗 참고 링크

### 공식 문서
- **앱인토스 개발자 센터**: https://developers-apps-in-toss.toss.im
- **TDS React Native**: https://tossmini-docs.toss.im/tds-react-native/
- **TDS WebView**: https://tossmini-docs.toss.im/tds-mobile/

### 커뮤니티
- **개발자 포럼**: https://techchat-apps-in-toss.toss.im/
- **피드백**: https://apps-in-toss.channel.io/workflows/787658

### 예제
- **Cocos 예제**: https://github.com/toss/apps-in-toss-cocos-examples

---

## 🎓 학습 순서 (권장)

1. **DEV_STANDARD.md** 읽기 (30분) ⭐
2. **docs/apps-in-toss-developer-guide.md** 훑어보기 (1시간)
3. **docs/tds-react-native-components.json** 주요 컴포넌트 확인 (30분)
4. 샘플 프로젝트 생성 및 실행 (30분)
5. TDS 컴포넌트 실습 (1시간)
6. 첫 미니앱 개발 시작! 🚀

---

## 💡 팁 & 트릭

### TDS 컴포넌트 찾기

```typescript
// docs/tds-react-native-components.json 에서 검색
// 또는 AI 스킬 사용
const guide = await skillManager.executeSkill('appsInTossGuide', {
  topic: 'tds'
});
```

### 빠른 프로토타이핑

```typescript
// AI 스킬로 코드 생성
const code = await skillManager.executeSkill('codeGenerator', {
  idea: myIdea,
  codeStyle: 'standard'
});
```

### 출시 전 체크

```typescript
// AI 스킬로 체크리스트 확인
const checklist = await skillManager.executeSkill('appsInTossGuide', {
  topic: 'launch',
  format: 'checklist'
});
```

---

## ⚡ 새로운 기능 (v1.0.0)

### 1. 완전한 문서 크롤링
- ✅ 앱인토스 공식 문서 100+ 페이지 크롤링
- ✅ TDS React Native 47+ 컴포넌트 문서
- ✅ JSON 및 Markdown 형식으로 구조화

### 2. appsInTossGuide 스킬 추가
- ✅ 실시간 개발 가이드 제공
- ✅ 10가지 주제 지원 (design, webview, reactnative, tds, authentication, payment, marketing, launch, api, sdk)
- ✅ 4가지 응답 형식 (summary, detailed, code, checklist)

### 3. React Native + TDS 표준 설정
- ✅ DEV_STANDARD.md 완전 가이드
- ✅ 프로젝트 구조 템플릿
- ✅ 코딩 규칙 및 베스트 프랙티스

---

## 🤝 기여

이 프로젝트는 앱인토스 미니앱 개발을 위한 표준 템플릿입니다.

개선 사항이나 피드백은 환영합니다!

---

## 📄 라이선스

이 프로젝트는 [Apps in Toss](https://apps-in-toss.toss.im) 플랫폼 위에서 개발됩니다.

모든 디자인 시스템 및 컴포넌트의 저작권은 **Toss**에 있습니다.

---

## 📞 지원

### 문제 해결

1. **DEV_STANDARD.md** 체크리스트 확인
2. **docs/apps-in-toss-developer-guide.md** 검색
3. AI 스킬 `appsInTossGuide` 사용
4. 개발자 포럼에 질문

### 긴급 문제

- **커뮤니티**: https://techchat-apps-in-toss.toss.im/
- **피드백**: https://apps-in-toss.channel.io/workflows/787658

---

**프로젝트 버전**: v1.0.0
**최종 업데이트**: 2026-01-21
**개발 표준**: React Native + TDS

**Happy Coding! 🚀**
