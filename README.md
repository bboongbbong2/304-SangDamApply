# 세종과학고등학교 상담 신청 웹앱

교사가 상담 일정을 설정하고 학생 및 학부모가 예약할 수 있는 상담 예약 웹 애플리케이션입니다.

## 기능
- **교사 (관리자)**
  - Firebase Authentication 로그인
  - 학생/학부모 인증코드(4자리) 설정
  - 상담 가능한 날짜 추가 및 자동 시간표 생성
  - 특정 시간 '불가' 상태 처리
  - 신청 완료된 내역 확인 및 취소
- **학생 / 학부모**
  - 4자리 인증코드를 통한 접근 (교사가 설정한 코드)
  - 교사가 오픈한 상담 날짜 및 시간 선택
  - 학번, 이름 입력 후 예약 (동시성 제어로 중복 방지)

## 기술 스택
- Frontend: React.js, Vite, Vanilla CSS
- Backend: Firebase (Firestore, Authentication)
- Deployment: Vercel (권장)

## 시작하기

### 1. 프로젝트 복제
```bash
git clone https://github.com/bboongbbong2/304-SangDamApply.git
cd "304 SangDamApply"
```

### 2. 패키지 설치
```bash
npm install
```

### 3. Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트를 생성합니다.
2. Authentication에서 "이메일/비밀번호" 제공업체를 사용 설정합니다.
3. Firestore Database를 생성합니다.
4. 프로젝트 설정에서 웹 앱을 추가하고 구성(Config) 값을 복사합니다.
5. `src/firebase.js` 파일에 복사한 설정 값을 붙여넣거나 `.env` 파일을 생성하여 관리합니다.

### 4. 로컬 서버 실행
```bash
npm run dev
```

### 5. 배포 (Vercel)
Vercel에 GitHub 레포지토리를 연결하여 쉽게 배포할 수 있습니다.
1. Vercel(https://vercel.com)에 로그인합니다.
2. Add New Project에서 해당 GitHub 레포지토리를 가져옵니다.
3. Framework Preset을 **Vite**로 확인하고 배포합니다.

## 주의사항
- 교사 계정은 Firebase Console의 Authentication 탭에서 직접 수동으로 생성해주셔야 합니다. (예: email: teacher@sejong.hs.kr / password: password123)
- 학생/학부모는 별도 회원가입 없이 '인증코드' 4자리로 접근합니다.
