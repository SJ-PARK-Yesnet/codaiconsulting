import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { SESSION_ID, ZONE, PROD_CD = "", WH_CD = "", BASE_DATE } = await request.json();

    if (!SESSION_ID || !ZONE) {
      return NextResponse.json(
        { error: "세션 ID와 Zone 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // 기준일자 처리 (제공되지 않은 경우 오늘 날짜 사용)
    const today = new Date();
    const formattedDate = BASE_DATE || 
      `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    
    // API 엔드포인트 생성
    const apiUrl = `https://sboapi${ZONE}.ecount.com/OAPI/V2/InventoryBalance/GetListInventoryBalanceStatusByLocation?SESSION_ID=${SESSION_ID}`;
    
    // 요청 데이터 구성
    const requestData = {
      PROD_CD,
      WH_CD,
      BASE_DATE: formattedDate
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`이카운트 API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('창고별재고현황 API 호출 오류:', error);
    return NextResponse.json(
      { error: error.message || '창고별재고현황 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
} 