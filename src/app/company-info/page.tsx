'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveCompanyInfo } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type CompanyInsert = Database['public']['Tables']['companies']['Insert']

export default function CompanyInfo() {
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<CompanyInsert, 'id' | 'created_at' | 'updated_at'>>({
    business_number: '',
    company_name: '',
    business_type: '',
    business_item: '',
    last_year_revenue: null,
    current_erp: null
  })
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [businessStatus, setBusinessStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  // 세션 스토리지에서 이전에 저장된 회사 ID가 있는지 확인
  useEffect(() => {
    const existingCompanyId = sessionStorage.getItem('companyId')
    if (existingCompanyId) {
      // 이미 등록된 회사가 있으면 질문지 페이지로 이동 여부 확인
      if (confirm('이미 등록된 회사 정보가 있습니다. 질문지 페이지로 이동하시겠습니까?')) {
        router.push('/questionnaire')
      } else {
        // 기존 정보 제거
        sessionStorage.removeItem('companyId')
      }
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    let updatedValue: string | number | null = value

    // 수치 필드 처리
    if (id === 'lastYearRevenue') {
      updatedValue = value ? parseInt(value) : null
    }

    // ID 값을 데이터베이스 컬럼명으로 변환
    const fieldMap: Record<string, keyof Omit<CompanyInsert, 'id' | 'created_at' | 'updated_at'>> = {
      businessNumber: 'business_number',
      companyName: 'company_name',
      businessType: 'business_type',
      businessItem: 'business_item',
      lastYearRevenue: 'last_year_revenue',
      currentERP: 'current_erp'
    }

    // 사업자번호 형식이 변경되면 검증 상태 초기화
    if (id === 'businessNumber') {
      setVerified(false)
      setBusinessStatus(null)
    }

    const field = fieldMap[id]
    if (field) {
      setFormData(prev => ({
        ...prev,
        [field]: updatedValue
      }))
    }
  }

  // 사업자번호 형식 검증
  const validateBusinessNumber = (number: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // 필수 필드 검증
      if (!formData.business_number || !formData.company_name || !formData.business_type || !formData.business_item) {
        throw new Error('필수 항목을 모두 입력해주세요.')
      }

      // 사업자번호 형식 검증
      if (!validateBusinessNumber(formData.business_number)) {
        throw new Error('사업자번호 형식이 올바르지 않습니다. 000-00-00000 형식으로 입력해주세요.')
      }

      // 사업자번호 검증이 되었는지 확인
      if (!verified) {
        throw new Error('사업자번호 검증을 먼저 완료해주세요.')
      }

      // Supabase에 데이터 저장
      const companyData: CompanyInsert = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: null
      }

      const { data, error } = await saveCompanyInfo(companyData)

      if (error) {
        throw error
      }

      // 저장된 회사 ID를 세션 스토리지에 저장
      if (data && data[0]) {
        sessionStorage.setItem('companyId', data[0].id)
        setSuccess(true)
        // 잠시 후 질문지 페이지로 이동
        setTimeout(() => {
          router.push('/questionnaire')
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message || '회사 정보 저장 중 오류가 발생했습니다.')
      console.error('회사 정보 저장 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">기업 정보 입력</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          회사 정보가 성공적으로 저장되었습니다. 잠시 후 질문지 페이지로 이동합니다.
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="businessNumber" className="block text-sm font-medium text-gray-700 mb-1">사업자번호</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                id="businessNumber" 
                placeholder="000-00-00000" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
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
          
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
            <input 
              type="text" 
              id="companyName" 
              placeholder="회사명을 입력하세요" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={formData.company_name}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">업태</label>
            <input 
              type="text" 
              id="businessType" 
              placeholder="예) 서비스업" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={formData.business_type}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div>
            <label htmlFor="businessItem" className="block text-sm font-medium text-gray-700 mb-1">종목</label>
            <input 
              type="text" 
              id="businessItem" 
              placeholder="예) 소프트웨어 개발" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={formData.business_item}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div>
            <label htmlFor="lastYearRevenue" className="block text-sm font-medium text-gray-700 mb-1">작년 매출액 (선택)</label>
            <input 
              type="number" 
              id="lastYearRevenue" 
              placeholder="단위: 백만원" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={formData.last_year_revenue || ''}
              onChange={handleChange}
              min="0"
            />
            <p className="mt-1 text-xs text-gray-500">단위: 백만원 (예: 1000 = 10억원)</p>
          </div>
          
          <div>
            <label htmlFor="currentERP" className="block text-sm font-medium text-gray-700 mb-1">현재 사용 중인 ERP (선택)</label>
            <select 
              id="currentERP" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.current_erp || ''}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="none">사용하지 않음</option>
              <option value="ecount">이카운트</option>
              <option value="douzone">더존비즈온</option>
              <option value="sap">SAP</option>
              <option value="oracle">Oracle ERP</option>
              <option value="microsoft">Microsoft Dynamics</option>
              <option value="custom">자체 개발 시스템</option>
              <option value="other">기타</option>
            </select>
          </div>
          
          <div className="flex justify-between pt-4">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              이전
            </Link>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              disabled={loading || !verified}
            >
              {loading ? '저장 중...' : '다음'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 