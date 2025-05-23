# ERP 컨설팅 웹서비스

기업에 최적화된 ERP 시스템 추천 및 세팅 가이드를 제공하는 웹 서비스입니다.

## 기능

- 기업 기본정보 입력 및 관리
- 사전질문지 응답 작성 및 관리
- ERP 시스템 추천 알고리즘
- 추천 결과 및 상세 세팅 가이드 제공
- 이메일 연락 요청 기능

## 기술 스택

- **프론트엔드**: Next.js 15.x, React 18.x, Tailwind CSS 3.x, TypeScript 5.x
- **백엔드**: Next.js API Routes, Supabase
- **데이터베이스**: Supabase (PostgreSQL)
- **배포**: Docker, GitHub Actions, AWS

## 개발 환경 설정

1. 저장소 클론
```bash
git clone <repository-url>
cd erp-consulting-service
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env.local` 파일을 생성하고 필요한 환경 변수 설정:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 개발 서버 실행
```bash
npm run dev
```

## Supabase 설정

이 프로젝트는 Supabase를 백엔드로 사용합니다. Supabase 설정을 위해 다음 단계를 따르세요:

1. [Supabase 웹사이트](https://supabase.com/)에 접속하여 계정을 생성합니다.
2. 새 프로젝트를 생성합니다.
3. 프로젝트 생성 후, `Project Settings` > `API` 메뉴에서 `Project URL`과 `anon public` 키를 찾습니다.
4. 이 값들을 `.env.local` 파일에 환경 변수로 설정합니다.
5. SQL 에디터에서 다음 스크립트를 실행하여 필요한 테이블을 생성합니다:

```sql
-- 회사 정보 테이블
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_number VARCHAR NOT NULL,
  company_name VARCHAR NOT NULL,
  business_type VARCHAR NOT NULL,
  business_item VARCHAR NOT NULL,
  last_year_revenue NUMERIC,
  current_erp VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- 질문지 응답 테이블
CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  common_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  sales_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  purchase_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  production_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  accounting_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  management_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- 추천 결과 테이블
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id),
  recommended_erp VARCHAR NOT NULL,
  reasons JSONB NOT NULL DEFAULT '{}'::jsonb,
  setup_guide TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 연락 요청 테이블
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  recommendation_id UUID NOT NULL REFERENCES recommendations(id),
  additional_info TEXT,
  request_ip VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR NOT NULL DEFAULT 'pending'
);
```

6. Row Level Security 설정을 위해 각 테이블에 적절한 정책을 설정합니다.

## 프로젝트 구조

```
/
├── src/
│   ├── app/
│   │   ├── main/          # 메인 페이지
│   │   ├── company-info/  # 기업 정보 입력 페이지
│   │   ├── questionnaire/ # 사전질문지 페이지
│   │   ├── recommendation/ # 추천 결과 페이지
│   │   └── api/          # API 라우트
│   ├── components/       # 재사용 가능한 컴포넌트
│   ├── lib/              # 유틸리티 및 API 클라이언트
│   ├── hooks/            # 커스텀 React hooks
│   └── styles/           # 전역 스타일 및 Tailwind 설정
├── public/               # 정적 파일
│   └── images/           # 이미지 파일
└── docs/                 # 문서 파일
```

## Supabase 테이블 구조

### companies 테이블
- id (PK)
- business_number (varchar)
- company_name (varchar)
- business_type (varchar)
- business_item (varchar)
- last_year_revenue (numeric, nullable)
- current_erp (varchar, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### questionnaires 테이블
- id (PK)
- company_id (FK)
- common_answers (jsonb)
- sales_answers (jsonb)
- purchase_answers (jsonb)
- production_answers (jsonb)
- accounting_answers (jsonb)
- management_answers (jsonb)
- created_at (timestamp)
- updated_at (timestamp)

### recommendations 테이블
- id (PK)
- company_id (FK)
- questionnaire_id (FK)
- recommended_erp (varchar)
- reasons (jsonb)
- setup_guide (text)
- created_at (timestamp)

### contact_requests 테이블
- id (PK)
- company_id (FK)
- recommendation_id (FK)
- additional_info (text, nullable)
- request_ip (varchar)
- created_at (timestamp)
- status (varchar, default 'pending')

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 
