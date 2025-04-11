'use client'

import React, { useState, useEffect } from 'react'
import { sendEmail, saveContactMessage } from '@/lib/supabase'
import Script from 'next/script'

declare global {
  interface Window {
    naver: any;
    navermap_authFailure: () => void;
  }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  // 네이버 지도 초기화 함수
  const initializeNaverMap = () => {
    if (typeof window !== 'undefined' && window.naver && window.naver.maps) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.401319, 126.9726893), // 평촌역하이필드지식산업센터 좌표
        zoom: 15
      };
      
      const map = new window.naver.maps.Map('map', mapOptions);
      
      // 마커 추가
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(37.401319, 126.9726893),
        map: map,
        title: '예스넷(주)'
      });
      
      // 정보창 추가
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding:10px;width:200px;">
            <h5 style="margin-top:0;font-size:16px;font-weight:bold;">예스넷(주)</h5>
            <p style="margin-bottom:5px;">경기도 안양시 동안구 벌말로 66,<br>평촌역하이필드지식산업센터 B동 904호</p>
            <p style="margin-bottom:5px;">전화: 070.8657.2080</p>
          </div>
        `
      });
      
      // 마커 클릭시 정보창 표시
      window.naver.maps.Event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
      });
      
      // 기본적으로 정보창 표시
      infoWindow.open(map, marker);
    }
  };

  // API 로드 실패 처리
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.navermap_authFailure = () => {
        console.error('네이버 지도 API 인증 실패');
        // 인증 실패 시 메시지 표시할 수 있음
      };
    }
  }, []);
  
  // 네이버 지도 스크립트 로드 완료 후 초기화
  const handleNaverMapScriptLoad = () => {
    setMapLoaded(true);
    setTimeout(() => {
      initializeNaverMap();
    }, 500);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // 필수 입력 확인
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('이름, 이메일, 메시지는 필수 입력사항입니다.')
      }
      
      // 이메일 형식 확인
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('유효한 이메일 주소를 입력해주세요.')
      }
      
      // 데이터베이스에 저장
      const saveResult = await saveContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      })
      
      if (saveResult.error) {
        console.error('데이터베이스 저장 오류:', saveResult.error)
        // 데이터베이스 저장 실패는 계속 진행 (이메일만이라도 보내기 위해)
      }
      
      // 이메일 발송
      const emailResult = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'yesnet@yesneterp.com', // 수신자 이메일
          from: formData.email, // 발신자 이메일
          subject: `[홈페이지 문의] ${formData.name}님의 문의`,
          text: `
이름: ${formData.name}
이메일: ${formData.email}
전화번호: ${formData.phone || '미입력'}
메시지:
${formData.message}

---
이 메시지는 홈페이지 문의 양식을 통해 전송되었습니다.
예스넷(주)
대표: 박승주
주소: 경기도 안양시 동안구 벌말로 66, 평촌역하이필드지식산업센터 B동 904호
전화번호: 070.8657.2080
이메일: yesnet@yesneterp.com
사업자등록번호: 581-88-03426
          `.trim()
        }),
      })
      
      const data = await emailResult.json()
      
      if (!emailResult.ok) {
        // 이메일 전송에 실패했지만 데이터베이스에 저장했을 경우
        if (!saveResult.error) {
          setSuccess('데이터베이스에 문의가 저장되었습니다. 이메일 전송에는 문제가 있었지만, 빠른 시일 내에 검토 후 답변 드리겠습니다.')
          
          // 폼 초기화
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
          })
          return
        }
        
        throw new Error(data.error || '이메일 전송에 실패했습니다.')
      }
      
      // 성공 메시지 표시
      setSuccess('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.')
      
      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
      
    } catch (err: any) {
      console.error('문의 제출 오류:', err)
      setError(err.message || '문의 제출 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 네이버 지도 API 스크립트 로드 */}
      <Script 
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=khqeksfw60`}
        strategy="afterInteractive"
        onLoad={handleNaverMapScriptLoad}
      />
      
      <h1 className="text-3xl font-bold mb-6 text-center">연락처</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">예스넷에 문의하기</h2>
          <p className="text-gray-600 mb-4">
            궁금한 점이나 문의사항이 있으시면 아래 양식을 작성해 주세요. 빠른 시일 내에 답변 드리겠습니다.
          </p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-700">{success}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="홍길동"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="example@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="010-1234-5678"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                메시지 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="문의 내용을 입력해주세요."
              />
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? '전송 중...' : '문의하기'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">연락처 정보</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>회사명:</strong> 예스넷(주)</p>
            <p><strong>대표:</strong> 박승주</p>
            <p><strong>주소:</strong> 경기도 안양시 동안구 벌말로 66, 평촌역하이필드지식산업센터 B동 904호</p>
            <p><strong>전화번호:</strong> 070.8657.2080</p>
            <p><strong>이메일:</strong> yesnet@yesneterp.com</p>
            <p><strong>사업자등록번호:</strong> 581-88-03426</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">위치 정보</h2>
        <div className="relative w-full h-[400px]">
          <div id="map" className="w-full h-full"></div>
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">지도를 불러오는 중...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 