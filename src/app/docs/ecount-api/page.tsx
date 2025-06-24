import EcountApiDocsPage from './EcountApiDocsClient';

export const metadata = {
  title: '이카운트 API 개발 가이드 | 예스넷(주) ERP 컨설팅',
  description: '이카운트 ERP API 연동 방법, 인증, 주요 API, 예제 코드, FAQ 등 실무 중심 개발 가이드 제공.',
  keywords: '이카운트, ERP, API, 개발, 연동, 가이드, 예제, 인증, 예스넷'
};

export function Head() {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-SGYF6ZSPH6"></script>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SGYF6ZSPH6');
        `
      }} />
    </>
  );
}

export default function Page() {
  return <EcountApiDocsPage />;
} 