"use client";

import React, { useState, useEffect } from 'react';

export default function ApiScoreClient() {
  // 상태값 정의
  const [companyCode, setCompanyCode] = useState('');
  const [userId, setUserId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [zone, setZone] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [apiDomain, setApiDomain] = useState('');

  // 점수 상태
  const [score, setScore] = useState({
    connectionScore: 0,   // API 연결 점수 (30점)
    dataAccuracyScore: 0, // 데이터 정확성 점수 (70점)
    totalScore: 0,        // 총점 (100점)
    negativeItems: []     // 마이너스 재고 항목
  });

  // 컨설팅 요청 폼
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    companyName: ''
  });

  // 연락처 제출 상태
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  // 점수 체크 함수
  const checkScore = async () => {
    if (!companyCode || !userId || !apiKey) {
      setError('회사 코드, 사용자 ID, API 키를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCheckComplete(false);
    setTestResults([]);

    try {
      // 1. Zone 조회 (서버측 API 사용)
      const zoneResponse = await fetch('/api/ecount/zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ COM_CODE: companyCode }),
      });

      const zoneData = await zoneResponse.json();

      if (!zoneData.success || !zoneData.data?.ZONE) {
        setError(`Zone 조회 실패: ${zoneData.message || '알 수 없는 오류'}`);
        setTestResults(prev => [
          { type: 'zone', success: false, message: `Zone 조회 실패: ${zoneData.message || '알 수 없는 오류'}`, timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
        setScore(prev => ({
          ...prev,
          connectionScore: 0,
          totalScore: prev.dataAccuracyScore
        }));
        setIsLoading(false);
        return;
      }

      // Zone 설정
      const zoneValue = zoneData.data.ZONE;
      setZone(zoneValue);
      setTestResults(prev => [
        { type: 'zone', success: true, message: `Zone 조회 성공: ${zoneValue}`, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);

      // 2. 로그인 (서버측 API 사용)
      const loginResponse = await fetch('/api/ecount/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          COM_CODE: companyCode,
          USER_ID: userId,
          API_CERT_KEY: apiKey,
          ZONE: zoneValue,
          LAN_TYPE: 'ko-KR'
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginData.success || !loginData.data?.SESSION_ID) {
        setError(`로그인 실패: ${loginData.message || '알 수 없는 오류'}`);
        setTestResults(prev => [
          { type: 'login', success: false, message: `로그인 실패: ${loginData.message || '알 수 없는 오류'}`, timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
        setScore(prev => ({
          ...prev,
          connectionScore: 10, // Zone은 성공했으므로 일부 점수 부여
          totalScore: 10 + prev.dataAccuracyScore
        }));
        setIsLoading(false);
        return;
      }

      // 세션 ID 및 API 도메인 설정
      const sessionIdValue = loginData.data.SESSION_ID;
      setSessionId(sessionIdValue);
      setApiDomain(loginData.domain || 'sboapi');

      setTestResults(prev => [
        { type: 'login', success: true, message: `로그인 성공: 세션 ID 발급됨`, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);

      // API 연결 점수 부여 (Zone + 로그인 성공 = 30점)
      setScore(prev => ({
        ...prev,
        connectionScore: 30
      }));

      // 3. 창고별 재고현황 조회 (서버측 API 사용)
      const inventoryResponse = await fetch('/api/ecount/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SESSION_ID: sessionIdValue,
          ZONE: zoneValue,
          PROD_CD: '', // 빈 값으로 모든 품목 재고 조회
          WH_CD: '',   // 빈 값으로 모든 창고 조회
          DOMAIN: loginData.domain || 'sboapi'
        }),
      });

      const inventoryData = await inventoryResponse.json();

      if (!inventoryData.success || !inventoryData.data) {
        setError(`재고 현황 조회 실패: ${inventoryData.message || '알 수 없는 오류'}`);
        setTestResults(prev => [
          { type: 'inventory', success: false, message: `재고 현황 조회 실패: ${inventoryData.message || '알 수 없는 오류'}`, timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
        // API 연결 점수는 그대로 유지
        setScore(prev => ({
          ...prev,
          totalScore: prev.connectionScore
        }));
        setIsLoading(false);
        setCheckComplete(true);
        return;
      }

      // 재고 데이터 분석 및 점수 계산
      const inventoryItems = inventoryData.data.Result || [];
      const totalItems = inventoryItems.length;
      const negativeItems = inventoryItems.filter((item: any) => parseFloat(item.BAL_QTY) < 0);
      const negativeItemsCount = negativeItems.length;

      // 재고 정확성 점수 계산 (마이너스 재고가 없으면 70점, 있으면 비율에 따라 감점)
      let dataAccuracyScore = 70;

      if (totalItems > 0 && negativeItemsCount > 0) {
        // 마이너스 재고 비율을 계산하여 70점에서 차감
        const negativeRatio = negativeItemsCount / totalItems;
        const deduction = Math.round(70 * negativeRatio);
        dataAccuracyScore = Math.max(0, 70 - deduction);
      }

      // 총점 계산
      const totalScore = Math.min(100, Math.max(0, 30 + dataAccuracyScore));

      setScore({
        connectionScore: 30,
        dataAccuracyScore,
        totalScore,
        negativeItems: negativeItems
      });

      setTestResults(prev => [
        { 
          type: 'inventory', 
          success: true, 
          message: `재고 현황 조회 성공: 총 ${totalItems}개 품목, 마이너스 재고 ${negativeItemsCount}개 발견`, 
          timestamp: new Date().toLocaleTimeString(),
          data: { totalItems, negativeItemsCount, negativeItems }
        },
        ...prev
      ]);

      setCheckComplete(true);
    } catch (err) {
      setError('API 점수 체크 중 오류가 발생했습니다.');
      setTestResults(prev => [
        { type: 'error', success: false, message: '서버 오류가 발생했습니다.', timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 컨설팅 요청 제출
  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.companyName) {
      setContactError('이름, 회사명, 이메일은 필수 입력사항입니다.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setContactError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setContactSubmitting(true);
    setContactError('');

    try {
      // 이메일 발송
      const emailResult = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'yesnet@yesneterp.com', // 수신자 이메일
          from: 'nekisj@yesneterp.com', // 발신자 이메일을 SMTP 인증 계정으로 변경
          subject: `[이카운트 API 점검] ${contactForm.companyName} API 점검 결과`,
          text: `
이름: ${contactForm.name}
회사명: ${contactForm.companyName}
이메일: ${contactForm.email}  // 사용자 이메일은 본문에 포함
전화번호: ${contactForm.phone || '미입력'}
점검 결과: ${score.totalScore}점 (API 연결: ${score.connectionScore}점, 데이터 정확성: ${score.dataAccuracyScore}점)
마이너스 재고 품목 수: ${(score.negativeItems as any[]).length}개

문의 내용:
${contactForm.message}

--- API 연결 정보 ---
회사 코드: ${companyCode}
사용자 ID: ${userId}

---
이 메시지는 이카운트 API 점검 페이지에서 자동 발송되었습니다.
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
        throw new Error(data.error || '이메일 전송에 실패했습니다.');
      }

      setContactSuccess(true);
      // 폼 초기화
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        companyName: ''
      });
    } catch (err: any) {
      setContactError(err.message || '컨설팅 요청 중 오류가 발생했습니다.');
    } finally {
      setContactSubmitting(false);
    }
  };

  // 폼 입력 핸들러
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">이카운트 API 점검 도구</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* API 인증 폼 - 왼쪽 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">API 인증 정보</h2>
          <form className="flex flex-col gap-6">
            <div>
              <label htmlFor="companyCode" className="block font-semibold text-gray-900 mb-2">회사 코드</label>
              <input
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
                id="companyCode"
                type="text"
                placeholder="회사 코드 입력"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="userId" className="block font-semibold text-gray-900 mb-2">사용자 ID</label>
              <input
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
                id="userId"
                type="text"
                placeholder="사용자 ID 입력"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="apiKey" className="block font-semibold text-gray-900 mb-2">API 키</label>
              <input
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
                id="apiKey"
                type="password"
                placeholder="API 키 입력"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end pt-6 gap-4">
              <button
                className="px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                type="button"
                onClick={checkScore}
                disabled={isLoading}
              >
                {isLoading ? '점검 중...' : 'API 점검 실행'}
              </button>
            </div>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-6" role="alert">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* 오른쪽: 점검 안내 or 점검 결과 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {!checkComplete ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">API 점검 방법 안내</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>회사 코드, 사용자 ID, API 키를 정확히 입력하세요.</li>
                <li>API 점검 실행 버튼을 누르면 실시간으로 Zone, 로그인, 재고 데이터 등을 점검합니다.</li>
                <li>점검 결과에 따라 API 연동 상태와 데이터 품질을 확인할 수 있습니다.</li>
                <li>점검 후 컨설팅 요청도 가능합니다.</li>
                <li><strong>API키가 없는 경우:</strong> Self-Customizing &gt; 정보관리 &gt; API인증키발급 &gt; API인증현황(하단 버튼) &gt; 키발급(하단 버튼)을 통해 테스트 인증키를 발급하여 정보입력</li>
                <li><strong>(테스트)API키가 있는 경우:</strong> Self-Customizing &gt; 정보관리 &gt; API인증키발급 &gt; API인증현황(하단 버튼) 상에 나와있는 API키값을 입력</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 점수 표시 */}
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-48 h-48" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="2"></circle>
                    <circle 
                      cx="18" cy="18" r="16" fill="none" 
                      stroke={score.totalScore >= 70 ? '#22c55e' : score.totalScore >= 40 ? '#eab308' : '#ef4444'} 
                      strokeWidth="2" 
                      strokeDasharray={`${score.totalScore} 100`}
                      transform="rotate(-90 18 18)"
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{score.totalScore}</span>
                    <span className="text-gray-500">점</span>
                  </div>
                </div>
              </div>

              {/* 세부 점수 */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-md ${score.connectionScore === 30 ? 'bg-green-50' : 'bg-red-50'}`}> 
                  <p className="text-sm text-gray-600 mb-1">API 연결 점수</p>
                  <p className={`font-medium text-lg ${score.connectionScore === 30 ? 'text-green-600' : 'text-red-600'}`}> 
                    {score.connectionScore}/30점
                  </p>
                </div>

                <div className={`p-4 rounded-md ${score.dataAccuracyScore >= 50 ? 'bg-green-50' : score.dataAccuracyScore >= 30 ? 'bg-yellow-50' : 'bg-red-50'}`}> 
                  <p className="text-sm text-gray-600 mb-1">데이터 정확성 점수</p>
                  <p className={`font-medium text-lg ${score.dataAccuracyScore >= 50 ? 'text-green-600' : score.dataAccuracyScore >= 30 ? 'text-yellow-600' : 'text-red-600'}`}> 
                    {score.dataAccuracyScore}/70점
                  </p>
                </div>
              </div>

              {/* 재고 분석 결과 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-md font-medium">재고 분석 결과</h3>
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showDetails ? '세부정보 숨기기' : '세부정보 보기'}
                  </button>
                </div>

                {(score.negativeItems as any[]).length > 0 ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-yellow-700">
                      <strong>주의:</strong> {(score.negativeItems as any[]).length}개의 품목에서 마이너스 재고가 발견되었습니다.
                    </p>
                    {showDetails && (
                      <div className="mt-3 max-h-60 overflow-y-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-yellow-100">
                              <th className="py-2 px-3 text-left">창고</th>
                              <th className="py-2 px-3 text-left">품목코드</th>
                              <th className="py-2 px-3 text-left">품목명</th>
                              <th className="py-2 px-3 text-right">재고량</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(score.negativeItems as any[]).map((item, idx) => (
                              <tr key={idx} className="border-t border-yellow-200">
                                <td className="py-2 px-3">{item.WH_DES || item.WH_CD}</td>
                                <td className="py-2 px-3">{item.PROD_CD}</td>
                                <td className="py-2 px-3">{item.PROD_DES}</td>
                                <td className="py-2 px-3 text-right text-red-600">{parseFloat(item.BAL_QTY).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                    <p className="text-green-700">
                      <strong>양호:</strong> 마이너스 재고가 발견되지 않았습니다.
                    </p>
                  </div>
                )}
              </div>

              {/* 컨설팅 요청 폼 */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">재고관리 컨설팅 문의</h3>
                {contactSuccess ? (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg mb-6" role="alert">
                    컨설팅 요청이 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
                  </div>
                ) : (
                  <form onSubmit={submitContact} className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block font-semibold text-gray-900 mb-2">이름</label>
                        <input
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
                          placeholder="홍길동"
                        />
                      </div>
                      <div>
                        <label htmlFor="companyName" className="block font-semibold text-gray-900 mb-2">회사명</label>
                        <input
                          type="text"
                          name="companyName"
                          value={contactForm.companyName}
                          onChange={handleContactChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
                          placeholder="ㅇㅇ주식회사"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block font-semibold text-gray-900 mb-2">이메일</label>
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
                          placeholder="example@company.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block font-semibold text-gray-900 mb-2">전화번호</label>
                        <input
                          type="tel"
                          name="phone"
                          value={contactForm.phone}
                          onChange={handleContactChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
                          placeholder="010-1234-5678"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block font-semibold text-gray-900 mb-2">문의사항</label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 transition"
                        placeholder="재고관리 컨설팅 관련 문의사항을 입력해주세요."
                      />
                    </div>
                    {contactError && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-6" role="alert">
                        {contactError}
                      </div>
                    )}
                    <div className="flex justify-end pt-6 gap-4">
                      <button
                        type="submit"
                        disabled={contactSubmitting}
                        className="px-6 py-3 text-base font-bold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition disabled:opacity-50"
                      >
                        {contactSubmitting ? '요청 중...' : '컨설팅 요청하기'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* 테스트 결과 로그 */}
          {testResults.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-medium mb-2">API 호출 로그</h3>
              <div className="bg-gray-50 p-3 rounded-md max-h-48 overflow-y-auto text-sm">
                {testResults.map((result, idx) => (
                  <div key={idx} className={`mb-1 pb-1 ${idx < testResults.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <span className="text-gray-500 text-xs">{result.timestamp}</span>{' '}
                    <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                      {result.success ? '✓' : '✗'} {result.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 