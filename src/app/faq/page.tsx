'use client';

import React from 'react';
import Link from 'next/link';

export default function FAQ() {
  return (
    <main className="min-h-screen py-16 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          자주 묻는 질문
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          많이 궁금해하시는 질문들을 모았습니다.
        </p>
        
        <div className="space-y-6">
          {/* 아코디언 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-5 font-medium cursor-pointer list-none">
                <span className="text-lg font-semibold">예스넷의 세팅 & 컨설팅은 무엇이 다른가요?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-gray-700">
                <p className="mb-2">ERP 시스템은 데이터에 대한 이해와 더불어 ERP 기능, 회사 프로세스에 대한 이해까지 전반적인 데이터 전문 인력이 진행해야 성공적인 구축이 가능합니다. 예스넷은 이카운트 ERP에서 오랜 시간 근무하고 기획·개발·교육에 참여했던 컨설턴트로 구성된 회사입니다.</p>
                <p><strong>실전 경험을 토대로 높은 전문성을 가지고 효율적인 세팅&컨설팅이 가능</strong>하며, 현재 150개 이상의 기업들과 세팅&컨설팅 완료 및 진행 중에 있습니다. 또한 <strong>매년 데이터 가공 부문 데이터바우처에 선정되고 있어 컨설팅 비용 부담을 낮춰 진행</strong>할 수 있습니다.</p>
              </div>
            </details>
          </div>

          {/* 아코디언 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-5 font-medium cursor-pointer list-none">
                <span className="text-lg font-semibold">기간은 얼마나 걸리나요?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-gray-700">
                <p>세팅&컨설팅 기간은 각 회사마다 사용 범위와 데이터량이 다르기 때문에 차이는 있을 수 있으나 <strong>평균적으로 2~3개월 정도 소요</strong>되며, 원하는 세팅에 대한 자료 정리가 잘 되어 있으면 기간은 더 단축됩니다. 또한 세팅 진행이 빠르게 완료되었어도 실무를 위한 테스트 및 ERP 교육 기간까지 고려한다면 평균 기간 정도 소요됩니다.</p>
              </div>
            </details>
          </div>

          {/* 아코디언 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-5 font-medium cursor-pointer list-none">
                <span className="text-lg font-semibold">기존 프로그램과의 호환이 가능한가요?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-gray-700">
                <p>기존 경영자료를 엑셀 문서로 보유하고 있다면, 이카운트 ERP로 쉽게 업로드할 수 있습니다. 또한 타 프로그램의 데이터 이관 작업도 가능합니다.</p>
              </div>
            </details>
          </div>

          {/* 아코디언 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-5 font-medium cursor-pointer list-none">
                <span className="text-lg font-semibold">비용은 얼마인가요?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-gray-700">
                <p>세팅&컨설팅 비용은 <strong>각 회사마다 사용 범위와 데이터량이 다르기 때문에 원격 및 방문 상담 후에 정확한 비용을 알려 드릴 수 있습니다.</strong> 또한 비용 부담을 덜어드리기 위해 데이터바우처를 통한 정부지원금 안내도 함께 도와 드리고 있으니 편하게 문의 주시기 바랍니다.</p>
              </div>
            </details>
          </div>

          {/* 아코디언 5 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-5 font-medium cursor-pointer list-none">
                <span className="text-lg font-semibold">어떻게 진행되나요?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-gray-700">
                <p>진행 과정은 <strong>상담(원격·방문) → 견적 금액 제시 → 금액 확정 → 세팅 진행 → 테스트 및 교육 → 추가 컨설팅(선택사항) → 세팅 완료 → 유지보수(선택사항)</strong>의 과정을 거칩니다.</p>
              </div>
            </details>
          </div>
        </div>
        
        {/* 컨설팅 문의 섹션 */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">더 궁금하신 점이 있으신가요?</h2>
          <p className="text-gray-600 text-center mb-8">ERP 전문 컨설턴트가 친절히 안내해드립니다.</p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium mb-4">연락처 안내</h3>
              <div className="space-y-3">
                <p className="flex items-start">
                  <span className="font-medium mr-2">주소:</span>
                  <span>경기도 안양시 동안구 벌말로 66, 평촌역하이필드지식산업센터 B동 904호</span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium mr-2">전화:</span>
                  <span>070.8657.2080</span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium mr-2">이메일:</span>
                  <span>yesnet@yesneterp.com</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center">
              <Link href="/contact" className="px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mb-4 w-full text-center">
                문의하기
              </Link>
              <p className="text-sm text-gray-500">전화 또는 이메일로도 문의 가능합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 