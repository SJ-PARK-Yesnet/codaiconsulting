'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { saveRecommendation, saveContactRequest, getRecommendation, sendEmail } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type RecommendationInsert = Database['public']['Tables']['recommendations']['Insert']
type ContactRequestInsert = Database['public']['Tables']['contact_requests']['Insert']

export default function Recommendation() {
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [questionnaireId, setQuestionnaireId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [contactLoading, setContactLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [phone, setPhone] = useState('')
  const [recommendationId, setRecommendationId] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<any>(null)
  
  // 세션 스토리지에서 데이터 가져오기
  useEffect(() => {
    try {
      console.log('세션 스토리지 데이터 확인 시작')
      // 세션 스토리지에서 데이터 가져오기
      const cId = sessionStorage.getItem('companyId')
      const qId = sessionStorage.getItem('questionnaireId')
      
      console.log('세션 데이터:', { companyId: cId, questionnaireId: qId })
      
      // 데이터 검증
      if (!cId) {
        console.error('회사 ID가 없습니다')
        setError('회사 정보가 없습니다. 회사 정보 입력 페이지로 이동합니다.')
        setLoading(false)
        
        // 2초 후 회사 정보 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = '/company-info'
        }, 2000)
        return
      }
      
      if (!qId) {
        console.error('질문지 ID가 없습니다')
        setError('질문지 정보가 없습니다. 설문 페이지로 이동합니다.')
        setLoading(false)
        
        // 2초 후 질문지 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = '/questionnaire'
        }, 2000)
        return
      }
      
      // 모든 데이터가 있으면 상태 업데이트
      setCompanyId(cId)
      setQuestionnaireId(qId)
      
      // 추천 결과 확인 진행
      console.log('모든 필수 데이터 확인 완료. 추천 결과 확인 시작')
      checkExistingRecommendation(cId, qId)
    } catch (err) {
      console.error('세션 데이터 처리 오류:', err)
      setError('세션 데이터 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }, [])
  
  // 기존 추천 결과 확인
  const checkExistingRecommendation = async (cId: string, qId: string) => {
    try {
      console.log('추천 결과 조회 시작:', cId)
      const result = await getRecommendation(cId)
      
      // 오류 확인
      if (result.error) {
        console.error('추천 결과 조회 중 오류 발생:', result.error)
        throw result.error
      }
      
      // 데이터가 있으면 표시
      if (result.data) {
        console.log('기존 추천 결과 찾음:', result.data.id)
        setRecommendation(result.data)
        setRecommendationId(result.data.id)
        setLoading(false)
      } else {
        // 없으면 새로 생성
        console.log('기존 추천 결과 없음. 새로 생성 필요')
        if (qId) {
          await saveDummyRecommendation(cId, qId)
        } else {
          console.error('질문지 ID가 없어 더미 추천 생성 불가')
          setError('질문지 정보가 없습니다. 이전 단계부터 진행해주세요.')
          setLoading(false)
        }
      }
    } catch (err: any) {
      console.error('추천 결과 조회 실패:', err)
      setError('추천 결과 조회 중 오류가 발생했습니다.')
      
      // 오류 상황에서도 질문지 ID가 있으면 새로 생성 시도
      if (qId) {
        try {
          console.log('오류 발생 후 더미 추천 생성 시도')
          await saveDummyRecommendation(cId, qId)
        } catch (createErr: any) {
          console.error('더미 추천 생성 오류:', createErr)
          setError('추천 결과를 생성할 수 없습니다. 다시 시도해주세요.')
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
  }
  
  // 더미 추천 결과 저장
  const saveDummyRecommendation = async (cId: string, qId: string) => {
    try {
      console.log('더미 추천 결과 저장 시작:', { companyId: cId, questionnaireId: qId })
      
      const recommendationData: RecommendationInsert = {
        company_id: cId,
        questionnaire_id: qId,
        recommended_erp: '이카운트 ERP',
        reasons: {
          businessFit: '중소기업에 최적화된 클라우드 기반 ERP 시스템',
          costEfficiency: '비용 효율적인 가격 정책(구독형 모델)',
          userFriendly: '사용자 친화적 인터페이스로 빠른 적응 가능',
          integrationCapability: '회계, 영업, 재고 관리 모듈 연동 우수',
          score: {
            businessFit: 90,
            featureFit: 85,
            costEfficiency: 95
          }
        },
        setup_guide: `
# 이카운트 ERP 세팅 가이드

## 초기 설정 단계
1. 회사 정보 등록
2. 사용자 계정 생성 및 권한 설정
3. 부서 및 직원 정보 설정
4. 기초 코드 등록 (거래처, 품목, 계정과목 등)
5. 전표 양식 및 문서 양식 설정

## 주요 모듈 설정
- 회계 모듈: 회계 기수 설정, 계정 과목 설정
- 영업 모듈: 판매 단가 설정, 할인 정책 설정
- 재고 모듈: 창고 정보 등록, 재고 단위 설정

더 자세한 설정 가이드는 전문 컨설턴트의 도움을 받아 진행하시는 것을 권장합니다.
        `,
        created_at: new Date().toISOString()
      }
      
      console.log('저장할 추천 데이터:', JSON.stringify(recommendationData, null, 2))
      const result = await saveRecommendation(recommendationData)
      
      if (result.error) {
        console.error('Supabase 저장 오류:', result.error)
        throw result.error
      }
      
      // 저장 결과 검증
      if (!result.data || result.data.length === 0) {
        console.error('추천 데이터가 저장되었지만 반환된 데이터가 없습니다')
        throw new Error('추천 데이터 저장 결과가 반환되지 않았습니다')
      }
      
      console.log('더미 추천 결과 저장 성공:', result.data[0].id)
      
      // 저장된 결과로 상태 업데이트
      setRecommendation({
        id: result.data[0].id,
        recommended_erp: recommendationData.recommended_erp,
        reasons: recommendationData.reasons,
        setup_guide: recommendationData.setup_guide
      })
      setRecommendationId(result.data[0].id)
      setError(null) // 이전 오류가 있었다면 제거
    } catch (err: any) {
      const errorMsg = err.message || '추천 결과 저장 중 오류가 발생했습니다.'
      console.error('더미 추천 저장 실패:', errorMsg, err)
      setError(errorMsg)
      // 실패 시에도 추천 정보는 null로 설정하여 UI가 이를 처리할 수 있게 함
      setRecommendation(null)
      setRecommendationId(null)
    } finally {
      // 로딩 상태 종료
      setLoading(false)
    }
  }
  
  // 연락 요청 처리
  const handleContactRequest = async () => {
    if (!companyId || !recommendationId) {
      setError('필요한 정보가 없습니다. 이전 단계부터 진행해주세요.')
      return
    }
    
    if (!phone) {
      setError('연락 가능한 연락처를 입력해주세요.')
      return
    }
    
    setContactLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // 추가 정보에 연락처 정보를 포함시켜 저장
      const contactInfo = `연락처: ${phone}\n\n${additionalInfo}`;
      
      const contactData: ContactRequestInsert = {
        company_id: companyId,
        recommendation_id: recommendationId,
        additional_info: contactInfo,
        request_ip: window.location.hostname,
        created_at: new Date().toISOString(),
        status: 'pending'
      }
      
      const { error } = await saveContactRequest(contactData)
      
      if (error) {
        throw error
      }

      // 이메일 발송 시도 - 테스트 모드 사용
      console.log('이메일 발송 시도...');
      
      try {
        // 이메일 전송 API 엔드포인트를 통해 처리
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: 'yesnet@yesneterp.com',
            subject: '새로운 연락 요청이 있습니다',
            text: `새로운 연락 요청이 접수되었습니다.

회사 ID: ${companyId}
연락처: ${phone}
문의사항: ${additionalInfo || '(없음)'}`
          }),
        });
        
        const emailResult = await emailResponse.json();
        
        if (emailResponse.ok) {
          console.log('이메일 발송 성공:', emailResult);
          
          // 테스트 모드에서 제공하는 미리보기 URL이 있는 경우
          if (emailResult.previewUrl) {
            setSuccess(`연락 요청이 성공적으로 접수되었습니다. 테스트 모드에서 이메일이 발송되었습니다. 
            
이메일 확인: ${emailResult.previewUrl}`);
          } else {
            setSuccess('연락 요청이 성공적으로 접수되었습니다. 빠른 시일 내에 연락 드리겠습니다.');
          }
        } else {
          console.error('이메일 발송 실패:', emailResult);
          // 이메일 실패해도 사용자에게는 성공 메시지 표시
          setSuccess('연락 요청이 저장되었습니다. (이메일 발송 실패)');
        }
      } catch (emailError) {
        console.error('이메일 전송 프로세스 오류:', emailError);
        // 이메일 전송에 실패해도 사용자에게 성공 메시지 표시
        setSuccess('연락 요청이 저장되었습니다. (이메일 발송 오류)');
      }
      
      setAdditionalInfo('')
      setPhone('')
    } catch (err: any) {
      setError(err.message || '연락 요청 처리 중 오류가 발생했습니다.')
      console.error('연락 요청 오류:', err)
    } finally {
      setContactLoading(false)
    }
  }

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
    )
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
    )
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
  )
}
