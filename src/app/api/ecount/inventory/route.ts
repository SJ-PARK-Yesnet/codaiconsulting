import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { SESSION_ID, ZONE, PROD_CD, WH_CD, BASE_DATE, DOMAIN } = body;
    
    // 필요한 파라미터 검증
    if (!SESSION_ID || !ZONE) {
      return NextResponse.json(
        { success: false, message: '세션 ID와 ZONE이 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 날짜 포맷 확인 (YYYYMMDD)
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const date = BASE_DATE || today;
    
    // 도메인 설정 (로그인 API에서 사용한 도메인이 있으면 그것 우선 사용)
    const preferredDomain = DOMAIN || 'sboapi';
    
    // API 호출 함수
    const callApi = async (domain: string) => {
      const apiUrl = `https://${domain}${ZONE}.ecount.com/OAPI/V2/InventoryBalance/GetListInventoryBalanceStatusByLocation?SESSION_ID=${SESSION_ID}`;
      const requestData = {
        PROD_CD: PROD_CD || '',
        WH_CD: WH_CD || '',
        BASE_DATE: date
      };

      console.log(`재고 현황 API 요청 (${domain}):`, apiUrl);
      console.log('요청 데이터:', JSON.stringify(requestData));
      
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        // 응답 상태 로깅
        console.log(`${domain} 응답 상태:`, response.status, response.statusText);
        if (!response.ok) {
          console.error(`${domain} 응답 에러:`, response.status, response.statusText);
          const errorText = await response.text();
          console.error(`${domain} 에러 내용:`, errorText);
        }
        
        return { response, domain };
      } catch (error) {
        console.error(`${domain} 호출 중 오류 발생:`, error);
        return { 
          response: { 
            ok: false, 
            status: 500, 
            statusText: '네트워크 오류', 
            text: async () => `${error}`,
            json: async () => ({ error: `${error}` })
          } as Response, 
          domain 
        };
      }
    };
    
    // 로그인에서 사용한 도메인을 우선적으로 시도
    let { response, domain } = await callApi(preferredDomain);
    
    // 실패 시 다른 도메인으로 재시도
    if (!response.ok) {
      const otherDomain = preferredDomain === 'oapi' ? 'sboapi' : 'oapi';
      console.log(`${preferredDomain} 호출 실패 (${response.status}), ${otherDomain}로 재시도합니다.`);
      const result = await callApi(otherDomain);
      response = result.response;
      domain = result.domain;
    }
    
    // 최종 결과 처리
    if (!response.ok) {
      console.error(`API 오류 (${domain}): ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { success: false, message: `API 요청 실패: ${response.status} ${response.statusText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log(`재고 현황 API 응답 (${domain}):`, JSON.stringify(data).substring(0, 200) + '...');
    
    // 이카운트 API 응답 형식 확인 및 처리
    if (data && data.Data) {
      return NextResponse.json({
        success: true,
        data: data.Data,
        domain: domain // 어떤 도메인으로 성공했는지 정보 추가
      });
    } else {
      return NextResponse.json(
        { success: false, message: '재고 현황 조회에 실패했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('재고 현황 API 호출 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 