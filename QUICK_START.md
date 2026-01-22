# 빠른 시작 가이드

## 현재 상황 요약

✅ **완료된 작업**
- React Native + TDS 기반 복리 계산기 구현
- 시계열 그래프 추가 (react-native-chart-kit)
- Zustand 상태 관리
- Storage API 통합 (자동 저장/복원)
- bedrock.config.ts 설정 완료 (앱 이름: ci-calculator)
- 모든 의존성 package.json에 추가

⚠️ **현재 블로커**
- Node.js v22.11.0과 네이티브 바이너리 호환성 문제
- 모든 npm/npx 명령어가 segmentation fault로 실패

## 해결 방법: Node.js v18 설치

### Option 1: nvm-windows 사용 (권장) ⭐

```bash
# 1. nvm-windows 설치
# https://github.com/coreybutler/nvm-windows/releases
# nvm-setup.exe 다운로드 및 설치

# 2. Node.js v18 설치
nvm install 18.20.5
nvm use 18.20.5

# 3. 확인
node --version  # v18.20.5
```

### Option 2: 직접 설치

1. https://nodejs.org/dist/v18.20.5/node-v18.20.5-x64.msi
2. 다운로드 후 설치

## Node.js v18 설치 후 실행

```bash
# 1. 프로젝트 디렉토리로 이동
cd "C:\Users\USER-PC\Desktop\앱인토스 프로젝트\receipt-static"

# 2. node_modules 제거 (중요!)
rm -rf node_modules package-lock.json

# 3. 의존성 재설치
npm install --legacy-peer-deps

# 4. 개발 서버 실행
npm run dev
```

## 개발 서버 실행 성공 후

### 1. 포트 확인
- Granite 개발 서버: http://localhost:8081
- 콘솔에 "Ready on http://localhost:8081" 메시지 확인

### 2. Android 디바이스 연결

```bash
# USB로 Android 기기 연결 후
adb devices

# 포트 포워딩 설정
adb reverse tcp:8081 tcp:8081
```

### 3. 샌드박스 앱에서 테스트

1. 토스 샌드박스 앱 실행
2. 개발자 로그인 (하단의 개발자 메뉴)
3. "ci-calculator" 앱 찾아서 실행
4. 복리 계산기 UI 확인

## 주요 파일 구조

```
receipt-static/
├── bedrock.config.ts           # Apps in Toss 설정 (앱 이름: ci-calculator)
├── package.json                # 의존성 (React Native, TDS, chart-kit)
├── index.js                    # Granite 엔트리 포인트
├── src/
│   ├── pages/
│   │   └── index.tsx          # 메인 페이지 (파일 기반 라우팅)
│   ├── components/
│   │   ├── CompoundInterestCalculator.tsx  # 계산기 메인 컴포넌트
│   │   └── CompoundInterestChart.tsx       # 시계열 그래프
│   ├── hooks/
│   │   └── useStorage.ts      # Storage API 훅
│   ├── stores/
│   │   └── calculatorStore.ts # Zustand 스토어
│   ├── utils/
│   │   └── compoundInterest.ts # 복리 계산 로직
│   └── types/
│       └── index.ts           # TypeScript 타입 정의
└── docs/
    ├── SETUP_GUIDE.md         # 상세 설정 가이드
    ├── SANDBOX_TESTING.md     # 샌드박스 테스트 가이드
    └── LAUNCH_ROADMAP.md      # 출시 로드맵
```

## 주요 기능

### 1. 복리 계산
- 초기 투자금
- 연 수익률
- 투자 기간
- 월 추가 투자
- 복리 주기 (연/월/일)

### 2. 시계열 그래프
- 연도별 원금 vs 최종 금액 비교
- TDS 컬러 시스템 (blue600, grey600)
- Bezier 곡선으로 부드러운 라인
- 10년 이상일 때 가로 스크롤

### 3. Storage API
- 입력 값 자동 저장
- 앱 재실행 시 복원
- 계산 히스토리 (최근 10개)

### 4. TDS 디자인 시스템
- 색상: colors.blue600, colors.grey600, etc.
- 타이포그래피: typography.Headline1, etc.
- 하드코딩 없이 모두 TDS 토큰 사용

## 다음 단계

Node.js v18 설치 → 패키지 재설치 → 개발 서버 실행 → 샌드박스 테스트

자세한 내용은 다음 문서를 참고하세요:
- **SETUP_GUIDE.md**: 상세한 환경 설정 가이드
- **SANDBOX_TESTING.md**: 샌드박스 앱 테스트 가이드 (9단계)
- **LAUNCH_ROADMAP.md**: 출시까지의 전체 로드맵 (10단계)
