import Questionnaire from './QuestionnaireClient';

export const metadata = {
  title: 'ERP 사전질문지 | 예스넷(주) ERP 컨설팅',
  description: '기업 맞춤형 ERP 추천을 위한 사전질문지. 시스템, 인원, 데이터, 요구사항 등 간편 입력.',
  keywords: 'ERP, 사전질문지, 설문, 맞춤형, 이카운트, 컨설팅, 예스넷'
};

export default function Page() {
  return <Questionnaire />;
} 