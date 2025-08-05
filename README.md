# 코다이컨설팅 - 이카운트 ERP 솔루션

이카운트 ERP 시스템과 연동하는 웹 애플리케이션입니다.

## 주요 기능

### 1. 이카운트 API 연동
- 품목 관리 (등록, 조회)
- 고객 관리 (등록, 조회)
- 판매 관리 (등록)
- 재고 관리 (조회)

### 2. 데이터 업로드 시스템
- 엑셀 파일을 통한 대량 데이터 업로드
- 암호 보호된 관리자 페이지
- 컬럼 매핑 기능
- 실시간 전송 결과 확인

## 페이지 구성

### 메인 페이지
- 홈페이지 (`/`)
- 회사 정보 (`/company-info`)
- ERP 비교 (`/erp-comparison`)
- FAQ (`/faq`)

### API 관련 페이지
- API 예제 (`/api-example`)
- API 테스트 (`/api-test`)
- API 점수 (`/api-score`)

### 문서 페이지
- 이카운트 API 문서 (`/docs/ecount-api`)
- 이카운트 컨설팅 (`/ecount-consulting`)

### 관리자 페이지
- **데이터 업로드** (`/upload`) - 암호: `yesnet630080!`

## 업로드 페이지 사용법

### 1. 접근 방법
- URL: `http://localhost:3000/upload`
- 암호: `yesnet630080!`

### 2. 지원하는 API
- **품목등록**: PROD_CD, PROD_DES, SIZE_DES, BAR_CODE, REMARKS, CONT1
- **고객등록**: CUST_CD, CUST_DES, ADDR1, ADDR2, TEL_NO, EMAIL
- **판매등록**: WH_CD, PROD_CD, QTY, UNIT_PRICE, REMARKS

### 3. 사용 단계
1. 암호 입력 후 페이지 접근
2. 엑셀 파일 업로드 (.xlsx, .xls)
3. 전송할 API 선택
4. 엑셀 컬럼을 API 필드에 매핑
5. 데이터 전송 실행
6. 결과 확인

### 4. 엑셀 파일 형식
- 첫 번째 행: 컬럼명
- 두 번째 행부터: 데이터
- 필수 필드는 반드시 포함해야 함

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Excel Processing**: xlsx
- **Backend**: Next.js API Routes

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 환경 설정

### 필수 환경 변수
```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 이메일 설정 (선택사항)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## API 엔드포인트

### 이카운트 API
- `POST /api/ecount/zone` - Zone 정보 조회
- `POST /api/ecount/login` - 로그인
- `POST /api/ecount/products` - 품목 관리
- `POST /api/ecount/customers` - 고객 관리
- `POST /api/ecount/sales` - 판매 관리
- `POST /api/ecount/inventory` - 재고 조회

### 기타 API
- `POST /api/contact` - 문의하기
- `POST /api/send-email` - 이메일 전송

## 개발 가이드

### 새로운 API 추가
1. `src/app/api/ecount/` 디렉토리에 새 라우트 생성
2. 이카운트 API 스펙에 맞춰 구현
3. 업로드 페이지의 `API_CONFIGS`에 추가

### UI 컴포넌트 추가
1. `src/components/ui/` 디렉토리에 컴포넌트 생성
2. shadcn/ui 스타일 가이드 준수
3. TypeScript 타입 정의

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.