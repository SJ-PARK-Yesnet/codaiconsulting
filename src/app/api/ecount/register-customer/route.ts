import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { SESSION_ID, ZONE, DOMAIN, CUST } = body;

    // 필수 파라미터 검증
    if (!SESSION_ID || !ZONE || !CUST || !CUST.CUST_CD || !CUST.CUST_DES) {
      return NextResponse.json({
        success: false,
        message: '필수 파라미터가 누락되었습니다.'
      }, { status: 400 });
    }

    // API 도메인 설정 (테스트 또는 실제 환경)
    const apiDomain = DOMAIN || 'sboapi';
    
    // 이카운트 거래처 등록 API 호출
    const apiUrl = `https://${apiDomain}${ZONE}.ecount.com/OAPI/V2/AccountBasic/SaveBasicCust?SESSION_ID=${SESSION_ID}`;

    // API 요청 본문 구성
    const requestBody = {
      "CustList": [{
        "BulkDatas": {
          "CUST_CD": CUST.CUST_CD,
          "CUST_DES": CUST.CUST_DES,
          "BIZ_NO": CUST.BIZ_NO || '',
          "CEO_NM": CUST.CEO_NM || '',
          "ADDR": CUST.ADDR || '',
          "TEL": CUST.TEL || '',
        }
      }]
    };
    
    console.log('거래처 등록 API 요청:', apiUrl);
    console.log('요청 데이터:', JSON.stringify(requestBody));

    // API 요청 전송
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('이카운트 API 응답:', data);

    // 응답 확인 및 결과 반환
    if (data.Status === "200") {
      return NextResponse.json({
        success: true,
        message: '거래처가 성공적으로 등록되었습니다.',
        data: data.Data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.Message || '거래처 등록에 실패했습니다.',
        errorCode: data.Status
      });
    }
  } catch (error) {
    console.error('거래처 등록 API 오류:', error);
    return NextResponse.json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: (error as Error).message
    }, { status: 500 });
  }
} 