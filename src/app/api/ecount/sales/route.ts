import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 요청 본문에서 데이터 추출
    const body = await request.json();
    
    // 업로드 페이지에서 전송하는 형식과 기존 형식 모두 지원
    let data;
    let sessionId, zone, domain;
    
    if (body.data) {
      // 업로드 페이지에서 전송하는 형식
      data = body.data;
      sessionId = body.SESSION_ID || 'default_session';
      zone = body.ZONE || 'BA';
      domain = body.DOMAIN || 'sboapi';
    } else {
      // 기존 형식
      const { SESSION_ID, ZONE, DOMAIN, SALE_DATA } = body;
      data = SALE_DATA ? [SALE_DATA] : [];
      sessionId = SESSION_ID;
      zone = ZONE;
      domain = DOMAIN || 'sboapi';
    }

    // 필수 파라미터 검증
    if (!sessionId || !zone || !data || data.length === 0) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // API URL 구성
    const apiUrl = `https://${domain}${zone}.ecount.com/OAPI/V2/Sale/SaveSale?SESSION_ID=${sessionId}`;

    // 요청 데이터 구성
    const requestData = {
      "SaleList": data.map((item: any) => ({
        "BulkDatas": item
      }))
    };

    console.log('판매 등록 API URL:', apiUrl);
    console.log('판매 등록 요청 데이터:', requestData);

    // 이카운트 API 호출
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    // API 응답 처리
    const responseData = await response.json();
    console.log('이카운트 API 응답:', responseData);

    // 응답 반환
    if (responseData.Status === '200') {
      return NextResponse.json({
        success: true,
        message: '판매 등록 성공',
        data: responseData.Data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '판매 등록 실패',
        error: responseData.Message
      });
    }
  } catch (error) {
    console.error('판매 등록 API 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '판매 등록 중 오류가 발생했습니다.', 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 