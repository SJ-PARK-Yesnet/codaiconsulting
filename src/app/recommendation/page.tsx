export const metadata = {
  title: 'ERP 추천 | 예스넷(주) ERP 컨설팅',
  description: '기업 맞춤형 ERP 솔루션 추천 서비스. 업종, 규모, 예산에 따라 최적의 ERP 도입 방안 제안.',
  keywords: 'ERP, 추천, 컨설팅, 솔루션, 도입, 예스넷'
};

import RecommendationClient from './RecommendationClient';

export default function RecommendationPage() {
  return <RecommendationClient />;
}
