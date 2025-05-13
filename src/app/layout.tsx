import React from 'react'
import '../styles/globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '예스넷(주) 이카운트 ERP 컨설팅 서비스',
  description: '귀사에 가장 적합한 ERP 시스템을 찾아드립니다. 이카운트 ERP 전문 컨설팅 서비스를 제공합니다.',
  metadataBase: new URL('https://yesnet.kr'),
  openGraph: {
    title: '예스넷(주) 이카운트 ERP 컨설팅 서비스',
    description: '귀사에 가장 적합한 ERP 시스템을 찾아드립니다. 이카운트 ERP 전문 컨설팅 서비스를 제공합니다.',
    url: 'https://yesnet.kr',
    siteName: '예스넷(주)',
    locale: 'ko_KR',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
    shortcut: '/favicon.ico'
  },
  alternates: {
    canonical: 'https://yesnet.kr',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <img src="/yesnet-logo.png" alt="예스넷 로고" className="h-10" />
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">
                홈
              </Link>
              <Link href="/erp-comparison" className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">
                ERP 비교
              </Link>
              <a href="/faq" className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">
                자주 묻는 질문
              </a>
            </nav>
            <div className="flex md:hidden">
              <button className="text-gray-600 hover:text-blue-600 focus:outline-none">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-white mt-auto w-full py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-lg font-semibold mb-4 text-center">예스넷(주)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 왼쪽 열: 대표, 주소, 사업자등록번호 */}
              <div className="text-sm space-y-2">
                <p><span className="font-medium">대표:</span> 박승주</p>
                <p><span className="font-medium">주소:</span> 경기도 안양시 동안구 벌말로 66, 평촌역하이필드지식산업센터 B동 904호</p>
                <p><span className="font-medium">사업자등록번호:</span> 581-88-03426</p>
              </div>
              
              {/* 오른쪽 열: 이메일, 전화번호 */}
              <div className="text-sm space-y-2 md:text-right">
                <p><span className="font-medium">이메일:</span> yesnet@yesneterp.com</p>
                <p><span className="font-medium">전화번호:</span> 070.8657.2080</p>
              </div>
            </div>
            
            {/* 하단부 */}
            <div className="mt-6 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* 왼쪽: Copyright */}
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} 예스넷(주). All rights reserved.
              </div>
              
              {/* 오른쪽: 소셜 미디어 링크 */}
              <div className="flex gap-4 justify-center md:justify-end">
                <a href="https://www.youtube.com/@ERP" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
                <a href="https://blog.naver.com/yesneterp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3.5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5zM19 15V6.413l-5.293 5.293a1 1 0 0 1-1.414 0L8 7.413 5 10.413V15h14z" />
                  </svg>
                </a>
                <a href="https://yesneterp.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 6h2v3h3v2h-3v3h-2v-3H8V9h3V6zm-.5 8.5A1.5 1.5 0 0 1 12 13.5a1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1 0-3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 