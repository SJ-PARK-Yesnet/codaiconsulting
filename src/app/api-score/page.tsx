export const metadata = {
  title: 'API 품질 점검 | 예스넷(주) ERP 컨설팅',
  description: '이카운트 ERP API 연동 품질 점검 및 데이터 정확성 평가. API 연결, 데이터 신뢰도, 마이너스 재고 등 자동 진단.',
  keywords: '이카운트, ERP, API, 품질, 점검, 데이터, 신뢰도, 마이너스 재고, 예스넷'
};

import ApiScoreClient from './ApiScoreClient';

export default function APIScorePage() {
  return <ApiScoreClient />;
} 