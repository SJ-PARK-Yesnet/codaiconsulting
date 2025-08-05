import React from "react";
import Link from "next/link";

export const metadata = {
  title: "쇼핑몰 주문 데이터, 이카운트ERP에 가장 스마트하게 연동하는 법 | 예스넷(주)",
  description: "스마트스토어, 쿠팡, 사방넷 등 쇼핑몰 주문 데이터를 이카운트ERP에 자동 연동하는 3가지 방법과, CoDAi 솔루션의 혁신적 자동화 효과를 소개합니다.",
  keywords: "이카운트, ERP, 쇼핑몰, 주문연동, 자동화, CoDAi, 스마트스토어, 쿠팡, 사방넷, 예스넷",
  openGraph: {
    title: "쇼핑몰 주문 데이터, 이카운트ERP에 가장 스마트하게 연동하는 법 | 예스넷(주)",
    description: "스마트스토어, 쿠팡, 사방넷 등 쇼핑몰 주문 데이터를 이카운트ERP에 자동 연동하는 3가지 방법과, CoDAi 솔루션의 혁신적 자동화 효과를 소개합니다.",
    url: "https://yesnet.kr/insight",
    siteName: "예스넷(주)",
    locale: "ko_KR",
    type: "article",
  },
  alternates: {
    canonical: "https://yesnet.kr/insight",
  },
};

export default function InsightPage() {
  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 section-title text-center">
          쇼핑몰 주문 데이터를 이카운트ERP에 연동하는<br className="hidden md:block" />
          <span className="text-blue-700">가장 스마트한 방법은?</span>
        </h1>
        <p className="text-lg text-gray-600 text-center leading-relaxed mt-4">
          스마트스토어, 쿠팡, 사방넷 등 다양한 쇼핑몰의 주문 데이터를<br />
          <b>이카운트ERP에 자동으로 연동</b>하는 실전 노하우와<br className="hidden md:block" />
          <span className="text-blue-600 font-semibold">자동화 솔루션(CoDAi)</span>을 소개합니다.
        </p>
      </header>

      <article className="prose lg:prose-xl text-content bg-white rounded-xl shadow-md p-8 mb-12">
        <p className="mb-6">
          자동화된 쇼핑몰 시스템 덕분에 주문 접수는 쉬워졌지만,<br className="md:hidden" /> <b>ERP 반영</b>은 여전히 수작업에 의존하는 기업이 많습니다.<br />
          반복적인 주문 데이터 정리, 오류 수정, 수동 업로드에서 벗어나<br />
          <span className="font-bold text-blue-700">진짜 중요한 재고관리와 매출분석</span>에 집중하세요!
        </p>

        <h2 className="sub-title mt-10 mb-4">주문 데이터 ERP 연동, 대표적인 3가지 방법</h2>
        <ol className="space-y-6 list-decimal pl-6">
          <li>
            <b>엑셀 파일 수동 업로드</b><br />
            <span className="block mt-1 text-gray-700">쇼핑몰에서 주문 데이터를 엑셀로 내려받아, 이카운트 양식에 맞춰 수동 업로드.</span>
            <span className="block mt-2 text-gray-500 text-sm">장점: 별도 개발 없이 누구나 사용 가능<br />단점: 반복 작업, 오류 위험, 대량 주문/다채널에 비효율</span>
          </li>
          <li>
            <b>이카운트 쇼핑몰관리 메뉴 이용</b><br />
            <span className="block mt-1 text-gray-700">이카운트의 기본 연동 기능으로, 20여 개 쇼핑몰/통합관리 솔루션과 API 연동.</span>
            <span className="block mt-2 text-gray-500 text-sm">장점: 실시간 주문 확인, 재고 자동 반영, 통합 관리<br />단점: 초기 셋업 복잡, 데이터 매핑 오류 가능, 완전 자동화는 불가</span>
          </li>
          <li>
            <b>CoDAi(코다이) 솔루션 활용</b><br />
            <span className="block mt-1 text-gray-700">주문 데이터를 자동 변환·매핑, 클릭 몇 번만으로 ERP에 연동하는 <b>지능형 자동화 플랫폼</b>.</span>
            <span className="block mt-2 text-gray-500 text-sm">장점: 수작업 제거, 품목 자동 매칭, 매출/재고 오류 방지, 작업 시간 70% 절감, 실시간성 향상</span>
          </li>
        </ol>

        <h2 className="sub-title mt-12 mb-4">CoDAi 솔루션, 왜 가장 실용적인가?</h2>
        <ul className="space-y-3 pl-4">
          <li>스마트스토어, 쿠팡, 자사몰 등 다양한 플랫폼 주문 데이터 자동 수집</li>
          <li>ERP 품목코드와 자동 매칭(유사도 분석, 기준코드 등록 등)</li>
          <li>매출·재고 반영의 정확도 95% 이상, 수작업 오류 최소화</li>
          <li>직관적 UI, 비개발자도 쉽게 사용 가능</li>
          <li>향후 ERP 재고 연동 기반 쇼핑몰 품절 처리(개발 중)</li>
        </ul>

        <figure className="my-8">
          <img
            src="https://blogfiles.pstatic.net/MjAyNTA1MjdfMTcy/MDAxNzQ4MzIyOTkwMzM0.11NjBb5rns3Z2HtbALLlE0Dm7-vNRDv9xIIjuw17Q74g.REy6Y5nfCqhg-JnRLq039C0ca3Bxvt4T9UD_fetU5Ecg.PNG/image.png?type=w1"
            alt="CoDAi 사용 4단계: 데이터 확인 → 코드 매핑 → 전표 전송 → ERP 반영"
            className="rounded-lg shadow mx-auto w-full max-w-2xl h-auto"
            loading="lazy"
          />
          <figcaption className="text-center text-sm text-gray-500 mt-2">
            CoDAi 사용 4단계: 데이터 확인 → 코드 매핑 → 전표 전송 → ERP 반영
          </figcaption>
        </figure>

        <blockquote className="border-l-4 border-blue-400 bg-blue-50 p-4 my-8 text-blue-900 font-semibold leading-relaxed">
          “수작업에서 해방, 매출/재고 오류 방지, 작업 시간 70% 절감, 실시간 통합 관리까지.<br />
          <span className="text-blue-700">CoDAi는 단순한 툴이 아닌, ERP 통합 관리를 실현하는 전략적 파트너입니다.”</span>
        </blockquote>

        <h2 className="sub-title mt-12 mb-4">CoDAi 도입이 필요한 기업 유형</h2>
        <ul className="space-y-2 pl-4">
          <li>2개 이상 쇼핑몰을 운영하며, ERP(특히 이카운트)를 함께 사용하는 기업</li>
          <li>주문 데이터를 매번 엑셀로 다운받아 수동 업로드하는 실무 환경</li>
          <li>판매 상품 변경이 잦고, 옵션(색상, 사이즈 등) 구성이 복잡한 경우</li>
          <li>ERP 재고와 쇼핑몰 재고 간 실시간 연동이 안 되어 품절/재고 오류로 인한 CS가 잦은 경우</li>
        </ul>

        <h2 className="sub-title mt-12 mb-4">마무리하며</h2>
        <p className="mb-8 leading-relaxed">
          쇼핑몰 운영의 핵심은 단순 주문 처리보다 <b>정확한 데이터 기반의 재고 관리와 매출 분석</b>입니다.<br />
          CoDAi는 반복 작업과 오류를 줄이고, 자동화된 데이터 처리 구조로 <b>업무 효율과 신뢰성</b>을 극대화합니다.<br />
          지금의 업무 방식을 돌아보고, <span className="text-blue-700 font-semibold">'수작업'이 아닌 '자동화'가 이끄는 미래</span>로 전환해보세요!
        </p>

        <figure className="my-8">
          <img src="/erp-insight.png" alt="CoDAi 이카운트ERP 연동 자동화" className="rounded-lg shadow mx-auto" />
          <figcaption className="text-center text-sm text-gray-500 mt-2">CoDAi 솔루션으로 실현하는 ERP 자동화</figcaption>
        </figure>
      </article>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <Link
          href="https://codai.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary text-lg px-8 py-4 rounded-full shadow hover:bg-blue-700 transition mb-4 md:mb-0"
        >
          CoDAi 무료 체험 신청하기
        </Link>
        <Link
          href="/contact"
          className="btn btn-outline text-lg px-8 py-4 rounded-full shadow hover:bg-gray-100 transition"
        >
          도입 상담/데모 요청
        </Link>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        <span>
          원문: {" "}
          <a
            href="https://blog.naver.com/PostView.naver?blogId=yesneterp&logNo=223913034864&categoryNo=35&parentCategoryNo=35&from=thumbnailList"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            네이버 블로그에서 보기
          </a>
        </span>
      </div>
    </section>
  );
} 