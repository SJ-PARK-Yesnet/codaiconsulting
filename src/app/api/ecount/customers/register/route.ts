import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 요청 본문에서 필요한 데이터 추출
    const { SESSION_ID, ZONE, DOMAIN, CUST } = await request.json();

    // 필수 파라미터 검증
    if (!SESSION_ID || !ZONE || !CUST) {
      return NextResponse.json(
        { error: 'SESSION_ID, ZONE, CUST 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // API 도메인 설정 (기본값은 sboapi)
    const apiDomain = DOMAIN || 'sboapi';

    // API URL 구성 - 수정됨
    const apiUrl = `https://${apiDomain}${ZONE}.ecount.com/OAPI/V2/AccountBasic/SaveBasicCust?SESSION_ID=${SESSION_ID}`;

    // 요청 데이터 구성 - 수정됨
    const requestData = {
      "CustList": [
        {
          "BulkDatas": {
            "BUSINESS_NO": CUST.BUSINESS_NO,
            "CUST_NAME": CUST.CUST_NAME,
            "BOSS_NAME": CUST.BOSS_NAME || "",
            "TEL": CUST.TEL || "",
            "ADDR": CUST.ADDR || "",
            "UPTAE": "",
            "JONGMOK": "",
            "EMAIL": "",
            "POST_NO": "",
            "G_GUBUN": "",
            "G_BUSINESS_TYPE": "",
            "G_BUSINESS_CD": "",
            "TAX_REG_ID": "",
            "FAX": "",
            "HP_NO": "",
            "DM_POST": "",
            "DM_ADDR": "",
            "REMARKS_WIN": "",
            "GUBUN": "",
            "FOREIGN_FLAG": "",
            "EXCHANGE_CODE": "",
            "CUST_GROUP1": "",
            "CUST_GROUP2": "",
            "URL_PATH": "",
            "REMARKS": "",
            "OUTORDER_YN": "",
            "IO_CODE_SL_BASE_YN": "",
            "IO_CODE_SL": "",
            "IO_CODE_BY_BASE_YN": "",
            "IO_CODE_BY": "",
            "EMP_CD": "",
            "MANAGE_BOND_NO": "",
            "MANAGE_DEBIT_NO": "",
            "CUST_LIMIT": "",
            "O_RATE": "",
            "I_RATE": "",
            "PRICE_GROUP": "",
            "PRICE_GROUP2": "",
            "CUST_LIMIT_TERM": "",
            "CONT1": "",
            "CONT2": "",
            "CONT3": "",
            "CONT4": "",
            "CONT5": "",
            "CONT6": "",
            "NO_CUST_USER1": "",
            "NO_CUST_USER2": "",
            "NO_CUST_USER3": ""
          }
        }
      ]
    };

    console.log('거래처 등록 API URL:', apiUrl);
    console.log('거래처 등록 요청 데이터:', JSON.stringify(requestData, null, 2));

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
    console.log('이카운트 API 응답 전체:', JSON.stringify(responseData, null, 2));

    // 응답 반환
    if (responseData.Status === '200') {
      const successCount = responseData.Data?.SuccessCnt || 0;
      const resultDetails = responseData.Data?.ResultDetails || '';
      
      let resultMessage = '';
      let errorDetail = '';
      
      try {
        // ResultDetails는 JSON 문자열 형태로 반환될 수 있어 파싱 시도
        if (resultDetails) {
          const parsedDetails = JSON.parse(resultDetails);
          if (Array.isArray(parsedDetails) && parsedDetails.length > 0) {
            const totalError = parsedDetails[0].TotalError;
            // TotalError가 객체인 경우 문자열로 변환
            errorDetail = typeof totalError === 'object' && totalError !== null 
              ? JSON.stringify(totalError) 
              : totalError || '';
          }
        }
      } catch (e) {
        console.error('ResultDetails 파싱 오류:', e);
        errorDetail = resultDetails;
      }
      
      if (successCount > 0) {
        return NextResponse.json({
          success: true,
          message: '거래처 등록 성공',
          data: responseData.Data,
          successCount
        });
      } else {
        return NextResponse.json({
          success: false,
          message: '거래처 등록 실패',
          error: errorDetail,
          rawResponse: responseData.Data,
          successCount
        });
      }
    } else {
      const errorMessage = responseData.Message || '알 수 없는 오류';
      const errorDetail = responseData.Data?.MSG || responseData.Data?.Message || '';
      
      console.error('거래처 등록 실패 상세:', {
        status: responseData.Status,
        message: errorMessage,
        detail: errorDetail,
        fullResponse: responseData
      });
      
      return NextResponse.json({
        success: false,
        message: '거래처 등록 실패',
        error: errorDetail ? `${errorMessage} - ${errorDetail}` : errorMessage,
        rawResponse: responseData,
        successCount: 0
      });
    }
  } catch (error) {
    console.error('거래처 등록 API 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '거래처 등록 중 오류가 발생했습니다.', 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 