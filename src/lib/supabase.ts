import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Supabase 환경 변수 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 환경 변수가 제대로 설정되었는지 확인
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL 또는 Anon Key가 설정되지 않았습니다.')
}

// 개발 환경에서 콘솔에 환경 변수 값 출력
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl ? '설정됨' : '설정되지 않음')
  console.log('Supabase Anon Key:', supabaseAnonKey ? '설정됨' : '설정되지 않음')
}

// 테스트용 기본값 설정 - 실제 운영에서는 반드시 .env.local에 올바른 값을 설정해야 함
const fallbackUrl = 'https://xyzcompany.supabase.co' // 임시 기본값
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' // 임시 기본값

// Supabase 클라이언트 생성 - 유효한 URL 형식이 아닌 경우 기본값 사용
let validSupabaseUrl = supabaseUrl
let validSupabaseKey = supabaseAnonKey

try {
  // URL 형식이 유효한지 확인
  new URL(supabaseUrl)
} catch (e) {
  console.warn('Supabase URL이 유효하지 않습니다. 기본값을 사용합니다.')
  validSupabaseUrl = fallbackUrl
}

// 키가 비어있는 경우 기본값 사용
if (!supabaseAnonKey) {
  validSupabaseKey = fallbackKey
}

// Supabase 클라이언트 생성
export const supabase = createClient<Database>(validSupabaseUrl, validSupabaseKey)

// 기업 정보 저장
export async function saveCompanyInfo(companyData: any) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('기업 정보 저장 오류:', error)
    return { data: null, error }
  }
}

// 질문지 응답 저장
export async function saveQuestionnaire(questionnaireData: any) {
  try {
    const { data, error } = await supabase
      .from('questionnaires')
      .insert([questionnaireData])
      .select()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('질문지 응답 저장 오류:', error)
    return { data: null, error }
  }
}

// 추천 결과 저장
export async function saveRecommendation(recommendationData: any) {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .insert([recommendationData])
      .select()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('추천 결과 저장 오류:', error)
    return { data: null, error }
  }
}

// 연락 요청 저장
export async function saveContactRequest(contactData: any) {
  try {
    const { data, error } = await supabase
      .from('contact_requests')
      .insert([contactData])
      .select()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('연락 요청 저장 오류:', error)
    return { data: null, error }
  }
}

// 기업 정보 조회
export async function getCompanyInfo(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('기업 정보 조회 오류:', error)
    return { data: null, error }
  }
}

// 추천 결과 조회
export async function getRecommendation(companyId: string) {
  try {
    // single()을 사용하지 않고 보통의 쿼리로 변경
    const { data, error } = await supabase
      .from('recommendations')
      .select(`
        *,
        companies(*),
        questionnaires(*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('Supabase 쿼리 오류:', error)
      throw error
    }
    
    // 결과가 없는 경우를 명시적으로 처리
    if (!data || data.length === 0) {
      return { data: null, error: null }
    }
    
    return { data: data[0], error: null }
  } catch (error: any) {
    console.error('추천 결과 조회 오류:', error)
    const errorMessage = error.message || '알 수 없는 오류'
    const errorDetails = error.details || ''
    console.error(`상세 오류: ${errorMessage}, 세부정보: ${errorDetails}`)
    return { data: null, error }
  }
}

// 이카운트 컨설팅 저장
export async function saveEcountConsulting(data: any) {
  try {
    console.log('저장 시도 데이터:', data)
    // 필수 필드 확인
    if (!data.business_number) {
      throw new Error('사업자번호는 필수 입력 항목입니다.')
    }
    
    const { data: result, error } = await supabase
      .from('ecount_consultings')
      .insert([data])
      .select()
    
    if (error) {
      console.error('Supabase 오류 상세:', error)
      throw error
    }
    
    if (!result || result.length === 0) {
      throw new Error('데이터 삽입 후 결과가 반환되지 않았습니다.')
    }
    
    return { data: result, error: null }
  } catch (error: any) {
    console.error('이카운트 컨설팅 저장 오류:', error)
    // 더 자세한 오류 메시지 반환
    return { 
      data: null, 
      error: {
        message: error.message || '이카운트 컨설팅 저장 중 오류가 발생했습니다.',
        details: error.details || error.hint || JSON.stringify(error)
      }
    }
  }
}

// 이카운트 컨설팅 이메일 요청 저장
export async function saveEcountEmailRequest(data: any) {
  try {
    const { data: result, error } = await supabase
      .from('ecount_email_requests')
      .insert([data])
      .select()
    
    if (error) throw error
    return { data: result, error: null }
  } catch (error) {
    console.error('이카운트 이메일 요청 저장 오류:', error)
    return { data: null, error }
  }
}

// 이카운트 컨설팅 조회
export async function getEcountConsulting(id: string) {
  try {
    const { data, error } = await supabase
      .from('ecount_consultings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('이카운트 컨설팅 조회 오류:', error)
    return { data: null, error }
  }
}

// 이메일 발송 함수
export async function sendEmail(emailData: {
  to: string;
  from: string;
  subject: string;
  text: string;
}) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '이메일 발송 중 오류가 발생했습니다.');
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('이메일 발송 오류:', error);
    return { data: null, error };
  }
}

// 문의 메시지 저장
export async function saveContactMessage(contactData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        ...contactData,
        created_at: new Date().toISOString(),
        is_read: false
      }])
      .select()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('문의 메시지 저장 오류:', error)
    return { data: null, error }
  }
} 