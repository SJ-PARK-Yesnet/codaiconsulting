import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import dns from 'dns'
import { promisify } from 'util'

// DNS 조회 함수 프로미스화
const resolveMx = promisify(dns.resolveMx)

// MX 레코드 타입 정의
interface MxRecord {
  priority: number;
  exchange: string;
}

export async function GET() {
  try {
    console.log('SMTP 서버 연결 테스트 시작')
    
    // 사용자가 제공한 실제 메일서버 정보 사용
    const smtpHost = 'wsmtp.ecount.com' // 보내는 서버: wsmtp.ecount.com
    const smtpPort = '587' // 포트: 587
    const smtpUser = 'nekisj@yesneterp.com' // 사용자 계정: nekisj@yesneterp.com
    const smtpPass = process.env.SMTP_PASS || '1q2w3e4r5t' // 비밀번호는 환경변수에서 가져오거나 기본값 사용
    const smtpSecure = false // 587 포트는 일반적으로 STARTTLS 사용
    const emailFrom = 'nekisj@yesneterp.com'
    
    // 추가 정보 출력
    console.log('이메일 도메인 추출:', emailFrom.split('@')[1])
    
    // 도메인 MX 레코드 확인 (이메일 서버 정보)
    let mxRecords: MxRecord[] = []
    try {
      const domain = emailFrom.split('@')[1]
      mxRecords = await resolveMx(domain)
      console.log(`${domain}의 MX 레코드:`, mxRecords)
    } catch (err) {
      console.error('MX 레코드 조회 실패:', err)
    }
    
    console.log('SMTP 설정 정보:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass ? '설정됨' : '설정 안됨',
      secure: smtpSecure
    })
    
    // 서버 정보가 모두 설정되어 있는지 확인
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      return NextResponse.json({
        success: false,
        error: 'SMTP 설정이 올바르게 지정되지 않았습니다.',
        missingVariables: {
          SMTP_HOST: !smtpHost,
          SMTP_PORT: !smtpPort,
          SMTP_USER: !smtpUser,
          SMTP_PASS: !smtpPass
        }
      })
    }
    
    // 메일 서버 정보 출력
    console.log('이메일 서버 설정 정보:');
    console.log('- 보내는 서버(SMTP): wsmtp.ecount.com:587');
    console.log('- 받는 서버(IMAP): wmbox4.ecount.com:143');
    console.log('- 사용자 계정: nekisj@yesneterp.com');
    
    // 다양한 인증 메커니즘 시도 (CRAM-MD5 제외)
    const authMechanisms = [
      // 기본 인증
      {
        name: 'DEFAULT',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      },
      // LOGIN 인증 메커니즘
      {
        name: 'LOGIN',
        auth: {
          user: smtpUser,
          pass: smtpPass,
          method: 'LOGIN'
        }
      },
      // PLAIN 인증 메커니즘
      {
        name: 'PLAIN',
        auth: {
          user: smtpUser,
          pass: smtpPass,
          method: 'PLAIN'
        }
      }
      // CRAM-MD5 제외 (이전 테스트에서 지원하지 않음 확인)
    ]
    
    let successfulAuth = null
    let lastError = null
    
    // 각 인증 메커니즘을 시도
    for (const mechanism of authMechanisms) {
      // 트랜스포터 설정
      const transportConfig = {
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: smtpSecure,
        auth: mechanism.auth,
        // 오류 디버깅 활성화
        debug: true,
        logger: true,
        connectionTimeout: 10000, // 10초
        tls: {
          // 안전하지 않은 인증서 허용 (개발 환경용)
          rejectUnauthorized: false
        }
      }
      
      console.log(`[${mechanism.name}] 인증 메커니즘 테스트:`, JSON.stringify({
        ...transportConfig,
        auth: { ...mechanism.auth, pass: '********' }
      }))
      
      // 트랜스포터 생성
      const transporter = nodemailer.createTransport(transportConfig)
      
      try {
        // SMTP 연결 확인
        console.log(`[${mechanism.name}] SMTP 서버 연결 확인 중...`)
        await transporter.verify()
        console.log(`[${mechanism.name}] SMTP 서버 연결 성공!`)
        
        // 성공한 인증 메커니즘 기록
        successfulAuth = mechanism
        break
      } catch (error: any) {
        console.error(`[${mechanism.name}] SMTP 서버 연결 실패:`, error)
        console.error('상세 오류:', error.response || error.code || error.command)
        lastError = error
      }
    }
    
    // 결과 반환
    if (successfulAuth) {
      return NextResponse.json({
        success: true,
        message: `SMTP 서버 연결에 성공했습니다. (인증 메커니즘: ${successfulAuth.name})`,
        smtpSettings: {
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          user: smtpUser,
          authMechanism: successfulAuth.name
        },
        mxRecords
      })
    } else {
      // SMTP 서버 연결 실패 시 추가 정보
      return NextResponse.json({
        success: false,
        error: lastError ? `SMTP 서버 연결 실패: ${lastError.message}` : '알 수 없는 오류',
        errorCode: lastError?.code,
        errorResponse: lastError?.response,
        errorCommand: lastError?.command,
        mxRecords,
        suggestion: '자격 증명(ID/PW)이 올바른지 확인하고, 메일 서버 관리자에게 문의하세요.',
        troubleshooting: [
          '1. SMTP 서버 주소(wsmtp.ecount.com)와 포트번호(587)가 올바른지 확인하세요.',
          '2. 이메일 계정(nekisj@yesneterp.com)과 비밀번호가 정확한지 확인하세요.',
          '3. 해당 이메일 계정이 SMTP 접근을 허용하는지 확인하세요.',
          '4. 방화벽이나 네트워크 정책이 SMTP 연결을 차단하고 있지 않은지 확인하세요.',
          '5. 2단계 인증을 사용 중이라면, 앱 비밀번호를 생성하여 사용하세요.'
        ],
        stack: process.env.NODE_ENV === 'development' ? lastError?.stack : undefined
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('SMTP 연결 테스트 오류:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'SMTP 연결 테스트 중 오류가 발생했습니다.',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
} 