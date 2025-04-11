/**
 * 이카운트 API 연동 유틸리티
 * 
 * VBA 코드를 참고하여 이카운트 API 연동 함수를 JavaScript로 구현
 */

/**
 * 회사코드로 Zone 정보를 가져오는 함수
 * @param companyCode 이카운트 회사 코드
 * @returns Zone 정보
 */
export const getZoneAndDomain = async (companyCode: string) => {
  const apiUrl = 'https://sboapi.ecount.com/OAPI/V2/Zone'
  const requestData = { COM_CODE: companyCode }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return {
      zone: data.Data.ZONE,
      status: 'success'
    }
  } catch (error) {
    console.error('Zone API 호출 오류:', error)
    return {
      zone: '',
      status: 'error',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    }
  }
}

/**
 * 이카운트 API 로그인 함수
 * @param companyCode 회사 코드
 * @param userId 사용자 ID
 * @param apiKey API 인증 키
 * @param zone Zone 정보
 * @returns 세션 ID
 */
export const getSessionId = async (
  companyCode: string,
  userId: string,
  apiKey: string,
  zone: string
) => {
  // 고정값 설정
  const lanType = 'ko-KR'
  
  // API 엔드포인트 생성
  const apiUrl = `https://oapi${zone}.ecount.com/OAPI/V2/OAPILogin`
  
  // 요청 데이터 구성
  const requestData = {
    COM_CODE: companyCode,
    USER_ID: userId,
    API_CERT_KEY: apiKey,
    LAN_TYPE: lanType,
    ZONE: zone
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return {
      sessionId: data.Data.Datas.SESSION_ID,
      status: 'success'
    }
  } catch (error) {
    console.error('Login API 호출 오류:', error)
    return {
      sessionId: '',
      status: 'error',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    }
  }
}

/**
 * 판매 API 호출 함수
 * @param sessionId 세션 ID
 * @param zone Zone 정보
 * @returns 
 */
export const sendSale = async (sessionId: string, zone: string) => {
  // API 엔드포인트 생성
  const apiUrl = `https://sboapi${zone}.ecount.com/OAPI/V2/Sale/SaveSale?SESSION_ID=${sessionId}`
  
  // 요청 데이터 구성
  const requestData = {
    SaleList: [
      {
        BulkDatas: {
          WH_CD: '100',
          PROD_CD: '1',
          QTY: 1
        }
      }
    ]
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return {
      successCount: data.Data.SuccessCnt,
      status: 'success'
    }
  } catch (error) {
    console.error('판매 API 호출 오류:', error)
    return {
      successCount: 0,
      status: 'error',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    }
  }
}

/**
 * 품목 등록 API 호출 함수
 * @param sessionId 세션 ID
 * @param zone Zone 정보
 * @returns 
 */
export const sendProd = async (sessionId: string, zone: string) => {
  // API 엔드포인트 생성
  const apiUrl = `https://sboapi${zone}.ecount.com/OAPI/V2/InventoryBasic/SaveBasicProduct?SESSION_ID=${sessionId}`
  
  // 요청 데이터 구성
  const requestData = {
    ProductList: [
      {
        BulkDatas: {
          PROD_CD: 'TEST',
          PROD_DES: 'TEST'
        }
      }
    ]
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return {
      successCount: data.Data.SuccessCnt,
      status: 'success'
    }
  } catch (error) {
    console.error('품목 등록 API 호출 오류:', error)
    return {
      successCount: 0,
      status: 'error',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    }
  }
}

/**
 * 창고별 재고현황 API 호출 함수
 * @param sessionId 세션 ID
 * @param zone Zone 정보
 * @returns 
 */
export const getInventoryBalanceWH = async (
  sessionId: string, 
  zone: string, 
  prodCd: string = '', 
  whCd: string = ''
) => {
  // API 엔드포인트 생성
  const apiUrl = `https://sboapi${zone}.ecount.com/OAPI/V2/InventoryBalance/GetListInventoryBalanceStatusByLocation?SESSION_ID=${sessionId}`
  
  // 현재 날짜 포맷팅 (YYYYMMDD)
  const today = new Date()
  const baseDate = today.getFullYear() + 
                  ('0' + (today.getMonth() + 1)).slice(-2) + 
                  ('0' + today.getDate()).slice(-2)
  
  // 요청 데이터 구성
  const requestData = {
    PROD_CD: prodCd,
    WH_CD: whCd,
    BASE_DATE: baseDate
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return {
      results: data.Data.Result,
      status: 'success'
    }
  } catch (error) {
    console.error('창고별 재고현황 API 호출 오류:', error)
    return {
      results: [],
      status: 'error',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    }
  }
}

/**
 * 품목 조회 API 호출 함수
 * @param sessionId 세션 ID
 * @param zone Zone 정보
 * @returns 
 */
export const getProdCode = async (sessionId: string, zone: string) => {
  // API 엔드포인트 생성
  const apiUrl = `https://sboapi${zone}.ecount.com/OAPI/V2/InventoryBasic/GetBasicProductsList?SESSION_ID=${sessionId}`
  
  // 요청 데이터 구성
  const requestData = {
    PROD_CD: ''
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return {
      results: data.Data.Result,
      status: 'success'
    }
  } catch (error) {
    console.error('품목 조회 API 호출 오류:', error)
    return {
      results: [],
      status: 'error',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    }
  }
} 