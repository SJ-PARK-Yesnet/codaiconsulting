'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function APITest() {
  const router = useRouter();
  
  // 상태값 정의
  const [companyCode, setCompanyCode] = useState('');
  const [userId, setUserId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [zone, setZone] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [apiDomain, setApiDomain] = useState('');
  const [showJsonData, setShowJsonData] = useState(false);
  
  // Zone API 호출
  const getZone = async () => {
    if (!companyCode) {
      setError('회사 코드를 입력해주세요.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/ecount/zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ COM_CODE: companyCode }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.ZONE) {
        setZone(data.data.ZONE);
        setTestResults(prev => [
          { type: 'zone', success: true, message: `ZONE: ${data.data.ZONE}`, timestamp: new Date().toLocaleTimeString(), data: data.data },
          ...prev
        ]);
      } else {
        setError(data.message || 'Zone 정보를 가져오는데 실패했습니다.');
        setTestResults(prev => [
          { type: 'zone', success: false, message: data.message || 'Zone 정보를 가져오는데 실패했습니다.', timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      setTestResults(prev => [
        { type: 'zone', success: false, message: '서버 오류가 발생했습니다.', timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 로그인 API 호출
  const login = async () => {
    if (!companyCode || !userId || !apiKey || !zone) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // API 키 타입 예측
      const isTestKey = (apiKey.length >= 40) || /TEST/i.test(apiKey);
      const likelyDomain = isTestKey ? 'sboapi' : 'oapi';
      console.log(`API 키 패턴에 따른 예상 타입: ${isTestKey ? 'TEST KEY' : 'API KEY'}, 사용 예상 도메인: ${likelyDomain}`);
      
      // 로딩 메시지 업데이트
      setTestResults(prev => [
        { 
          type: 'loading', 
          success: true, 
          message: `로그인 시도 중... (${likelyDomain} 도메인 우선 시도, ${isTestKey ? 'TEST KEY' : 'API KEY'} 패턴)`, 
          timestamp: new Date().toLocaleTimeString() 
        },
        ...prev
      ]);
      
      const response = await fetch('/api/ecount/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          COM_CODE: companyCode,
          USER_ID: userId,
          API_CERT_KEY: apiKey,
          ZONE: zone,
          LAN_TYPE: 'ko-KR'
        }),
      });
      
      const data = await response.json();
      console.log('로그인 API 응답:', data);
      
      if (data.success && data.data?.SESSION_ID) {
        setSessionId(data.data.SESSION_ID);
        console.log('세션 ID 설정됨:', data.data.SESSION_ID);
        setApiDomain(data.domain || 'sboapi');
        console.log('API 도메인 설정됨:', data.domain || 'sboapi');
        setTestResults(prev => [
          { type: 'login', success: true, message: `세션 ID: ${data.data.SESSION_ID} (${data.domain || 'sboapi'} 사용)`, timestamp: new Date().toLocaleTimeString(), data: data.data },
          ...prev
        ]);
      } else {
        setError(data.message || '로그인에 실패했습니다.');
        console.error('로그인 실패:', data);
        
        // 원본 응답 데이터가 있다면 출력
        if (data.rawData) {
          console.error('원본 응답 데이터:', data.rawData);
        }
        
        setTestResults(prev => [
          { 
            type: 'login', 
            success: false, 
            message: data.message || '로그인에 실패했습니다.', 
            timestamp: new Date().toLocaleTimeString(),
            data: data.rawData // 디버깅을 위해 원본 응답 데이터 포함
          },
          ...prev
        ]);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      setTestResults(prev => [
        { type: 'login', success: false, message: '서버 오류가 발생했습니다.', timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 품목 조회 API 호출
  const getProducts = async () => {
    if (!sessionId || !zone) {
      setError('세션 ID와 Zone이 필요합니다. 먼저 로그인해주세요.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      console.log('품목 조회 API 호출 시작 - 세션 ID:', sessionId, 'Zone:', zone);
      
      const response = await fetch('/api/ecount/products/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SESSION_ID: sessionId,
          ZONE: zone,
          DOMAIN: apiDomain
        }),
      });
      
      console.log('품목 조회 API 응답 상태:', response.status, response.statusText);
      const data = await response.json();
      console.log('품목 조회 API 응답 데이터:', data);
      
      if (data.success && data.data?.Result) {
        setTestResults(prev => [
          { 
            type: 'products', 
            success: true, 
            message: `품목 조회 성공: 총 ${data.data.Result.length}개 품목`, 
            timestamp: new Date().toLocaleTimeString(), 
            data: data.data,
            count: data.data.Result.length
          },
          ...prev
        ]);
      } else {
        setError(data.message || '품목 조회에 실패했습니다.');
        setTestResults(prev => [
          { type: 'products', success: false, message: data.message || '품목 조회에 실패했습니다.', timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      setTestResults(prev => [
        { type: 'products', success: false, message: '서버 오류가 발생했습니다.', timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 창고별 재고 현황 API 호출
  const getInventory = async () => {
    if (!sessionId || !zone) {
      setError('세션 ID와 Zone이 필요합니다. 먼저 로그인해주세요.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      console.log('재고 현황 API 호출 시작 - 세션 ID:', sessionId, 'Zone:', zone);
      
      const response = await fetch('/api/ecount/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SESSION_ID: sessionId,
          ZONE: zone,
          PROD_CD: '', // 빈 값으로 모든 품목 재고 조회
          WH_CD: '', // 빈 값으로 모든 창고 조회
          DOMAIN: apiDomain
        }),
      });
      
      console.log('재고 현황 API 응답 상태:', response.status, response.statusText);
      const data = await response.json();
      console.log('재고 현황 API 응답 데이터:', data);
      
      if (data.success && data.data) {
        setTestResults(prev => [
          { 
            type: 'inventory', 
            success: true, 
            message: `재고 현황 조회 성공 (${data.domain} 사용)`, 
            timestamp: new Date().toLocaleTimeString(), 
            data: data.data,
            count: data.data.Result?.length || 0
          },
          ...prev
        ]);
      } else {
        setError(data.message || '재고 현황 조회에 실패했습니다.');
        setTestResults(prev => [
          { type: 'inventory', success: false, message: data.message || '재고 현황 조회에 실패했습니다.', timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      setTestResults(prev => [
        { type: 'inventory', success: false, message: '서버 오류가 발생했습니다.', timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen py-8 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          이카운트 API 연결 테스트
        </h1>
        <p className="text-xl text-gray-600 text-center mb-10">
          이카운트 ERP API 연결을 테스트하고 결과를 확인할 수 있습니다.
        </p>
        
        <div className="grid md:grid-cols-5 gap-6">
          {/* 왼쪽: 입력 폼 */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6">API 연결 정보</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">회사 코드</label>
                <input
                  type="text"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="회사 코드 입력"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">사용자 ID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="사용자 ID 입력"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">API 키 (API_CERT_KEY)</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="API 키 입력"
                />
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-4">API 호출 순서: <strong>Zone API → 로그인 API → 기타 API</strong></p>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={getZone}
                    disabled={isLoading || !companyCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '처리 중...' : 'Zone 조회'}
                  </button>
                  
                  <button
                    onClick={login}
                    disabled={isLoading || !companyCode || !userId || !apiKey || !zone}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '처리 중...' : '로그인'}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-md font-medium mb-2">API 목록</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={getProducts}
                    disabled={isLoading || !sessionId || !zone}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '처리 중...' : '품목 조회'}
                  </button>
                  
                  <button
                    onClick={getInventory}
                    disabled={isLoading || !sessionId || !zone}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '처리 중...' : '재고 현황'}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          {/* 오른쪽: 결과 및 상태 */}
          <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6">API 연결 상태 및 결과</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-1">존(Zone)</p>
                <p className="font-medium text-lg">{zone || '-'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-1">세션 ID</p>
                <p className="font-medium text-lg truncate">{sessionId || '-'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md col-span-2">
                <p className="text-sm text-gray-600 mb-1">API 도메인</p>
                <p className="font-medium text-lg">
                  {apiDomain ? <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{apiDomain}</span> : '-'}
                  {apiDomain && <span className="ml-2 text-sm text-gray-500">(이 도메인을 사용하여 API 요청이 수행됩니다)</span>}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-2">API 호출 결과</h3>
              <div className={`mb-2 p-2 rounded-md ${testResults.length > 0 ? (testResults[0].success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-500'}`}>
                {testResults.length > 0 ? testResults[0].message : '아직 API가 호출되지 않았습니다.'}
              </div>
              
              {testResults.length > 0 && testResults[0].data && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">응답 데이터</h4>
                  
                  {/* 품목 조회 결과 테이블 */}
                  {testResults[0].type === 'products' && testResults[0].data.Result && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">품목 목록 ({testResults[0].data.Result.length}개)</h5>
                      <div className="bg-white overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">품목코드</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">품목명</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">규격</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">바코드</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">비고</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {testResults[0].data.Result.slice(0, 10).map((item: any, index: number) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                                <td className="px-4 py-2.5 text-sm font-medium text-blue-700">{item.PROD_CD || '-'}</td>
                                <td className="px-4 py-2.5 text-sm text-gray-900">{item.PROD_DES || '-'}</td>
                                <td className="px-4 py-2.5 text-sm text-gray-900">{item.SIZE_DES || '-'}</td>
                                <td className="px-4 py-2.5 text-sm text-gray-500">{item.BAR_CODE || '-'}</td>
                                <td className="px-4 py-2.5 text-sm text-gray-500">{item.REMARKS || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {testResults[0].data.Result.length > 10 && (
                        <p className="text-xs text-gray-500 mt-2 italic">* 처음 10개 항목만 표시됩니다. 전체 데이터는 아래 JSON을 확인하세요.</p>
                      )}
                    </div>
                  )}
                  
                  {/* 재고 현황 조회 결과 테이블 */}
                  {testResults[0].type === 'inventory' && testResults[0].data.Result && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">재고 현황 ({testResults[0].data.Result.length}개)</h5>
                      <div className="bg-white overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">창고코드</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">창고명</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">품목코드</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">품목명</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">규격</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">수량</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {testResults[0].data.Result.slice(0, 10).map((item: any, index: number) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                                <td className="px-4 py-2.5 text-sm font-medium text-blue-700">{item.WH_CD || '-'}</td>
                                <td className="px-4 py-2.5 text-sm text-gray-900">{item.WH_DES || '-'}</td>
                                <td className="px-4 py-2.5 text-sm font-medium text-blue-700">{item.PROD_CD || '-'}</td>
                                <td className="px-4 py-2.5 text-sm text-gray-900">{item.PROD_DES || '-'}</td>
                                <td className="px-4 py-2.5 text-sm text-gray-900">{item.PROD_SIZE_DES || '-'}</td>
                                <td className="px-4 py-2.5 text-sm text-gray-900 text-right font-medium">
                                  {parseFloat(item.BAL_QTY) ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                                      {parseFloat(item.BAL_QTY).toLocaleString()}
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">0</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {testResults[0].data.Result.length > 10 && (
                        <p className="text-xs text-gray-500 mt-2 italic">* 처음 10개 항목만 표시됩니다. 전체 데이터는 아래 JSON을 확인하세요.</p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <button
                      onClick={() => setShowJsonData(!showJsonData)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm text-gray-700 flex items-center transition-all"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="mr-1.5 transition-transform duration-200" 
                        style={{ transform: showJsonData ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                      원본 JSON 데이터 {showJsonData ? '숨기기' : '보기'}
                    </button>
                    {showJsonData && (
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-96 mt-2 animate-fadeIn">
                        <pre className="text-sm text-gray-800">{JSON.stringify(testResults[0].data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">API 연결 가이드</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>회사 코드를 입력하고 Zone 조회 버튼을 클릭합니다.</li>
                <li>사용자 ID와 API 키를 입력하고 로그인 버튼을 클릭합니다.</li>
                <li>로그인 성공 후 원하는 API 테스트 버튼을 클릭합니다.</li>
                <li>Test Key와 API Key의 차이점을 이해하고 사용하세요.</li>
                <li>문제가 발생하면 개발자 도구의 콘솔 및 네트워크 탭을 확인하세요.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </main>
  );
} 