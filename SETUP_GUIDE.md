# 개발 환경 설정 가이드

## 현재 상황

Node.js v22.11.0을 사용 중이나, Apps in Toss의 Granite 프레임워크와 React Native가 사용하는 네이티브 바이너리(@swc/core, esbuild)가 Node.js v22와 호환되지 않아 segmentation fault 발생.

## 해결 방법: Node.js v18 LTS로 변경

### 방법 1: nvm-windows 사용 (권장)

1. **nvm-windows 설치**
   - https://github.com/coreybutler/nvm-windows/releases
   - 최신 `nvm-setup.exe` 다운로드 및 설치

2. **Node.js v18 설치 및 사용**
   ```bash
   nvm install 18.20.5
   nvm use 18.20.5
   node --version  # v18.20.5 확인
   ```

3. **패키지 재설치**
   ```bash
   cd "C:\Users\USER-PC\Desktop\앱인토스 프로젝트\receipt-static"
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

### 방법 2: 직접 Node.js v18 설치

1. **현재 Node.js 제거**
   - 제어판 > 프로그램 제거 > Node.js 제거

2. **Node.js v18.20.5 LTS 설치**
   - https://nodejs.org/dist/v18.20.5/node-v18.20.5-x64.msi
   - 다운로드 후 설치

3. **설치 확인**
   ```bash
   node --version  # v18.20.5 확인
   npm --version
   ```

4. **패키지 재설치**
   ```bash
   cd "C:\Users\USER-PC\Desktop\앱인토스 프로젝트\receipt-static"
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

5. **개발 서버 실행**
   ```bash
   npm run dev
   ```

## 개발 서버 실행 후

서버가 정상적으로 시작되면:

1. **포트 확인**
   - Granite 개발 서버: http://localhost:8081
   - Metro bundler 실행 중 확인

2. **Android 디바이스 연결 (ADB reverse)**
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

3. **샌드박스 앱에서 테스트**
   - 토스 샌드박스 앱 실행
   - 개발자 로그인
   - ci-calculator 앱 실행

## 추가 참고

- **Apps in Toss 개발 가이드**: https://developers-apps-in-toss.toss.im/tutorials/react-native.html
- **샌드박스 테스트 가이드**: SANDBOX_TESTING.md
- **출시 로드맵**: LAUNCH_ROADMAP.md
