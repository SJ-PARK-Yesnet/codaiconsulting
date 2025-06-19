"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function DropdownMenus() {
  const [open, setOpen] = useState<"erp" | "api" | null>(null);
  const erpRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        open === "erp" &&
        erpRef.current &&
        !erpRef.current.contains(e.target as Node) &&
        (!apiRef.current || !apiRef.current.contains(e.target as Node))
      ) {
        setOpen(null);
      }
      if (
        open === "api" &&
        apiRef.current &&
        !apiRef.current.contains(e.target as Node) &&
        (!erpRef.current || !erpRef.current.contains(e.target as Node))
      ) {
        setOpen(null);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="hidden md:flex items-center gap-8">
      {/* ERP컨설팅 드롭다운 */}
      <div className="relative group" ref={erpRef}>
        <button
          className={`flex items-center gap-1 text-[#1F2123] font-normal text-[16px] leading-[1em] px-2 py-1 transition-colors duration-150 group-hover:text-blue-500 hover:text-blue-500 focus:outline-none ${open === "erp" ? "text-blue-500" : ""}`}
          type="button"
          onClick={() => setOpen(open === "erp" ? null : "erp")}
        >
          ERP 컨설팅
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* 드롭다운 메뉴 */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-white rounded-[14px] shadow-[0_24px_32px_4px_rgba(167,174,186,0.12),0_0_6px_0_rgba(193,200,210,0.3)] py-4 px-0 z-50 transition-all duration-200 ${
            open === "erp"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
          }`}
          style={{ minWidth: 184 }}
        >
          <div className="px-6 pb-2">
            <div className="text-[12px] font-semibold text-[#C1C8D2] tracking-widest uppercase mb-4" style={{ fontFamily: "Pretendard" }}>
              erp Solutions
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/company-info" className="text-[14px] font-semibold text-[#1F2123] hover:text-blue-500 transition-colors" style={{ fontFamily: "Pretendard" }}>
                ERP 추천
              </Link>
              <Link href="/ecount-consulting" className="text-[14px] font-normal text-[#1F2123] hover:text-blue-500 transition-colors" style={{ fontFamily: "Pretendard" }}>
                이카운트ERP 컨설팅
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* API 분석 드롭다운 */}
      <div className="relative group" ref={apiRef}>
        <button
          className={`flex items-center gap-1 text-[#1F2123] font-normal text-[16px] leading-[1em] px-2 py-1 transition-colors duration-150 group-hover:text-[#02D1FE] hover:text-[#02D1FE] focus:outline-none ${
            open === "api" ? "text-[#02D1FE]" : ""
          }`}
          type="button"
          onClick={() => setOpen(open === "api" ? null : "api")}
        >
          API 분석
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* 드롭다운 메뉴 */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-white rounded-[14px] shadow-[0_24px_32px_4px_rgba(167,174,186,0.12),0_0_6px_0_rgba(193,200,210,0.3)] py-4 px-0 z-50 transition-all duration-200 ${
            open === "api"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
          }`}
          style={{ minWidth: 184 }}
        >
          <div className="px-6 pb-2">
            <div className="text-[12px] font-semibold text-[#C1C8D2] tracking-widest uppercase mb-4" style={{ fontFamily: "Pretendard" }}>
              API Solutions
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/api-test" className="text-[14px] font-semibold text-[#1F2123] hover:text-[#02D1FE] transition-colors" style={{ fontFamily: "Pretendard" }}>
                API 연동
              </Link>
              <Link href="/api-score" className="text-[14px] font-normal text-[#111B29] hover:text-[#02D1FE] transition-colors" style={{ fontFamily: "Pretendard" }}>
                API 점검
              </Link>
              <Link href="/docs/ecount-api" className="text-[14px] font-normal text-[#111B29] hover:text-[#02D1FE] transition-colors" style={{ fontFamily: "Pretendard" }}>
                API 활용
              </Link>
              <Link href="/api-example" className="text-[14px] font-normal text-[#111B29] hover:text-[#02D1FE] transition-colors" style={{ fontFamily: "Pretendard" }}>
                API 가이드
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Link href="/erp-comparison" className="text-[#1F2123] hover:text-blue-500 font-normal text-[16px] leading-[1em] px-2 py-1">
        ERP 비교
      </Link>
      <Link href="/faq" className="text-[#1F2123] hover:text-blue-500 font-normal text-[16px] leading-[1em] px-2 py-1">
        FAQ
      </Link>
      {/* 버튼 그룹 */}
      <div className="flex items-center gap-4 ml-8">
        <Link
          href="/contact"
          className="rounded-full bg-[#F4F6F9] text-[#1F2123] font-medium px-6 py-2 text-[16px] leading-[1.5em] border border-[#F4F6F9] hover:bg-gray-200 transition-colors"
          style={{ minWidth: 104, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          문의하기
        </Link>
      </div>
    </div>
  );
} 