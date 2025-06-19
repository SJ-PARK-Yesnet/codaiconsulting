"use client";

import React, { useState, useEffect } from 'react';
import { sendEmail, saveContactMessage } from '@/lib/supabase';
import Script from 'next/script';

declare global {
  interface Window {
    naver: any;
    navermap_authFailure: () => void;
  }
}

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 네이버 지도 초기화 함수
  const initializeNaverMap = () => {
    if (typeof window !== 'undefined' && window.naver && window.naver.maps) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.3943327, 126.9700937),
        zoom: 15
      };
      const map = new window.naver.maps.Map('map', mapOptions);
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(37.3943327, 126.9700937),
        map: map,
        title: '예스넷(주)'
      });
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding:10px;width:200px;">
            <h5 style="margin-top:0;font-size:16px;font-weight:bold;">예스넷(주)</h5>
            <p style="margin-bottom:5px;">경기도 안양시 동안구 벌말로 66,<br>평촌역하이필드지식산업센터 B동 904호</p>
            <p style="margin-bottom:5px;">전화: 070.8657.2080</p>
          </div>
        `
      });
      window.naver.maps.Event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
      });
      infoWindow.open(map, marker);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.navermap_authFailure = () => {
        console.error('네이버 지도 API 인증 실패');
      };
    }
  }, []);

  const handleNaverMapScriptLoad = () => {
    setMapLoaded(true);
    setTimeout(() => {
      initializeNaverMap();
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('이름, 이메일, 메시지는 필수 입력사항입니다.');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('유효한 이메일 주소를 입력해주세요.');
      }
      const saveResult = await saveContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      if (saveResult.error) {
        console.error('데이터베이스 저장 오류:', saveResult.error);
      }
      const emailResult = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'yesnet@yesneterp.com',
          from: formData.email,
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
      });
      const data = await emailResult.json();
      if (!emailResult.ok) {
        if (!saveResult.error) {
          setSuccess('데이터베이스에 문의가 저장되었습니다. 이메일 전송에는 문제가 있었지만, 빠른 시일 내에 검토 후 답변 드리겠습니다.');
          setFormData({ name: '', email: '', phone: '', message: '' });
          return;
        }
        throw new Error(data.error || '이메일 전송에 실패했습니다.');
      }
      setSuccess('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      console.error('문의 제출 오류:', err);
      setError(err.message || '문의 제출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Script 
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=khqeksfw60`}
        strategy="afterInteractive"
        onLoad={handleNaverMapScriptLoad}
      />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">문의하기</h1>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-6" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg mb-6" role="alert">
          {success}
        </div>
      )}
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block font-semibold text-gray-900 mb-2">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
              placeholder="홍길동"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-900 mb-2">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
              placeholder="example@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-semibold text-gray-900 mb-2">전화번호</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
              placeholder="010-1234-5678"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-semibold text-gray-900 mb-2">메시지</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
              placeholder="문의 내용을 입력해주세요."
            />
          </div>
          <div className="flex justify-end pt-6 gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
            >
              {loading ? '전송 중...' : '문의하기'}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
  );
} 