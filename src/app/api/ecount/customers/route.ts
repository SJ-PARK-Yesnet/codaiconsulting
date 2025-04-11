import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 요청 본문에서 필요한 데이터 추출
    const { SESSION_ID, ZONE, DOMAIN, SEARCH_TEXT } = await request.json();

    // 필수 파라미터 검증
    if (!SESSION_ID || !ZONE) {
      return NextResponse.json(
        { error: 'SESSION_ID와 ZONE 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // API 도메인 설정 (기본값은 sboapi)
    const apiDomain = DOMAIN || 'sboapi';

    // API URL 구성 (거래처 관리 API 사용)
    const apiUrl = `https://${apiDomain}${ZONE}.ecount.com/OAPI/V2/CustomerManagement/GetCustomersList?SESSION_ID=${SESSION_ID}`;

    // 요청 데이터 구성
    const requestData = {
      CUST_CD: SEARCH_TEXT || ''  // 검색어가 없으면 빈 문자열 사용
    };

    console.log('고객 조회 API URL:', apiUrl);
    console.log('고객 조회 요청 데이터:', requestData);

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
        message: '고객 조회 성공',
        data: responseData.Data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '고객 조회 실패',
        error: responseData.Message
      });
    }
  } catch (error) {
    console.error('고객 조회 API 오류:', error);
    return NextResponse.json(
      { success: false, message: '고객 조회 중 오류가 발생했습니다.', error: (error as Error).message },
      { status: 500 }
    );
  }
} 