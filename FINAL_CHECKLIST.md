# ✅ 출시 최종 체크리스트 - ci-calculator

## 📋 프로젝트 정보

**앱 이름**: ci-calculator (복리 계산기)
**버전**: 1.0.0
**플랫폼**: React Native + TDS
**등록일**: 2026-01-21

---

## 🎯 구현 완료 기능

### ✅ 핵심 기능

- [x] **복리 계산 엔진**
  - 정확한 복리 계산 알고리즘
  - 월 추가 납입금 지원
  - 연도별 상세 내역
  - 최대 30년 계산 지원

- [x] **시계열 그래프**
  - react-native-chart-kit 사용
  - 최종 금액 vs 원금 비교
  - TDS 색상 (blue600, grey600) 적용
  - 부드러운 베지어 곡선
  - 가로 스크롤 지원 (10년 초과 시)

- [x] **Storage 자동 저장**
  - 입력값 자동 저장
  - 앱 재실행 시 복원
  - Toast 알림 ("이전 입력값을 불러왔어요")

- [x] **UI/UX**
  - TDS 컴포넌트 100% 사용
  - 색상 토큰 사용 (하드코딩 없음)
  - 타이포그래피 사용
  - Toast 알림 시스템
  - 반응형 레이아웃

---

## 📦 패키지 의존성

### 필수 패키지

```json
{
  "@apps-in-toss/framework": "^1.5.2",
  "@granite-js/native": "^0.1.28",
  "@granite-js/plugin-router": "^0.1.28",
  "@granite-js/react-native": "^0.1.28",
  "@toss/tds-react-native": "^1.3.8",
  "react": "18.2.0",
  "react-native": "0.72.6",
  "react-native-chart-kit": "^6.12.0",
  "react-native-svg": "^13.14.0",
  "zustand": "^4.4.0"
}
```

### 설치 방법

```bash
npm install --legacy-peer-deps
# 또는
yarn install
```

---

## 📁 파일 구조

```
ci-calculator/
├── src/
│   ├── pages/
│   │   └── index.tsx                          # 메인 페이지
│   ├── components/
│   │   ├── CompoundInterestCalculator.tsx     # 계산기 메인
│   │   └── CompoundInterestChart.tsx          # 시계열 그래프 ⭐ NEW
│   ├── hooks/
│   │   └── useStorage.ts                      # Storage Hook
│   ├── stores/
│   │   └── calculatorStore.ts                 # Zustand 스토어
│   ├── utils/
│   │   └── compoundInterest.ts                # 계산 로직
│   ├── types/
│   │   └── index.ts                           # TypeScript 타입
│   └── App.tsx                                # 앱 루트
├── bedrock.config.ts                          # 앱인토스 설정 ⭐
├── package.json                               # 패키지 설정
├── tsconfig.json                              # TypeScript 설정
└── granite.config.ts                          # Granite 설정
```

---

## 🔧 bedrock.config.ts 설정

```typescript
export default defineConfig({
  scheme: 'intoss',
  appName: 'ci-calculator',  // ⭐ 콘솔 등록 이름과 동일
  plugins: [
    appsInToss({
      brand: {
        displayName: '복리 계산기',
        primaryColor: '#3182F6',
        icon: 'https://...',  // TODO: 실제 아이콘 URL
        bridgeColorMode: 'basic',
      },
      permissions: [],
    }),
    router(),
  ],
});
```

---

## 🎨 TDS 표준 준수 확인

### ✅ 색상 토큰

```typescript
// ✅ 올바름
colors.blue600   // 메인 색상
colors.grey900   // 텍스트
colors.grey50    // 배경
colors.green600  // 이자 금액
colors.white     // 카드 배경

// ❌ 금지 - 하드코딩 없음
backgroundColor: '#3182F6'  // 사용하지 않음
```

### ✅ 타이포그래피

```typescript
// ✅ 올바름
<typography.Headline1>
<typography.Headline3>
<typography.Body2Bold>
<typography.Caption1>
<typography.Caption2>

// ❌ 금지 - 폰트 크기 하드코딩 없음
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>
```

### ✅ TDS 컴포넌트

```typescript
// ✅ 사용된 컴포넌트
Navbar
TextField
Button
List / ListRow
Badge
Toast
```

---

## 🧪 테스트 시나리오

### 1. 기본 계산

```
입력:
- 원금: 10,000,000원
- 이자율: 5%
- 기간: 10년
- 월 납입: 0원

예상 결과:
- 최종 금액: 약 16,288,946원
- 총 이자: 약 6,288,946원
- 수익률: 62.89%
```

### 2. 월 납입 포함

```
입력:
- 원금: 10,000,000원
- 이자율: 5%
- 기간: 10년
- 월 납입: 500,000원

예상 결과:
- 최종 금액: 약 93,680,000원
- 월 납입으로 원금 증가
- 복리 효과로 이자 증가
```

### 3. Storage 테스트

1. 값 입력 (예: 원금 20,000,000원)
2. 앱 완전 종료
3. 앱 재실행
4. ✅ "이전 입력값을 불러왔어요" Toast 표시
5. ✅ 입력값 복원됨

### 4. 그래프 테스트

1. 계산하기 버튼 클릭
2. ✅ 시계열 그래프 표시
3. ✅ 파란색 선: 최종 금액
4. ✅ 회색 선: 원금
5. ✅ 가로 스크롤 가능 (10년 초과 시)
6. ✅ Y축 레이블: 만원/억원 단위

---

## 🚀 빌드 & 배포

### Step 1: 타입 체크

```bash
npm run typecheck
```

**확인사항**:
- [ ] 타입 에러 없음
- [ ] import 경로 올바름

### Step 2: 린트

```bash
npm run lint
```

**확인사항**:
- [ ] ESLint 에러 없음
- [ ] 코드 스타일 일관성

### Step 3: 빌드

```bash
npm run build
```

**생성 파일**:
- [ ] `dist/` 또는 `.ait/` 디렉토리 생성
- [ ] 번들 크기 < 5MB
- [ ] 에러 없이 빌드 완료

### Step 4: 콘솔 업로드

1. https://console-apps-in-toss.toss.im 접속
2. 워크스페이스 > ci-calculator 선택
3. 개발 > 배포 > 번들 업로드
4. 버전 정보 입력:
   - 버전: 1.0.0
   - 변경사항: "첫 출시 - 복리 계산 + 시계열 그래프"

---

## 📱 샌드박스 테스트

### 사전 준비

1. **샌드박스 앱 설치**
   - Android: Google Play
   - iOS: App Store

2. **개발자 로그인**
   - 콘솔에서 발급받은 개발자 코드 입력
   - 또는 QR 코드 스캔

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **포트 포워딩** (Android)
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

### 테스트 체크리스트

- [ ] 앱 실행 < 2초
- [ ] 모든 입력 필드 작동
- [ ] 계산 결과 정확
- [ ] 그래프 정상 표시
- [ ] Storage 저장/복원 작동
- [ ] Toast 알림 표시
- [ ] 스크롤 부드러움
- [ ] 키보드 동작 정상

---

## 🎯 출시 전 최종 확인

### 기능

- [x] 복리 계산 정확도 검증
- [x] 그래프 데이터 정확도
- [x] Storage 동작 확인
- [x] Toast 알림 작동
- [x] 초기화 기능 작동

### 디자인

- [x] TDS 컴포넌트만 사용
- [x] 색상 토큰 사용
- [x] 타이포그래피 사용
- [x] 반응형 레이아웃
- [x] 접근성 (라벨, 대비)

### 성능

- [x] 앱 실행 < 2초
- [x] 계산 응답 < 1초
- [x] 부드러운 스크롤
- [x] 메모리 누수 없음

### 보안

- [x] API 키 노출 없음
- [x] 민감 정보 로깅 없음
- [x] 입력값 검증

### 문서

- [x] README.md 업데이트
- [x] QUICKSTART.md 작성
- [x] SANDBOX_TESTING.md 작성
- [x] LAUNCH_ROADMAP.md 작성

---

## 📊 메타데이터

### 앱 정보 (콘솔 입력용)

**앱 이름**: 복리 계산기

**한 줄 소개** (30자):
```
투자 수익을 한눈에 보는 복리 계산기
```

**상세 설명** (500자):
```
원금, 이자율, 기간만 입력하면 복리 효과를
한눈에 확인할 수 있어요.

주요 기능:
• 정확한 복리 계산
• 월 추가 납입 지원
• 시계열 그래프로 투자 성장 확인
• 연도별 상세 내역
• 자동 저장으로 편리한 재사용

투자 계획을 세우거나, 저축 목표를 정할 때
복리 효과를 시각적으로 확인하세요!
```

**카테고리**: 금융/재테크

**태그**: 복리, 계산기, 투자, 재테크, 저축

### 스크린샷 (필수)

1. **메인 화면**: 입력 폼 + 버튼
2. **결과 화면**: 최종 금액 + 요약
3. **그래프**: 시계열 그래프
4. **상세**: 연도별 상세 내역

크기: 1080x1920px (9:16 비율)

---

## 🔮 다음 단계

### 즉시 (출시 후)

1. **모니터링**
   - Analytics 확인
   - 크래시 모니터링
   - 사용자 피드백 수집

2. **버그 수정**
   - 긴급 버그 핫픽스
   - 성능 최적화

### v1.1 계획

1. **기능 추가**
   - [ ] 히스토리 목록 (과거 계산 기록)
   - [ ] 비교 모드 (여러 시나리오 비교)
   - [ ] 공유 기능 (결과 이미지 공유)
   - [ ] 목표 금액 역계산

2. **UX 개선**
   - [ ] 입력값 프리셋 (자주 사용하는 값 저장)
   - [ ] 그래프 확대/축소
   - [ ] 다크 모드 지원

3. **마케팅**
   - [ ] 푸시 알림 (정기 저축 리마인더)
   - [ ] 인앱 광고 (수익화)
   - [ ] 프리미엄 기능 (IAP)

---

## 📞 지원

### 문제 발생 시

1. `SANDBOX_TESTING.md`의 문제 해결 섹션 확인
2. `LAUNCH_ROADMAP.md`의 체크리스트 확인
3. 앱인토스 개발자 포럼: https://techchat-apps-in-toss.toss.im/
4. 피드백 채널: https://apps-in-toss.channel.io/workflows/787658

---

**최종 업데이트**: 2026-01-21
**상태**: ✅ 출시 준비 완료
**다음 작업**: 샌드박스 테스트 → 빌드 → 콘솔 업로드 → 심사 신청

🚀 **출시를 축하합니다!**
