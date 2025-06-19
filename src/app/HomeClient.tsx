'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

export default function HomeClient() {
  return (
    <main className="w-full min-h-screen bg-white" style={{ fontFamily: 'Pretendard, system-ui, sans-serif' }}>
      {/* Section 1: Hero/Intro */}
      <section className="w-full flex flex-col items-center justify-center px-4 md:px-20 pt-[88px] pb-0 bg-white">
        <div className="w-full max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-[302px]">
          {/* Left: Main Title */}
          <div className="flex flex-col gap-4 md:gap-6 max-w-[770px]">
            <h1
              className="font-['Inter_Tight','Pretendard'] font-semibold text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] xl:text-[7.5rem] leading-tight md:leading-[1.05] text-[#030812] break-keep whitespace-pre-line"
              style={{ wordBreak: 'keep-all' }}
            >
              Consulting&
              <br className="hidden sm:block" />
              Solution
            </h1>
            <p className="font-normal text-[22px] text-[#1F2123] leading-[1.3]">당신의 손쉬운 솔루션, 예스넷<br />기업 맞춤형 ERP 솔루션을 알려드립니다.</p>
            <div className="flex flex-col items-start mt-4">
              <div className="flex items-center gap-2 bg-white rounded-full px-8 py-3 shadow-md border border-gray-200">
                <span className="font-['Inter_Tight','Pretendard'] font-medium text-[18px] text-gray-600">SCROLL DOWN</span>
                <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 1V14M6.5 14L1 8.5M6.5 14L12 8.5" stroke="url(#paint0_linear_1_1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear_1_1" x1="6.5" y1="1" x2="6.5" y2="14" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4B5563"/>
                      <stop offset="1" stopColor="#C6CEDE"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          {/* Right: Main Visual (반응형 이미지) */}
          <div className="w-full md:w-auto flex justify-center md:block mt-8 md:mt-0">
            <div className="relative w-full max-w-[550px] aspect-[55/36] md:w-[550px] md:h-[360px]">
              <Image
                src="/main-visual.png"
                alt="메인 비주얼"
                fill
                className="rounded-2xl object-cover"
                sizes="(max-width: 768px) 100vw, 550px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 카드 3개 (ERP 추천, 이카운트API 연동, 이카운트ERP 컨설팅) */}
      <section className="w-full flex justify-center px-4 md:px-20 py-24 bg-white">
        <div className="w-full max-w-[1440px] grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 카드 1: ERP 추천 */}
          <div className="flex flex-col bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="w-full h-[250px] bg-gray-100 relative">
              <Image src="/card-erp.png" alt="ERP 추천 썸네일" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-4 px-6 py-8">
              <h2 className="font-semibold text-[38px] text-[#1F2123]">ERP 추천</h2>
              <p className="text-[20px] text-[#4B5563] leading-snug">기업 규모·업종·예산·구매·생산 등<br />우리 회사에 꼭 필요한 기능이 담긴<br />최적의 ERP를 추천해 드려요!</p>
              <div className="flex justify-end">
                <Link href="/company-info" className="flex items-center gap-2 px-6 py-3 bg-[#F4F6F9] border border-[#1F2123] rounded-full text-[#1F2123] font-medium text-[16px] hover:bg-gray-100 transition-colors">
                  바로가기
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" stroke="#1F2123" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </div>
          </div>
          {/* 카드 2: 이카운트API 연동 */}
          <div className="flex flex-col bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="w-full h-[250px] bg-gray-100 relative">
              <Image src="/card-api.png" alt="API 연동 썸네일" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-4 px-6 py-8">
              <h2 className="font-semibold text-[38px] text-[#1F2123]">이카운트API 연동</h2>
              <p className="text-[20px] text-[#4B5563] leading-snug">API 연동 테스트 및 품질 평가를 통해<br />시스템 통합 가능성 진단과 더불어<br />데이터 활용 방안을 확인할 수 있어요!</p>
              <div className="flex justify-end">
                <Link href="/api-test" className="flex items-center gap-2 px-6 py-3 bg-[#F4F6F9] border border-[#1F2123] rounded-full text-[#1F2123] font-medium text-[16px] hover:bg-gray-100 transition-colors">
                  바로가기
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" stroke="#1F2123" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </div>
          </div>
          {/* 카드 3: 이카운트ERP 컨설팅 */}
          <div className="flex flex-col bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="w-full h-[250px] bg-gray-100 relative">
              <Image src="/card-consulting.png" alt="ERP 컨설팅 썸네일" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-4 px-6 py-8">
              <h2 className="font-semibold text-[38px] text-[#1F2123]">이카운트ERP 컨설팅</h2>
              <p className="text-[20px] text-[#4B5563] leading-snug">ERP 활용도 진단 및 최적화로<br />업무의 효율성을 향상시키고<br />비용을 절감할 수 있도록 도와드려요!</p>
              <div className="flex justify-end">
                <Link href="/ecount-consulting" className="flex items-center gap-2 px-6 py-3 bg-[#F4F6F9] border border-[#1F2123] rounded-full text-[#1F2123] font-medium text-[16px] hover:bg-gray-100 transition-colors">
                  바로가기
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M5 10h10m0 0l-4-4m4 4l-4 4" stroke="#1F2123" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: FAQ (Figma 스타일) */}
      <section className="w-full flex justify-center px-4 md:px-20 py-24 bg-white">
        <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center">
          <div className="w-full max-w-[1100px] flex flex-col gap-12">
            <h2 className="font-['Inter_Tight','Pretendard'] font-semibold text-[44px] text-[#030812] mb-8 text-left">FAQ</h2>
            <div className="flex flex-col gap-0 border-t border-b border-[#ECF0F5] bg-white rounded-xl overflow-hidden shadow-sm">
              <FAQFigmaAccordion />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Call to Action (Figma 하단 CTA) */}
      <section
        className="w-full flex justify-center px-4 md:px-20 py-24 relative min-h-[400px]"
        style={{ background: 'url(/Background.png) center/cover no-repeat' }}
      >
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" aria-hidden="true" />
        <div className="w-full max-w-[1440px] flex flex-col items-center gap-8 relative z-10">
          <h2 className="font-['Poppins','Pretendard'] font-semibold text-[44px] text-white text-center leading-tight drop-shadow-lg">디지털 전환의 꿈,<br />예스넷과 지금 시작하세요.</h2>
          <Link href="/contact" className="flex items-center gap-2 px-8 py-3 border border-white rounded-full text-white font-medium text-[16px] bg-[#1F2123] hover:bg-[#111827] transition-colors shadow-md">
            문의하기
          </Link>
        </div>
      </section>
    </main>
  )
}

function FAQFigmaAccordion() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const faqs = [
    {
      q: '어떻게 진행되나요?',
      a: '상담(원격·방문) → 견적 금액 제시 → 금액 확정 → 세팅 진행 → 테스트 및 교육 → 추가 컨설팅(선택사항) → 세팅 완료 → 유지보수(선택사항)의 과정을 거칩니다.',
    },
    {
      q: '기간은 얼마나 걸리나요?',
      a: '평균적으로 2~3개월 정도 소요되며, 회사 상황에 따라 달라질 수 있습니다.',
    },
    {
      q: '기존 프로그램과의 호환이 가능한가요?',
      a: '엑셀 등으로 데이터를 보유하고 있다면 이카운트 ERP로 쉽게 업로드할 수 있습니다.',
    },
    {
      q: '비용은 얼마인가요?',
      a: '상담 후 사용 범위와 데이터량에 따라 안내해 드립니다. 정부지원금 안내도 도와드립니다.',
    },
  ];
  return (
    <div className="flex flex-col gap-0">
      {faqs.map((item, idx) => (
        <div key={idx} className="border-b border-[#ECF0F5] last:border-b-0">
          <button
            className="w-full flex items-center justify-between px-8 py-7 group focus:outline-none"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            aria-expanded={openIdx === idx}
            aria-controls={`faq-panel-${idx}`}
            style={{ minHeight: 64 }}
          >
            <span className="text-[20px] font-semibold text-[#1F2123] font-['Pretendard'] text-left flex-1">{item.q}</span>
            <span className="flex items-center justify-center bg-[#F9FBFD] rounded-full w-10 h-10 mr-6 transition-colors group-hover:bg-[#F4F6F9]">
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M5 7l4 4 4-4" stroke="#1F2123" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </button>
          {openIdx === idx && (
            <div id={`faq-panel-${idx}`} className="pl-8 pr-16 pb-8 pt-2 text-[18px] text-[#4B5563] leading-snug animate-fade-in font-['Pretendard']">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 