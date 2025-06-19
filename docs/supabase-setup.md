# Supabase 설정 단계

## 1. Supabase 계정 생성

1. [Supabase 웹사이트](https://supabase.com/)에 접속합니다.
2. 오른쪽 상단의 "Start your project" 버튼을 클릭합니다.
3. GitHub, Google 또는 이메일로 회원가입하거나 로그인합니다.

## 2. 새 프로젝트 생성

1. Supabase 대시보드에서 "New Project" 버튼을 클릭합니다.
2. 다음 정보를 입력합니다:
   - Organization: 기존 조직 선택 또는 새 조직 생성
   - Name: `erp-consulting-service`
   - Database Password: 안전한 비밀번호 설정
   - Region: 서비스 이용자에게 가장 가까운 지역 선택 (예: Asia Northeast 1 (Tokyo))
   - Pricing Plan: Free tier 선택
3. "Create new project" 버튼을 클릭합니다.
4. 프로젝트 생성 완료 메시지가 표시될 때까지 기다립니다(약 1-2분 소요).

## 3. 데이터베이스 테이블 생성

프로젝트가 생성되면 "Table Editor"를 통해 다음 테이블을 생성합니다:

### 3.1 companies 테이블

1. "Table Editor" > "Create a new table" 클릭
2. 테이블 이름: `companies`
3. 컬럼 추가:
   - `id`: uuid (Primary Key)
   - `business_number`: varchar
   - `company_name`: varchar
   - `business_type`: varchar
   - `business_item`: varchar
   - `last_year_revenue`: numeric (nullable)
   - `current_erp`: varchar (nullable)
   - `created_at`: timestamptz (기본값: now())
   - `updated_at`: timestamptz (nullable)
4. "Save" 클릭

### 3.2 questionnaires 테이블

1. "Table Editor" > "Create a new table" 클릭
2. 테이블 이름: `questionnaires`
3. 컬럼 추가:
   - `id`: uuid (Primary Key)
   - `company_id`: uuid (Foreign Key -> companies.id)
   - `common_answers`: jsonb
   - `sales_answers`: jsonb
   - `purchase_answers`: jsonb
   - `production_answers`: jsonb
   - `accounting_answers`: jsonb
   - `management_answers`: jsonb
   - `created_at`: timestamptz (기본값: now())
   - `updated_at`: timestamptz (nullable)
4. "Save" 클릭

### 3.3 recommendations 테이블

1. "Table Editor" > "Create a new table" 클릭
2. 테이블 이름: `recommendations`
3. 컬럼 추가:
   - `id`: uuid (Primary Key)
   - `company_id`: uuid (Foreign Key -> companies.id)
   - `questionnaire_id`: uuid (Foreign Key -> questionnaires.id)
   - `recommended_erp`: varchar
   - `reasons`: jsonb
   - `setup_guide`: text
   - `created_at`: timestamptz (기본값: now())
4. "Save" 클릭

### 3.4 contact_requests 테이블

1. "Table Editor" > "Create a new table" 클릭
2. 테이블 이름: `contact_requests`
3. 컬럼 추가:
   - `id`: uuid (Primary Key)
   - `company_id`: uuid (Foreign Key -> companies.id)
   - `recommendation_id`: uuid (Foreign Key -> recommendations.id)
   - `additional_info`: text (nullable)
   - `request_ip`: varchar
   - `created_at`: timestamptz (기본값: now())
   - `status`: varchar (기본값: 'pending')
4. "Save" 클릭

## 4. 데이터베이스 정책 설정

RLS(Row Level Security)를 사용하여 데이터 접근 제어를 설정합니다:

1. "Authentication" > "Policies" 로 이동
2. 각 테이블에 대해 기본 정책 설정:
   - 기본적으로 모든 테이블에 "Enable RLS" 활성화
   - 필요한 경우 "Create a new policy" 로 테이블별 접근 정책 설정

## 5. 연결 정보 가져오기

1. "Project Settings" > "API" 로 이동
2. 다음 정보를 복사합니다:
   - Project URL (anon/public)
   - anon (public) API key

## 6. 환경 변수 설정

프로젝트의 루트 디렉토리에 있는 `.env.local` 파일을 열고 다음과 같이 환경 변수를 업데이트합니다:

```
NEXT_PUBLIC_SUPABASE_URL=복사한_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=복사한_API_key
```

## 7. 연결 테스트

환경 변수 설정 후, 애플리케이션을 다시 시작하고 데이터베이스 연결이 올바르게 작동하는지 확인합니다.

## 8. SQL Editor를 사용한 테이블 생성

GUI 대신 SQL Editor를 사용하여 테이블을 생성하려면 다음 SQL 스크립트를 사용하세요:

1. Supabase 대시보드의 왼쪽 메뉴에서 "SQL Editor"를 클릭합니다.
2. "New Query"를 클릭하고 아래 스크립트를 붙여넣습니다.
3. "Run"을 클릭하여 스크립트를 실행합니다.

```sql
-- companies 테이블 생성
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_number VARCHAR NOT NULL,
  company_name VARCHAR NOT NULL,
  business_type VARCHAR NOT NULL,
  business_item VARCHAR NOT NULL,
  last_year_revenue NUMERIC,
  current_erp VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- questionnaires 테이블 생성
CREATE TABLE IF NOT EXISTS public.questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  common_answers JSONB DEFAULT '{}'::jsonb,
  sales_answers JSONB DEFAULT '{}'::jsonb,
  purchase_answers JSONB DEFAULT '{}'::jsonb,
  production_answers JSONB DEFAULT '{}'::jsonb,
  accounting_answers JSONB DEFAULT '{}'::jsonb,
  management_answers JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- recommendations 테이블 생성
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  questionnaire_id UUID REFERENCES public.questionnaires(id) ON DELETE CASCADE,
  recommended_erp VARCHAR NOT NULL,
  reasons JSONB DEFAULT '{}'::jsonb,
  setup_guide TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- contact_requests 테이블 생성
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE CASCADE,
  additional_info TEXT,
  request_ip VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR DEFAULT 'pending'
);

-- RLS 정책 설정
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- 모든 테이블에 대한 기본 정책 설정: 모든 작업 허용
CREATE POLICY "Allow full access" ON public.companies FOR ALL USING (true);
CREATE POLICY "Allow full access" ON public.questionnaires FOR ALL USING (true);
CREATE POLICY "Allow full access" ON public.recommendations FOR ALL USING (true);
CREATE POLICY "Allow full access" ON public.contact_requests FOR ALL USING (true);
```

이 스크립트는 필요한 모든 테이블을 생성하고 기본 RLS 정책을 설정합니다. 실제 프로덕션 환경에서는 더 엄격한 보안 정책을 설정하는 것이 좋습니다. 