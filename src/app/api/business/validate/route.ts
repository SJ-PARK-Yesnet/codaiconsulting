import { NextResponse } from 'next/server';

// API 키 (환경변수로 관리하는 것이 좋지만 예제에서는 직접 사용)
const API_KEY = 'q7ZHxRIxDS5HlfShjSHI5dMqMfU5Xw8PfQ9MJIUk37Mp%2BmAyv798S%2F7d%2F5VbDhHu0D0Zf9MdP831IlMjMvCD2A%3D%3D';

export async function POST(request: Request) {
  try {
    const { businessNumber } = await request.json();
    
    // 사업자번호 필수 값 확인
    if (!businessNumber) {
      return NextResponse.json(
        { error: '사업자등록번호는 필수값입니다.' }, 
        { status: 400 }
      );
    }
    
    // 사업자번호에서 하이픈 제거
    const cleanBusinessNumber = businessNumber.replace(/-/g, '');
    
    // 사업자등록 상태조회 API 호출
    const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${API_KEY}`;
    const requestData = {
      b_no: [cleanBusinessNumber]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: '국세청 API 호출 실패', details: errorText }, 
        { status: 500 }
      );
    }

    const result = await response.json();
    
    // 사업자 상태 확인
    const businessStatus = result.data?.[0]?.b_stt;
    const isActive = businessStatus === '계속사업자';
    
    return NextResponse.json({
      isValid: result.status_code === 'OK' && result.match_cnt > 0,
      isActive,
      businessStatus,
      data: result.data?.[0] || null
    });
    
  } catch (error: any) {
    console.error('사업자등록번호 검증 오류:', error);
    return NextResponse.json(
      { error: '사업자등록번호 검증 중 오류가 발생했습니다.', details: error.message }, 
      { status: 500 }
    );
  }
} 