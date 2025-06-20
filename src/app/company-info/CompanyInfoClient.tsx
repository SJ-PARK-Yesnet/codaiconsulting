"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveCompanyInfo } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type CompanyInsert = Database['public']['Tables']['companies']['Insert'];

export default function CompanyInfoClient() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<CompanyInsert, 'id' | 'created_at' | 'updated_at'>>({
    business_number: '',
    company_name: '',
    business_type: '',
    business_item: '',
    last_year_revenue: null,
    current_erp: null
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [businessStatus, setBusinessStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const existingCompanyId = sessionStorage.getItem('companyId');
    if (existingCompanyId) {
      if (confirm('이미 등록된 회사 정보가 있습니다. 질문지 페이지로 이동하시겠습니까?')) {
        router.push('/questionnaire');
      } else {
        sessionStorage.removeItem('companyId');
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    let updatedValue: string | number | null = value;
    
    if (id === 'lastYearRevenue') {
      updatedValue = value ? parseInt(value) : null;
    } else if (id === 'businessNumber') {
      // 숫자만 남기고 모든 문자 제거
      updatedValue = value.replace(/[^0-9]/g, '');
      setVerified(false);
      setBusinessStatus(null);
    }
    
    const fieldMap: Record<string, keyof Omit<CompanyInsert, 'id' | 'created_at' | 'updated_at'>> = {
      businessNumber: 'business_number',
      companyName: 'company_name',
      businessType: 'business_type',
      businessItem: 'business_item',
      lastYearRevenue: 'last_year_revenue',
      currentERP: 'current_erp'
    };
    
    const field = fieldMap[id];
    if (field) {
      setFormData(prev => ({
        ...prev,
        [field]: updatedValue
      }));
    }
  };

  const validateBusinessNumber = (number: string) => {
    // 숫자 10자리인지 검증
    const regex = /^\d{10}$/;
    return regex.test(number);
  };

  const verifyBusinessNumber = async () => {
    if (!formData.business_number) {
      setError('사업자번호를 입력해주세요.');
      return;
    }
    if (!validateBusinessNumber(formData.business_number)) {
      setError('사업자번호 10자리를 정확히 입력해주세요.');
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const response = await fetch('/api/business/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessNumber: formData.business_number }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '사업자번호 검증에 실패했습니다.');
      }
      if (!data.isValid) {
        setError('유효하지 않은 사업자번호입니다.');
        setVerified(false);
        return;
      }
      if (!data.isActive) {
        setError(`해당 사업자번호는 현재 ${data.businessStatus || '정상 운영중이 아닙니다'}. 계속할 수 없습니다.`);
        setVerified(false);
        return;
      }
      setVerified(true);
      setBusinessStatus(data.businessStatus);
      setError(null);
    } catch (err: any) {
      setError(err.message || '사업자번호 검증 중 오류가 발생했습니다.');
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!formData.business_number || !formData.company_name || !formData.business_type || !formData.business_item) {
        throw new Error('필수 항목을 모두 입력해주세요.');
      }
      if (!validateBusinessNumber(formData.business_number)) {
        throw new Error('사업자번호 10자리를 정확히 입력해주세요.');
      }
      if (!verified) {
        throw new Error('사업자번호 검증을 먼저 완료해주세요.');
      }
      const companyData: CompanyInsert = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: null
      };
      const { data, error } = await saveCompanyInfo(companyData);
      if (error) {
        throw error;
      }
      if (data && data[0]) {
        sessionStorage.setItem('companyId', data[0].id);
        setSuccess(true);
        setTimeout(() => {
          router.push('/questionnaire');
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || '회사 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">기업 정보 입력</h2>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-6" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg mb-6" role="alert">
          회사 정보가 성공적으로 저장되었습니다. 잠시 후 질문지 페이지로 이동합니다.
        </div>
      )}
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="businessNumber" className="block font-semibold text-gray-900 mb-2">사업자번호</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                id="businessNumber" 
                placeholder="숫자만 10자리 입력" 
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
                value={formData.business_number}
                onChange={handleChange}
                maxLength={10}
                required 
              />
              <button
                type="button"
                onClick={verifyBusinessNumber}
                disabled={verifying || !formData.business_number}
                className="px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
              >
                {verifying ? '검증 중...' : '검증'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">하이픈(-) 없이 숫자 10자리만 입력하세요.</p>
            {verified && businessStatus && (
              <p className="mt-1 text-xs text-green-600 font-semibold">
                ✓ 확인 완료: {businessStatus}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="companyName" className="block font-semibold text-gray-900 mb-2">회사명</label>
            <input 
              type="text" 
              id="companyName" 
              placeholder="회사명을 입력하세요" 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition" 
              value={formData.company_name}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <label htmlFor="businessType" className="block font-semibold text-gray-900 mb-2">업태</label>
            <input 
              type="text" 
              id="businessType" 
              placeholder="예) 서비스업" 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition" 
              value={formData.business_type}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <label htmlFor="businessItem" className="block font-semibold text-gray-900 mb-2">종목</label>
            <input 
              type="text" 
              id="businessItem" 
              placeholder="예) 소프트웨어 개발" 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition" 
              value={formData.business_item}
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <label htmlFor="lastYearRevenue" className="block font-semibold text-gray-900 mb-2">작년 매출액 (선택)</label>
            <input 
              type="number" 
              id="lastYearRevenue" 
              placeholder="단위: 백만원" 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition" 
              value={formData.last_year_revenue || ''}
              onChange={handleChange}
              min="0"
            />
            <p className="mt-1 text-xs text-gray-400">단위: 백만원 (예: 1000 = 10억원)</p>
          </div>
          <div>
            <label htmlFor="currentERP" className="block font-semibold text-gray-900 mb-2">현재 사용 중인 ERP (선택)</label>
            <select 
              id="currentERP" 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base text-gray-700 transition"
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
          <div className="flex justify-between pt-6 gap-4">
            <Link href="/" className="px-6 py-3 text-base font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-lg shadow-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              이전
            </Link>
            <button 
              type="submit" 
              className="px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
              disabled={loading || !verified}
            >
              {loading ? '저장 중...' : '다음'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 