"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
// 필요한 추가 import 유지

const Tabs = dynamic(() => import('@/components/ui/tabs').then(mod => mod.Tabs), { ssr: false });
const TabsContent = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsContent), { ssr: false });
const TabsList = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsList), { ssr: false });
const TabsTrigger = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsTrigger), { ssr: false });

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card), { ssr: false });
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => mod.CardContent), { ssr: false });
const CardDescription = dynamic(() => import('@/components/ui/card').then(mod => mod.CardDescription), { ssr: false });
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => mod.CardHeader), { ssr: false });
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle), { ssr: false });

const Accordion = dynamic(() => import('@/components/ui/accordion').then(mod => mod.Accordion), { ssr: false });
const AccordionContent = dynamic(() => import('@/components/ui/accordion').then(mod => mod.AccordionContent), { ssr: false });
const AccordionItem = dynamic(() => import('@/components/ui/accordion').then(mod => mod.AccordionItem), { ssr: false });
const AccordionTrigger = dynamic(() => import('@/components/ui/accordion').then(mod => mod.AccordionTrigger), { ssr: false });

export default function EcountApiDocsPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isClient, setIsClient] = useState(false);
    
    // 클라이언트 사이드에서만 렌더링하도록 함
    useEffect(() => {
      setIsClient(true);
    }, []);
    
    if (!isClient) {
      return <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">이카운트 API 개발 가이드</h1>
        <p className="text-gray-700 mb-8">로딩 중...</p>
      </div>;
    }
    
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">이카운트 API 개발 가이드</h1>
        <p className="text-gray-700 mb-8">
          이카운트 API를 사용하여 이카운트 ERP와 외부 시스템을 연동하는 방법에 대한 가이드입니다.
        </p>
  
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="auth">인증</TabsTrigger>
            <TabsTrigger value="apis">주요 API</TabsTrigger>
            <TabsTrigger value="examples">예제 코드</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
  
          {/* 개요 탭 */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>이카운트 API 개요</CardTitle>
                <CardDescription>
                  이카운트 API의 기본 구조와 사용 방법
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">API 기본 구조</h3>
                <ol className="list-decimal ml-6 space-y-2">
                  <li>회사코드(COM_CODE)를 받아서 Zone API 호출하여 Zone값 받음</li>
                  <li>회사코드(COM_CODE), 사용자ID(USER_ID), API Key(API_CERT_KEY), Zone을 받아서 로그인API 호출하여 세션ID(SESSION_ID) 받음</li>
                  <li>나머지 API 호출 시 Zone과 세션ID를 Request URL에 담아 POST방식으로 호출함</li>
                  <li>API Key(API_CERT_KEY)값은 두 종류로 API Key와 Test Key가 존재함</li>
                  <li>Test Key로 URL호출시에는 https://sboapi로 시작하는 URL을 호출하며, API Key로 호출하는 경우는 https://oapi로 URL을 호출함</li>
                  <li>Zone API, 로그인 API가 아닌 API를 Test Key로 1회 이상 정상 호출하는 경우 앞으로는 Test Key를 사용하지 아니하며, 1회 이상 정상 호출된 경우 API Key값을 입력하도록 유도해야함</li>
                </ol>
  
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">API 호출 흐름</h4>
                  <div className="flex flex-col space-y-2">
                    <div className="p-3 bg-white rounded border border-blue-200">
                      1. Zone API 호출 → Zone 획득
                    </div>
                    <div className="flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div className="p-3 bg-white rounded border border-blue-200">
                      2. 로그인 API 호출 → 세션ID 획득
                    </div>
                    <div className="flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div className="p-3 bg-white rounded border border-blue-200">
                      3. 기타 API 호출 → 데이터 처리
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
  
          {/* 인증 탭 */}
          <TabsContent value="auth">
            <Card>
              <CardHeader>
                <CardTitle>인증 및 세션 관리</CardTitle>
                <CardDescription>
                  이카운트 API 인증 과정 및 세션 관리 방법
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">1. Zone API</h3>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium mb-2">엔드포인트</h4>
                  <code className="bg-gray-100 p-2 rounded block text-sm">
                    https://sboapi.ecount.com/OAPI/V2/Zone
                  </code>
                  <h4 className="font-medium mt-4 mb-2">요청 데이터</h4>
                  <pre className="bg-gray-100 p-2 rounded block text-sm overflow-auto">
                    {`{\n  "COM_CODE": "회사코드"\n}`}
                  </pre>
                  <h4 className="font-medium mt-4 mb-2">응답 예시</h4>
                  <pre className="bg-gray-100 p-2 rounded block text-sm overflow-auto">
                    {`{\n  "Data": {\n    "ZONE": "BA"\n  }\n}`}
                  </pre>
                </div>
  
                <h3 className="text-xl font-semibold">2. 로그인 API</h3>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium mb-2">엔드포인트</h4>
                  <code className="bg-gray-100 p-2 rounded block text-sm">
                    https://oapi{'{ZONE}'}.ecount.com/OAPI/V2/OAPILogin
                  </code>
                  <p className="text-sm text-gray-600 mt-1 mb-2">* {'{ZONE}'}에 Zone API에서 받은 ZONE 값을 대입</p>
                  <h4 className="font-medium mt-4 mb-2">요청 데이터</h4>
                  <pre className="bg-gray-100 p-2 rounded block text-sm overflow-auto">
                    {`{\n  "COM_CODE": "회사코드",\n  "USER_ID": "사용자ID",\n  "API_CERT_KEY": "API키",\n  "LAN_TYPE": "ko-KR",\n  "ZONE": "Zone값"\n}`}
                  </pre>
                  <h4 className="font-medium mt-4 mb-2">응답 예시</h4>
                  <pre className="bg-gray-100 p-2 rounded block text-sm overflow-auto">
                    {`{\n  "Data": {\n    "Datas": {\n      "SESSION_ID": "세션ID값"\n    }\n  }\n}`}
                  </pre>
                </div>
  
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-2">API 키 타입 구분</h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><span className="font-medium">Test Key:</span> 테스트 용도로 사용, URL 패턴은 <code className="bg-yellow-100 px-1 py-0.5 rounded">https://sboapi{'{ZONE}'}.ecount.com/...</code></li>
                    <li><span className="font-medium">API Key:</span> 실제 운영 환경에서 사용, URL 패턴은 <code className="bg-yellow-100 px-1 py-0.5 rounded">https://oapi{'{ZONE}'}.ecount.com/...</code></li>
                    <li>Test Key로 1회 이상 정상 호출 시, 이후에는 API Key 사용 필요</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
  
          {/* 주요 API 탭 */}
          <TabsContent value="apis">
            <Card>
              <CardHeader>
                <CardTitle>주요 API 목록</CardTitle>
                <CardDescription>
                  자주 사용하는 이카운트 API 목록 및 사용 방법
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>판매 API</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">판매 저장 API</h4>
                          <h5 className="text-sm font-medium">엔드포인트</h5>
                          <code className="bg-gray-100 p-2 rounded block text-sm mb-4">
                            https://sboapi{'{ZONE}'}.ecount.com/OAPI/V2/Sale/SaveSale?SESSION_ID={'{SESSION_ID}'}
                          </code>
                          <h5 className="text-sm font-medium">요청 데이터 예시</h5>
                          <pre className="bg-gray-100 p-2 rounded block text-sm overflow-auto">
                            {`{\n  "SaleList": [\n    {\n      "BulkDatas": {\n        "WH_CD": "100",\n        "PROD_CD": "1",\n        "QTY": 1\n      }\n    }\n  ]\n}`}
                          </pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>품목 API</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">품목 등록 API</h4>
                          <h5 className="text-sm font-medium">엔드포인트</h5>
                          <code className="bg-gray-100 p-2 rounded block text-sm mb-4">
                            https://sboapi{'{ZONE}'}.ecount.com/OAPI/V2/InventoryBasic/SaveBasicProduct?SESSION_ID={'{SESSION_ID}'}
                          </code>
                          <h5 className="text-sm font-medium">요청 데이터 예시</h5>
                          <pre className="bg-gray-100 p-2 rounded block text-sm overflow-auto">
                            {`{\n  "ProductList": [\n    {\n      "BulkDatas": {\n        "PROD_CD": "TEST",\n        "PROD_DES": "TEST"\n      }\n    }\n  ]\n}`}
                          </pre>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">품목 조회 API</h4>
                          <h5 className="text-sm font-medium">엔드포인트</h5>
                          <code className="bg-gray-100 p-2 rounded block text-sm mb-4">
                            https://sboapi{'{ZONE}'}.ecount.com/OAPI/V2/InventoryBasic/GetBasicProductsList?SESSION_ID={'{SESSION_ID}'}
                          </code>
                          <h5 className="text-sm font-medium">요청 데이터 예시</h5>
                          <pre className="bg-gray-100 p-2 rounded block text-sm overflow-auto">
                            {`{\n  "PROD_CD": ""\n}`}
                          </pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>재고 API</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">창고별 재고현황 API</h4>
                          <h5 className="text-sm font-medium">엔드포인트</h5>
                          <code className="bg-gray-100 p-2 rounded block text-sm mb-4">
                            https://sboapi{'{ZONE}'}.ecount.com/OAPI/V2/InventoryBalance/GetListInventoryBalanceStatusByLocation?SESSION_ID={'{SESSION_ID}'}
                          </code>
                          <h5 className="text-sm font-medium">요청 데이터 예시</h5>
                          <pre className="bg-gray-100 p-2 rounded block text-sm overflow-auto">
                            {`{\n  "PROD_CD": "",\n  "WH_CD": "",\n  "BASE_DATE": "20240401"\n}`}
                          </pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
  
          {/* 예제 코드 탭 */}
          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>예제 코드</CardTitle>
                <CardDescription>
                  이카운트 API 활용 예제 코드
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="javascript" className="w-full mb-6">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="csharp">C#</TabsTrigger>
                    <TabsTrigger value="java">Java</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="javascript">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">JavaScript 예제</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Zone API 호출</h4>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-auto">
                          {`// Zone API 호출
  const getZone = async (companyCode) => {
    try {
      const response = await fetch('https://sboapi.ecount.com/OAPI/V2/Zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ COM_CODE: companyCode })
      });
      
      const result = await response.json();
      return result.Data.ZONE;
    } catch (error) {
      console.error('Zone API 호출 실패:', error);
      throw error;
    }
  };`}
                        </pre>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">로그인 API 호출</h4>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-auto">
                          {`// 로그인 API 호출
  const login = async (companyCode, userId, apiKey, zone) => {
    try {
      const response = await fetch(\`https://oapi\${zone}.ecount.com/OAPI/V2/OAPILogin\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          COM_CODE: companyCode,
          USER_ID: userId,
          API_CERT_KEY: apiKey,
          LAN_TYPE: 'ko-KR',
          ZONE: zone
        })
      });
      
      const result = await response.json();
      return result.Data.Datas.SESSION_ID;
    } catch (error) {
      console.error('로그인 API 호출 실패:', error);
      throw error;
    }
  };`}
                        </pre>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">품목 조회 API 호출</h4>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-auto">
                          {`// 품목 조회 API 호출
  const getProducts = async (zone, sessionId) => {
    try {
      const response = await fetch(
        \`https://sboapi\${zone}.ecount.com/OAPI/V2/InventoryBasic/GetBasicProductsList?SESSION_ID=\${sessionId}\`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            PROD_CD: ""
          })
        }
      );
      
      const result = await response.json();
      return result.Data.Result;
    } catch (error) {
      console.error('품목 조회 API 호출 실패:', error);
      throw error;
    }
  };`}
                        </pre>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">API 전체 흐름 예제</h4>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-auto">
                          {`// 이카운트 API 연동 전체 흐름
  const ecountApiExample = async () => {
    const companyCode = 'YOUR_COMPANY_CODE';
    const userId = 'YOUR_USER_ID';
    const apiKey = 'YOUR_API_KEY';
    
    try {
      // 1. Zone 획득
      const zone = await getZone(companyCode);
      console.log('Zone:', zone);
      
      // 2. 로그인하여 세션ID 획득
      const sessionId = await login(companyCode, userId, apiKey, zone);
      console.log('세션ID:', sessionId);
      
      // 3. 품목 정보 조회
      const products = await getProducts(zone, sessionId);
      console.log('품목 목록:', products);
      
      // 4. 필요한 비즈니스 로직 실행
      // ...
      
    } catch (error) {
      console.error('이카운트 API 연동 실패:', error);
    }
  };
  
  // 실행
  ecountApiExample();`}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="csharp">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">C# 예제</h4>
                      <p>C# 예제는 다음 업데이트에 추가될 예정입니다.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="java">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Java 예제</h4>
                      <p>Java 예제는 다음 업데이트에 추가될 예정입니다.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
  
          {/* FAQ 탭 */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>자주 묻는 질문</CardTitle>
                <CardDescription>
                  이카운트 API 관련 자주 묻는 질문과 답변
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>
                      Test Key와 API Key의 차이점은 무엇인가요?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700">
                        Test Key는 개발 및 테스트 환경에서 사용하는 키로, URL 패턴은 <code className="bg-gray-100 px-1 py-0.5 rounded">https://sboapi{'{ZONE}'}.ecount.com/...</code>과 같습니다.
                        API Key는 실제 운영 환경에서 사용하는 키로, URL 패턴은 <code className="bg-gray-100 px-1 py-0.5 rounded">https://oapi{'{ZONE}'}.ecount.com/...</code>과 같습니다.
                        Test Key로 1회 이상 정상 호출하면 이후에는 API Key를 사용해야 합니다.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="faq-2">
                    <AccordionTrigger>
                      세션ID의 유효 기간은 얼마인가요?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-700">
                        세션ID는 기본적으로 자동로그아웃 시간에 따라 만료됩니다.
                        세션이 만료되면 로그인 API를 다시 호출하여 새로운 세션ID를 발급받아야 합니다.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="faq-3">
                    <AccordionTrigger>
                      API 호출 시 자주 발생하는 오류는 무엇인가요?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p className="text-gray-700">이카운트 API 호출 시 자주 발생하는 오류는 다음과 같습니다:</p>
                        <ul className="list-disc ml-6 space-y-1">
                          <li>세션 만료: 세션ID가 만료되어 재로그인이 필요한 경우</li>
                          <li>권한 부족: API를 호출하는 사용자 계정에 해당 기능에 대한 권한이 없는 경우</li>
                          <li>유효하지 않은 파라미터: 요청 데이터 형식이 잘못되었거나 필수 파라미터가 누락된 경우</li>
                          <li>회사 정보 오류: 존재하지 않는 회사 코드를 사용한 경우</li>
                          <li>API 호출 제한: 단위 시간당 API 호출 횟수를 초과한 경우</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="faq-4">
                    <AccordionTrigger>
                      API 개발 환경을 어떻게 설정하나요?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p className="text-gray-700">이카운트 API 개발 환경을 설정하는 단계는 다음과 같습니다:</p>
                        <ol className="list-decimal ml-6 space-y-1">
                          <li>이카운트 가입 및 승인</li>
                          <li>테스트용 회사 생성 및 테스트 환경 설정</li>
                          <li>API 인증 키(Test Key) 발급</li>
                          <li>개발 도구 및 라이브러리 준비 (HTTP 클라이언트 등)</li>
                          <li>Zone API 및 로그인 API를 통한 기본 연동 테스트</li>
                          <li>필요한 API 기능 구현 및 테스트</li>
                          <li>정식 환경 전환 및 API Key 발급</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  } 