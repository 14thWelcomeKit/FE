# WelcomeKit - 웰컴키트 PWA 애플리케이션

멋쟁이사자처럼 14기 웰컴키트 프로젝트의 프론트엔드 애플리케이션입니다.

## 🚀 프로젝트 개요

WelcomeKit은 React 기반의 Progressive Web App(PWA)으로, 사용자 인증, 프로필 관리, QR 코드 스캔, 빙고 게임 등의 기능을 제공합니다.

## ✨ 주요 기능

### 🔐 사용자 인증
- 로그인/회원가입
- JWT 토큰 기반 인증
- 쿠키를 통한 세션 관리
- 자동 로그인 유지

### 👤 사용자 관리
- 프로필 이미지 업로드/변경
- 비밀번호 변경
- 사용자 정보 조회/수정
- 웰컴 메시지 조회

### 📱 PWA 기능
- 홈 화면 설치
- 오프라인 지원
- 서비스 워커를 통한 캐싱
- 반응형 디자인

### 🎯 핵심 기능
- QR 코드 스캔
- 빙고 게임
- 체크인 시스템
- 소개 페이지
- 익명 문의 게시판

## 🛠️ 기술 스택

### Frontend
- **React 18.3.1** - 사용자 인터페이스 라이브러리
- **React Router DOM 7.2.0** - 클라이언트 사이드 라우팅
- **Styled Components 6.1.15** - CSS-in-JS 스타일링
- **Axios 1.8.3** - HTTP 클라이언트

### PWA & 모바일
- **Service Worker** - 오프라인 캐싱 및 백그라운드 동기화
- **Web App Manifest** - PWA 설치 및 설정
- **HTML5 QR Scanner** - QR 코드 스캔 기능

### 상태 관리 & 인증
- **React Context API** - 전역 상태 관리
- **React Cookie** - 쿠키 기반 인증 토큰 관리

## 📁 프로젝트 구조

```
src/
├── components/             # 재사용 가능한 컴포넌트
│   ├── Header.jsx          # 네비게이션 헤더
│   ├── PageContainer.jsx   # 페이지 레이아웃 컨테이너
│   ├── Breakpoints.jsx     # 반응형 디자인 브레이크포인트
│   ├── PWAInstall.jsx      # PWA 설치 컴포넌트
│   ├── Board.jsx           # 게시판 컴포넌트
│   └── WelcomeModal.jsx    # 웰컴 메시지 모달
├── pages/                  # 페이지 컴포넌트
│   ├── Main.jsx            # 메인 페이지
│   ├── Introduce.jsx       # 소개 페이지
│   ├── Login.jsx           # 로그인 페이지
│   ├── SignUp.jsx          # 회원가입 페이지
│   ├── MyPage.jsx          # 마이페이지
│   ├── ProfileImage.jsx    # 프로필 이미지 관리
│   ├── ChangePassword.jsx  # 비밀번호 변경
│   ├── Check.jsx           # 체크인 페이지
│   ├── QrScanner.jsx       # QR 스캔 페이지
│   ├── Bingo.jsx           # 빙고 게임 페이지
│   ├── Board.jsx           # 익명 문의 게시판 페이지
│   └── Setting.jsx         # 설정 페이지
├── images/                 # 이미지 리소스
├── fonts/                  # 폰트 파일
├── App.js                  # 메인 앱 컴포넌트
├── router.jsx              # 라우팅 설정
├── AuthContext.js          # 인증 컨텍스트
├── axiosInstance.js        # Axios 인스턴스 설정
├── GlobalStyles.js         # 전역 스타일
└── index.js                # 앱 진입점

public/
├── manifest.json           # PWA 매니페스트
├── sw.js                   # 서비스 워커
├── favicon.ico             # 파비콘
├── logo192.png             # PWA 아이콘 (192x192)
└── logo512.png             # PWA 아이콘 (512x512)
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 설치 및 실행

1. **저장소 클론**
```bash
git clone [repository-url]
cd FE
```

2. **의존성 설치**
```bash
npm install
```

3. **개발 서버 실행**
```bash
npm start
```

4. **프로덕션 빌드**
```bash
npm run build
```

5. **테스트 실행**
```bash
npm test
```

## 🐳 Docker 배포

### Docker 이미지 빌드
```bash
docker build -t welcomekit-frontend .
```

### Docker 컨테이너 실행
```bash
docker run -p 3000:3000 welcomekit-frontend
```

## 🔧 환경 설정


### PWA 설정
- `public/manifest.json`에서 앱 정보 수정
- `public/sw.js`에서 캐싱 전략 설정

## 📱 PWA 설치 방법

### 모바일 브라우저
1. Chrome/Safari에서 사이트 접속
2. "홈 화면에 추가" 또는 "앱 설치" 선택
3. 설치 완료 후 홈 화면에서 앱 실행

### 데스크톱 브라우저
1. Chrome에서 사이트 접속
2. 주소창 우측의 설치 아이콘 클릭
3. "WelcomeKit 설치" 클릭

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: `#FF6000` (오렌지)
- **Background**: `rgba(255, 255, 255, 0.19)` (반투명 화이트)
- **Text**: `#FFF` (화이트)
- **Error**: `#FF4444` (빨강)

### 반응형 브레이크포인트
- **Mobile**: `max-width: 768px`
- **Tablet**: `max-width: 1024px`
- **Laptop**: `max-width: 1440px`

### 폰트
- **Title**: Montserrat (Bold)
- **Body**: Pretendard (Regular/Medium)

## 🔐 인증 시스템

### 토큰 관리
- JWT Access Token을 쿠키에 저장
- 자동 토큰 갱신 및 만료 처리
- 보안을 위한 SameSite 설정

### 보안 기능
- HTTPS 통신
- XSS 방지
- CSRF 보호

## 📊 성능 최적화

### PWA 최적화
- 서비스 워커를 통한 오프라인 지원
- 리소스 캐싱 및 지연 로딩
- 이미지 최적화

### React 최적화
- React.memo를 통한 불필요한 리렌더링 방지
- 코드 스플리팅
- 번들 크기 최적화

## 🧪 테스트

### 테스트 실행
```bash
# 전체 테스트 실행
npm test

# 테스트 커버리지 확인
npm test -- --coverage

# 특정 테스트 파일 실행
npm test -- --testPathPattern=ComponentName
```

## 🚀 배포

### 빌드
```bash
npm run build
```

### 정적 파일 서빙
- `build/` 폴더의 정적 파일을 웹 서버에 배포
- Nginx, Apache, 또는 CDN 사용 가능

### 환경 변수
- `.env` 파일을 통한 환경별 설정
- `REACT_APP_` 접두사로 시작하는 변수 사용


## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 팀원

- **멋쟁이사자처럼 13기** - 
- FE 13기 운영진 신상현, 김민석, 오승민
- BE 13기 운영진 오현우, 박재영

- **멋쟁이사자처럼 14기** - 
- FE 14기 운영진 이예진, 장주연, 김다은, 강한림
- BE 14기 운영진 김주희, 박재영, 전진수, 최예은

---

**WelcomeKit** - 멋쟁이사자처럼 14기와 함께하는 특별한 경험을 만들어보세요! 🦁✨
