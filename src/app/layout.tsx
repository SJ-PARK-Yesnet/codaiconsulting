import React from 'react'
import '../styles/globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import DropdownMenus from '../components/DropdownMenus'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '예스넷(주) 이카운트 ERP 컨설팅 서비스',
  description: '귀사에 가장 적합한 ERP 시스템을 찾아드립니다. 이카운트 ERP 전문 컨설팅 서비스를 제공합니다.',
  keywords: 'ERP, 이카운트, 컨설팅, IT, 도입, 맞춤형, 교육, 운영, 예스넷',
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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SGYF6ZSPH6"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SGYF6ZSPH6');
          `
        }} />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-white`}>
        <header className="bg-white sticky top-0 z-10 h-24 border-b border-gray-100 flex items-center justify-center" style={{fontFamily:'Pretendard, system-ui, sans-serif'}}>
          <div className="w-full max-w-[1440px] flex items-center justify-between px-20 h-24">
            {/* 좌측: 로고 */}
            <Link href="/" className="flex items-center min-w-[147px]">
              <img
                src="/yesnet-logo.png"
                alt="예스넷 로고"
                className="h-[22px] w-auto"
                style={{ minWidth: 126 }}
              />
            </Link>
            {/* 우측: 메뉴 & 버튼 */}
            <DropdownMenus />
            {/* 모바일 메뉴(햄버거) */}
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
        
        <footer className="bg-[#FDFDFD] w-full pt-20 pb-10 px-4 border-t border-gray-100" style={{fontFamily:'Pretendard, system-ui, sans-serif'}}>
          <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              {/* 로고 */}
              <div className="flex-shrink-0 flex items-start mb-8 md:mb-0">
                <img src="/yesnet-logo.png" alt="예스넷 로고" className="h-8 w-auto" />
              </div>
              {/* 네비게이션 메뉴 */}
              <div className="flex flex-wrap gap-12 md:gap-16 w-full justify-end">
                {/* ERP 컨설팅 */}
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <span className="text-[18px] font-medium text-[#1F2123] mb-1">ERP 컨설팅</span>
                  <Link href="/company-info" className="text-[14px] text-[#4B5563] hover:text-blue-500 transition-colors">ERP 추천</Link>
                  <Link href="/ecount-consulting" className="text-[14px] text-[#4B5563] hover:text-blue-500 transition-colors">이카운트ERP 컨설팅</Link>
                </div>
                {/* API 분석 */}
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <span className="text-[18px] font-medium text-[#1F2123] mb-1">API 분석</span>
                  <Link href="/api-test" className="text-[14px] text-[#4B5563] hover:text-blue-500 transition-colors">API 연동</Link>
                  <Link href="/api-score" className="text-[14px] text-[#4B5563] hover:text-blue-500 transition-colors">API 점검</Link>
                  <Link href="/docs/ecount-api" className="text-[14px] text-[#4B5563] hover:text-blue-500 transition-colors">API 활용</Link>
                  <Link href="/api-example" className="text-[14px] text-[#4B5563] hover:text-blue-500 transition-colors">API 가이드</Link>
                </div>
                {/* ERP 비교 */}
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <span className="text-[18px] font-medium text-[#1F2123] mb-1">ERP 비교</span>
                  <Link href="/erp-comparison" className="text-[14px] text-[#4B5563] hover:text-blue-500 transition-colors">ERP 비교</Link>
                </div>
                {/* FAQ */}
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <span className="text-[18px] font-medium text-[#1F2123] mb-1">FAQ</span>
                  <Link href="/faq" className="text-[14px] text-[#4B5563] hover:text-blue-500 transition-colors">FAQ</Link>
                </div>
              </div>
            </div>
            {/* 하단부: 카피라이트 & 소셜 */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100 pt-8">
              <div className="text-xs text-[#9DA8B8]">ⓒ 2025. Yesnet Corp. All Rights Reserved.</div>
              <div className="flex gap-6">
                <a href="https://yesneterp.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="홈페이지">
                  <img src="/assets/Homepage.svg" alt="홈페이지" width={24} height={24} />
                </a>
                <a href="https://blog.naver.com/yesneterp" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="블로그">
                  <img src="/assets/Blog.svg" alt="블로그" width={24} height={24} />
                </a>
                <a href="https://www.youtube.com/@ERP" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="유튜브">
                  <img src="/assets/Youtube.svg" alt="유튜브" width={24} height={24} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}