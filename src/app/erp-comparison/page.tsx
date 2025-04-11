'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ERPComparison() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ERP 솔루션 비교</h1>
      
      <p className="text-lg text-gray-700 mb-6 text-center max-w-3xl mx-auto">
        다양한 ERP 시스템을 비교하여 귀사에 가장 적합한 솔루션을 찾아보세요.
        가격, 기능, 설치방식 등 중요한 요소를 한눈에 비교할 수 있습니다.
      </p>
      
      {/* 중요성 및 시스템 요구사항 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-5 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">적합한 ERP 선택의 중요성</h3>
          <p className="text-blue-700 mb-3">
            회사에 적합한 ERP 솔루션을 선택하는 것은 비즈니스 성공에 결정적인 영향을 미칩니다. 업종, 규모, 목표에 
            맞지 않는 시스템을 도입할 경우 비용 낭비와 업무 효율성 저하를 초래할 수 있습니다.
          </p>
          <p className="text-blue-700">
            예스넷은 10년 이상의 ERP 컨설팅 경험을 바탕으로 귀사에 가장 적합한 솔루션을 찾아드립니다. 
            전문가 상담을 통해 기업 특성에 맞는 맞춤형 ERP를 추천받아보세요.
          </p>
        </div>
        
        <div className="bg-green-50 p-5 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-3">시스템 요구사항</h3>
          <ul className="text-green-700 space-y-2">
            <li><span className="font-medium">클라우드 ERP:</span> 인터넷 연결, 최신 웹 브라우저 (Chrome, Edge, Safari 최신 버전)</li>
            <li><span className="font-medium">구축형 ERP:</span> Windows 10/11, 최소 4GB RAM(8GB 이상 권장), 100GB 이상 저장공간</li>
            <li><span className="font-medium">서버 요구사항:</span> Windows Server 2016 이상, 최소 8GB RAM(16GB 이상 권장)</li>
            <li><span className="font-medium">네트워크:</span> 안정적인 인터넷 연결, 방화벽 설정 필요</li>
          </ul>
        </div>
      </div>
      
      {/* 탭 메뉴 */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          전체 보기
        </button>
        <button 
          onClick={() => setActiveTab('cloud')}
          className={`px-4 py-2 rounded-md ${activeTab === 'cloud' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          클라우드 ERP
        </button>
        <button 
          onClick={() => setActiveTab('onpremise')}
          className={`px-4 py-2 rounded-md ${activeTab === 'onpremise' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          구축형 ERP
        </button>
      </div>
      
      {/* ERP 비교 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b border-r text-left font-semibold text-gray-700">ERP 제품</th>
              <th className="py-3 px-4 border-b border-r text-left font-semibold text-gray-700">설치방식</th>
              <th className="py-3 px-4 border-b border-r text-left font-semibold text-gray-700">업체명</th>
              <th className="py-3 px-4 border-b border-r text-left font-semibold text-gray-700">구독비용</th>
              <th className="py-3 px-4 border-b border-r text-left font-semibold text-gray-700">대표기능</th>
              <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">특징</th>
            </tr>
          </thead>
          <tbody>
            {/* 이카운트 */}
            {(activeTab === 'all' || activeTab === 'cloud') && (
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 border-b border-r font-medium">이카운트 ERP</td>
                <td className="py-4 px-4 border-b border-r">클라우드</td>
                <td className="py-4 px-4 border-b border-r">이카운트</td>
                <td className="py-4 px-4 border-b border-r">
                  <div>월 40,000원</div>
                  <div className="text-sm text-gray-500">가입비 : 200,000원(한번만 발생)</div>
                </td>
                <td className="py-4 px-4 border-b border-r">
                  <ul className="list-disc list-inside text-sm">
                    <li>사용자/품목/거래처 수 무제한</li>
                    <li>별도 서버 불필요</li>
                    <li>시스템 자동 업데이트</li>
                  </ul>
                  <div className="mt-2 bg-yellow-100 p-2 text-sm rounded">
                    <strong>ERP 초보 사용자에 대한 이해도가 높은 경우 권장</strong>
                  </div>
                </td>
                <td className="py-4 px-4 border-b">
                  <div className="bg-yellow-100 p-2 rounded mb-2">
                    <span className="font-medium">장점:</span> ERP 기본적인 기능들이 충분함, 특히 재고기능이 강력함
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <span className="font-medium">단점:</span> 복잡하거나 특화된 기능 제한적
                  </div>
                </td>
              </tr>
            )}
            
            {/* 더존 */}
            {(activeTab === 'all' || activeTab === 'onpremise') && (
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 border-b border-r font-medium">더존 amranth 10</td>
                <td className="py-4 px-4 border-b border-r">구축형</td>
                <td className="py-4 px-4 border-b border-r">더존비즈온</td>
                <td className="py-4 px-4 border-b border-r">
                  <div>가격 대리점마다 상이</div>
                  <div className="text-sm text-gray-500">사용자당 라이선스에 따른 가격 체계</div>
                </td>
                <td className="py-4 px-4 border-b border-r">
                  <ul className="list-disc list-inside text-sm">
                    <li>기본적 ERP 시스템에 대한 이해도가 높음</li>
                    <li>회계에 특화된 시스템</li>
                  </ul>
                  <div className="mt-2 bg-yellow-100 p-2 text-sm rounded">
                    <strong>FRP를 사용하는 업체에 현장이 있으며 재고관리가 필요하다면 도입 권장</strong>
                  </div>
                </td>
                <td className="py-4 px-4 border-b">
                  <div className="bg-yellow-100 p-2 rounded mb-2">
                    <span className="font-medium">장점:</span> 다양한 업종에 맞춤형 솔루션 제공, 회계 및 세무기능 강력
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <span className="font-medium">단점:</span> 초기 설치비용 및 유지보수 비용 고가, 시스템 복잡성 높음
                  </div>
                </td>
              </tr>
            )}

            {/* 제품3 - SAP */}
            {(activeTab === 'all' || activeTab === 'onpremise') && (
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 border-b border-r font-medium">SAP Business One</td>
                <td className="py-4 px-4 border-b border-r">구축형 / 클라우드</td>
                <td className="py-4 px-4 border-b border-r">SAP</td>
                <td className="py-4 px-4 border-b border-r">
                  <div>기본가격 다소 높음</div>
                  <div className="text-sm text-gray-500">사용자당 라이선스에 따른 가격 체계</div>
                </td>
                <td className="py-4 px-4 border-b border-r">
                  <ul className="list-disc list-inside text-sm">
                    <li>세계적으로 검증된 ERP 시스템</li>
                    <li>다양한 산업별 템플릿 제공</li>
                    <li>확장성 우수</li>
                  </ul>
                  <div className="mt-2 bg-yellow-100 p-2 text-sm rounded">
                    <strong>제조기업이 재고, 영업, 생산까지 전 범위 관리를 원한다면 추천</strong>
                  </div>
                </td>
                <td className="py-4 px-4 border-b">
                  <div className="bg-yellow-100 p-2 rounded mb-2">
                    <span className="font-medium">장점:</span> 글로벌 표준 프로세스, 강력한 분석 기능, 다양한 모듈 제공
                  </div>
                  <div className="bg-red-50 p-2 rounded mb-2">
                    <span className="font-medium">단점:</span> 높은 구축 비용, 복잡한 시스템, 커스터마이징 어려움
                  </div>
                  <div className="text-gray-700 text-sm">
                    <span className="font-medium">비용:</span> 제품가격 1,600만원, 10명 기준, 추가시 1명당 160만원
                  </div>
                </td>
              </tr>
            )}

            {/* 제품4 - 오라클 */}
            {(activeTab === 'all' || activeTab === 'cloud') && (
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 border-b border-r font-medium">Oracle NetSuite</td>
                <td className="py-4 px-4 border-b border-r">클라우드</td>
                <td className="py-4 px-4 border-b border-r">Oracle</td>
                <td className="py-4 px-4 border-b border-r">
                  <div>연간 라이선스 체계</div>
                  <div className="text-sm text-gray-500">사용자 수와 모듈에 따라 가격 변동</div>
                </td>
                <td className="py-4 px-4 border-b border-r">
                  <ul className="list-disc list-inside text-sm">
                    <li>글로벌 기업 대상 통합 솔루션</li>
                    <li>재무, CRM, 공급망 관리 통합</li>
                    <li>실시간 비즈니스 인텔리전스</li>
                  </ul>
                  <div className="mt-2 bg-yellow-100 p-2 text-sm rounded">
                    <strong>대기업 또는 외국계 기업 연계가 필요한 경우 추천</strong>
                  </div>
                </td>
                <td className="py-4 px-4 border-b">
                  <div className="bg-yellow-100 p-2 rounded mb-2">
                    <span className="font-medium">장점:</span> 국제적 비즈니스 지원, 다양한 통합 API, 확장성 우수
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <span className="font-medium">단점:</span> 높은 구독 비용, 중소기업에 과도한 기능
                  </div>
                </td>
              </tr>
            )}

            {/* 제품5 - 얼마에요 */}
            {(activeTab === 'all' || activeTab === 'onpremise' || activeTab === 'cloud') && (
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 border-b border-r font-medium">얼마에요</td>
                <td className="py-4 px-4 border-b border-r">구축형 / 클라우드</td>
                <td className="py-4 px-4 border-b border-r">아이퀘스트</td>
                <td className="py-4 px-4 border-b border-r">
                  <div>월 39,000원</div>
                  <div className="text-sm text-gray-500">가입비 : 100,000원(유저 추가당 50,000원)</div>
                </td>
                <td className="py-4 px-4 border-b border-r">
                  <ul className="list-disc list-inside text-sm">
                    <li>일반적인 회사 업무에 맞게 설계</li>
                    <li>간편한 회계/세무 관리</li>
                    <li>직관적인 인터페이스</li>
                  </ul>
                  <div className="mt-2 bg-yellow-100 p-2 text-sm rounded">
                    <strong>관리 포인트가 적고 사용 인원이 적은 소규모 기업에 적합</strong>
                  </div>
                </td>
                <td className="py-4 px-4 border-b">
                  <div className="bg-yellow-100 p-2 rounded mb-2">
                    <span className="font-medium">장점:</span> 사용이 쉽고 직관적, 초기 구축 비용이 저렴, 설치 및 운영이 간편
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <span className="font-medium">단점:</span> 커스터마이징이 제한적, 복잡한 업무 프로세스 지원 제한, 확장성 부족
                  </div>
                </td>
              </tr>
            )}

            {/* 제품6 - 영림원 */}
            {(activeTab === 'all' || activeTab === 'onpremise' || activeTab === 'cloud') && (
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 border-b border-r font-medium">영림원 SystemEver</td>
                <td className="py-4 px-4 border-b border-r">구축형 / 클라우드</td>
                <td className="py-4 px-4 border-b border-r">영림원소프트랩</td>
                <td className="py-4 px-4 border-b border-r">
                  <div>맞춤형 가격 체계</div>
                  <div className="text-sm text-gray-500">기업 규모 및 커스터마이징 정도에 따라 가격 책정</div>
                </td>
                <td className="py-4 px-4 border-b border-r">
                  <ul className="list-disc list-inside text-sm">
                    <li>기업 맞춤형 개발 가능</li>
                    <li>다양한 산업 특화 모듈</li>
                    <li>높은 수준의 커스터마이징</li>
                  </ul>
                  <div className="mt-2 bg-yellow-100 p-2 text-sm rounded">
                    <strong>일반적인 업무 흐름과 다르거나 특수한 관리 요구사항이 있는 기업에 적합</strong>
                  </div>
                </td>
                <td className="py-4 px-4 border-b">
                  <div className="bg-yellow-100 p-2 rounded mb-2">
                    <span className="font-medium">장점:</span> 완전한 맞춤형 개발, 높은 확장성, 특수 업종에 특화된 기능 제공
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <span className="font-medium">단점:</span> 상대적으로 높은 구축 비용, 개발 및 도입 기간 장기화, 유지보수 비용 증가
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 하단 안내문 */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">ERP 선택 시 고려사항</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li>회사 규모와 성장 계획에 적합한 솔루션인지 확인하세요.</li>
          <li>업종별 특수성을 지원하는지 검토하세요.</li>
          <li>초기 도입 비용뿐만 아니라 유지보수 비용도 고려하세요.</li>
          <li>기존 시스템과의 연동 가능성을 확인하세요.</li>
          <li>도입 후 기술 지원 및 교육 서비스가 제공되는지 확인하세요.</li>
        </ul>
      </div>
      
      {/* CTA 버튼 */}
      <div className="mt-10 text-center">
        <Link href="/company-info" className="inline-block px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          맞춤형 ERP 추천받기
        </Link>
      </div>
      
      {/* 업종별 추천 ERP */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">업종별 추천 ERP 솔루션</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 제조업 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">제조업</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✓</span>
                <span><strong>이카운트 ERP:</strong> 중소 제조업체, 간단한 BOM 관리 필요 시</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✓</span>
                <span><strong>SAP Business One:</strong> 중견 제조기업, 복잡한 BOM/생산 관리 필요 시</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✓</span>
                <span><strong>Oracle NetSuite:</strong> 글로벌 공급망 관리 시</span>
              </li>
            </ul>
          </div>
          
          {/* 유통/도소매 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">유통/도소매</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✓</span>
                <span><strong>이카운트 ERP:</strong> 소규모 유통업체, 기본 재고/판매 관리</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✓</span>
                <span><strong>더존 Smart A:</strong> 국내 중소 유통업체, 세무/회계 중점 관리</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✓</span>
                <span><strong>Microsoft Dynamics:</strong> 옴니채널 판매, 고객 관계 관리 중요 시</span>
              </li>
            </ul>
          </div>
          
          {/* 서비스업 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">서비스/전문직</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✓</span>
                <span><strong>이카운트 ERP:</strong> 소규모 서비스업체, 기본 회계/급여 관리</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✓</span>
                <span><strong>Microsoft Dynamics:</strong> 프로젝트 관리, CRM 필요 시</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">✓</span>
                <span><strong>Oracle NetSuite:</strong> 다국적 서비스, 복잡한 비용 정산</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 