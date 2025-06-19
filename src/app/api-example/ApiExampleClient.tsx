"use client";

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

export default function ApiExampleClient() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">이카운트 API 연동 예제</h1>
      <p className="mb-8 text-gray-700 text-center">
        이카운트 ERP API 연동을 위한 실전 예제 코드와 활용 가이드를 제공합니다.<br />
        아래 예제는 실제 API 호출 흐름과 JSON 구조, 주요 사용법을 쉽게 이해할 수 있도록 구성되어 있습니다.
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Zone API 호출 예제</h2>
        <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto mb-2">
{`// 회사코드로 ZONE 조회
fetch('/api/ecount/zone', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ COM_CODE: '회사코드' })
})
  .then(res => res.json())
  .then(data => {
    // data.data.ZONE 사용
    console.log('ZONE:', data.data.ZONE);
  });`}
        </pre>
        <p className="text-gray-600 text-xs">※ 실제로는 회사코드(COM_CODE)를 입력해야 하며, 응답에서 ZONE 값을 추출합니다.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. 로그인 API 호출 예제</h2>
        <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto mb-2">
{`// ZONE, 회사코드, 사용자ID, API Key로 세션ID 발급
fetch('/api/ecount/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    COM_CODE: '회사코드',
    USER_ID: '사용자ID',
    API_CERT_KEY: 'API Key',
    ZONE: 'ZONE',
    LAN_TYPE: 'ko-KR'
  })
})
  .then(res => res.json())
  .then(data => {
    // data.data.SESSION_ID 사용
    console.log('SESSION_ID:', data.data.SESSION_ID);
  });`}
        </pre>
        <p className="text-gray-600 text-xs">※ ZONE, 회사코드, 사용자ID, API Key를 모두 입력해야 하며, 응답에서 SESSION_ID를 추출합니다.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. 품목 조회 API 예제</h2>
        <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto mb-2">
{`// 품목 리스트 조회 (SESSION_ID 필요)
fetch('/api/ecount/products/list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    SESSION_ID: '세션ID',
    ZONE: 'ZONE',
    DOMAIN: 'sboapi' // 또는 oapi
  })
})
  .then(res => res.json())
  .then(data => {
    // data.data.Result 배열 사용
    console.log('품목 목록:', data.data.Result);
  });`}
        </pre>
        <p className="text-gray-600 text-xs">※ SESSION_ID, ZONE, DOMAIN 값을 정확히 입력해야 하며, 결과는 Result 배열로 반환됩니다.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. 판매 등록 API 예제</h2>
        <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto mb-2">
{`// 판매 데이터 등록 (SESSION_ID 필요)
fetch('/api/ecount/sales', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    SESSION_ID: '세션ID',
    ZONE: 'ZONE',
    DOMAIN: 'sboapi',
    SaleList: [
      {
        BulkDatas: {
          WH_CD: '100',
          PROD_CD: '1',
          QTY: 1
        }
      }
    ]
  })
})
  .then(res => res.json())
  .then(data => {
    // data.data.SuccessCnt 등 사용
    console.log('등록 성공 건수:', data.data.SuccessCnt);
  });`}
        </pre>
        <p className="text-gray-600 text-xs">※ 실제 등록 시에는 품목코드, 창고코드, 수량 등 실제 데이터를 입력해야 합니다.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. 기타 참고</h2>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          <li>API 호출 시 <b>Content-Type</b>은 항상 <b>application/json</b>으로 지정해야 합니다.</li>
          <li>실제 서비스 연동 시에는 <b>API Key</b>와 <b>Test Key</b>의 구분, <b>ZONE</b> 값, <b>SESSION_ID</b> 관리에 주의하세요.</li>
          <li>API 응답 구조는 <b>data</b> 객체 내부에 실제 데이터가 포함되어 있습니다.</li>
          <li>API 호출 실패 시 <b>message</b> 필드에 오류 메시지가 반환됩니다.</li>
        </ul>
      </div>

      <div className="text-center text-xs text-gray-400 mt-10">
        © 예스넷(주) | 이카운트 ERP API 연동 예제 및 가이드
      </div>
    </div>
  );
} 