@echo off
echo ============================================
echo Node.js v18 설치 가이드
echo ============================================
echo.
echo 현재 Node.js 버전:
node --version
echo.
echo Node.js v22는 @swc/core와 호환성 문제가 있습니다.
echo Node.js v18 LTS로 변경이 필요합니다.
echo.
echo ============================================
echo 방법 1: nvm-windows 사용 (권장)
echo ============================================
echo 1. https://github.com/coreybutler/nvm-windows/releases
echo 2. nvm-setup.exe 다운로드 및 설치
echo 3. 명령어 실행:
echo    nvm install 18.20.5
echo    nvm use 18.20.5
echo.
echo ============================================
echo 방법 2: 직접 설치
echo ============================================
echo 1. https://nodejs.org/dist/v18.20.5/node-v18.20.5-x64.msi
echo 2. 다운로드 및 설치
echo.
echo ============================================
echo 설치 후 실행할 명령어
echo ============================================
echo cd "%CD%"
echo rmdir /s /q node_modules
echo del package-lock.json
echo npm install --legacy-peer-deps
echo npm run dev
echo.
pause
