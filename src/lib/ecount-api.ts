/**
 * 이카운트 API 통합
 * 
 * 기본 API 흐름:
 * 1. 회사코드(COM_CODE)로 Zone API 호출하여 Zone값 얻기
 * 2. 회사코드(COM_CODE), 사용자ID(USER_ID), API Key(API_CERT_KEY), Zone으로 로그인API 호출하여 세션ID 얻기
 * 3. 나머지 API는 Zone과 세션ID를 포함하여 호출
 */

// Zone API 호출
export async function getZoneAndDomain(companyCode: string) {
  const apiUrl = "https://sboapi.ecount.com/OAPI/V2/Zone";
  const requestData = { COM_CODE: companyCode };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.Status !== 0) {
      throw new Error(`Zone API 에러: ${data.Error?.Message || '알 수 없는 오류'}`);
    }

    return {
      status: 'success',
      zone: data.Data.ZONE,
      domain: data.Data.URL || '',
      message: '서버 연결 성공'
    };
  } catch (error) {
    return {
      status: 'error',
      zone: '',
      domain: '',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// 로그인 API 호출
export async function getSessionId(
  companyCode: string, 
  userId: string, 
  apiKey: string, 
  zone: string
) {
  const apiUrl = `https://oapi${zone.toLowerCase()}.ecount.com/OAPI/V2/OAPILogin`;
  const requestData = {
    COM_CODE: companyCode,
    USER_ID: userId,
    API_CERT_KEY: apiKey,
    LAN_TYPE: 'ko-KR',
    ZONE: zone
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.Status !== 0) {
      throw new Error(`로그인 API 에러: ${data.Error?.Message || '알 수 없는 오류'}`);
    }

    return {
      status: 'success',
      sessionId: data.Data.Datas.SESSION_ID,
      message: '로그인 성공'
    };
  } catch (error) {
    return {
      status: 'error',
      sessionId: '',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// 품목 조회 API
export async function getProdCode(sessionId: string, zone: string) {
  const apiUrl = `https://sboapi${zone.toLowerCase()}.ecount.com/OAPI/V2/InventoryBasic/GetBasicProductsList?SESSION_ID=${sessionId}`;
  const requestData = { PROD_CD: "" };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.Status !== 0) {
      throw new Error(`품목 조회 API 에러: ${data.Error?.Message || '알 수 없는 오류'}`);
    }

    return {
      status: 'success',
      results: data.Data.Result || [],
      message: '품목 조회 성공'
    };
  } catch (error) {
    return {
      status: 'error',
      results: [],
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// 창고별 재고 현황 API
export async function getInventoryBalanceWH(sessionId: string, zone: string) {
  const apiUrl = `https://sboapi${zone.toLowerCase()}.ecount.com/OAPI/V2/InventoryBalance/GetListInventoryBalanceStatusByLocation?SESSION_ID=${sessionId}`;
  const requestData = { 
    PROD_CD: "", 
    WH_CD: "", 
    BASE_DATE: new Date().toISOString().split('T')[0].replace(/-/g, '')
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.Status !== 0) {
      throw new Error(`재고 조회 API 에러: ${data.Error?.Message || '알 수 없는 오류'}`);
    }

    return {
      status: 'success',
      results: data.Data.Result || [],
      message: '재고 조회 성공'
    };
  } catch (error) {
    return {
      status: 'error',
      results: [],
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// 판매 데이터 등록 API (테스트용)
export async function testSaveTransaction(sessionId: string, zone: string) {
  const apiUrl = `https://sboapi${zone.toLowerCase()}.ecount.com/OAPI/V2/Sale/SaveSale?SESSION_ID=${sessionId}`;
  const requestData = { 
    SaleList: [
      {
        BulkDatas: {
          WH_CD: "100",
          PROD_CD: "1",
          QTY: 1
        }
      }
    ]
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.Status !== 0) {
      throw new Error(`판매 데이터 등록 API 에러: ${data.Error?.Message || '알 수 없는 오류'}`);
    }

    return {
      status: 'success',
      successCount: data.Data.SuccessCnt,
      message: '판매 데이터 등록 성공'
    };
  } catch (error) {
    return {
      status: 'error',
      successCount: 0,
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
} 