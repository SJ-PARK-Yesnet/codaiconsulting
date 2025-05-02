import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { COM_CODE, USER_ID, API_CERT_KEY, LAN_TYPE, ZONE } = body;

    // 필요한 파라미터 검증
    if (!COM_CODE || !USER_ID || !API_CERT_KEY || !ZONE) {
      return NextResponse.json(
        { success: false, message: '회사 코드, 사용자 ID, API 키, ZONE이 모두 필요합니다.' },
        { status: 400 }
      );
    }

    // sboapi와 oapi를 순차적으로 시도하는 함수
    const callApi = async (domain: string) => {
      const apiUrl = `https://${domain}${ZONE}.ecount.com/OAPI/V2/OAPILogin`;
      const requestData = {
        COM_CODE,
        USER_ID,
        API_CERT_KEY,
        LAN_TYPE: LAN_TYPE || 'ko-KR',
        ZONE
      };

      console.log(`로그인 API 요청 (${domain}):`, apiUrl);
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
          try {
            const errorText = await response.text();
            console.error(`${domain} 에러 내용:`, errorText);
          } catch (e) {
            console.error(`${domain} 에러 내용 읽기 실패:`, e);
          }
        } else {
          console.log(`${domain} 응답 성공`);
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
    
    // API 키 특성에 따라 적절한 도메인부터 시도
    // API KEY는 'oapi'에서, TEST KEY는 'sboapi'에서 먼저 시도
    const isTestKey = (API_CERT_KEY.length >= 40) || /TEST/i.test(API_CERT_KEY);
    const firstDomain = isTestKey ? 'sboapi' : 'oapi';
    const secondDomain = isTestKey ? 'oapi' : 'sboapi';
    
    console.log(`API 키 특성에 따라 먼저 시도할 도메인: ${firstDomain} (키 패턴: ${isTestKey ? 'TEST KEY' : 'API KEY'})`);
    
    // 첫 번째 도메인 시도
    let { response, domain } = await callApi(firstDomain);
    
    // 첫 번째 도메인 실패 시 두 번째 도메인으로 재시도
    if (!response.ok) {
      console.log(`${firstDomain} 호출 실패 (${response.status}), ${secondDomain}로 재시도합니다.`);
      const result = await callApi(secondDomain);
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

    // JSON 파싱 시도
    let data;
    try {
      data = await response.json();
      
      // 응답 메시지에 따른 도메인 전환
      if (data?.Data?.Message) {
        if (domain === 'sboapi' && data.Data.Message === "실서버용 인증키입니다.") {
          // 실서버용 인증키는 oapi로 전환
          console.log('실서버용 인증키 감지, oapi로 전환합니다.');
          const result = await callApi('oapi');
          response = result.response;
          domain = result.domain;
          
          if (!response.ok) {
            console.error(`API 오류 (${domain}): ${response.status} - ${response.statusText}`);
            return NextResponse.json(
              { success: false, message: `API 요청 실패: ${response.status} ${response.statusText}` },
              { status: 500 }
            );
          }
          
          // 새 응답 데이터로 갱신
          data = await response.json();
        } else if (domain === 'oapi' && data.Data.Message === "테스트용 인증키입니다.") {
          // 테스트용 인증키는 sboapi로 전환
          console.log('테스트용 인증키 감지, sboapi로 전환합니다.');
          const result = await callApi('sboapi');
          response = result.response;
          domain = result.domain;
          
          if (!response.ok) {
            console.error(`API 오류 (${domain}): ${response.status} - ${response.statusText}`);
            return NextResponse.json(
              { success: false, message: `API 요청 실패: ${response.status} ${response.statusText}` },
              { status: 500 }
            );
          }
          
          // 새 응답 데이터로 갱신
          data = await response.json();
        }
      }
    } catch (error) {
      console.error(`JSON 파싱 오류 (${domain}):`, error);
      const text = await response.text();
      console.error(`응답 텍스트:`, text);
      return NextResponse.json(
        { success: false, message: '응답 데이터 파싱에 실패했습니다.' },
        { status: 500 }
      );
    }
    
    // 전체 응답 데이터 로깅 (길이 제한)
    console.log(`로그인 API 응답 데이터 (${domain}):`, JSON.stringify(data).substring(0, 1000) + '...');
    
    // 이카운트 API 응답 형식 확인 및 처리
    let sessionId = '';
    let userName = '';
    let comName = '';
    
    // 응답 구조 디버깅을 위한 로깅 추가
    if (data && data.Data) {
      console.log(`${domain} Data 객체 구조:`, JSON.stringify(data.Data).substring(0, 1000) + '...');
      if (data.Data.Datas) {
        console.log(`${domain} Datas 객체 구조:`, JSON.stringify(data.Data.Datas).substring(0, 1000) + '...');
      }
    }
    
    // 객체를 재귀적으로 탐색하여 SESSION_ID 찾기
    const findSessionId = (obj: any, prefix = ''): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      
      // 직접 SESSION_ID 속성 확인 (대소문자 구분 없이)
      for (const key of Object.keys(obj)) {
        const upperKey = key.toUpperCase();
        if (upperKey === 'SESSION_ID' && obj[key]) {
          console.log(`세션 ID 찾음: ${prefix}.${key} = ${obj[key]}`);
          return obj[key];
        }
      }
      
      // 중첩 객체 탐색
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const result = findSessionId(obj[key], `${prefix}.${key}`);
          if (result) return result;
        }
      }
      
      return null;
    };
    
    // 세션 ID 재귀적 탐색 시도
    sessionId = findSessionId(data, 'data') || '';
    
    // 기존 방식으로도 시도 (특정 구조 검색)
    if (!sessionId && data) {
      // TESTKEY에서 자주 나타나는 구조 확인
      if (data.Data && typeof data.Data === 'object') {
        if (data.Data.Datas && data.Data.Datas.SESSION_ID) {
          // 일반 API KEY 응답 구조 (oapi)
          sessionId = data.Data.Datas.SESSION_ID;
          userName = data.Data.Datas.USER_NAME || '';
          comName = data.Data.Datas.COM_NAME || '';
        } else if (data.Data.SESSION_ID) {
          // TESTKEY 응답 구조 1 (sboapi)
          sessionId = data.Data.SESSION_ID;
          userName = data.Data.USER_ID || body.USER_ID || '';
          comName = data.Data.COM_NAME || body.COM_CODE || '';
        } else if (data.Data.Data && data.Data.Data.SESSION_ID) {
          // TESTKEY 응답 구조 2
          sessionId = data.Data.Data.SESSION_ID;
          userName = data.Data.Data.USER_ID || body.USER_ID || '';
          comName = data.Data.Data.COM_NAME || body.COM_CODE || '';
        }
      }
      
      // SESSION_ID가 최상위에 있는 경우
      if (!sessionId && data.SESSION_ID) {
        sessionId = data.SESSION_ID;
      }
    }
    
    if (sessionId) {
      // 응답 구조 로깅
      const responseData = {
        SESSION_ID: sessionId,
        USER_NAME: userName || body.USER_ID,
        COM_NAME: comName || body.COM_CODE
      };
      console.log(`변환된 응답 데이터 (${domain}):`, responseData);
      
      return NextResponse.json({
        success: true,
        data: responseData,
        domain: domain,
        rawData: domain === 'sboapi' ? data : undefined // TESTKEY(sboapi) 응답일 경우 전체 응답 포함
      });
    } else {
      console.error(`세션 ID를 찾을 수 없음 (${domain}):`, JSON.stringify(data));
      
      // 키 유형을 확인하여 사용자에게 안내
      let message = '로그인에 실패했습니다. 세션 ID를 찾을 수 없습니다.';
      
      if (data?.Data?.Message === "테스트용 인증키입니다.") {
        message = '테스트용 인증키입니다. sboapi 도메인을 사용해주세요.';
      } else if (data?.Data?.Message === "실서버용 인증키입니다.") {
        message = '실서버용 인증키입니다. oapi 도메인을 사용해주세요.';
      }
      
      return NextResponse.json({
        success: false, 
        message: message,
        rawData: data // 디버깅을 위해 전체 응답 포함
      }, { status: 401 });
    }
  } catch (error) {
    console.error('로그인 API 호출 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 