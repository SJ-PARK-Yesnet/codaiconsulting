'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const faqs = [
  {
    q: '어떻게 진행되나요?',
    a: (
      <>
        진행 과정은 <strong>상담(원격·방문) → 견적 금액 제시 → 금액 확정 → 세팅 진행 → 테스트 및 교육 → 추가 컨설팅(선택사항) → 세팅 완료 → 유지보수(선택사항)</strong>의 과정을 거칩니다.
      </>
    ),
  },
  {
    q: '기간은 얼마나 걸리나요?',
    a: (
      <>
        세팅&컨설팅 기간은 각 회사마다 사용 범위와 데이터량이 다르기 때문에 차이는 있을 수 있으나 <strong>평균적으로 2~3개월 정도 소요</strong>되며, 원하는 세팅에 대한 자료 정리가 잘 되어 있으면 기간은 더 단축됩니다. 또한 세팅 진행이 빠르게 완료되었어도 실무를 위한 테스트 및 ERP 교육 기간까지 고려한다면 평균 기간 정도 소요됩니다.
      </>
    ),
  },
  {
    q: '기존 프로그램과의 호환이 가능한가요?',
    a: (
      <>
        기존 경영자료를 엑셀 문서로 보유하고 있다면, 이카운트 ERP로 쉽게 업로드할 수 있습니다. 또한 타 프로그램의 데이터 이관 작업도 가능합니다.
      </>
    ),
  },
  {
    q: '비용은 얼마인가요?',
    a: (
      <>
        세팅&컨설팅 비용은 <strong>각 회사마다 사용 범위와 데이터량이 다르기 때문에 원격 및 방문 상담 후에 정확한 비용을 알려 드릴 수 있습니다.</strong> 또한 비용 부담을 덜어드리기 위해 데이터바우처를 통한 정부지원금 안내도 함께 도와 드리고 있으니 편하게 문의 주시기 바랍니다.
      </>
    ),
  },
  {
    q: '컨설팅으로 어떤 도움을 주나요?',
    a: (
      <>
        ERP 도입, 데이터 이전, 맞춤 세팅, 실무 교육 등 <strong>기업 상황에 맞는 실질적 컨설팅</strong>을 제공합니다. 현장 경험이 풍부한 컨설턴트가 직접 지원합니다.
      </>
    ),
  },
];

function FigmaFAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-6 w-full">
      {faqs.map((item, idx) => (
        <div
          key={idx}
          className={`w-full bg-white rounded-2xl shadow-md border border-[#ECF0F5] transition-all ${openIdx === idx ? 'ring-2 ring-[#1F2123]/10' : ''}`}
        >
          <button
            className="w-full flex items-center justify-between px-10 py-7 group focus:outline-none"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            aria-expanded={openIdx === idx}
            aria-controls={`faq-panel-${idx}`}
            style={{ minHeight: 64 }}
          >
            <span className="text-[20px] font-semibold text-[#1F2123] text-left flex-1 font-['Pretendard']">{item.q}</span>
            <span className={`flex items-center justify-center bg-[#F9FBFD] rounded-full w-12 h-12 ml-6 transition-colors group-hover:bg-[#F4F6F9] ${openIdx === idx ? 'rotate-180' : ''}`}>
              <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><path d="M7 9l4 4 4-4" stroke="#1F2123" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </button>
          {openIdx === idx && (
            <div id={`faq-panel-${idx}`} className="bg-[#F9FBFD] rounded-b-2xl px-10 py-8 text-[18px] text-[#4B5563] leading-snug animate-fade-in font-['Pretendard']">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FigmaFAQButton({
  href, defaultImg, hoverImg, alt, label,
  sideImg, sideImgHover,
  className
}: {
  href: string, defaultImg: string, hoverImg: string, alt: string, label: string,
  sideImg?: string, sideImgHover?: string,
  className?: string
}) {
  const [isHover, setIsHover] = useState(false);
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`relative flex items-center transition-transform duration-200 hover:scale-105 ${className || ''}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ width: 560, height: 182 }}
    >
      <Image
        src={isHover ? hoverImg : defaultImg}
        alt={alt}
        width={560}
        height={182}
        className="mx-auto"
        priority
      />
      {sideImg && (
        <Image
          src={isHover && sideImgHover ? sideImgHover : sideImg}
          alt=""
          width={120}
          height={120}
          className="absolute right-8 top-1/2 -translate-y-1/2"
          style={{ pointerEvents: 'none' }}
        />
      )}
      <span className="sr-only">{label}</span>
    </a>
  );
}

export default function FaqClient() {
  return (
    <main className="w-full min-h-screen bg-white py-0 px-0" style={{ fontFamily: 'Pretendard, system-ui, sans-serif' }}>
      {/* 상단 Hero 영역 */}
      <section className="w-full flex flex-col items-center justify-center pt-24 pb-8 bg-white">
        <h1 className="text-[44px] font-bold text-[#030812] text-center mb-2 font-['Inter_Tight','Pretendard']">FAQ</h1>
        <p className="text-[44px] md:text-[70px] font-semibold text-[#030812] text-center mb-8 leading-none font-['Inter_Tight','Pretendard']">궁금증을 해결해드려요!</p>
      </section>
      {/* FAQ 아코디언 */}
      <section className="w-full flex flex-col items-center justify-center bg-white">
        <div className="w-full max-w-[1100px] flex flex-col gap-6">
          <FigmaFAQAccordion />
        </div>
      </section>
      {/* FAQ와 버튼 사이 흰색 배경 덮개 */}
      <div className="w-full h-12 bg-white" />
      {/* 하단 버튼 카드 영역 */}
      <section className="w-full flex flex-row gap-8 justify-center items-center mt-20 mb-24 bg-white">
        <FigmaFAQButton
          href="/contact"
          defaultImg="/inquiry-default.png"
          hoverImg="/inquiry-hover.png"
          alt="온라인 문의"
          label="온라인 문의"
          sideImg="/inquiry-side-default.png"
          sideImgHover="/inquiry-side-hover.png"
          className="bg-gradient-to-b from-[#02D1FE] to-[#0285FE] shadow-lg rounded-[24px] px-0 py-0 max-w-[560px] min-w-[320px] h-[182px] flex items-center justify-center"
        />
        <FigmaFAQButton
          href="https://pf.kakao.com/_YAXYxj/chat"
          defaultImg="/kakao-default.png"
          hoverImg="/kakao-hover.png"
          alt="카카오톡 상담"
          label="카카오톡 상담"
          sideImg="/kakao-side-default.png"
          sideImgHover="/kakao-side-hover.png"
          className="bg-[#FDFDFD] shadow-lg rounded-[24px] px-0 py-0 max-w-[560px] min-w-[320px] h-[182px] flex items-center justify-center"
        />
      </section>
      {/* 버튼 아래 흰색 공백 */}
      <div className="w-full h-32 bg-white" />
    </main>
  );
} 