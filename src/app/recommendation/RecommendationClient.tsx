"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { saveRecommendation, saveContactRequest, getRecommendation, getQuestionnaire, sendEmail } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type RecommendationInsert = Database['public']['Tables']['recommendations']['Insert'];
type ContactRequestInsert = Database['public']['Tables']['contact_requests']['Insert'];
type QuestionnaireData = Database['public']['Tables']['questionnaires']['Row'];

export default function RecommendationClient() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [questionnaireId, setQuestionnaireId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [phone, setPhone] = useState('');
  const [recommendationId, setRecommendationId] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    try {
      const cId = sessionStorage.getItem('companyId');
      const qId = sessionStorage.getItem('questionnaireId');
      if (!cId) {
        setError('회사 정보가 없습니다. 회사 정보 입력 페이지로 이동합니다.');
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/company-info';
        }, 2000);
        return;
      }
      if (!qId) {
        setError('질문지 정보가 없습니다. 설문 페이지로 이동합니다.');
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/questionnaire';
        }, 2000);
        return;
      }
      setCompanyId(cId);
      setQuestionnaireId(qId);
      checkExistingRecommendation(cId, qId);
    } catch (err) {
      setError('세션 데이터 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  }, []);

  const checkExistingRecommendation = async (cId: string, qId: string) => {
    try {
      const result = await getRecommendation(cId);
      if (result.error) {
        throw result.error;
      }
      if (result.data) {
        setRecommendation(result.data);
        setRecommendationId(result.data.id);
        setLoading(false);
      } else {
        await generateAndSaveRecommendation(cId, qId);
      }
    } catch (err) {
      setError('추천 결과 조회 중 오류가 발생했습니다. 새로 추천을 생성합니다.');
      try {
        await generateAndSaveRecommendation(cId, qId);
      } catch (createErr) {
        setError('추천 결과를 생성할 수 없습니다. 다시 시도해주세요.');
        setLoading(false);
      }
    }
  };

  const generateAndSaveRecommendation = async (cId: string, qId: string) => {
    try {
      const { data: questionnaireData, error: questionnaireError } = await getQuestionnaire(qId);
      if (questionnaireError || !questionnaireData) {
        throw new Error('설문 답변을 불러오는 데 실패했습니다.');
      }

      const answers = questionnaireData.common_answers as any;
      const accountingAnswers = questionnaireData.accounting_answers as any;
      const userCount = answers.userCount || 0;
      const wantEcount = answers.wantEcount === '예';

      let recommended_erp = '이카운트 ERP';
      let reasons: any = {};
      let setup_guide = '';

      if (accountingAnswers.directTaxFiling === 'yes' || accountingAnswers.selfBookkeeping === 'yes') {
        recommended_erp = '더존 ERP';
        reasons = {
          businessFit: '자체 기장 및 세금 신고 등 전문적인 회계 처리에 강점',
          costEfficiency: '다양한 라인업(Amaranth 10, ERP iU)으로 비즈니스 규모에 맞는 시스템 선택',
          userFriendly: '강력한 회계/세무 기능과 그룹사 관리 기능 제공',
          integrationCapability: '그룹웨어, 클라우드 등 다양한 솔루션과 연동하여 통합 경영 환경 구축',
          score: { businessFit: 92, featureFit: 98, costEfficiency: 80 }
        };
        setup_guide = `
# 더존 ERP 세팅 가이드
## 초기 설정 단계
1. 경영 환경 분석 및 ISP(정보화 전략 계획) 수립
2. 서버 구축 및 시스템 환경 설정 (구축형의 경우)
3. 데이터 마이그레이션 및 초기 데이터 검증
## 주요 모듈 설정
- 회계: IFRS, 내부회계관리제도 등 고급 회계 기능 설정
- 인사/급여: 복잡한 급여 계산식 및 연말정산 프로세스 커스터마이징
- 그룹웨어: 전자결재, 경비 청구 등 프로세스 자동화 설정`;
      } else if (wantEcount || userCount < 50) {
        recommended_erp = '이카운트 ERP';
        reasons = {
          businessFit: '50인 미만 중소기업에 최적화된 클라우드 기반 ERP 시스템',
          costEfficiency: '월 4만원의 합리적인 비용으로 모든 기능 사용 가능',
          userFriendly: '사용자 친화적 인터페이스로 빠른 적응 가능',
          integrationCapability: '회계, 영업, 재고, 생산, 급여 등 주요 모듈 통합 관리',
          score: { businessFit: 95, featureFit: 90, costEfficiency: 98 }
        };
        setup_guide = `
# 이카운트 ERP 세팅 가이드
## 초기 설정 단계
1. 회사 정보 등록 및 기초 코드 설정 (거래처, 품목, 창고)
2. 사용자 계정 생성 및 권한 설정
3. 전표 및 문서 양식 커스터마이징
## 주요 모듈 설정
- 재고: 품목별 초기 재고 수량 등록
- 회계: 계정과목 설정 및 초기 이월 설정
- 급여: 사원 정보 및 급여 조건 등록`;
      } else if (userCount >= 50 && userCount < 300) {
        recommended_erp = '영림원 ERP';
        reasons = {
          businessFit: '50-300인 규모의 중견/성장기업 맞춤형 솔루션 제공',
          costEfficiency: '구축형과 클라우드형 선택 가능, 유연한 가격 정책',
          userFriendly: '산업별 특화 프로세스 내장으로 높은 업무 적합도',
          integrationCapability: 'K-System Ace: 확장성과 유연성이 뛰어난 프로세스 기반 ERP',
          score: { businessFit: 90, featureFit: 92, costEfficiency: 85 }
        };
        setup_guide = `
# 영림원 ERP 세팅 가이드
## 초기 설정 단계
1. 기간시스템 분석 및 인터페이스(I/F) 설계
2. 마스터 데이터(기준정보) 표준화 및 정비
3. 사용자 교육 및 테스트 진행
## 주요 모듈 설정
- 생산: 공정관리, 품질관리 등 상세 생산 프로세스 설정
- 회계: 연결회계 및 IFRS 지원 기능 설정
- 영업: 산업별 특화 영업 프로세스(수주, 출하 등) 적용`;
      } else {
        recommended_erp = '더존 ERP';
        reasons = {
          businessFit: '300인 이상 기업 및 복잡한 회계/관리 요구사항에 적합',
          costEfficiency: '다양한 라인업(Amaranth 10, ERP iU)으로 비즈니스 규모에 맞는 시스템 선택',
          userFriendly: '강력한 회계/세무 기능과 그룹사 관리 기능 제공',
          integrationCapability: '그룹웨어, 클라우드 등 다양한 솔루션과 연동하여 통합 경영 환경 구축',
          score: { businessFit: 88, featureFit: 95, costEfficiency: 80 }
        };
        setup_guide = `
# 더존 ERP 세팅 가이드
## 초기 설정 단계
1. 경영 환경 분석 및 ISP(정보화 전략 계획) 수립
2. 서버 구축 및 시스템 환경 설정 (구축형의 경우)
3. 데이터 마이그레이션 및 초기 데이터 검증
## 주요 모듈 설정
- 회계: IFRS, 내부회계관리제도 등 고급 회계 기능 설정
- 인사/급여: 복잡한 급여 계산식 및 연말정산 프로세스 커스터마이징
- 그룹웨어: 전자결재, 경비 청구 등 프로세스 자동화 설정`;
      }

      const recommendationData: RecommendationInsert = {
        company_id: cId,
        questionnaire_id: qId,
        recommended_erp,
        reasons,
        setup_guide,
        created_at: new Date().toISOString()
      };

      const result = await saveRecommendation(recommendationData);
      if (result.error) throw result.error;
      if (!result.data || result.data.length === 0) throw new Error('추천 데이터 저장 결과가 반환되지 않았습니다');
      
      setRecommendation({
        id: result.data[0].id,
        ...recommendationData
      });
      setRecommendationId(result.data[0].id);
      setError(null);
    } catch (err: any) {
      setError(err.message || '추천 결과 생성 중 오류가 발생했습니다.');
      setRecommendation(null);
      setRecommendationId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleContactRequest = async () => {
    if (!companyId || !recommendationId) {
      setError('필요한 정보가 없습니다. 이전 단계부터 진행해주세요.');
      return;
    }
    if (!phone) {
      setError('연락 가능한 연락처를 입력해주세요.');
      return;
    }
    setContactLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const contactInfo = `연락처: ${phone}\n\n${additionalInfo}`;
      const contactData: ContactRequestInsert = {
        company_id: companyId,
        recommendation_id: recommendationId,
        additional_info: contactInfo,
        request_ip: window.location.hostname,
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      const { error } = await saveContactRequest(contactData);
      if (error) {
        throw error;
      }
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: 'yesnet@yesneterp.com',
            subject: '새로운 연락 요청이 있습니다',
            text: `새로운 연락 요청이 접수되었습니다.\n\n회사 ID: ${companyId}\n연락처: ${phone}\n문의사항: ${additionalInfo || '(없음)'}`
          }),
        });
        const emailResult = await emailResponse.json();
        if (emailResponse.ok) {
          if (emailResult.previewUrl) {
            setSuccess(`연락 요청이 성공적으로 접수되었습니다. 테스트 모드에서 이메일이 발송되었습니다. \n\n이메일 확인: ${emailResult.previewUrl}`);
          } else {
            setSuccess('연락 요청이 성공적으로 접수되었습니다. 빠른 시일 내에 연락 드리겠습니다.');
          }
        } else {
          setSuccess('연락 요청이 저장되었습니다. (이메일 발송 실패)');
        }
      } catch (emailError) {
        setSuccess('연락 요청이 저장되었습니다. (이메일 오류)');
      }
      setAdditionalInfo('');
      setPhone('');
    } catch (err: any) {
      setError(err.message || '연락 요청 처리 중 오류가 발생했습니다.');
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">추천 ERP 시스템</h2>
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">추천 정보를 분석 중입니다. 잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }
  if (!recommendation) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">추천 ERP 시스템</h2>
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="text-center text-gray-600">
            <p>추천 결과를 생성하는데 문제가 발생했습니다.</p>
            <p className="mt-2">이전 단계부터 다시 진행해주세요.</p>
            <div className="mt-6">
              <Link href="/company-info" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                처음부터 다시 시작하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">추천 ERP 시스템</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-blue-700" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">{recommendation.recommended_erp}</h3>
        </div>
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-2">추천 이유</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {recommendation.reasons.businessFit && <li>{recommendation.reasons.businessFit}</li>}
            {recommendation.reasons.costEfficiency && <li>{recommendation.reasons.costEfficiency}</li>}
            {recommendation.reasons.userFriendly && <li>{recommendation.reasons.userFriendly}</li>}
            {recommendation.reasons.integrationCapability && <li>{recommendation.reasons.integrationCapability}</li>}
          </ul>
        </div>
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-2">적합도 점수</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">업종 적합성</span>
                <span className="text-sm font-medium">
                  {recommendation.reasons.score?.businessFit || 90}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${recommendation.reasons.score?.businessFit || 90}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">기능 적합성</span>
                <span className="text-sm font-medium">
                  {recommendation.reasons.score?.featureFit || 85}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${recommendation.reasons.score?.featureFit || 85}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">비용 효율성</span>
                <span className="text-sm font-medium">
                  {recommendation.reasons.score?.costEfficiency || 95}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${recommendation.reasons.score?.costEfficiency || 95}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">상세 ERP 세팅 가이드</h3>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ 
            __html: recommendation.setup_guide
              .replace(/^# (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-800 my-2">$1</h3>')
              .replace(/^## (.*$)/gim, '<h4 class="text-lg font-medium text-gray-700 my-2">$1</h4>')
              .replace(/^[0-9]+\. (.*$)/gim, '<li>$1</li>')
              .replace(/^- (.*$)/gim, '<li>$1</li>')
              .split('\n\n').map((p: string) => p.trim().startsWith('<') ? p : `<p>${p}</p>`).join('')
              .replace(/<li>/g, '<li class="ml-5">')
          }} />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">연락 요청</h3>
        <p className="text-gray-700 mb-4">
          ERP 도입에 대한 상세한 상담이 필요하신가요? 아래 버튼을 클릭하시면 전문 컨설턴트가 연락드립니다.
        </p>
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        <div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              연락 가능한 연락처 <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              id="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="예: 010-1234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 mb-4" 
            placeholder="추가 문의사항이 있으시면 남겨주세요."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          ></textarea>
          <button 
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onClick={handleContactRequest}
            disabled={contactLoading}
          >
            {contactLoading ? '요청 처리 중...' : '연락 요청하기'}
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <Link href="/questionnaire" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          이전
        </Link>
        <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          처음으로
        </Link>
      </div>
    </div>
  );
} 