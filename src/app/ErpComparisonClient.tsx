'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ERP_LIST = [
  {
    name: '이카운트 ERP',
    brand: '이카운트',
    type: '클라우드',
    features: [
      '사용자/품목/거래처 수 무제한',
      '별도 서버 불필요',
      '시스템 자동 업데이트',
    ],
    recommend: '✓ ERP 초보 사용자에 대한 이해도가 높은 경우 권장',
    pros: '장점 : ERP 기본적인 기능 자체로도 활용도가 높으며, 특히\n재고 기능이 특화되어 있음',
    cons: '단점 : 업종별 복잡하고 특화된 기능이 제한적',
    price: '월 40,000원',
    signup: '가입비 : 200,000원(첫달만)',
    install: '클라우드',
    category: 'cloud',
  },
  {
    name: 'Oracle NetSuite',
    brand: 'Oracle',
    type: '클라우드',
    features: [
      '글로벌 기업 대상 통합 솔루션',
      '재무 · CRM · 공급망 관리 통합',
      '실시간 비즈니스 인텔리전스',
    ],
    recommend: '✓ 대기업 또는 외국계 기업 연계가 필요한 경우 권장',
    pros: '장점 : 국제적 비즈니스 지원, 다양한 통합 API, 확장성 우수',
    cons: '단점 : 중소기업에게 과도한 기능과 높은 구독 비용',
    price: '연간 라이선스 체계',
    signup: '사용자 수와 모듈에 따라 가격 변동',
    install: '클라우드',
    category: 'cloud',
  },
  {
    name: '얼마에요',
    brand: '아이퀘스트',
    type: '구축형/클라우드',
    features: [
      '일반적인 회사 업무에 맞게 설계',
      '간편한 회계/세무 관리',
      '직관적인 인터페이스',
    ],
    recommend: '✓ 사용자 수 및 관리 필요가 적은 소규모 기업에 적합',
    pros: '장점 : 쉬운 사용과 저렴한 도입 비용, 간편한 설치 및 운영',
    cons: '단점 : 제한적인 업무 지원 및 커스터마이징, 확장성 부족',
    price: '월 39,000원',
    signup: '가입비 : 100,000원(유저 추가당 50,000원)',
    install: '구축형/\n클라우드',
    category: 'onpremise',
  },
  {
    name: '영림원 SystemEver',
    brand: '영림원소프트랩',
    type: '구축형/클라우드',
    features: [
      '기업 맞춤형 개발 가능',
      '다양한 산업 특화 모듈',
      '높은 수준의 커스터마이징',
    ],
    recommend: '✓ 특수한 관리 요구사항이 있는 기업에 적합',
    pros: '장점 : 완전한 맞춤형 개발, 시스템 확장성 우수',
    cons: '단점 : 상대적으로 높은 구축 비용, 개발 및 도입 기간 장기화\n도입 후 유지보수 비용 증가',
    price: '맞춤형 가격 체계',
    signup: '기업 규모 및 커스터마이징 기준 가격 책정',
    install: '구축형/\n클라우드',
    category: 'onpremise',
  },
  {
    name: '더존 amranth 10',
    brand: '더존비즈온',
    type: '구축형/클라우드',
    features: [
      '기본 ERP 시스템에 대한 이해도가 높음',
      '회계에 특화된 시스템',
    ],
    recommend: '✓ ERP를 사용하는 업체이며 현장이 있고\n재고관리가 필요한 경우 권장',
    pros: '장점 : 다양한 업종 맞춤형 솔루션 제공, 회계·세무기능 우수',
    cons: '단점 : 높은 설치 및 유지보수 비용, 시스템 복잡성 높음',
    price: '대리점마다 가격 상이',
    signup: '사용자당 라이선스에 따른 가격 체계',
    install: '구축형/\n클라우드',
    category: 'onpremise',
  },
  {
    name: 'SAP Business One',
    brand: 'SAP',
    type: '구축형/클라우드',
    features: [
      '세계적으로 검증된 ERP 시스템',
      '다양한 산업 템플릿 제공',
      '시스템 확장성 우수',
    ],
    recommend: '✓ 제조기업이 재고·영업·생산까지 전 범위의 관리를 원할 경우 적합',
    pros: '장점 : 글로벌 표준 프로세스, 강력한 분석 기능 및 모듈 제공',
    cons: '단점 : 높은 구축 비용, 복잡한 시스템 및 커스터마이징 제한',
    price: '월 기본 비용 다소 높음',
    signup: '사용자당 라이선스에 따른 가격 체계',
    install: '구축형/\n클라우드',
    category: 'onpremise',
  },
];

const CATEGORY_LIST = [
  { key: 'all', label: '전체보기' },
  { key: 'cloud', label: '클라우드 ERP' },
  { key: 'onpremise', label: '구축형 ERP' },
];

export default function ErpComparisonClient() {
  const [category, setCategory] = useState('all');

  return (
    <main className="w-full min-h-screen bg-white" style={{ fontFamily: 'Pretendard, system-ui, sans-serif' }}>
      {/* 상단 인사이트/타이틀 */}
      <section className="w-full flex flex-col items-center justify-center px-4 md:px-20 pt-[88px] pb-0 bg-white">
        <div className="w-full max-w-[1440px] flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="font-['Inter_Tight','Pretendard'] font-medium text-[22px] text-[#030812]">Insight</span>
            <h1 className="font-['Inter_Tight','Pretendard'] font-semibold text-[clamp(2.5rem,6vw,4.375rem)] leading-none text-[#030812] text-center">ERP 비교</h1>
          </div>
        </div>
      </section>

      {/* ERP 선택의 중요성 */}
      <section className="w-full flex justify-center px-4 md:px-20 py-16 bg-white">
        <div className="w-full max-w-[1440px] flex flex-col md:flex-row gap-12 items-center">
          {/* 왼쪽 이미지 */}
          <div className="w-full md:w-[388px] h-[310px] bg-[#F1F7FF] rounded-2xl flex items-center justify-center overflow-hidden">
            <Image src="/erp-insight.png" alt="ERP Insight" width={388} height={310} className="object-contain" />
          </div>
          {/* 오른쪽 설명 */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="font-semibold text-[32px] text-[#030812] leading-snug">적합한 ERP 선택의 중요성</h2>
            <p className="text-[14px] text-[#1F2123] leading-relaxed">
              기업에게 적합한 ERP 시스템을 선택하는 것은 비즈니스 성공에 결정적인 영향을 미칩니다. 업종·규모·목표 등 기업에 맞지 않는 시스템을 도입할 경우 불필요한 비용 낭비와 업무 효율성 저하를 초래할 수 있기 때문입니다. 하지만 다양한 ERP 시스템이 있기 때문에 어떤 것이 적합한 시스템인지 알기 쉽지 않죠.<br /><br />
              예스넷은 10년 이상의 ERP 컨설팅 경험을 바탕으로 귀사에 가장 적합한 솔루션을 찾아드립니다. 전문적인 상담을 통해 기업 특성에 맞는 맞춤형 ERP를 추천받아보세요!
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center bg-[#F1F7FF] rounded-full px-4 py-2 text-[14px] text-[#030812] font-normal">✓ 기업규모·방향성에 적합</span>
              <span className="inline-flex items-center bg-[#F1F7FF] rounded-full px-4 py-2 text-[14px] text-[#030812] font-normal">✓ 업종별 특수성 지원</span>
              <span className="inline-flex items-center bg-[#F1F7FF] rounded-full px-4 py-2 text-[14px] text-[#030812] font-normal">✓ 유지 보수 비용</span>
              <span className="inline-flex items-center bg-[#F1F7FF] rounded-full px-4 py-2 text-[14px] text-[#030812] font-normal">✓ 기존 시스템과의 연동 가능성</span>
              <span className="inline-flex items-center bg-[#F1F7FF] rounded-full px-4 py-2 text-[14px] text-[#030812] font-normal">✓ 기술 지원 및 교육 서비스가 제공</span>
            </div>
            <div className="relative w-full flex justify-end items-start mt-2">
              <div className="group inline-block relative">
                <span
                  className="text-[12px] text-[#308FFF] font-medium cursor-pointer select-none"
                  tabIndex={0}
                  aria-describedby="erp-tip-popover"
                >
                  Tip. ERP 시스템별 요구사양
                </span>
                {/* 퀵팁 팝오버 */}
                <div
                  id="erp-tip-popover"
                  className="absolute right-0 top-8 z-20 hidden group-hover:flex group-focus-within:flex flex-col items-start min-w-[260px] max-w-[340px] bg-[#308FFF] rounded-xl shadow-[0_6px_10px_0_rgba(75,85,99,0.1)] px-8 py-6 text-white transition-opacity duration-200"
                  style={{ fontFamily: 'Pretendard, Roboto, system-ui, sans-serif' }}
                >
                  {/* 타이틀 */}
                  <div className="font-bold text-[14px] mb-2" style={{ fontFamily: 'Pretendard' }}>Tip. ERP 시스템별 요구사양</div>
                  {/* 설명 */}
                  <div className="text-[12px] leading-[1.4] whitespace-pre-line" style={{ fontFamily: 'Roboto' }}>
                    ✓ 클라우드 : 인터넷 연결·최신 웹 브라우저(Chrome·Edge·Safari 최신 버전)
                    <br />✓ 구축형 : Windows 10/11·최소 4GB RAM(8GB 이상 권장)·100GB 이상 저장공간
                    <br />✓ 서버 : Windows 서버 2016 이상·최소 8GB RAM(16GB 이상 권장)
                    <br />✓ 네트워크 : 안정적인 인터넷 연결·방화벽 설정 필요
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 탭 */}
      <section className="w-full flex justify-center px-4 md:px-20">
        <div className="w-full max-w-[1012px] flex flex-col items-center">
          <div className="flex gap-4 mb-8">
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-6 py-2 rounded-[20px] font-medium text-[14px] transition-colors
                  ${category === cat.key ? 'bg-[#F4F6F9] text-[#1F2123]' : 'bg-[#F4F6F9]/50 text-[#4B5563] hover:bg-[#F4F6F9]'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ERP 비교 테이블 */}
      <section className="w-full flex justify-center px-4 md:px-20 pb-24 bg-white">
        <div className="w-full max-w-[1310px] flex flex-col gap-8">
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-[1fr_1fr_1fr_2fr_2fr] bg-[#F9FBFD] rounded-t-2xl shadow-sm overflow-hidden text-[16px] font-semibold text-[#1F2123]">
            <div className="py-4 px-4 border-r border-[#F1F7FF]">ERP 구분</div>
            <div className="py-4 px-4 border-r border-[#F1F7FF] text-[#1F2123]/50 font-medium">설치방식</div>
            <div className="py-4 px-4 border-r border-[#F1F7FF] text-[#0285FE] font-semibold">구독비용</div>
            <div className="py-4 px-6 border-r border-[#F1F7FF]">대표기능</div>
            <div className="py-4 px-6">특징</div>
          </div>
          {/* 테이블 바디 */}
          {ERP_LIST.filter((row) => category === 'all' || (category === 'cloud' ? row.type.includes('클라우드') : row.type.includes('구축형'))).map((row, idx) => (
            <div key={row.name} className="grid grid-cols-[1fr_1fr_1fr_2fr_2fr] bg-white rounded-b-2xl shadow-sm overflow-hidden text-[14px] text-[#1F2123] border-b border-[#F1F7FF] last:rounded-b-2xl last:border-b-0">
              {/* ERP 구분 */}
              <div className="flex flex-col justify-center py-6 px-4 border-r border-[#F1F7FF]">
                <div className="font-semibold text-[14px] text-[#1F2123]" style={{fontFamily:'Pretendard',fontWeight:600}}>{row.name}</div>
                <div className="text-xs text-[#4B5563] font-normal" style={{fontFamily:'Pretendard',fontWeight:400}}>{row.brand}</div>
              </div>
              {/* 설치방식 */}
              <div className="flex items-center py-6 px-4 border-r border-[#F1F7FF] whitespace-pre-line">
                <span className="inline-block bg-[#F1F7FF] rounded-full px-4 py-2 text-[14px] text-[#030812] font-normal" style={{fontFamily:'Pretendard',fontWeight:400}}>{row.install}</span>
              </div>
              {/* 구독비용 */}
              <div className="flex flex-col gap-1 py-6 px-4 border-r border-[#F1F7FF]">
                <div className="font-semibold text-[#0285FE] text-[14px]" style={{fontFamily:'Pretendard',fontWeight:600}}>{row.price}</div>
                <div className="text-[#4B5563] text-xs whitespace-pre-line font-normal" style={{fontFamily:'Pretendard',fontWeight:400}}>{row.signup}</div>
              </div>
              {/* 대표기능 */}
              <div className="flex flex-col gap-2 py-6 px-6 border-r border-[#F1F7FF]">
                {row.features.map((f, i) => (
                  <div key={i} className="text-[#1F2123] font-normal" style={{fontFamily:'Pretendard',fontWeight:400}}>{f}</div>
                ))}
                <div className="mt-2 text-[#0285FE] font-medium whitespace-pre-line" style={{fontFamily:'Pretendard',fontWeight:500}}>{row.recommend}</div>
              </div>
              {/* 특징 */}
              <div className="flex flex-col gap-2 py-6 px-6 min-h-[108px] whitespace-pre-line bg-[#F1F7FF] rounded-r-2xl">
                <div className="font-medium text-[#1F2123]" style={{fontFamily:'Pretendard',fontWeight:500}}>{row.pros}</div>
                <div className="font-medium text-[#1F2123]" style={{fontFamily:'Pretendard',fontWeight:500}}>{row.cons}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
} 