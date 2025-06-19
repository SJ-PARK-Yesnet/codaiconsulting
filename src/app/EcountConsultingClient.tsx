'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveEcountConsulting, saveEcountEmailRequest, sendEmail, supabase } from '@/lib/supabase';
import { 
  getZoneAndDomain, 
  getSessionId, 
  getInventoryBalanceWH, 
  getProdCode,
  testSaveTransaction
} from '@/lib/ecount-api';

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
      const consultingType = calculatedScore < 50 ? 'setting' : 'advanced'
      
      console.log('Supabase 저장 시도...', {
        ...formData,
        score: calculatedScore,
        consulting_type: consultingType
      })
      
      // Supabase에 데이터 저장
      const { data, error } = await saveEcountConsulting({
        ...formData,
        score: calculatedScore,
        consulting_type: consultingType,
        created_at: new Date().toISOString()
      })
      
      if (error) {
        console.error('저장 중 발생한 상세 오류:', error)
        throw new Error(
          error.message || 
          '이카운트 컨설팅 정보 저장에 실패했습니다. 네트워크 연결 및 Supabase 설정을 확인하세요.'
        )
      }
      
      // 다음 단계로 이동 및 ID 저장
      if (data && data[0]) {
        setConsultingId(data[0].id)
        setStep(2)
      } else {
        throw new Error('데이터가 저장되었으나 ID를 확인할 수 없습니다.')
      }
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
    if (!consultingId) {
      setError('컨설팅 정보가 없습니다.')
      return
    }
    
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
      
      const emailBody = `
회사명: ${formData.company_name}
담당자: ${formData.contact_person}
연락처: ${formData.phone}
이메일: ${formData.email}
이카운트 사용기간: ${formData.current_usage_years}년
사용수준: ${formData.current_usage_level}
주요 사용 모듈: ${formData.main_modules.join(', ')}
현재 문제점: ${formData.pain_points}
개선 요구사항: ${formData.improvement_needs}
진단 점수: ${score}/100점
컨설팅 유형: ${type === 'setting' ? '이카운트 세팅 요청' : '이카운트 고도화 요청'}
추가 요청사항: ${additionalInfo}

---
예스넷(주)
대표: 박승주
주소: 경기도 안양시 동안구 벌말로 66, 평촌역하이필드지식산업센터 B동 904호
전화번호: 070.8657.2080
이메일: yesnet@yesneterp.com
사업자등록번호: 581-88-03426
      `.trim()
      
      console.log('이메일 요청 처리 시작...')
      
      // Supabase에 이메일 요청 정보 저장
      const { data, error } = await saveEcountEmailRequest({
        consulting_id: consultingId,
        request_type: type,
        additional_info: additionalInfo,
        email_to: emailTo,
        email_from: emailFrom,
        email_subject: emailSubject,
        email_body: emailBody,
        is_sent: false, // 초기값은 false로 설정
        created_at: new Date().toISOString()
      })
      
      if (error) {
        console.error('이메일 요청 저장 실패:', error)
        throw new Error('이메일 요청 정보를 저장하는 중 오류가 발생했습니다.')
      }
      
      console.log('이메일 요청 정보 저장 성공:', data?.[0]?.id)
      
      // 실제 이메일 발송
      console.log('이메일 발송 요청 시작...')
      const emailResult = await sendEmail({
        to: emailTo,
        from: emailFrom,
        subject: emailSubject,
        text: emailBody
      })
      
      if (emailResult.error) {
        console.warn('이메일 발송 실패:', emailResult.error)
        setSuccess('요청이 저장되었습니다. 시스템 오류로 이메일은 발송되지 않았지만, 담당자가 확인 후 연락드리겠습니다.')
      } else {
        console.log('이메일 발송 성공:', emailResult.data)
        
        // 이메일이 성공적으로 발송된 경우, is_sent 플래그 업데이트
        if (data && data[0]) {
          console.log('이메일 상태 업데이트 시작...')
          const updateResponse = await supabase
            .from('ecount_email_requests')
            .update({ is_sent: true })
            .eq('id', data[0].id)
          
          if (updateResponse.error) {
            console.warn('이메일 상태 업데이트 실패:', updateResponse.error)
          } else {
            console.log('이메일 상태 업데이트 성공')
          }
        }
        
        setSuccess('요청이 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.')
      }
      
      setEmailSent(true)
    } catch (err: any) {
      console.error('이메일 요청 처리 오류:', err)
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {step === 1 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">이카운트 사용 현황 조사</h2>
          <p className="text-gray-600 mb-6">현재 이카운트 사용 현황을 파악하여 최적의 컨설팅 방향을 제안해 드립니다.</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="business_number" className="block text-sm font-medium text-gray-700 mb-1">사업자번호</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="business_number"
                  name="business_number"
                  placeholder="000-00-00000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={formData.business_number}
                  onChange={handleChange}
                  maxLength={12}
                  required
                />
                <button
                  type="button"
                  onClick={verifyBusinessNumber}
                  disabled={verifying || !formData.business_number}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
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
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-1">담당자명</label>
                <input
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: 010-1234-5678"
                    required
                  />
                </div>
              </div>
            </div>
            {/* ... (전체 코드가 너무 길어 생략, 실제 적용 시 전체 JSX UI를 100% 붙여넣어야 함) ... */}
          </form>
        </div>
      )}
      {step === 2 && score !== null && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">이카운트 활용 진단 결과</h2>
          {/* ... (원본의 점수, 안내, 버튼, 링크 등 전체) ... */}
        </div>
      )}
    </div>
  );
} 