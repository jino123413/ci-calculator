# 🧪 샌드박스 테스트 가이드

## 📋 개요

앱인토스 샌드박스 앱을 사용하여 복리 계산기를 실제 앱처럼 테스트하는 방법입니다.

---

## 1️⃣ 샌드박스 앱 설치

### Android

1. Google Play 스토어에서 "토스 샌드박스" 검색
2. 앱 설치

또는 QR 코드:
- https://developers-apps-in-toss.toss.im/prepare/sandbox.html

### iOS

1. App Store에서 "토스 샌드박스" 검색
2. 앱 설치
3. **TestFlight** 초대가 필요할 수 있음

---

## 2️⃣ 개발 환경 설정

### Step 1: 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `localhost:8081`에서 실행됩니다.

### Step 2: 네트워크 설정

#### Android (권장)

```bash
# ADB 포트 포워딩
adb reverse tcp:8081 tcp:8081

# 기기 연결 확인
adb devices
```

#### iOS

1. Mac과 iOS 기기가 **동일한 WiFi 네트워크**에 연결되어 있어야 합니다
2. `bedrock.config.ts`의 host를 Mac의 로컬 IP로 변경:

```typescript
export default defineConfig({
  // ...
  devServer: {
    host: '192.168.0.10', // Mac의 로컬 IP 주소
    port: 8081,
  },
});
```

Mac의 IP 확인:
```bash
ipconfig getifaddr en0  # WiFi
# 또는
ipconfig getifaddr en1  # 이더넷
```

---

## 3️⃣ 개발자 로그인

### Step 1: 샌드박스 앱 실행

토스 샌드박스 앱을 실행합니다.

### Step 2: 개발자 로그인

1. 앱 우측 상단의 **설정(⚙️)** 아이콘 터치
2. **"개발자 로그인"** 선택
3. 앱인토스 콘솔에 등록된 계정으로 로그인

**로그인 방법**:
- 앱인토스 콘솔에서 발급받은 **개발자 코드** 입력
- 또는 **QR 코드** 스캔

### Step 3: 개발자 모드 확인

로그인 성공 시:
- 화면 상단에 **"DEV"** 배지 표시
- 개발 중인 앱 목록 표시

---

## 4️⃣ 앱 실행 및 테스트

### Step 1: 앱 선택

1. 샌드박스 앱에서 **"복리 계산기"** 찾기
2. 앱 아이콘 터치하여 실행

### Step 2: 개발 모드로 실행

앱 실행 시 두 가지 모드 선택 가능:

#### A. 로컬 개발 모드 (권장)

- 로컬 개발 서버(`localhost:8081`)에 연결
- **핫 리로드** 지원 - 코드 변경 시 자동 반영
- 빠른 개발 & 디버깅

선택 방법:
1. 앱 아이콘 **길게 누르기**
2. **"개발 모드로 실행"** 선택

#### B. 프로덕션 모드

- 빌드된 `.ait` 번들 실행
- 실제 출시 환경과 동일
- 핫 리로드 없음

선택 방법:
- 앱 아이콘 **일반 터치**

---

## 5️⃣ 테스트 시나리오

### 기본 기능 테스트

1. **입력 테스트**
   - [ ] 원금 입력: 10,000,000원
   - [ ] 연 이자율: 5%
   - [ ] 투자 기간: 10년
   - [ ] 월 추가 납입액: 500,000원

2. **계산 버튼**
   - [ ] "계산하기" 버튼 터치
   - [ ] 결과가 정상적으로 표시되는지 확인
   - [ ] Toast 메시지 표시 확인

3. **결과 확인**
   - [ ] 최종 금액이 올바르게 표시되는지
   - [ ] 총 원금, 총 이자, 수익률이 정확한지
   - [ ] 연도별 상세 내역이 펼쳐지는지

### Storage 기능 테스트

1. **자동 저장**
   - [ ] 값 입력 후 앱 종료
   - [ ] 샌드박스 앱 완전 종료 (백그라운드에서 제거)
   - [ ] 앱 재실행 시 입력값이 복원되는지 확인
   - [ ] Toast "이전 입력값을 불러왔어요" 표시 확인

2. **초기화**
   - [ ] "초기화" 버튼 터치
   - [ ] 모든 입력값이 초기화되는지 확인
   - [ ] Toast "초기화되었어요" 표시 확인

### UI/UX 테스트

1. **TDS 컴포넌트**
   - [ ] 버튼 스타일이 TDS 표준에 맞는지
   - [ ] TextField가 올바르게 작동하는지
   - [ ] Toast가 하단에 표시되는지
   - [ ] Badge 색상이 적절한지

2. **반응형**
   - [ ] 다양한 화면 크기에서 레이아웃이 깨지지 않는지
   - [ ] 스크롤이 정상 작동하는지
   - [ ] 키보드가 입력 필드를 가리지 않는지

3. **성능**
   - [ ] 앱 실행 시간 < 2초
   - [ ] 계산 응답 시간 < 1초
   - [ ] 부드러운 스크롤

---

## 6️⃣ 디버깅

### React Native Debugger

```bash
# Chrome DevTools 열기
# 샌드박스 앱에서 개발자 메뉴 열기:
# - Android: 기기 흔들기 또는 adb shell input keyevent 82
# - iOS: ⌘ + D (시뮬레이터) 또는 기기 흔들기
```

개발자 메�옵션:
- **Reload**: 앱 새로고침
- **Debug**: Chrome DevTools 연결
- **Element Inspector**: UI 요소 검사
- **Performance Monitor**: 성능 모니터링

### 콘솔 로그 확인

#### Android

```bash
adb logcat | grep -i "ReactNativeJS"
```

#### iOS

```bash
# Xcode Console에서 확인
# 또는
react-native log-ios
```

### 네트워크 요청 확인

React Native Debugger의 Network 탭에서 확인:
- Storage API 호출
- API 요청/응답
- 에러 로그

---

## 7️⃣ 문제 해결

### 1. 앱이 표시되지 않음

**원인**: 개발자 로그인 실패 또는 앱 등록 안됨

**해결**:
1. 샌드박스 앱 재시작
2. 개발자 로그인 다시 시도
3. 앱인토스 콘솔에서 앱 등록 확인

### 2. "연결할 수 없습니다" 오류

**원인**: 개발 서버 연결 실패

**해결**:

#### Android
```bash
# ADB 연결 확인
adb devices

# 포트 포워딩 재설정
adb reverse --remove-all
adb reverse tcp:8081 tcp:8081
```

#### iOS
```bash
# 로컬 IP 확인
ipconfig getifaddr en0

# bedrock.config.ts 수정
# host: '192.168.x.x'로 변경
```

### 3. 흰 화면 / 빈 화면

**원인**: JavaScript 번들 로드 실패

**해결**:
```bash
# 캐시 삭제 및 재시작
rm -rf node_modules .ait
npm install
npm run dev
```

### 4. Storage 저장 안됨

**원인**: Storage API 권한 또는 호출 오류

**해결**:
1. `bedrock.config.ts`의 permissions 확인
2. 콘솔 로그에서 에러 확인
3. Storage API 호출 코드 검증

### 5. 핫 리로드 작동 안함

**원인**: Fast Refresh 비활성화

**해결**:
1. 개발자 메뉴 열기 (기기 흔들기)
2. "Enable Fast Refresh" 활성화
3. 앱 새로고침

---

## 8️⃣ 체크리스트

출시 전 필수 확인 사항:

### 기능

- [ ] 모든 입력 필드가 정상 작동
- [ ] 계산 결과가 정확
- [ ] Storage에 데이터 저장/복원 정상
- [ ] 초기화 기능 정상
- [ ] Toast 메시지 표시 정상

### UI/UX

- [ ] TDS 컴포넌트 정상 렌더링
- [ ] 색상 토큰 사용 (하드코딩 없음)
- [ ] 타이포그래피 일관성
- [ ] 반응형 레이아웃
- [ ] 키보드 동작 정상

### 성능

- [ ] 앱 실행 시간 < 2초
- [ ] 계산 응답 시간 < 1초
- [ ] 메모리 누수 없음
- [ ] 크래시 없음

### 호환성

- [ ] Android 최소 버전 테스트
- [ ] iOS 최소 버전 테스트
- [ ] 다양한 화면 크기 테스트
- [ ] 네트워크 재연결 시 정상 작동

---

## 9️⃣ 다음 단계

테스트 완료 후:

1. ✅ **빌드**: `npm run build`
2. 📦 **번들 생성**: `.ait` 파일 확인
3. 🚀 **콘솔 업로드**: 앱인토스 콘솔에 업로드
4. 📝 **출시 신청**: 심사 요청

자세한 내용은 `LAUNCH_ROADMAP.md` 참고.

---

**도움말**: https://developers-apps-in-toss.toss.im/prepare/sandbox.html
