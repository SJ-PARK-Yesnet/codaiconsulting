'use client';

import { useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  // 페이지 로드 시 기본 경로 확인
  useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path !== '/') {
        router.replace('/');
      }
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          ERP 컨설팅 서비스
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          귀사에 가장 적합한 ERP 시스템을 찾아드립니다. 간단한 설문을 통해 맞춤형 ERP 솔루션을 추천받으세요.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
          <Link href="/company-info" className="px-8 py-4 text-xl font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            ERP 추천 바로가기
          </Link>
          <Link href="/ecount-consulting" className="px-8 py-4 text-xl font-medium text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
            이카운트 컨설팅 바로가기
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* ERP 추천 서비스 소개 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">ERP 추천 서비스</h2>
            <p className="text-gray-600 mb-4">
              수많은 ERP 솔루션 중에서 귀사에 가장 적합한 시스템을 찾는 것은 쉽지 않습니다. 
              기업 규모, 업종, 예산, 필요 기능에 따라 최적의 ERP를 추천해 드립니다.
            </p>
            <ul className="text-gray-600 mb-6 list-disc list-inside space-y-2">
              <li>기업 정보 입력</li>
              <li>요구사항 설문 작성</li>
              <li>맞춤형 ERP 추천 결과</li>
              <li>도입 가이드 제공</li>
            </ul>
            <Link href="/company-info" className="text-blue-600 font-medium hover:text-blue-800">
              ERP 추천 받기 &rarr;
            </Link>
          </div>
          
          {/* 이카운트 컨설팅 서비스 소개 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">이카운트 컨설팅</h2>
            <p className="text-gray-600 mb-4">
              이카운트를 사용 중이신가요? 이카운트의 활용도를 진단하고 최적화하여 
              업무 효율성을 높이고 비용을 절감할 수 있도록 도와드립니다.
            </p>
            <ul className="text-gray-600 mb-6 list-disc list-inside space-y-2">
              <li>이카운트 활용도 진단</li>
              <li>맞춤형 세팅 서비스</li>
              <li>고도화 컨설팅</li>
              <li>사용자 교육 및 지원</li>
            </ul>
            <Link href="/ecount-consulting" className="text-green-600 font-medium hover:text-green-800">
              이카운트 컨설팅 받기 &rarr;
            </Link>
          </div>
        </div>
        
        {/* 이카운트 API 연결 테스트 */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">이카운트 API 연결 테스트</h2>
          <p className="text-gray-600 mb-4">
            이카운트 ERP와 API 연결을 테스트하고 데이터 품질을 분석해 보세요.
            API 연결을 통한 시스템 통합과 데이터 활용 방안을 확인할 수 있습니다.
          </p>
          <ul className="text-gray-600 mb-6 list-disc list-inside space-y-2">
            <li>데이터 품질 평가</li>
            <li>API 연결 성공률 확인</li>
            <li>시스템 통합 가능성 진단</li>
            <li>맞춤형 연동 솔루션 추천</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api-test" className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
              API 연결 테스트
            </Link>
            <Link href="/docs/ecount-api" className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              API 가이드 보기
            </Link>
          </div>
          <br></br>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api-score" className="px-6 py-3 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
              API 점수 체크하기
            </Link>
            <Link href="/api-example" className="px-6 py-3 text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors">
              API 활용 예시 보기
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 