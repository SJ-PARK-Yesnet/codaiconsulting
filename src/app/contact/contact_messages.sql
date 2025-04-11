-- contact_messages 테이블 생성
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT false
);

-- Row Level Security 설정 (필요한 경우)
-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 관리자만 읽기/쓰기 가능한 정책 (선택 사항)
-- CREATE POLICY "관리자 전체 권한" ON contact_messages
--   USING (auth.uid() IN (
--     SELECT auth.uid() FROM auth.users WHERE email IN ('admin@example.com')
--   )); 