"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveQuestionnaire } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type QuestionnaireInsert = Database['public']['Tables']['questionnaires']['Insert'];
type CommonAnswers = {
  systemDescription: string;
  historyManagement: string;
  wantEcount: string;
  needIntegration: string;
  userCount?: number;
  dataVolume?: string;
  specialRequirements?: string;
};

export default function Questionnaire() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<string>('common')
    const [companyId, setCompanyId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)
    
    // 질문지 응답 상태
    const [formData, setFormData] = useState<{
      common: CommonAnswers
      sales: Record<string, any>
      purchase: Record<string, any>
      production: Record<string, any>
      accounting: Record<string, any>
      management: Record<string, any>
      [key: string]: any // 인덱스 시그니처 추가
    }>({
      common: {
        systemDescription: '',
        historyManagement: '',
        wantEcount: '',
        needIntegration: '',
        userCount: undefined,
        dataVolume: '',
        specialRequirements: ''
      },
      sales: {},
      purchase: {},
      production: {},
      accounting: {},
      management: {}
    })
    
    // 회사 ID 가져오기
    useEffect(() => {
      const id = sessionStorage.getItem('companyId')
      if (!id) {
        setError('회사 정보가 없습니다. 회사 정보를 먼저 입력해주세요.')
        // 3초 후 회사 정보 페이지로 이동
        const timer = setTimeout(() => {
          router.push('/company-info')
        }, 3000)
        return () => clearTimeout(timer)
      } else {
        setCompanyId(id)
      }
    }, [router])
    
    const handleTabChange = (tab: string) => {
      setActiveTab(tab)
    }
    
    // 다음 탭으로 이동하는 함수 추가
    const goToNextTab = () => {
      const tabs = ['common', 'sales', 'purchase', 'production', 'accounting', 'management']
      const currentIndex = tabs.indexOf(activeTab)
      
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1])
      }
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      const tabData = { ...formData[activeTab as keyof typeof formData] }
      
      // 숫자 필드 처리
      if (name === 'userCount') {
        // 숫자 타입으로 변환
        const numericValue = value ? parseInt(value, 10) : undefined
        tabData[name] = numericValue
      } else {
        tabData[name] = value
      }
      
      setFormData(prev => ({
        ...prev,
        [activeTab]: tabData
      }))
    }
    
    const validateForm = (): boolean => {
      // 공통 탭의 필수 필드 검증
      if (activeTab === 'common') {
        if (!formData.common.systemDescription) {
          setError('현재 사용 중인 시스템에 대해 설명해 주세요.')
          return false
        }
        if (!formData.common.historyManagement) {
          setError('히스토리 관리 요구사항 여부를 선택해주세요.')
          return false
        }
        if (!formData.common.wantEcount) {
          setError('이카운트 ERP 사용 여부를 선택해주세요.')
          return false
        }
        if (!formData.common.needIntegration) {
          setError('서비스 연동 여부를 선택해주세요.')
          return false
        }
      }
      return true
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!companyId) {
        setError('회사 정보가 없습니다. 회사 정보를 먼저 입력해주세요.')
        return
      }
      
      // 폼 유효성 검사
      if (!validateForm()) {
        return
      }
      
      // 마지막 탭(관리)인 경우에만 제출 처리
      if (String(activeTab) === 'management') {
        setLoading(true)
        setError(null)
        
        try {
          // Supabase에 질문지 응답 저장
          const questionnaireData: QuestionnaireInsert = {
            company_id: companyId,
            common_answers: formData.common,
            sales_answers: formData.sales,
            purchase_answers: formData.purchase,
            production_answers: formData.production,
            accounting_answers: formData.accounting,
            management_answers: formData.management,
            created_at: new Date().toISOString(),
            updated_at: null
          }
          
          const { data, error } = await saveQuestionnaire(questionnaireData)
          
          if (error) {
            throw error
          }
          
          // 저장된 질문지 ID 세션 스토리지에 저장
          if (data && data[0]) {
            sessionStorage.setItem('questionnaireId', data[0].id)
            setSuccess(true)
            
            // 잠시 후 추천 결과 페이지로 이동
            setTimeout(() => {
              router.push('/recommendation')
            }, 1500)
          }
        } catch (err: any) {
          setError(err.message || '질문지 저장 중 오류가 발생했습니다.')
          console.error('질문지 저장 오류:', err)
        } finally {
          setLoading(false)
        }
      } else {
        // 마지막 탭이 아닌 경우 다음 탭으로 이동
        goToNextTab()
      }
    }
    
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">사전질문지</h2>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-6" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg mb-6" role="alert">
              질문지가 성공적으로 저장되었습니다. 잠시 후 추천 결과 페이지로 이동합니다.
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${String(activeTab) === 'common' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handleTabChange('common')}
              >
                공통/기술
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${String(activeTab) === 'sales' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handleTabChange('sales')}
              >
                영업
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${String(activeTab) === 'purchase' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handleTabChange('purchase')}
              >
                구매
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${String(activeTab) === 'production' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handleTabChange('production')}
              >
                생산
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${String(activeTab) === 'accounting' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handleTabChange('accounting')}
              >
                회계
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${String(activeTab) === 'management' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handleTabChange('management')}
              >
                관리
              </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              {String(activeTab) === 'common' && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">공통/기술 영역</h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="systemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        기존에 사용하고 계신 시스템에 대해 설명해 주세요.
                      </label>
                      <textarea 
                        id="systemDescription"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                        name="systemDescription"
                        value={formData.common.systemDescription}
                        onChange={handleChange}
                        placeholder="현재 사용 중인 시스템의 장단점, 불편한 점 등을 자유롭게 기술해 주세요."
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">기업 내 사용자 수와 히스토리 관리 요구사항이 있으신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="historyManagement" 
                            value="yes" 
                            checked={formData.common.historyManagement === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                            required
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="historyManagement" 
                            value="no" 
                            checked={formData.common.historyManagement === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
                    
                    {formData.common.historyManagement === 'yes' && (
                      <div>
                        <label htmlFor="userCount" className="block text-sm font-medium text-gray-700 mb-1">
                          사용자 수 (명)
                        </label>
                        <input 
                          type="number" 
                          id="userCount"
                          name="userCount"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={formData.common.userCount || ''}
                          onChange={handleChange}
                          min="1"
                          placeholder="예: 10"
                        />
                      </div>
                    )}
                    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">이카운트 ERP 사용을 원하시나요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="wantEcount" 
                            value="yes" 
                            checked={formData.common.wantEcount === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                            required
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="wantEcount" 
                            value="no" 
                            checked={formData.common.wantEcount === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="wantEcount" 
                            value="unknown" 
                            checked={formData.common.wantEcount === 'unknown'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>잘 모르겠음</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">재고관리, 회계관리 등 서로 연동해서 사용해야 할까요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needIntegration" 
                            value="yes" 
                            checked={formData.common.needIntegration === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                            required
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needIntegration" 
                            value="no" 
                            checked={formData.common.needIntegration === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needIntegration" 
                            value="partial" 
                            checked={formData.common.needIntegration === 'partial'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>부분적으로</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="dataVolume" className="block text-sm font-medium text-gray-700 mb-1">
                        예상되는 데이터 양은 얼마나 되나요? (선택)
                      </label>
                      <select 
                        id="dataVolume"
                        name="dataVolume"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.common.dataVolume || ''}
                        onChange={handleChange}
                      >
                        <option value="">선택하세요</option>
                        <option value="small">소량 (월 1,000건 미만)</option>
                        <option value="medium">중간 (월 1,000~10,000건)</option>
                        <option value="large">대량 (월 10,000건 이상)</option>
                        <option value="very_large">매우 대량 (월 100,000건 이상)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                        특별한 요구사항이 있으신가요? (선택)
                      </label>
                      <textarea 
                        id="specialRequirements"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                        name="specialRequirements"
                        value={formData.common.specialRequirements || ''}
                        onChange={handleChange}
                        placeholder="추가적인 요구사항이나 특별히 고려해야 할 사항이 있다면 작성해 주세요."
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Link href="/company-info" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        이전
                      </Link>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        {loading ? '저장 중...' : String(activeTab) === 'management' ? '제출' : '다음'}
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              {String(activeTab) === 'sales' && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">영업 관리 영역</h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">프로젝트별 견적/수주/납품/매출 관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needProjectManagement" 
                            value="yes" 
                            checked={formData.sales.needProjectManagement === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needProjectManagement" 
                            value="no" 
                            checked={formData.sales.needProjectManagement === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">영업사원별 실적관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="salesPerformance" 
                            value="yes" 
                            checked={formData.sales.salesPerformance === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="salesPerformance" 
                            value="no" 
                            checked={formData.sales.salesPerformance === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">고객관리(CRM) 기능이 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needCRM" 
                            value="yes" 
                            checked={formData.sales.needCRM === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needCRM" 
                            value="partial" 
                            checked={formData.sales.needCRM === 'partial'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>부분적으로 필요</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needCRM" 
                            value="no" 
                            checked={formData.sales.needCRM === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">거래처별 단가관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="customerPriceManagement" 
                            value="yes" 
                            checked={formData.sales.customerPriceManagement === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="customerPriceManagement" 
                            value="no" 
                            checked={formData.sales.customerPriceManagement === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <label htmlFor="salesNotes" className="block text-sm font-medium text-gray-700 mb-1">
                        기타 영업관리에 필요한 요구사항이 있으신가요? (선택)
                      </label>
                      <textarea 
                        id="salesNotes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                        name="salesNotes"
                        value={formData.sales.salesNotes || ''}
                        onChange={handleChange}
                        placeholder="기타 영업관리에 필요한 요구사항을 자유롭게 기술해 주세요."
                      ></textarea>
                    </div>
    
                    <div className="flex justify-between pt-4">
                      <Link href="/company-info" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        이전
                      </Link>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        {loading ? '저장 중...' : '다음'}
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              {String(activeTab) === 'purchase' && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">구매 관리 영역</h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">발주/검수/입고관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needPurchaseManagement" 
                            value="complete" 
                            checked={formData.purchase.needPurchaseManagement === 'complete'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>전체 필요</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needPurchaseManagement" 
                            value="partial" 
                            checked={formData.purchase.needPurchaseManagement === 'partial'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>일부 필요</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needPurchaseManagement" 
                            value="no" 
                            checked={formData.purchase.needPurchaseManagement === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>필요 없음</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">구매요청/결재기능이 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="purchaseApproval" 
                            value="yes" 
                            checked={formData.purchase.purchaseApproval === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="purchaseApproval" 
                            value="no" 
                            checked={formData.purchase.purchaseApproval === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">자동발주 기능이 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="automaticPurchase" 
                            value="yes" 
                            checked={formData.purchase.automaticPurchase === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="automaticPurchase" 
                            value="no" 
                            checked={formData.purchase.automaticPurchase === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <label htmlFor="purchaseNotes" className="block text-sm font-medium text-gray-700 mb-1">
                        기타 구매관리에 필요한 요구사항이 있으신가요? (선택)
                      </label>
                      <textarea 
                        id="purchaseNotes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                        name="purchaseNotes"
                        value={formData.purchase.purchaseNotes || ''}
                        onChange={handleChange}
                        placeholder="기타 구매관리에 필요한 요구사항을 자유롭게 기술해 주세요."
                      ></textarea>
                    </div>
    
                    <div className="flex justify-between pt-4">
                      <Link href="/company-info" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        이전
                      </Link>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        {loading ? '저장 중...' : '다음'}
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              {String(activeTab) === 'production' && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">생산 관리 영역</h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">BOM(자재명세서) 관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needBOM" 
                            value="yes" 
                            checked={formData.production.needBOM === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needBOM" 
                            value="no" 
                            checked={formData.production.needBOM === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">작업지시/공정관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="workOrderManagement" 
                            value="complete" 
                            checked={formData.production.workOrderManagement === 'complete'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>전체 필요</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="workOrderManagement" 
                            value="partial" 
                            checked={formData.production.workOrderManagement === 'partial'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>일부 필요</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="workOrderManagement" 
                            value="no" 
                            checked={formData.production.workOrderManagement === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>필요 없음</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">생산원가 집계가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="productionCost" 
                            value="yes" 
                            checked={formData.production.productionCost === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="productionCost" 
                            value="no" 
                            checked={formData.production.productionCost === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">품질관리(QC) 기능이 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="qualityControl" 
                            value="yes" 
                            checked={formData.production.qualityControl === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="qualityControl" 
                            value="no" 
                            checked={formData.production.qualityControl === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <label htmlFor="productionNotes" className="block text-sm font-medium text-gray-700 mb-1">
                        기타 생산관리에 필요한 요구사항이 있으신가요? (선택)
                      </label>
                      <textarea 
                        id="productionNotes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                        name="productionNotes"
                        value={formData.production.productionNotes || ''}
                        onChange={handleChange}
                        placeholder="기타 생산관리에 필요한 요구사항을 자유롭게 기술해 주세요."
                      ></textarea>
                    </div>
    
                    <div className="flex justify-between pt-4">
                      <Link href="/company-info" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        이전
                      </Link>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        {loading ? '저장 중...' : '다음'}
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              {String(activeTab) === 'accounting' && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">회계 관리 영역</h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">회계전표 관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needAccountingSlip" 
                            value="yes" 
                            checked={formData.accounting.needAccountingSlip === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="needAccountingSlip" 
                            value="no" 
                            checked={formData.accounting.needAccountingSlip === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">세금계산서/현금영수증 관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="taxInvoiceManagement" 
                            value="yes" 
                            checked={formData.accounting.taxInvoiceManagement === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="taxInvoiceManagement" 
                            value="no" 
                            checked={formData.accounting.taxInvoiceManagement === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">매입/매출 전자세금계산서 연동이 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="electronicTaxInvoice" 
                            value="yes" 
                            checked={formData.accounting.electronicTaxInvoice === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="electronicTaxInvoice" 
                            value="no" 
                            checked={formData.accounting.electronicTaxInvoice === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">금융기관 계좌 연동이 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="bankAccountIntegration" 
                            value="yes" 
                            checked={formData.accounting.bankAccountIntegration === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="bankAccountIntegration" 
                            value="no" 
                            checked={formData.accounting.bankAccountIntegration === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">고정자산 관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="fixedAssetManagement" 
                            value="yes" 
                            checked={formData.accounting.fixedAssetManagement === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="fixedAssetManagement" 
                            value="no" 
                            checked={formData.accounting.fixedAssetManagement === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">세금 신고를 직접 진행하시나요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="directTaxFiling"
                            value="yes"
                            checked={formData.accounting.directTaxFiling === 'yes'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="directTaxFiling"
                            value="no"
                            checked={formData.accounting.directTaxFiling === 'no'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">자체기장을 하고 계신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="selfBookkeeping"
                            value="yes"
                            checked={formData.accounting.selfBookkeeping === 'yes'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="selfBookkeeping"
                            value="no"
                            checked={formData.accounting.selfBookkeeping === 'no'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <label htmlFor="accountingNotes" className="block text-sm font-medium text-gray-700 mb-1">
                        기타 회계관리에 필요한 요구사항이 있으신가요? (선택)
                      </label>
                      <textarea 
                        id="accountingNotes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                        name="accountingNotes"
                        value={formData.accounting.accountingNotes || ''}
                        onChange={handleChange}
                        placeholder="기타 회계관리에 필요한 요구사항을 자유롭게 기술해 주세요."
                      ></textarea>
                    </div>
    
                    <div className="flex justify-between pt-4">
                      <Link href="/company-info" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        이전
                      </Link>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        {loading ? '저장 중...' : '다음'}
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              {String(activeTab) === 'management' && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">경영 관리 영역</h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">인사급여 관리가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="hrManagement" 
                            value="yes" 
                            checked={formData.management.hrManagement === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="hrManagement" 
                            value="no" 
                            checked={formData.management.hrManagement === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">전자결재 시스템이 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="electronicApproval" 
                            value="yes" 
                            checked={formData.management.electronicApproval === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="electronicApproval" 
                            value="no" 
                            checked={formData.management.electronicApproval === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">경영자를 위한 대시보드가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="executiveDashboard" 
                            value="yes" 
                            checked={formData.management.executiveDashboard === 'yes'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>예</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="executiveDashboard" 
                            value="no" 
                            checked={formData.management.executiveDashboard === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>아니오</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">권한관리 수준은 어느 정도가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="permissionLevel" 
                            value="simple" 
                            checked={formData.management.permissionLevel === 'simple'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>단순한 사용자/관리자 구분만 필요</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="permissionLevel" 
                            value="department" 
                            checked={formData.management.permissionLevel === 'department'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>부서별 권한 관리 필요</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="permissionLevel" 
                            value="detailed" 
                            checked={formData.management.permissionLevel === 'detailed'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>메뉴/기능별 세부 권한 관리 필요</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">보고서 및 분석 도구가 필요하신가요?</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="reportingTools" 
                            value="basic" 
                            checked={formData.management.reportingTools === 'basic'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>기본 보고서만 필요</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="reportingTools" 
                            value="advanced" 
                            checked={formData.management.reportingTools === 'advanced'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>고급 분석 및 커스텀 보고서 필요</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="reportingTools" 
                            value="no" 
                            checked={formData.management.reportingTools === 'no'}
                            onChange={handleChange}
                            className="mr-2" 
                          />
                          <span>필요 없음</span>
                        </label>
                      </div>
                    </div>
    
                    <div>
                      <label htmlFor="managementNotes" className="block text-sm font-medium text-gray-700 mb-1">
                        기타 경영관리에 필요한 요구사항이 있으신가요? (선택)
                      </label>
                      <textarea 
                        id="managementNotes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                        name="managementNotes"
                        value={formData.management.managementNotes || ''}
                        onChange={handleChange}
                        placeholder="기타 경영관리에 필요한 요구사항을 자유롭게 기술해 주세요."
                      ></textarea>
                    </div>
    
                    <div className="flex justify-between pt-4">
                      <Link href="/company-info" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        이전
                      </Link>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        {loading ? '저장 중...' : '다음'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } 