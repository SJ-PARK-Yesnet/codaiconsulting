import { NextRequest, NextResponse } from 'next/server';

// 배포 설정: 이 API 라우트는 서버 사이드 렌더링으로 실행되어야 함
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { COM_CODE } = body;

    if (!COM_CODE) {
      return NextResponse.json(
        { success: false, message: '회사 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // 이카운트 Zone API 호출
    const apiUrl = 'https://sboapi.ecount.com/OAPI/V2/Zone';
    const requestData = { COM_CODE };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error(`API 오류: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { success: false, message: `API 요청 실패: ${response.status} ${response.statusText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // 이카운트 API 응답 형식 확인 및 처리
    if (data && data.Data) {
      return NextResponse.json({
        success: true,
        data: data.Data,
      });
    } else {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 응답 형식입니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Zone API 호출 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 