import ApiTestClient from './ApiTestClient';

export const metadata = {
  title: 'API 연동 테스트 | 예스넷(주) ERP 컨설팅',
  description: '이카운트 ERP API 연동 테스트 및 실시간 결과 확인. Zone, 로그인, 품목·재고 조회 등 다양한 테스트 지원.',
  keywords: '이카운트, ERP, API, 연동, 테스트, 품목, 재고, 로그인, 예스넷'
};

export default function Page() {
  return <ApiTestClient />;
} 