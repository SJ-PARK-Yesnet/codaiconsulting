'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

// Chart.js 등록
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function APIExamplePage() {
  // 상태값 정의
  const [companyCode, setCompanyCode] = useState('');
  const [userId, setUserId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [zone, setZone] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiDomain, setApiDomain] = useState('');
  const [activeTab, setActiveTab] = useState("inventory");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // API 응답 데이터
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  
  // 거래처 정보 관련 상태
  const [customerCode, setCustomerCode] = useState('5818803426');
  const [customerName, setCustomerName] = useState('예스넷(주)');
  const [customerBizNo, setCustomerBizNo] = useState('');
  const [customerCEO, setCustomerCEO] = useState('박승주');
  const [customerAddr, setCustomerAddr] = useState('경기도 안양시 동안구 벌말로 66, B동 904호');
  const [customerTel, setCustomerTel] = useState('070-8657-2080');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerResult, setRegisterResult] = useState<{
    success: boolean;
    message: string;
    error?: string;
  } | null>(null);
  
  // API 문의 폼 관련 상태
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  // API 연결 함수
  const connectAPI = async () => {
    if (!companyCode || !userId || !apiKey) {
      setError('회사 코드, 사용자 ID, API 키를 모두 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
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
        setIsLoading(false);
        return;
      }
      
      // 세션 ID 및 API 도메인 설정
      const sessionIdValue = loginData.data.SESSION_ID;
      setSessionId(sessionIdValue);
      setApiDomain(loginData.domain || 'sboapi');
      setIsLoggedIn(true);
      
      setTestResults(prev => [
        { type: 'login', success: true, message: `로그인 성공: 세션 ID 발급됨`, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
      
      // 로그인 성공 후 활성 탭에 따라 데이터 로드
      await loadTabData(activeTab, sessionIdValue, zoneValue, loginData.domain || 'sboapi');
      
    } catch (err) {
      setError('API 연결 중 오류가 발생했습니다.');
      setTestResults(prev => [
        { type: 'error', success: false, message: '서버 오류가 발생했습니다.', timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 탭 변경 시 데이터 로딩
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    if (isLoggedIn) {
      await loadTabData(value, sessionId, zone, apiDomain);
    }
  };
  
  // 탭별 데이터 로딩
  const loadTabData = async (tabId: string, sessionId: string, zoneValue: string, domain: string) => {
    if (tabId === 'inventory') {
      // 창고별 재고현황 조회
      await fetchInventoryData(sessionId, zoneValue, domain);
    } else if (tabId === 'products') {
      // 품목 조회
      await fetchProductData(sessionId, zoneValue, domain);
    } else if (tabId === 'customers') {
      // 거래처 정보는 별도의 API 호출 없이 사용자 입력 기반으로 동작
    }
  };
  
  // 창고별 재고현황 조회
  const fetchInventoryData = async (sessionId: string, zoneValue: string, domain: string) => {
    try {
      setIsLoading(true);
      const inventoryResponse = await fetch('/api/ecount/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SESSION_ID: sessionId,
          ZONE: zoneValue,
          PROD_CD: '',
          WH_CD: '',
          DOMAIN: domain
        }),
      });
      
      const data = await inventoryResponse.json();
      
      if (data.success && data.data?.Result) {
        setInventoryData(data.data.Result);
        setTestResults(prev => [
          { 
            type: 'inventory', 
            success: true, 
            message: `재고 현황 조회 성공: 총 ${data.data.Result.length}개 품목`, 
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      } else {
        setError(`재고 현황 조회 실패: ${data.message || '알 수 없는 오류'}`);
        setTestResults(prev => [
          { type: 'inventory', success: false, message: `재고 현황 조회 실패: ${data.message || '알 수 없는 오류'}`, timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
      }
    } catch (err) {
      setError('재고 현황 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 품목 조회
  const fetchProductData = async (sessionId: string, zoneValue: string, domain: string) => {
    try {
      setIsLoading(true);
      const productsResponse = await fetch('/api/ecount/products/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SESSION_ID: sessionId,
          ZONE: zoneValue,
          PROD_CD: '',
          DOMAIN: domain
        }),
      });
      
      const data = await productsResponse.json();
      
      if (data.success && data.data?.Result) {
        setProductData(data.data.Result);
        setTestResults(prev => [
          { 
            type: 'products', 
            success: true, 
            message: `품목 조회 성공: 총 ${data.data.Result.length}개 품목`, 
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      } else {
        setError(`품목 조회 실패: ${data.message || '알 수 없는 오류'}`);
        setTestResults(prev => [
          { type: 'products', success: false, message: `품목 조회 실패: ${data.message || '알 수 없는 오류'}`, timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
      }
    } catch (err) {
      setError('품목 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 재고량 분포 파이 차트 데이터
  const getInventoryDistributionData = () => {
    if (!inventoryData.length) return null;
    
    const positiveCount = inventoryData.filter(item => parseFloat(item.BAL_QTY) > 0).length;
    const zeroCount = inventoryData.filter(item => parseFloat(item.BAL_QTY) === 0).length;
    const negativeCount = inventoryData.filter(item => parseFloat(item.BAL_QTY) < 0).length;
    
    return {
      labels: ['양수 재고', '0 재고', '음수 재고'],
      datasets: [
        {
          data: [positiveCount, zeroCount, negativeCount],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // 창고별 재고량 바 차트 데이터
  const getWarehouseInventoryData = () => {
    if (!inventoryData.length) return null;
    
    // 창고별 재고 합계 계산
    const warehouseData: Record<string, { total: number, name: string }> = {};
    
    inventoryData.forEach(item => {
      const whCode = item.WH_CD;
      const qty = parseFloat(item.BAL_QTY) || 0;
      
      if (!warehouseData[whCode]) {
        warehouseData[whCode] = { 
          total: 0,
          name: item.WH_DES || `창고 ${whCode}`
        };
      }
      
      warehouseData[whCode].total += qty;
    });
    
    // 상위 10개 창고만 표시 (데이터가 많을 경우)
    const topWarehouses = Object.entries(warehouseData)
      .sort((a, b) => Math.abs(b[1].total) - Math.abs(a[1].total))
      .slice(0, 10);
    
    return {
      labels: topWarehouses.map(([_, data]) => data.name),
      datasets: [
        {
          label: '재고량',
          data: topWarehouses.map(([_, data]) => data.total),
          backgroundColor: topWarehouses.map(([_, data]) => 
            data.total >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
          ),
          borderColor: topWarehouses.map(([_, data]) => 
            data.total >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
          ),
          borderWidth: 1,
        },
      ],
    };
  };
  
  // 거래처 등록 함수
  const registerCustomer = async () => {
    if (!customerCode || !customerName) {
      toast.error('거래처코드와 거래처명은 필수 입력값입니다.');
      return;
    }
    
    setIsRegistering(true);
    setRegisterResult(null);
    
    try {
      // 거래처 등록 API 호출
      const response = await fetch('/api/ecount/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SESSION_ID: sessionId,
          ZONE: zone,
          DOMAIN: apiDomain,
          CUST: {
            BUSINESS_NO: customerCode,
            CUST_NAME: customerName,
            BOSS_NAME: customerCEO,
            ADDR: customerAddr,
            TEL: customerTel
          }
        }),
      });
      
      const data = await response.json();
      console.log('거래처 등록 응답:', data);
      
      if (data.success) {
        // SuccessCnt가 1 이상인 경우 성공
        toast.success('이카운트로 거래처가 등록되었습니다.');
        setRegisterResult({
          success: true,
          message: `거래처 등록 성공: ${customerName}`
        });
        setTestResults(prev => [
          { type: 'customer', success: true, message: `거래처 등록 성공: ${customerName}`, timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
      } else {
        // 실패한 경우 오류 메시지 표시
        const errorMsg = data.error || '알 수 없는 오류';
        toast.error(`거래처 등록 실패: ${errorMsg}`);
        setRegisterResult({
          success: false,
          message: '거래처 등록 실패',
          error: errorMsg
        });
        setTestResults(prev => [
          { type: 'customer', success: false, message: `거래처 등록 실패: ${errorMsg}`, timestamp: new Date().toLocaleTimeString() },
          ...prev
        ]);
      }
    } catch (err) {
      toast.error('거래처 등록 중 오류가 발생했습니다.');
      setRegisterResult({
        success: false,
        message: '거래처 등록 중 오류가 발생했습니다.',
        error: (err as Error).message
      });
      setTestResults(prev => [
        { type: 'customer', success: false, message: '서버 오류가 발생했습니다.', timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
      console.error('거래처 등록 에러:', err);
    } finally {
      setIsRegistering(false);
    }
  };
  
  // API 문의 전송 함수
  const sendApiInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !message) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    
    setIsSending(true);
    setInquiryResult(null);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'yesnet@yesneterp.com',
          subject: '[API 개발 문의] ' + name,
          text: `
이름: ${name}
이메일: ${email}
전화번호: ${phone}
회사코드: ${companyCode}
사용자ID: ${userId}

문의내용:
${message}
          `,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('문의가 성공적으로 전송되었습니다.');
        setInquiryResult({
          success: true,
          message: '문의가 성공적으로 전송되었습니다. 담당자가 검토 후 연락드리겠습니다.'
        });
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        toast.error('문의 전송에 실패했습니다. 나중에 다시 시도해주세요.');
        setInquiryResult({
          success: false,
          message: '문의 전송에 실패했습니다. 나중에 다시 시도해주세요.'
        });
      }
    } catch (err) {
      toast.error('문의 전송 중 오류가 발생했습니다.');
      setInquiryResult({
        success: false,
        message: '문의 전송 중 오류가 발생했습니다.'
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <main className="min-h-screen py-8 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          이카운트 API 활용 예시
        </h1>
        <p className="text-xl text-gray-600 text-center mb-10">
          이카운트 API 연결 및 데이터 시각화 예시를 확인하세요.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* 왼쪽: 입력 폼 */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md">
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
                  disabled={isLoggedIn}
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
                  disabled={isLoggedIn}
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
                  disabled={isLoggedIn}
                />
              </div>
              
              <div className="pt-4">
                <button
                  onClick={connectAPI}
                  disabled={isLoading || !companyCode || !userId || !apiKey || isLoggedIn}
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '연결 중...' : isLoggedIn ? '연결됨' : 'API 연결하기'}
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Zone 조회 → 로그인 → 데이터 조회가 자동으로 수행됩니다.
                </p>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md">
                  {error}
                </div>
              )}
              
              {isLoggedIn && (
                <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md">
                  API 연결 성공! 오른쪽 탭에서 다양한 데이터 시각화를 확인하세요.
                </div>
              )}
            </div>
            
            {/* API 호출 로그 */}
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
            
            {/* API 문의 폼 */}
            {isLoggedIn && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">API 개발 문의하기</h3>
                <form onSubmit={sendApiInquiry} className="space-y-4">
                  <div>
                    <Label htmlFor="name">이름</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">이메일</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">전화번호</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} 
                      placeholder="전화번호를 입력하세요"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">문의내용</Label>
                    <Textarea 
                      id="message" 
                      value={message} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)} 
                      placeholder="필요한 API 개발 내용 또는 문의사항을 입력하세요"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={isSending} className="w-full">
                    {isSending ? '전송 중...' : '문의하기'}
                  </Button>
                  
                  {/* 문의 전송 결과 메시지 */}
                  {inquiryResult && (
                    <div className={`mt-4 p-4 rounded-md ${inquiryResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                      <p className="font-medium">{inquiryResult.message}</p>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
          
          {/* 오른쪽: API 데이터 시각화 */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6">API 데이터 시각화</h2>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="inventory">재고 현황 대시보드</TabsTrigger>
                <TabsTrigger value="products">품목 리스트</TabsTrigger>
                <TabsTrigger value="customers">거래처등록</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory" className="space-y-4">
                {!isLoggedIn ? (
                  <div className="py-12 text-center text-gray-500">
                    왼쪽에서 API 정보를 입력하고 연결하면 재고 현황 데이터가 표시됩니다.
                  </div>
                ) : isLoading ? (
                  <div className="py-12 text-center text-gray-500">
                    재고 현황 데이터를 불러오는 중입니다...
                  </div>
                ) : inventoryData.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>재고량 분포</CardTitle>
                          <CardDescription>양수/0/음수 재고별 품목 수</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            {getInventoryDistributionData() && (
                              <Pie 
                                data={getInventoryDistributionData()!} 
                                options={{ 
                                  responsive: true,
                                  maintainAspectRatio: false,
                                }}
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>창고별 재고량</CardTitle>
                          <CardDescription>상위 10개 창고의 총 재고량</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            {getWarehouseInventoryData() && (
                              <Bar 
                                data={getWarehouseInventoryData()!}
                                options={{ 
                                  responsive: true,
                                  maintainAspectRatio: false,
                                }}
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>재고 현황 테이블</CardTitle>
                        <CardDescription>최근 조회된 재고 데이터 (최대 10개 항목)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">창고코드</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">창고명</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">품목코드</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">품목명</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">수량</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {inventoryData.slice(0, 10).map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-4 py-2.5 text-sm font-medium text-blue-700">{item.WH_CD || '-'}</td>
                                  <td className="px-4 py-2.5 text-sm text-gray-900">{item.WH_DES || '-'}</td>
                                  <td className="px-4 py-2.5 text-sm font-medium text-blue-700">{item.PROD_CD || '-'}</td>
                                  <td className="px-4 py-2.5 text-sm text-gray-900">{item.PROD_DES || '-'}</td>
                                  <td className={`px-4 py-2.5 text-sm text-right font-medium ${parseFloat(item.BAL_QTY) < 0 ? 'text-red-600' : parseFloat(item.BAL_QTY) > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {parseFloat(item.BAL_QTY).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {inventoryData.length > 10 && (
                          <p className="text-xs text-gray-500 mt-2 italic">* 총 {inventoryData.length}개 중 처음 10개 항목만 표시됩니다.</p>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    재고 현황 데이터가 없습니다.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="products" className="space-y-4">
                {!isLoggedIn ? (
                  <div className="py-12 text-center text-gray-500">
                    왼쪽에서 API 정보를 입력하고 연결하면 품목 데이터가 표시됩니다.
                  </div>
                ) : isLoading ? (
                  <div className="py-12 text-center text-gray-500">
                    품목 데이터를 불러오는 중입니다...
                  </div>
                ) : productData.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>품목 목록</CardTitle>
                      <CardDescription>최근 조회된 품목 데이터 (최대 20개 항목)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
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
                            {productData.slice(0, 20).map((item, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                      {productData.length > 20 && (
                        <p className="text-xs text-gray-500 mt-2 italic">* 총 {productData.length}개 중 처음 20개 항목만 표시됩니다.</p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    품목 데이터가 없습니다.
                  </div>
                )}
              </TabsContent>
              
              {/* 새로운 거래처 정보 탭 */}
              <TabsContent value="customers" className="space-y-4">
                {!isLoggedIn ? (
                  <div className="py-12 text-center text-gray-500">
                    왼쪽에서 API 정보를 입력하고 연결하면 거래처 정보 입력 폼이 표시됩니다.
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>거래처 등록</CardTitle>
                      <CardDescription>거래처 정보를 입력하고 이카운트로 등록하세요.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customerCode">거래처코드 *</Label>
                          <Input 
                            id="customerCode" 
                            value={customerCode} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerCode(e.target.value)} 
                            placeholder="거래처코드를 입력하세요"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerName">거래처명 *</Label>
                          <Input 
                            id="customerName" 
                            value={customerName} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)} 
                            placeholder="거래처명을 입력하세요"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerCEO">대표자명</Label>
                          <Input 
                            id="customerCEO" 
                            value={customerCEO} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerCEO(e.target.value)} 
                            placeholder="대표자명을 입력하세요"
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="customerAddr">주소</Label>
                          <Input 
                            id="customerAddr" 
                            value={customerAddr} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerAddr(e.target.value)} 
                            placeholder="주소를 입력하세요"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerTel">전화번호</Label>
                          <Input 
                            id="customerTel" 
                            value={customerTel} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerTel(e.target.value)} 
                            placeholder="전화번호를 입력하세요"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          onClick={registerCustomer} 
                          disabled={isRegistering || !customerCode || !customerName}
                          className="w-full mt-4"
                        >
                          {isRegistering ? '처리 중...' : '거래처 등록하기'}
                        </Button>
                        
                        {/* 거래처 등록 결과 메시지 */}
                        {registerResult && (
                          <div className={`mt-4 p-4 rounded-md ${registerResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                            <p className="font-semibold">{registerResult.message}</p>
                            {registerResult.error && (
                              <p className="mt-1 text-sm">
                                {typeof registerResult.error === 'object' 
                                  ? JSON.stringify(registerResult.error) 
                                  : registerResult.error}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
} 