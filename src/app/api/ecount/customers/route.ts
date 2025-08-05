import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 요청 본문에서 데이터 추출
    const body = await request.json();
    
    // 필수 파라미터 추출
    const { data, SESSION_ID, ZONE, DOMAIN } = body;
    const sessionId = SESSION_ID || 'default_session';
    const zone = ZONE || 'BA';
    const domain = DOMAIN || 'sboapi';

    // 필수 파라미터 검증
    if (!sessionId || !zone) {
      return NextResponse.json(
        { error: 'SESSION_ID와 ZONE 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 고객 등록 API
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: '등록할 고객 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    const apiUrl = `https://${domain}${zone}.ecount.com/OAPI/V2/AccountBasic/SaveBasicCust?SESSION_ID=${sessionId}`;

    // 요청 데이터 구성
    const requestData = {
      "CustList": data.map((item: any) => ({
        "BulkDatas": item
      }))
    };

    console.log('고객 등록 API URL:', apiUrl);
    console.log('고객 등록 요청 데이터:', JSON.stringify(requestData, null, 2));
    console.log('전송할 데이터 개수:', data.length);

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

    // 응답 반환 - 더 자세한 응답 구조 확인
    if (responseData.Status === '200' || responseData.Code === '200') {
      return NextResponse.json({
        success: true,
        message: '고객 등록 성공',
        data: responseData.Data || responseData
      });
    } else {
      // 더 자세한 오류 정보 제공
      const errorMessage = responseData.Message || responseData.error || '알 수 없는 오류';
      console.error('고객 등록 실패 상세:', {
        Status: responseData.Status,
        Code: responseData.Code,
        Message: responseData.Message,
        Error: responseData.error,
        FullResponse: responseData
      });
      
      return NextResponse.json({
        success: false,
        message: `고객 등록 실패: ${errorMessage}`,
        error: errorMessage,
        details: responseData
      });
    }
  } catch (error) {
    console.error('고객 API 오류:', error);
    return NextResponse.json(
      { success: false, message: '고객 API 처리 중 오류가 발생했습니다.', error: (error as Error).message },
      { status: 500 }
    );
  }
} 