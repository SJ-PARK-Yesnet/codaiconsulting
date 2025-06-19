"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveEcountConsulting, saveEcountEmailRequest, sendEmail, supabase } from '@/lib/supabase'
import { 
  getZoneAndDomain, 
  getSessionId, 
  getInventoryBalanceWH, 
  getProdCode,
  testSaveTransaction
} from '@/lib/ecount-api'

interface FormData {
  business_number: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  current_usage_years: number
  current_usage_level: string
  main_modules: string[]
  pain_points: string
  improvement_needs: string
  // 영업관리 질문
  sales_item_management: string
  sales_credit_management: string
  // 구매관리 질문
  purchase_item_management: string
  purchase_debt_management: string
  // 재고관리 질문
  inventory_accuracy: string
  // 회계관리 질문
  account_tax_invoice: string
  account_bank_data: string
  account_card_data: string
  account_purchase_invoice: string
  // 생산관리 질문
  production_item_management: string
  // 인사/급여관리 질문
  hr_payroll_management: string
  hr_vacation_management: string
}

export default function EcountConsultingClient() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [verified, setVerified] = useState(false)
    const [businessStatus, setBusinessStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [score, setScore] = useState<number | null>(null)
    const [consultingId, setConsultingId] = useState<string | null>(null)
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [emailType, setEmailType] = useState<'setting' | 'advanced' | null>(null)
    const [emailSent, setEmailSent] = useState(false)
    
    const [formData, setFormData] = useState<FormData>({
      business_number: '',
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      current_usage_years: 1,
      current_usage_level: '기본',
      main_modules: [],
      pain_points: '',
      improvement_needs: '',
      // 영업관리 질문 초기값
      sales_item_management: '아니오',
      sales_credit_management: '아니오',
      // 구매관리 질문 초기값
      purchase_item_management: '아니오',
      purchase_debt_management: '아니오',
      // 재고관리 질문 초기값
      inventory_accuracy: '30% 미만',
      // 회계관리 질문 초기값
      account_tax_invoice: '아니오',
      account_bank_data: '아니오',
      account_card_data: '아니오',
      account_purchase_invoice: '아니오',
      // 생산관리 질문 초기값
      production_item_management: '아니오',
      // 인사/급여관리 질문 초기값
      hr_payroll_management: '아니오',
      hr_vacation_management: '아니오'
    })
    
    const [connectResult, setConnectResult] = useState<{
      success: boolean;
      message: string;
      zone?: string;
      sessionId?: string;
    }>({ success: false, message: '' })
  
    // 폼 데이터 상태 관리
    const [credentials, setCredentials] = useState({
      companyCode: '',
      userId: '',
      apiKey: ''
    })
  
    // 테스트 결과
    const [testResults, setTestResults] = useState<{
      products: any[];
      inventory: any[];
    }>({
      products: [],
      inventory: []
    })
  
    // 점수 계산
    const [scores, setScores] = useState({
      apiConnection: 0,
      dataQuality: 0,
      functionality: 0,
      total: 0
    })
    
    // 사업자번호 형식 검증
    const validateBusinessNumber = (number: string): boolean => {
      const regex = /^\d{3}-\d{2}-\d{5}$/
      return regex.test(number)
    }
  
    // 사업자번호 검증 API 호출
    const verifyBusinessNumber = async () => {
      if (!formData.business_number) {
        setError('사업자번호를 입력해주세요.')
        return
      }
  
      if (!validateBusinessNumber(formData.business_number)) {
        setError('사업자번호 형식이 올바르지 않습니다. 000-00-00000 형식으로 입력해주세요.')
        return
      }
  
      setVerifying(true)
      setError(null)
  
      try {
        const response = await fetch('/api/business/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ businessNumber: formData.business_number }),
        })
  
        const data = await response.json()
  
        if (!response.ok) {
          throw new Error(data.error || '사업자번호 검증에 실패했습니다.')
        }
  
        if (!data.isValid) {
          setError('유효하지 않은 사업자번호입니다.')
          setVerified(false)
          return
        }
  
        if (!data.isActive) {
          setError(`해당 사업자번호는 현재 ${data.businessStatus || '정상 운영중이 아닙니다'}. 계속할 수 없습니다.`)
          setVerified(false)
          return
        }
  
        setVerified(true)
        setBusinessStatus(data.businessStatus)
        setError(null)
      } catch (err: any) {
        setError(err.message || '사업자번호 검증 중 오류가 발생했습니다.')
        console.error('사업자번호 검증 오류:', err)
        setVerified(false)
      } finally {
        setVerifying(false)
      }
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      
      // 사업자번호 변경 시 검증 상태 초기화
      if (name === 'business_number') {
        setVerified(false)
        setBusinessStatus(null)
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : 0
      }))
    }
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target
      setFormData(prev => {
        const modules = [...prev.main_modules]
        
        if (checked && !modules.includes(value)) {
          modules.push(value)
        } else if (!checked && modules.includes(value)) {
          const index = modules.indexOf(value)
          modules.splice(index, 1)
        }
        
        return {
          ...prev,
          main_modules: modules
        }
      })
    }
    
    const calculateScore = (): number => {
      let totalScore = 0
      
      // 사용 연수에 따른 점수 (1년 미만: 10점, 1-3년: 20점, 3년 이상: 30점)
      if (formData.current_usage_years < 1) {
        totalScore += 10
      } else if (formData.current_usage_years < 3) {
        totalScore += 20
      } else {
        totalScore += 30
      }
      
      // 사용 수준에 따른 점수 (기본: 10점, 중간: 25점, 고급: 40점)
      if (formData.current_usage_level === '기본') {
        totalScore += 10
      } else if (formData.current_usage_level === '중간') {
        totalScore += 25
      } else if (formData.current_usage_level === '고급') {
        totalScore += 40
      }
      
      // 모듈별 질문 점수 계산
      // 영업관리 모듈 점수
      if (formData.main_modules.includes('영업')) {
        // 기본 모듈 점수
        totalScore += 5
        
        // 품목 관리 질문
        if (formData.sales_item_management === '예') {
          totalScore += 3
        }
        
        // 채권 관리 질문
        if (formData.sales_credit_management === '예') {
          totalScore += 3
        }
      }
      
      // 구매관리 모듈 점수
      if (formData.main_modules.includes('구매')) {
        // 기본 모듈 점수
        totalScore += 5
        
        // 품목 관리 질문
        if (formData.purchase_item_management === '예') {
          totalScore += 3
        }
        
        // 채무 관리 질문
        if (formData.purchase_debt_management === '예') {
          totalScore += 3
        }
      }
      
      // 재고관리 모듈 점수
      if (formData.main_modules.includes('재고')) {
        // 기본 모듈 점수
        totalScore += 5
        
        // 재고 정확도 질문
        if (formData.inventory_accuracy === '90% 이상') {
          totalScore += 6
        } else if (formData.inventory_accuracy === '70~90%') {
          totalScore += 4
        } else if (formData.inventory_accuracy === '50~70%') {
          totalScore += 2
        } else if (formData.inventory_accuracy === '30~50%') {
          totalScore += 1
        }
      }
      
      // 회계관리 모듈 점수
      if (formData.main_modules.includes('회계')) {
        // 기본 모듈 점수
        totalScore += 5
        
        // 세금계산서 발행 질문
        if (formData.account_tax_invoice === '예') {
          totalScore += 2
        }
        
        // 통장 데이터 관리 질문
        if (formData.account_bank_data === '예') {
          totalScore += 2
        }
        
        // 카드 데이터 관리 질문
        if (formData.account_card_data === '예') {
          totalScore += 2
        }
        
        // 매입 세금계산서 관리 질문
        if (formData.account_purchase_invoice === '예') {
          totalScore += 2
        }
      }
      
      // 생산관리 모듈 점수
      if (formData.main_modules.includes('생산')) {
        // 기본 모듈 점수
        totalScore += 5
        
        // 생산 품목 관리 질문
        if (formData.production_item_management === '예') {
          totalScore += 5
        }
      }
      
      // 인사/급여관리 모듈 점수
      if (formData.main_modules.includes('인사')) {
        // 기본 모듈 점수
        totalScore += 5
        
        // 급여 관리 질문
        if (formData.hr_payroll_management === '예') {
          totalScore += 3
        }
        
        // 연차 관리 질문
        if (formData.hr_vacation_management === '예') {
          totalScore += 3
        }
      }
      
      return Math.min(totalScore, 100) // 최대 100점
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)
      
      try {
        // 필수 필드 확인
        if (!formData.business_number || !formData.company_name || !formData.contact_person || !formData.email || !formData.phone) {
          throw new Error('모든 필수 정보를 입력해주세요.')
        }
        
        // 사업자번호 형식 검증
        if (!validateBusinessNumber(formData.business_number)) {
          throw new Error('사업자번호 형식이 올바르지 않습니다. 000-00-00000 형식으로 입력해주세요.')
        }
        
        // 사업자번호 검증 확인
        if (!verified) {
          throw new Error('사업자번호 검증을 먼저 완료해주세요.')
        }
        
        // 이메일 형식 확인
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
          throw new Error('유효한 이메일 주소를 입력해주세요.')
        }
        
        // 점수 계산
        const calculatedScore = calculateScore()
        setScore(calculatedScore)
        
        // 컨설팅 유형 결정
        // const consultingType = calculatedScore < 50 ? 'setting' : 'advanced'
        // supabase 저장 없이 바로 다음 단계로 이동
        setStep(2)
      } catch (err: any) {
        console.error('이카운트 컨설팅 저장 오류:', err)
        setError(
          err.message || 
          '저장 중 오류가 발생했습니다. 네트워크 연결 및 관리자에게 문의하세요.'
        )
      } finally {
        setLoading(false)
      }
    }
    
    const handleEmailRequest = async (type: 'setting' | 'advanced') => {
      setEmailType(type)
      setLoading(true)
      setError(null)
      try {
        // 관리자 이메일 주소
        const emailTo = 'yesnet@yesneterp.com'
        // 사용자가 입력한 이메일 주소 (또는 기본 발신자 이메일)
        const emailFrom = formData.email
        const emailSubject = type === 'setting' 
          ? `[이카운트 세팅 요청] ${formData.company_name}`
          : `[이카운트 고도화 요청] ${formData.company_name}`
        const emailBody = `\n회사명: ${formData.company_name}\n담당자: ${formData.contact_person}\n연락처: ${formData.phone}\n이메일: ${formData.email}\n이카운트 사용기간: ${formData.current_usage_years}년\n사용수준: ${formData.current_usage_level}\n주요 사용 모듈: ${formData.main_modules.join(', ')}\n현재 문제점: ${formData.pain_points}\n개선 요구사항: ${formData.improvement_needs}\n진단 점수: ${score}/100점\n컨설팅 유형: ${type === 'setting' ? '이카운트 세팅 요청' : '이카운트 고도화 요청'}\n추가 요청사항: ${additionalInfo}\n---\n예스넷(주)\n대표: 박승주\n주소: 경기도 안양시 동안구 벌말로 66, 평촌역하이필드지식산업센터 B동 904호\n전화번호: 070.8657.2080\n이메일: yesnet@yesneterp.com\n사업자등록번호: 581-88-03426\n        `.trim()
        // 실제 이메일 발송
        const emailResult = await sendEmail({
          to: emailTo,
          from: 'yesnet@yesneterp.com',
          subject: emailSubject,
          text: emailBody
        })
        if (emailResult.error) {
          setSuccess('요청이 저장되었습니다. 시스템 오류로 이메일은 발송되지 않았지만, 담당자가 확인 후 연락드리겠습니다.')
        } else {
          setSuccess('요청이 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.')
        }
        setEmailSent(true)
      } catch (err: any) {
        setError(err.message || '이메일 요청 처리 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    
    // API 연결 테스트
    const testConnection = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError('')
      
      try {
        // 1. Zone API 호출
        const zoneResult = await getZoneAndDomain(credentials.companyCode)
        
        if (zoneResult.status === 'error') {
          throw new Error(`Zone API 오류: ${zoneResult.message}`)
        }
        
        const zone = zoneResult.zone
        
        // 2. 로그인 API 호출
        const sessionResult = await getSessionId(
          credentials.companyCode,
          credentials.userId,
          credentials.apiKey,
          zone
        )
        
        if (sessionResult.status === 'error') {
          throw new Error(`로그인 API 오류: ${sessionResult.message}`)
        }
        
        // 연결 성공 - 데이터 저장
        setConnectResult({
          success: true,
          message: '이카운트 API 연결에 성공했습니다!',
          zone: zone,
          sessionId: sessionResult.sessionId
        })
        
        // 점수 갱신 - API 연결 점수
        setScores(prev => ({
          ...prev,
          apiConnection: 40,
          total: prev.total + 40
        }))
        
        // 다음 단계로 이동
        setStep(2)
        
      } catch (err) {
        setConnectResult({
          success: false,
          message: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        })
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
  
    // 데이터 품질 테스트
    const testDataQuality = async () => {
      if (!connectResult.zone || !connectResult.sessionId) {
        setError('API 연결 정보가 없습니다. 다시 연결해주세요.')
        return
      }
      
      setLoading(true)
      setError('')
      
      try {
        // 1. 품목 데이터 조회
        const productsResult = await getProdCode(
          connectResult.sessionId,
          connectResult.zone
        )
        
        if (productsResult.status === 'error') {
          throw new Error(`품목 조회 오류: ${productsResult.message}`)
        }
        
        // 2. 재고 데이터 조회
        const inventoryResult = await getInventoryBalanceWH(
          connectResult.sessionId,
          connectResult.zone
        )
        
        if (inventoryResult.status === 'error') {
          throw new Error(`재고 조회 오류: ${inventoryResult.message}`)
        }
        
        // 3. 거래 데이터 테스트
        const transactionResult = await testSaveTransaction(
          connectResult.sessionId,
          connectResult.zone
        )
        
        if (transactionResult.status === 'error') {
          throw new Error(`거래 데이터 테스트 오류: ${transactionResult.message}`)
        }
        
        // 조회 결과 저장
        setTestResults({
          products: productsResult.results || [],
          inventory: inventoryResult.results || []
        })
        
        // 데이터 품질 점수 계산
        let dataQualityScore = 0
        
        // 품목 데이터 존재 여부
        if (productsResult.results && productsResult.results.length > 0) {
          dataQualityScore += 15
        }
        
        // 재고 데이터 존재 여부
        if (inventoryResult.results && inventoryResult.results.length > 0) {
          dataQualityScore += 15
        }
        
        // 거래 데이터 존재 여부
        if (transactionResult.status === 'success') {
          dataQualityScore += 10
        }
        
        // 점수 갱신
        setScores(prev => ({
          ...prev,
          dataQuality: dataQualityScore,
          total: prev.total - prev.dataQuality + dataQualityScore
        }))
        
        // 다음 단계로 이동
        setStep(3)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
  
    // 요구사항 선택 핸들러
    const handleRequirementSelection = (requirement: string) => {
      // 기능 요구사항 선택에 따른 점수 계산
      let functionalityScore = 0
      
      switch(requirement) {
        case 'basic':
          functionalityScore = 10
          break
        case 'intermediate':
          functionalityScore = 20
          break
        case 'advanced':
          functionalityScore = 30
          break
      }
      
      // 점수 갱신
      setScores(prev => ({
        ...prev,
        functionality: functionalityScore,
        total: prev.total - prev.functionality + functionalityScore
      }))
      
      // 결과 페이지로 이동
      setStep(4)
    }
  
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">예스넷(주) 이카운트 컨설팅</h1>
        <p className="text-gray-600 mb-6">전문적인 이카운트 ERP 컨설팅으로 귀사의 업무 효율성을 극대화하세요</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        
        {step === 1 && (
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">이카운트 사용 현황 조사</h2>
            <p className="text-gray-600 mb-6">현재 이카운트 사용 현황을 파악하여 최적의 컨설팅 방향을 제안해 드립니다.</p>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="business_number" className="block text-sm font-semibold text-gray-900 mb-2">사업자번호</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="business_number"
                    name="business_number"
                    placeholder="000-00-00000"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    value={formData.business_number}
                    onChange={handleChange}
                    maxLength={12}
                    required
                  />
                  <button
                    type="button"
                    onClick={verifyBusinessNumber}
                    disabled={verifying || !formData.business_number}
                    className="flex-shrink-0 px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {verifying ? '검증 중...' : '검증'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">형식: 000-00-00000</p>
                {verified && businessStatus && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ 확인 완료: {businessStatus}
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-semibold text-gray-900 mb-2">회사명</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contact_person" className="block text-sm font-semibold text-gray-900 mb-2">담당자명</label>
                  <input
                    type="text"
                    id="contact_person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">이메일</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">연락처</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="예: 010-1234-5678"
                    required
                  />
                </div>
              </div>
              
              <hr className="border-gray-200" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">이카운트 사용 현황</h3>
                
                <div>
                  <label htmlFor="current_usage_years" className="block text-sm font-semibold text-gray-900 mb-2">이카운트 사용 기간 (년)</label>
                  <input
                    type="number"
                    id="current_usage_years"
                    name="current_usage_years"
                    value={formData.current_usage_years}
                    onChange={handleNumberChange}
                    min="0"
                    max="30"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="current_usage_level" className="block text-sm font-semibold text-gray-900 mb-2">이카운트 사용 수준</label>
                  <select
                    id="current_usage_level"
                    name="current_usage_level"
                    value={formData.current_usage_level}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    required
                  >
                    <option value="기본">기본 (필수 기능만 사용)</option>
                    <option value="중간">중간 (일부 고급 기능 사용)</option>
                    <option value="고급">고급 (대부분의 기능 활용)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">주요 사용 모듈 (해당되는 항목 모두 선택)</label>
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2 bg-white mb-1">
                      <input
                        type="checkbox"
                        id="module-sales"
                        name="main_modules"
                        value="영업"
                        checked={formData.main_modules.includes('영업')}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label htmlFor="module-sales" className="text-sm text-gray-700">영업 관리</label>
                    </div>
                    
                    {/* 영업 관리 모듈 선택 시 추가 질문 */}
                    {formData.main_modules.includes('영업') && (
                      <div className="ml-6 mt-2 p-3 bg-gray-50 rounded-md space-y-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">판매된 품목 또는 서비스에 대해 수량, 단가 등을 정확히 입력하고 관리하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="sales_item_yes"
                                name="sales_item_management"
                                value="예"
                                checked={formData.sales_item_management === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="sales_item_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="sales_item_no"
                                name="sales_item_management"
                                value="아니오"
                                checked={formData.sales_item_management === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="sales_item_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">채권(받아야하는 돈)관리를 이카운트 통해서 하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="sales_credit_yes"
                                name="sales_credit_management"
                                value="예"
                                checked={formData.sales_credit_management === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="sales_credit_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="sales_credit_no"
                                name="sales_credit_management"
                                value="아니오"
                                checked={formData.sales_credit_management === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="sales_credit_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center px-3 py-2 bg-white mb-1">
                      <input
                        type="checkbox"
                        id="module-purchase"
                        name="main_modules"
                        value="구매"
                        checked={formData.main_modules.includes('구매')}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label htmlFor="module-purchase" className="text-sm text-gray-700">구매 관리</label>
                    </div>
                    
                    {/* 구매 관리 모듈 선택 시 추가 질문 */}
                    {formData.main_modules.includes('구매') && (
                      <div className="ml-6 mt-2 p-3 bg-gray-50 rounded-md space-y-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">구매된 품목 또는 서비스에 대해 수량, 단가 등을 정확히 입력하고 관리하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="purchase_item_yes"
                                name="purchase_item_management"
                                value="예"
                                checked={formData.purchase_item_management === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="purchase_item_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="purchase_item_no"
                                name="purchase_item_management"
                                value="아니오"
                                checked={formData.purchase_item_management === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="purchase_item_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">채무(줘야하는 돈)관리를 이카운트 통해서 하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="purchase_debt_yes"
                                name="purchase_debt_management"
                                value="예"
                                checked={formData.purchase_debt_management === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="purchase_debt_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="purchase_debt_no"
                                name="purchase_debt_management"
                                value="아니오"
                                checked={formData.purchase_debt_management === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="purchase_debt_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center px-3 py-2 bg-white mb-1">
                      <input
                        type="checkbox"
                        id="module-inventory"
                        name="main_modules"
                        value="재고"
                        checked={formData.main_modules.includes('재고')}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label htmlFor="module-inventory" className="text-sm text-gray-700">재고 관리</label>
                    </div>
                    
                    {/* 재고 관리 모듈 선택 시 추가 질문 */}
                    {formData.main_modules.includes('재고') && (
                      <div className="ml-6 mt-2 p-3 bg-gray-50 rounded-md space-y-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">실제 재고와 이카운트 재고가 몇% 일치하시나요?</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="inventory_90"
                              name="inventory_accuracy"
                              value="90% 이상"
                              checked={formData.inventory_accuracy === '90% 이상'}
                              onChange={handleChange}
                              className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                            />
                            <label htmlFor="inventory_90" className="ml-2 text-base font-medium text-gray-900">90% 이상</label>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="inventory_70"
                            name="inventory_accuracy"
                            value="70~90%"
                            checked={formData.inventory_accuracy === '70~90%'}
                            onChange={handleChange}
                            className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                          />
                          <label htmlFor="inventory_70" className="ml-2 text-base font-medium text-gray-900">70~90%</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="inventory_50"
                            name="inventory_accuracy"
                            value="50~70%"
                            checked={formData.inventory_accuracy === '50~70%'}
                            onChange={handleChange}
                            className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                          />
                          <label htmlFor="inventory_50" className="ml-2 text-base font-medium text-gray-900">50~70%</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="inventory_30"
                            name="inventory_accuracy"
                            value="30~50%"
                            checked={formData.inventory_accuracy === '30~50%'}
                            onChange={handleChange}
                            className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                          />
                          <label htmlFor="inventory_30" className="ml-2 text-base font-medium text-gray-900">30~50%</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="inventory_less30"
                            name="inventory_accuracy"
                            value="30% 미만"
                            checked={formData.inventory_accuracy === '30% 미만'}
                            onChange={handleChange}
                            className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                          />
                          <label htmlFor="inventory_less30" className="ml-2 text-base font-medium text-gray-900">30% 미만</label>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center px-3 py-2 bg-white mb-1">
                      <input
                        type="checkbox"
                        id="module-accounting"
                        name="main_modules"
                        value="회계"
                        checked={formData.main_modules.includes('회계')}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label htmlFor="module-accounting" className="text-sm text-gray-700">회계 관리</label>
                    </div>
                    
                    {/* 회계 관리 모듈 선택 시 추가 질문 */}
                    {formData.main_modules.includes('회계') && (
                      <div className="ml-6 mt-2 p-3 bg-gray-50 rounded-md space-y-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">세금계산서를 이카운트에서 발행하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="account_tax_yes"
                                name="account_tax_invoice"
                                value="예"
                                checked={formData.account_tax_invoice === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="account_tax_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="account_tax_no"
                                name="account_tax_invoice"
                                value="아니오"
                                checked={formData.account_tax_invoice === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="account_tax_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">실제 통장데이터를 이카운트에서 확인하고 전표처리하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="account_bank_yes"
                                name="account_bank_data"
                                value="예"
                                checked={formData.account_bank_data === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="account_bank_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="account_bank_no"
                                name="account_bank_data"
                                value="아니오"
                                checked={formData.account_bank_data === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="account_bank_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">실제 카드데이터를 이카운트에서 확인하고 전표처리하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="account_card_yes"
                                name="account_card_data"
                                value="예"
                                checked={formData.account_card_data === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="account_card_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="account_card_no"
                                name="account_card_data"
                                value="아니오"
                                checked={formData.account_card_data === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="account_card_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">발행받은 매입세금계산서를 이카운트에서 확인하고 전표처리하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="account_purchase_yes"
                                name="account_purchase_invoice"
                                value="예"
                                checked={formData.account_purchase_invoice === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="account_purchase_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="account_purchase_no"
                                name="account_purchase_invoice"
                                value="아니오"
                                checked={formData.account_purchase_invoice === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="account_purchase_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center px-3 py-2 bg-white mb-1">
                      <input
                        type="checkbox"
                        id="module-production"
                        name="main_modules"
                        value="생산"
                        checked={formData.main_modules.includes('생산')}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label htmlFor="module-production" className="text-sm text-gray-700">생산 관리</label>
                    </div>
                    
                    {/* 생산 관리 모듈 선택 시 추가 질문 */}
                    {formData.main_modules.includes('생산') && (
                      <div className="ml-6 mt-2 p-3 bg-gray-50 rounded-md space-y-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">생산한 품목과 소모된 품목의 수량을 정확히 입력하고 관리하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="production_item_yes"
                                name="production_item_management"
                                value="예"
                                checked={formData.production_item_management === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="production_item_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="production_item_no"
                                name="production_item_management"
                                value="아니오"
                                checked={formData.production_item_management === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="production_item_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center px-3 py-2 bg-white mb-1">
                      <input
                        type="checkbox"
                        id="module-hr"
                        name="main_modules"
                        value="인사"
                        checked={formData.main_modules.includes('인사')}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label htmlFor="module-hr" className="text-sm text-gray-700">인사/급여 관리</label>
                    </div>
                    
                    {/* 인사/급여 관리 모듈 선택 시 추가 질문 */}
                    {formData.main_modules.includes('인사') && (
                      <div className="ml-6 mt-2 p-3 bg-gray-50 rounded-md space-y-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">급여대장 또는 급여명세서를 이카운트를 통해 생성 또는 발송하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="hr_payroll_yes"
                                name="hr_payroll_management"
                                value="예"
                                checked={formData.hr_payroll_management === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="hr_payroll_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="hr_payroll_no"
                                name="hr_payroll_management"
                                value="아니오"
                                checked={formData.hr_payroll_management === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="hr_payroll_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">연차관리를 이카운트를 통해 하고 계신가요?</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="hr_vacation_yes"
                                name="hr_vacation_management"
                                value="예"
                                checked={formData.hr_vacation_management === '예'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="hr_vacation_yes" className="ml-2 text-base font-medium text-gray-900">예</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="hr_vacation_no"
                                name="hr_vacation_management"
                                value="아니오"
                                checked={formData.hr_vacation_management === '아니오'}
                                onChange={handleChange}
                                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 checked:ring-2 checked:ring-blue-200 transition"
                              />
                              <label htmlFor="hr_vacation_no" className="ml-2 text-base font-medium text-gray-900">아니오</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="pain_points" className="block text-sm font-medium text-gray-700 mb-1">현재 이카운트 사용 시 어려운 점</label>
                  <textarea
                    id="pain_points"
                    name="pain_points"
                    value={formData.pain_points}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="예: 재고 관리와 회계 모듈 연동이 어렵습니다."
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="improvement_needs" className="block text-sm font-medium text-gray-700 mb-1">개선되었으면 하는 점</label>
                  <textarea
                    id="improvement_needs"
                    name="improvement_needs"
                    value={formData.improvement_needs}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="예: 맞춤형 보고서를 생성하고 싶습니다."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  취소
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {loading ? '분석 중...' : '진단 결과 보기'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {step === 2 && score !== null && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">이카운트 활용 진단 결과</h2>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">이카운트 활용 점수</span>
                <span className="text-sm font-medium text-gray-700">{score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${score < 50 ? 'bg-yellow-500' : 'bg-green-600'}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {score < 50 ? '기본 세팅이 필요합니다!' : '고도화를 통한 업그레이드가 가능합니다!'}
              </h3>
              <p className="text-gray-600">
                {score < 50 
                  ? '현재 이카운트의 기본 기능만 사용하고 계신 것으로 보입니다. 적절한 세팅을 통해 업무 효율성을 크게 향상시킬 수 있습니다.'
                  : '이카운트를 잘 활용하고 계시지만, 추가적인 고도화를 통해 더 많은 이점을 얻을 수 있습니다.'}
              </p>
            </div>
            
            {emailSent ? (
              <div className="text-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">요청이 성공적으로 전송되었습니다!</h3>
                <p className="text-gray-600 mb-4">전문 컨설턴트가 검토 후 빠른 시일 내에 연락드리겠습니다.</p>
                <Link href="/" className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out inline-block mt-2">
                  홈으로 돌아가기
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700 mb-1">추가 요청사항 (선택)</label>
                  <textarea
                    id="additional_info"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="컨설턴트에게 전달할 추가 요청사항이 있으면 입력해주세요."
                  ></textarea>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  {score < 50 ? (
                    <button
                      onClick={() => handleEmailRequest('setting')}
                      disabled={loading}
                      className="px-6 py-3 text-base font-medium text-white bg-yellow-500 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-150 ease-in-out"
                    >
                      {loading ? '처리 중...' : '이카운트 세팅 요청하기'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEmailRequest('advanced')}
                      disabled={loading}
                      className="px-6 py-3 text-base font-medium text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
                    >
                      {loading ? '처리 중...' : '이카운트 고도화하기'}
                    </button>
                  )}
                  
                  <Link href="/" className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out text-center">
                    홈으로 돌아가기
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    )
  } 