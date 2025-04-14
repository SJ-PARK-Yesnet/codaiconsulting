import { NextResponse } from 'next/server'
import { saveContactRequest } from '@/lib/supabase'

// 배포 설정: 이 API 라우트는 서버 사이드 렌더링으로 실행되어야 함
export const dynamic = 'force-dynamic';

// 이메일 발송 함수
async function sendEmail(data: any) {
  try {
    // 실제 이메일 발송 로직은 nodemailer 또는 다른 서비스를 사용해 구현
    // 예시로 console.log만 사용
    console.log('이메일 발송:', {
      to: 'yesnet@yesneterp.com',
      subject: `[ERP 컨설팅 연락 요청] ${data.companyName}`,
      content: `
        사업자명: ${data.companyName}
        사업자번호: ${data.businessNumber}
        추천 ERP: ${data.recommendedERP}
        추가 문의사항: ${data.additionalInfo || '없음'}
      `
    })
    
    return { success: true }
  } catch (error) {
    console.error('이메일 발송 오류:', error)
    return { success: false, error }
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // 데이터 유효성 검사
    if (!data.companyId || !data.recommendationId) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }
    
    // Supabase에 연락 요청 데이터 저장
    const { data: contactData, error: contactError } = await saveContactRequest({
      company_id: data.companyId,
      recommendation_id: data.recommendationId,
      additional_info: data.additionalInfo,
      request_ip: request.headers.get('x-forwarded-for') || 'unknown',
      created_at: new Date().toISOString()
    })
    
    if (contactError) {
      console.error('연락 요청 저장 오류:', contactError)
      return NextResponse.json(
        { error: '연락 요청을 저장하는 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
    
    // 이메일 발송
    const emailResult = await sendEmail(data)
    
    if (!emailResult.success) {
      return NextResponse.json(
        { error: '이메일 발송 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: '연락 요청이 성공적으로 처리되었습니다.'
    })
    
  } catch (error) {
    console.error('연락 요청 처리 오류:', error)
    return NextResponse.json(
      { error: '요청을 처리하는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 