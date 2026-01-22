# 앱인토스 개발 가이드 문서

## 📚 개요

이 디렉토리에는 [Apps in Toss 공식 개발자 센터](https://developers-apps-in-toss.toss.im)에서 크롤링한 완전한 개발 가이드가 포함되어 있습니다.

**크롤링 완료 일자**: 2026-01-21
**버전**: v1.0.0

---

## 📁 파일 구조

```
docs/
├── README.md                              # 이 파일
├── apps-in-toss-complete-guide.json       # 구조화된 가이드 데이터 (JSON)
└── apps-in-toss-developer-guide.md        # 마크다운 형식의 완전한 가이드
```

---

## 📖 문서 내용

### 1. `apps-in-toss-complete-guide.json`

**전체 사이트맵과 모든 가이드를 JSON 형식으로 구조화한 파일**

#### 포함된 주요 섹션:

- **메타데이터**: 문서 버전, 출처, 최종 업데이트 날짜
- **사이트맵**: 모든 페이지 URL 경로 (100+ 페이지)
- **시작하기**: 온보딩 프로세스, 정책, 주의사항
- **디자인 가이드**: 브랜딩, UX 라이팅, 다크 패턴 방지, TDS
- **개발 가이드**: WebView, React Native, Unity, Firebase
- **인증 시스템**: 토스 로그인, 게임 로그인, 토스 인증
- **결제 시스템**: 토스페이, 인앱 구매 (IAP)
- **마케팅 & 분석**: 푸시 알림, 애널리틱스, 광고
- **출시 체크리스트**: 비게임/게임 앱 출시 가이드
- **API & SDK 레퍼런스**: 모든 API 엔드포인트 및 SDK 메서드

#### 사용 예제:

```javascript
import fs from 'fs';

// JSON 파일 로드
const guideData = JSON.parse(
  fs.readFileSync('./docs/apps-in-toss-complete-guide.json', 'utf8')
);

// TDS 컴포넌트 목록 조회
console.log(guideData.design.tds.components);

// WebView 설정 정보 조회
console.log(guideData.development.webview.configuration);

// 토스페이 API 엔드포인트 조회
console.log(guideData.payment.tossPay.apiEndpoints);
```

---

### 2. `apps-in-toss-developer-guide.md`

**마크다운 형식의 완전한 개발 가이드 (읽기 편한 형식)**

#### 포함된 내용:

- ✅ 8개 주요 섹션 (시작하기, 디자인, 개발, 인증, 결제, 마케팅, 출시, API/SDK)
- ✅ 코드 예제 및 스니펫
- ✅ 단계별 튜토리얼
- ✅ 체크리스트 및 베스트 프랙티스
- ✅ 다이어그램 (Mermaid)
- ✅ 빠른 참조 표

#### 사용 방법:

- GitHub, GitLab 등에서 직접 읽기
- Markdown 뷰어로 열기
- 개발 문서로 팀과 공유
- AI 모델에 컨텍스트로 제공

---

## 🔧 스킬 시스템 통합

### AppsInTossGuideSkill

새로 추가된 `AppsInTossGuideSkill`은 크롤링된 가이드 데이터를 기반으로 개발자에게 실시간 가이드를 제공합니다.

#### 설치 위치:
```
skills/appsInTossGuide.js
```

#### 사용 가능한 주제 (Topics):

| 주제 | 설명 |
|-----|------|
| `design` | 디자인 가이드 (브랜딩, UX 라이팅, 다크 패턴, TDS) |
| `webview` | WebView 개발 가이드 |
| `reactnative` | React Native 개발 가이드 |
| `tds` | TDS (Toss Design System) 가이드 |
| `authentication` | 인증 시스템 (토스 로그인, 게임 로그인) |
| `payment` | 결제 시스템 (토스페이, IAP) |
| `marketing` | 마케팅 & 분석 (푸시, 애널리틱스, 광고) |
| `launch` | 출시 가이드 & 체크리스트 |
| `api` | API 레퍼런스 |
| `sdk` | SDK 레퍼런스 |
| `all` | 전체 가이드 개요 |

#### 세부 주제 (Subtopics):

- **design**: `branding`, `ux-writing`, `dark-pattern`
- **authentication**: `toss-login`
- **payment**: `toss-pay`, `iap`
- **marketing**: `analytics`, `ads`

#### 응답 형식 (Formats):

- `summary` - 요약 정보 (기본값)
- `detailed` - 상세 정보
- `code` - 코드 예제
- `checklist` - 체크리스트

#### 사용 예제:

```javascript
import { skillManager } from './skills/SkillManager.js';

// 1. 디자인 가이드 - 브랜딩
const brandingGuide = await skillManager.executeSkill('appsInTossGuide', {
  topic: 'design',
  subtopic: 'branding'
});

// 2. WebView 개발 - 코드 예제
const webviewCode = await skillManager.executeSkill('appsInTossGuide', {
  topic: 'webview',
  format: 'code'
});

// 3. 출시 체크리스트
const launchChecklist = await skillManager.executeSkill('appsInTossGuide', {
  topic: 'launch',
  format: 'checklist'
});

// 4. 애널리틱스 - 코드 예제
const analyticsCode = await skillManager.executeSkill('appsInTossGuide', {
  topic: 'marketing',
  subtopic: 'analytics',
  format: 'code'
});
```

---

## 📊 크롤링된 데이터 통계

### 문서 범위:

- **총 페이지 수**: 100+ 페이지
- **주요 섹션**: 8개
- **API 엔드포인트**: 15+
- **SDK 카테고리**: 8개
- **TDS 컴포넌트**: 40+

### 포함된 주요 기술:

- ✅ WebView (Vite + React + TypeScript)
- ✅ React Native (Granite Framework)
- ✅ Unity (WebGL)
- ✅ Firebase 통합
- ✅ TDS (Toss Design System)
- ✅ 토스 로그인 & 토스페이
- ✅ 인앱 구매 (IAP)
- ✅ 애널리틱스 & 광고
- ✅ 푸시 알림

---

## 🎯 주요 포인트

### 필수 준수 사항:

1. ✅ **비게임 앱은 TDS 필수**
2. ✅ **토스 로그인만 허용** (타 로그인 불가)
3. ✅ **토스페이만 허용** (타 결제 수단 불가)
4. ✅ **다크 패턴 금지**
5. ✅ **iframe 금지** (YouTube 제외)
6. ✅ **라이트 모드만** (다크모드 ❌)
7. ✅ **핀치 줌 비활성화** (지도 제외)

### 성능 기준:

- ⚡ **응답 시간**: 2초 이내
- 💾 **데이터 유지**: 재연결 시에도 유지
- ✅ **모든 기능 정상 작동**

---

## 🔄 업데이트 방법

가이드를 최신 버전으로 업데이트하려면 다음 단계를 수행하세요:

```bash
# 1. 크롤링 스크립트 실행 (별도 구현 필요)
node scripts/crawl-apps-in-toss-docs.js

# 2. JSON 데이터 검증
node scripts/validate-guide-data.js

# 3. 마크다운 문서 재생성
node scripts/generate-markdown.js

# 4. 스킬 시스템 재시작
npm run restart-skills
```

---

## 📚 추가 리소스

### 공식 문서:
- **개발자 센터**: https://developers-apps-in-toss.toss.im
- **TDS WebView**: https://tossmini-docs.toss.im/tds-mobile/
- **TDS React Native**: https://tossmini-docs.toss.im/tds-react-native/

### 커뮤니티:
- **개발자 포럼**: https://techchat-apps-in-toss.toss.im/
- **피드백**: https://apps-in-toss.channel.io/workflows/787658

### 예제 코드:
- **Cocos 예제**: https://github.com/toss/apps-in-toss-cocos-examples

---

## 🤝 기여

가이드에 오류나 누락된 정보가 있다면:

1. Issue 생성
2. Pull Request 제출
3. 또는 팀 채널에 피드백 공유

---

## 📄 라이선스

이 문서는 [Apps in Toss 공식 개발자 센터](https://developers-apps-in-toss.toss.im)에서 크롤링한 공개 정보를 기반으로 합니다.

모든 원본 콘텐츠의 저작권은 **Toss**에 있습니다.

---

**문서 버전**: v1.0.0
**최종 업데이트**: 2026-01-21
**크롤링 출처**: https://developers-apps-in-toss.toss.im
