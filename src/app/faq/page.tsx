export const metadata = {
  title: '자주 묻는 질문 | 예스넷(주) ERP 컨설팅',
  description: '이카운트 ERP, 컨설팅, API 연동 등 자주 묻는 질문과 답변. 실무 중심의 FAQ 제공.',
  keywords: 'FAQ, 자주 묻는 질문, 이카운트, ERP, 컨설팅, API, 예스넷'
};

import FaqClient from '../FaqClient';

export default function FAQPage() {
  return <FaqClient />;
} 