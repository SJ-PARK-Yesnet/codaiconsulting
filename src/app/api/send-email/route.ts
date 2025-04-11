import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await req.json()
    const { to, from, subject, text } = body
    
    // 필수 필드 검증
    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: '모든 필수 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    console.log('이메일 발송 시도:', { to, from, subject })
    
    // 사용자가 제공한 실제 메일서버 정보 사용
    const smtpHost = 'wsmtp.ecount.com' // 보내는 서버: wsmtp.ecount.com
    const smtpPort = '587' // 포트: 587
    const smtpUser = 'nekisj@yesneterp.com' // 사용자 계정: nekisj@yesneterp.com
    const smtpPass = process.env.SMTP_PASS || '1q2w3e4r5t' // 비밀번호는 환경변수에서 가져오거나 기본값 사용
    const smtpSecure = false // 587 포트는 일반적으로 STARTTLS 사용
    
    console.log('SMTP 설정 정보:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass ? '설정됨' : '설정 안됨',
      secure: smtpSecure
    })
    
    // 트랜스포터 설정
    let transporter
    let testAccount
    let usingTestAccount = false
    
    // 실제 SMTP 서버 사용 시도
    const transportConfig = {
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      // SMTP 오류 디버깅 활성화
      debug: true,
      logger: true,
      tls: {
        // 안전하지 않은 인증서 허용 (개발 환경용)
        rejectUnauthorized: false
      }
    }
    
    console.log('SMTP 설정:', JSON.stringify({
      ...transportConfig,
      auth: { user: transportConfig.auth.user, pass: '********' }
    }))
    
    try {
      // 실제 SMTP 서버 접속 시도
      transporter = nodemailer.createTransport(transportConfig)
      
      // SMTP 연결 확인
      console.log('SMTP 서버 연결 확인 중...')
      await transporter.verify()
      console.log('SMTP 서버 연결 성공!')
    } catch (firstError) {
      console.error('기본 인증으로 SMTP 서버 연결 실패:', firstError)
      
      // LOGIN 인증 메커니즘으로 다시 시도
      try {
        console.log('LOGIN 인증 메커니즘으로 재시도...')
        const loginConfig = {
          ...transportConfig,
          auth: {
            ...transportConfig.auth,
            method: 'LOGIN'
          }
        }
        
        transporter = nodemailer.createTransport(loginConfig)
        await transporter.verify()
        console.log('LOGIN 메커니즘으로 SMTP 서버 연결 성공!')
      } catch (secondError) {
        console.error('LOGIN 인증으로 SMTP 서버 연결 실패:', secondError)
        
        // PLAIN 인증 메커니즘으로 다시 시도
        try {
          console.log('PLAIN 인증 메커니즘으로 재시도...')
          const plainConfig = {
            ...transportConfig,
            auth: {
              ...transportConfig.auth,
              method: 'PLAIN'
            }
          }
          
          transporter = nodemailer.createTransport(plainConfig)
          await transporter.verify()
          console.log('PLAIN 메커니즘으로 SMTP 서버 연결 성공!')
        } catch (thirdError) {
          console.error('모든 인증 메커니즘으로 연결 실패:', thirdError)
          console.log('테스트 계정으로 전환합니다.')
          
          // 테스트 계정으로 전환
          testAccount = await nodemailer.createTestAccount()
          transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          })
          usingTestAccount = true
        }
      }
    }
    
    // 이메일 발신자 설정
    const emailFrom = from || smtpUser || (usingTestAccount ? 'test@example.com' : 'nekisj@yesneterp.com')
    
    // 이메일 옵션 설정
    const mailOptions = {
      from: `"${usingTestAccount ? '테스트 발신자' : '예스넷(주) ERP 컨설팅'}" <${emailFrom}>`,
      to,
      subject: usingTestAccount ? `[테스트] ${subject}` : subject,
      text: usingTestAccount ? `이것은 테스트 이메일입니다.\n\n${text}` : text,
    }
    
    console.log('메일 옵션:', mailOptions)
    
    // 이메일 발송 시도
    try {
      const info = await transporter.sendMail(mailOptions)
      console.log('이메일 발송 성공:', info.messageId)
      
      // 응답 준비
      const response: any = { 
        success: true, 
        messageId: info.messageId
      }
      
      // 테스트 계정인 경우 미리보기 URL 추가
      if (usingTestAccount) {
        response.previewUrl = nodemailer.getTestMessageUrl(info)
        response.testMode = true
        response.message = '테스트 모드로 이메일이 발송되었습니다. 미리보기 URL을 확인하세요.'
        console.log('테스트 이메일 미리보기 URL:', response.previewUrl)
      }
      
      // 성공 응답 반환
      return NextResponse.json(response)
    } catch (sendError: any) {
      console.error('이메일 발송 실패:', sendError)
      console.error('상세 오류:', sendError.response || sendError.code || sendError.command)
      
      // 자세한 오류 정보 제공
      return NextResponse.json({
        error: `이메일 발송 실패: ${sendError.message}`,
        details: sendError.response || sendError.code || sendError.command,
        stack: process.env.NODE_ENV === 'development' ? sendError.stack : undefined
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('이메일 API 오류:', error)
    
    // 오류 응답
    return NextResponse.json(
      { 
        error: error.message || '이메일 발송 처리 중 오류가 발생했습니다.',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 