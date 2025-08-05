'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExcelData {
  [key: string]: any;
}

interface ApiField {
  name: string;
  description: string;
  required: boolean;
}

interface ApiConfig {
  name: string;
  endpoint: string;
  fields: ApiField[];
}

interface EcountConfig {
  comCode: string;
  userId: string;
  apiKey: string;
  zone: string;
  sessionId: string;
}

const API_CONFIGS: ApiConfig[] = [
     {
     name: '품목등록',
     endpoint: '/api/ecount/products',
     fields: [
       { name: 'PROD_CD', description: '품목코드', required: true },
       { name: 'PROD_DES', description: '품목명', required: true },
       { name: 'SIZE_FLAG', description: '규격구분', required: false },
       { name: 'SIZE_DES', description: '규격', required: false },
       { name: 'UNIT', description: '단위', required: false },
       { name: 'PROD_TYPE', description: '품목구분', required: false },
       { name: 'SET_FLAG', description: '세트여부', required: false },
       { name: 'BAL_FLAG', description: '재고수량관리', required: false },
       { name: 'WH_CD', description: '생산공정', required: false },
       { name: 'IN_PRICE', description: '입고단가', required: false },
       { name: 'IN_PRICE_VAT', description: '입고단가Vat포함여부', required: false },
       { name: 'OUT_PRICE', description: '출고단가', required: false },
       { name: 'OUT_PRICE_VAT', description: '출고단가Vat포함여부', required: false },
       { name: 'REMARKS_WIN', description: '검색창내용', required: false },
       { name: 'CLASS_CD', description: '그룹코드', required: false },
       { name: 'CLASS_CD2', description: '그룹코드2', required: false },
       { name: 'CLASS_CD3', description: '그룹코드3', required: false },
       { name: 'BAR_CODE', description: '바코드', required: false },
       { name: 'VAT_YN', description: '부가세율(매출)구분', required: false },
       { name: 'TAX', description: '부가가치세율', required: false },
       { name: 'VAT_RATE_BY_BASE_YN', description: '부가세율(매입)구분', required: false },
       { name: 'VAT_RATE_BY', description: '부가세율(매입)', required: false },
       { name: 'CS_FLAG', description: 'C-Portal사용여부', required: false },
       { name: 'REMARKS', description: '적요', required: false },
       { name: 'INSPECT_TYPE_CD', description: '품질검사유형', required: false },
       { name: 'INSPECT_STATUS', description: '품질검사방법', required: false },
       { name: 'SAMPLE_PERCENT', description: '샘플링비율', required: false },
       { name: 'SAFE_A0001', description: '안전재고관리-주문서', required: false },
       { name: 'SAFE_A0002', description: '안전재고관리-판매', required: false },
       { name: 'SAFE_A0003', description: '안전재고관리-생산불출', required: false },
       { name: 'SAFE_A0004', description: '안전재고관리-생산입고', required: false },
       { name: 'SAFE_A0005', description: '안전재고관리-창고이동', required: false },
       { name: 'SAFE_A0006', description: '안전재고관리-자가사용', required: false },
       { name: 'SAFE_A0007', description: '안전재고관리-불량처리', required: false },
       { name: 'CSORD_C0001', description: 'C-Portal최소주문수량체크', required: false },
       { name: 'CSORD_TEXT', description: 'C-Portal최소주문수량', required: false },
       { name: 'CSORD_C0003', description: 'C-Portal최소주문단위', required: false },
       { name: 'IN_TERM', description: '조달기간', required: false },
       { name: 'MIN_QTY', description: '최소구매단위', required: false },
       { name: 'CUST', description: '구매처', required: false },
       { name: 'OUT_PRICE1', description: '단가A', required: false },
       { name: 'OUT_PRICE1_VAT_YN', description: '단가A VAT포함여부', required: false },
       { name: 'OUT_PRICE2', description: '단가B', required: false },
       { name: 'OUT_PRICE2_VAT_YN', description: '단가B VAT포함여부', required: false },
       { name: 'OUT_PRICE3', description: '단가C', required: false },
       { name: 'OUT_PRICE3_VAT_YN', description: '단가C VAT포함여부', required: false },
       { name: 'OUT_PRICE4', description: '단가D', required: false },
       { name: 'OUT_PRICE4_VAT_YN', description: '단가D VAT포함여부', required: false },
       { name: 'OUT_PRICE5', description: '단가E', required: false },
       { name: 'OUT_PRICE5_VAT_YN', description: '단가E VAT포함여부', required: false },
       { name: 'OUT_PRICE6', description: '단가F', required: false },
       { name: 'OUT_PRICE6_VAT_YN', description: '단가F VAT포함여부', required: false },
       { name: 'OUT_PRICE7', description: '단가G', required: false },
       { name: 'OUT_PRICE7_VAT_YN', description: '단가G VAT포함여부', required: false },
       { name: 'OUT_PRICE8', description: '단가H', required: false },
       { name: 'OUT_PRICE8_VAT_YN', description: '단가H VAT포함여부', required: false },
       { name: 'OUT_PRICE9', description: '단가I', required: false },
       { name: 'OUT_PRICE9_VAT_YN', description: '단가I VAT포함여부', required: false },
       { name: 'OUT_PRICE10', description: '단가J', required: false },
       { name: 'OUT_PRICE10_VAT_YN', description: '단가J VAT포함여부', required: false },
       { name: 'OUTSIDE_PRICE', description: '외주비단가', required: false },
       { name: 'OUTSIDE_PRICE_VAT', description: '외주비단가 VAT포함여부', required: false },
       { name: 'LABOR_WEIGHT', description: '노무비단가', required: false },
       { name: 'EXPENSES_WEIGHT', description: '경비가중치', required: false },
       { name: 'MATERIAL_COST', description: '재료비표준원가', required: false },
       { name: 'EXPENSE_COST', description: '경비표준원가', required: false },
       { name: 'LABOR_COST', description: '노무비표준원가', required: false },
       { name: 'OUT_COST', description: '외주비표준원가', required: false },
       { name: 'CONT1', description: '문자형추가항목1', required: false },
       { name: 'CONT2', description: '문자형추가항목2', required: false },
       { name: 'CONT3', description: '문자형추가항목3', required: false },
       { name: 'CONT4', description: '문자형추가항목4', required: false },
       { name: 'CONT5', description: '문자형추가항목5', required: false },
       { name: 'CONT6', description: '문자형추가항목6', required: false },
       { name: 'NO_USER1', description: '숫자형추가항목1', required: false },
       { name: 'NO_USER2', description: '숫자형추가항목2', required: false },
       { name: 'NO_USER3', description: '숫자형추가항목3', required: false },
       { name: 'NO_USER4', description: '숫자형추가항목4', required: false },
       { name: 'NO_USER5', description: '숫자형추가항목5', required: false },
       { name: 'NO_USER6', description: '숫자형추가항목6', required: false },
       { name: 'NO_USER7', description: '숫자형추가항목7', required: false },
       { name: 'NO_USER8', description: '숫자형추가항목8', required: false },
       { name: 'NO_USER9', description: '숫자형추가항목9', required: false },
       { name: 'NO_USER10', description: '숫자형추가항목10', required: false },
       { name: 'ITEM_TYPE', description: '관리항목', required: false },
       { name: 'SERIAL_TYPE', description: '시리얼/로트', required: false },
       { name: 'PROD_SELL_TYPE', description: '생산전표생성-판매', required: false },
       { name: 'PROD_WHMOVE_TYPE', description: '생산전표생성-창고이동', required: false },
       { name: 'QC_BUY_TYPE', description: '품질검사요청-구매', required: false },
       { name: 'QC_YN', description: '품질검사요청여부', required: false }
     ]
   },
     {
     name: '거래처등록',
     endpoint: '/api/ecount/customers',
     fields: [
       { name: 'BUSINESS_NO', description: '사업자등록번호', required: true },
       { name: 'CUST_NAME', description: '회사명', required: true },
       { name: 'BOSS_NAME', description: '대표자명', required: false },
       { name: 'UPTAE', description: '업태', required: false },
       { name: 'JONGMOK', description: '종목', required: false },
       { name: 'TEL', description: '전화번호', required: false },
       { name: 'EMAIL', description: '이메일', required: false },
       { name: 'POST_NO', description: '우편번호', required: false },
       { name: 'ADDR', description: '주소', required: false },
       { name: 'G_GUBUN', description: '거래처코드구분', required: false },
       { name: 'G_BUSINESS_TYPE', description: '세무신고거래처구분', required: false },
       { name: 'G_BUSINESS_CD', description: '세무신고거래처코드', required: false },
       { name: 'TAX_REG_ID', description: '종사업장번호', required: false },
       { name: 'FAX', description: 'Fax', required: false },
       { name: 'HP_NO', description: '모바일', required: false },
       { name: 'DM_POST', description: 'DM우편번호', required: false },
       { name: 'DM_ADDR', description: 'DM주소', required: false },
       { name: 'REMARKS_WIN', description: '검색창내용', required: false },
       { name: 'GUBUN', description: '구분', required: false },
       { name: 'FOREIGN_FLAG', description: '외환거래처사용여부', required: false },
       { name: 'EXCHANGE_CODE', description: '외화코드', required: false },
       { name: 'CUST_GROUP1', description: '업무관련그룹', required: false },
       { name: 'CUST_GROUP2', description: '회계관련그룹', required: false },
       { name: 'URL_PATH', description: '홈페이지', required: false },
       { name: 'REMARKS', description: '적요', required: false },
       { name: 'OUTORDER_YN', description: '출하대상 거래처 구분', required: false },
       { name: 'IO_CODE_SL_BASE_YN', description: '거래유형(영업) 기본여부', required: false },
       { name: 'IO_CODE_SL', description: '거래유형(영업)', required: false },
       { name: 'IO_CODE_BY_BASE_YN', description: '거래유형(구매) 기본여부', required: false },
       { name: 'IO_CODE_BY', description: '거래유형(구매)', required: false },
       { name: 'EMP_CD', description: '담당자코드', required: false },
       { name: 'MANAGE_BOND_NO', description: '채권번호관리', required: false },
       { name: 'MANAGE_DEBIT_NO', description: '채무번호관리', required: false },
       { name: 'CUST_LIMIT', description: '거래처별여신한도', required: false },
       { name: 'O_RATE', description: '출고조정률', required: false },
       { name: 'I_RATE', description: '입고조정률', required: false },
       { name: 'PRICE_GROUP', description: '영업단가그룹', required: false },
       { name: 'PRICE_GROUP2', description: '구매단가그룹', required: false },
       { name: 'CUST_LIMIT_TERM', description: '여신기간', required: false },
       { name: 'CONT1', description: '문자형추가항목1', required: false },
       { name: 'CONT2', description: '문자형추가항목2', required: false },
       { name: 'CONT3', description: '문자형추가항목3', required: false },
       { name: 'CONT4', description: '문자형추가항목4', required: false },
       { name: 'CONT5', description: '문자형추가항목5', required: false },
       { name: 'CONT6', description: '문자형추가항목6', required: false },
       { name: 'NO_CUST_USER1', description: '숫자형추가항목1', required: false },
       { name: 'NO_CUST_USER2', description: '숫자형추가항목2', required: false },
       { name: 'NO_CUST_USER3', description: '숫자형추가항목3', required: false }
     ]
   },
  {
    name: '판매등록',
    endpoint: '/api/ecount/sales',
    fields: [
             { name: 'UPLOAD_SER_NO', description: '순번', required: false },
      { name: 'IO_DATE', description: '판매일자', required: false },
      { name: 'CUST', description: '거래처코드', required: false },
      { name: 'CUST_DES', description: '거래처명', required: false },
      { name: 'EMP_CD', description: '담당자', required: false },
      { name: 'WH_CD', description: '출하창고', required: true },
      { name: 'IO_TYPE', description: '구분(거래유형)', required: false },
      { name: 'EXCHANGE_TYPE', description: '외화종류', required: false },
      { name: 'EXCHANGE_RATE', description: '환율', required: false },
      { name: 'SITE', description: '부서', required: false },
      { name: 'PJT_CD', description: '프로젝트', required: false },
      { name: 'DOC_NO', description: '판매No.', required: false },
      { name: 'TTL_CTT', description: '제목', required: false },
      { name: 'U_MEMO1', description: '문자형식1', required: false },
      { name: 'U_MEMO2', description: '문자형식2', required: false },
      { name: 'U_MEMO3', description: '문자형식3', required: false },
      { name: 'U_MEMO4', description: '문자형식4', required: false },
      { name: 'U_MEMO5', description: '문자형식5', required: false },
      { name: 'ADD_TXT_01_T', description: '추가문자형식1', required: false },
      { name: 'ADD_TXT_02_T', description: '추가문자형식2', required: false },
      { name: 'ADD_TXT_03_T', description: '추가문자형식3', required: false },
      { name: 'ADD_TXT_04_T', description: '추가문자형식4', required: false },
      { name: 'ADD_TXT_05_T', description: '추가문자형식5', required: false },
      { name: 'ADD_TXT_06_T', description: '추가문자형식6', required: false },
      { name: 'ADD_TXT_07_T', description: '추가문자형식7', required: false },
      { name: 'ADD_TXT_08_T', description: '추가문자형식8', required: false },
      { name: 'ADD_TXT_09_T', description: '추가문자형식9', required: false },
      { name: 'ADD_TXT_10_T', description: '추가문자형식10', required: false },
      { name: 'ADD_NUM_01_T', description: '추가숫자형식1', required: false },
      { name: 'ADD_NUM_02_T', description: '추가숫자형식2', required: false },
      { name: 'ADD_NUM_03_T', description: '추가숫자형식3', required: false },
      { name: 'ADD_NUM_04_T', description: '추가숫자형식4', required: false },
      { name: 'ADD_NUM_05_T', description: '추가숫자형식5', required: false },
      { name: 'ADD_CD_01_T', description: '추가코드형식1', required: false },
      { name: 'ADD_CD_02_T', description: '추가코드형식2', required: false },
      { name: 'ADD_CD_03_T', description: '추가코드형식3', required: false },
      { name: 'ADD_DATE_01_T', description: '추가일자형식1', required: false },
      { name: 'ADD_DATE_02_T', description: '추가일자형식2', required: false },
      { name: 'ADD_DATE_03_T', description: '추가일자형식3', required: false },
      { name: 'U_TXT1', description: '장문형식1', required: false },
      { name: 'ADD_LTXT_01_T', description: '추가장문형식1', required: false },
      { name: 'ADD_LTXT_02_T', description: '추가장문형식2', required: false },
      { name: 'ADD_LTXT_03_T', description: '추가장문형식3', required: false },
      { name: 'PROD_CD', description: '품목코드', required: true },
      { name: 'PROD_DES', description: '품목명', required: false },
      { name: 'SIZE_DES', description: '규격', required: false },
      { name: 'UQTY', description: '추가수량', required: false },
      { name: 'QTY', description: '수량', required: true },
      { name: 'PRICE', description: '단가', required: false },
      { name: 'USER_PRICE_VAT', description: '단가(vat포함)', required: false },
      { name: 'SUPPLY_AMT', description: '공급가액(원화)', required: false },
      { name: 'SUPPLY_AMT_F', description: '공급가액[외화]', required: false },
      { name: 'VAT_AMT', description: '부가세', required: false },
      { name: 'REMARKS', description: '적요', required: false },
      { name: 'ITEM_CD', description: '관리항목', required: false },
      { name: 'P_REMARKS1', description: '적요1', required: false },
      { name: 'P_REMARKS2', description: '적요2', required: false },
      { name: 'P_REMARKS3', description: '적요3', required: false },
      { name: 'P_AMT1', description: '금액1', required: false },
      { name: 'P_AMT2', description: '금액2', required: false },
      { name: 'ADD_TXT_01', description: '추가문자형식1', required: false },
      { name: 'ADD_TXT_02', description: '추가문자형식2', required: false },
      { name: 'ADD_TXT_03', description: '추가문자형식3', required: false },
      { name: 'ADD_TXT_04', description: '추가문자형식4', required: false },
      { name: 'ADD_TXT_05', description: '추가문자형식5', required: false },
      { name: 'ADD_TXT_06', description: '추가문자형식6', required: false },
      { name: 'ADD_NUM_01', description: '추가숫자형식1', required: false },
      { name: 'ADD_NUM_02', description: '추가숫자형식2', required: false },
      { name: 'ADD_NUM_03', description: '추가숫자형식3', required: false },
      { name: 'ADD_NUM_04', description: '추가숫자형식4', required: false },
      { name: 'ADD_NUM_05', description: '추가숫자형식5', required: false },
      { name: 'ADD_CD_01', description: '추가코드형식코드1', required: false },
      { name: 'ADD_CD_02', description: '추가코드형식코드2', required: false },
      { name: 'ADD_CD_03', description: '추가코드형식코드3', required: false },
      { name: 'ADD_CD_NM_01', description: '추가코드형식명1', required: false },
      { name: 'ADD_CD_NM_02', description: '추가코드형식명2', required: false },
      { name: 'ADD_CD_NM_03', description: '추가코드형식명3', required: false },
      { name: 'ADD_DATE_01', description: '추가일자형식1', required: false },
      { name: 'ADD_DATE_02', description: '추가일자형식2', required: false },
      { name: 'ADD_DATE_03', description: '추가일자형식3', required: false }
    ]
  },
  {
    name: '견적서입력',
    endpoint: '/api/ecount/quotation',
    fields: [
      { name: 'UPLOAD_SER_NO', description: '순번', required: false },
      { name: 'IO_DATE', description: '견적서일자', required: false },
      { name: 'CUST', description: '거래처코드', required: false },
      { name: 'CUST_DES', description: '거래처명', required: false },
      { name: 'EMP_CD', description: '담당자', required: false },
      { name: 'WH_CD', description: '출하창고', required: false },
      { name: 'IO_TYPE', description: '구분(거래유형)', required: false },
      { name: 'EXCHANGE_TYPE', description: '외화종류', required: false },
      { name: 'EXCHANGE_RATE', description: '환율', required: false },
      { name: 'PJT_CD', description: '프로젝트', required: false },
      { name: 'DOC_NO', description: '견적No.', required: false },
      { name: 'TTL_CTT', description: '제목', required: false },
      { name: 'REF_DES', description: '참조', required: false },
      { name: 'COLL_TERM', description: '결제조건', required: false },
      { name: 'AGREE_TERM', description: '유효기간', required: false },
      { name: 'U_MEMO1', description: '문자형식1', required: false },
      { name: 'U_MEMO2', description: '문자형식2', required: false },
      { name: 'U_MEMO3', description: '문자형식3', required: false },
      { name: 'U_MEMO4', description: '문자형식4', required: false },
      { name: 'U_MEMO5', description: '문자형식5', required: false },
      { name: 'ADD_TXT_01_T', description: '추가문자형식1', required: false },
      { name: 'ADD_TXT_02_T', description: '추가문자형식2', required: false },
      { name: 'ADD_TXT_03_T', description: '추가문자형식3', required: false },
      { name: 'ADD_TXT_04_T', description: '추가문자형식4', required: false },
      { name: 'ADD_TXT_05_T', description: '추가문자형식5', required: false },
      { name: 'ADD_TXT_06_T', description: '추가문자형식6', required: false },
      { name: 'ADD_TXT_07_T', description: '추가문자형식7', required: false },
      { name: 'ADD_TXT_08_T', description: '추가문자형식8', required: false },
      { name: 'ADD_TXT_09_T', description: '추가문자형식9', required: false },
      { name: 'ADD_TXT_10_T', description: '추가문자형식10', required: false },
      { name: 'ADD_NUM_01_T', description: '추가숫자형식1', required: false },
      { name: 'ADD_NUM_02_T', description: '추가숫자형식2', required: false },
      { name: 'ADD_NUM_03_T', description: '추가숫자형식3', required: false },
      { name: 'ADD_NUM_04_T', description: '추가숫자형식4', required: false },
      { name: 'ADD_NUM_05_T', description: '추가숫자형식5', required: false },
      { name: 'ADD_CD_01_T', description: '추가코드형식1', required: false },
      { name: 'ADD_CD_02_T', description: '추가코드형식2', required: false },
      { name: 'ADD_CD_03_T', description: '추가코드형식3', required: false },
      { name: 'ADD_DATE_01_T', description: '추가일자형식1', required: false },
      { name: 'ADD_DATE_02_T', description: '추가일자형식2', required: false },
      { name: 'ADD_DATE_03_T', description: '추가일자형식3', required: false },
      { name: 'U_TXT1', description: '장문형식1', required: false },
      { name: 'ADD_LTXT_01_T', description: '추가장문형식1', required: false },
      { name: 'ADD_LTXT_02_T', description: '추가장문형식2', required: false },
      { name: 'ADD_LTXT_03_T', description: '추가장문형식3', required: false },
      { name: 'PROD_CD', description: '품목코드', required: true },
      { name: 'PROD_DES', description: '품목명', required: false },
      { name: 'SIZE_DES', description: '규격', required: false },
      { name: 'UQTY', description: '추가수량', required: false },
      { name: 'QTY', description: '주문수량', required: true },
      { name: 'PRICE', description: '견적단가', required: false },
      { name: 'USER_PRICE_VAT', description: '단가(vat포함)', required: false },
      { name: 'SUPPLY_AMT', description: '공급가액(원화)', required: false },
      { name: 'SUPPLY_AMT_F', description: '공급가액[외화]', required: false },
      { name: 'VAT_AMT', description: '부가세', required: false },
      { name: 'REMARKS', description: '적요', required: false },
      { name: 'ITEM_CD', description: '관리항목', required: false },
      { name: 'P_AMT1', description: '금액1', required: false },
      { name: 'P_AMT2', description: '금액2', required: false },
      { name: 'P_REMARKS1', description: '적요1', required: false },
      { name: 'P_REMARKS2', description: '적요2', required: false },
      { name: 'P_REMARKS3', description: '적요3', required: false },
      { name: 'ADD_TXT_01', description: '추가문자형식1', required: false },
      { name: 'ADD_TXT_02', description: '추가문자형식2', required: false },
      { name: 'ADD_TXT_03', description: '추가문자형식3', required: false },
      { name: 'ADD_TXT_04', description: '추가문자형식4', required: false },
      { name: 'ADD_TXT_05', description: '추가문자형식5', required: false },
      { name: 'ADD_TXT_06', description: '추가문자형식6', required: false },
      { name: 'ADD_NUM_01', description: '추가숫자형식1', required: false },
      { name: 'ADD_NUM_02', description: '추가숫자형식2', required: false },
      { name: 'ADD_NUM_03', description: '추가숫자형식3', required: false },
      { name: 'ADD_NUM_04', description: '추가숫자형식4', required: false },
      { name: 'ADD_NUM_05', description: '추가숫자형식5', required: false },
      { name: 'ADD_CD_01', description: '추가코드형식코드1', required: false },
      { name: 'ADD_CD_02', description: '추가코드형식코드2', required: false },
      { name: 'ADD_CD_03', description: '추가코드형식코드3', required: false },
      { name: 'ADD_CD_NM_01', description: '추가코드형식명1', required: false },
      { name: 'ADD_CD_NM_02', description: '추가코드형식명2', required: false },
      { name: 'ADD_CD_NM_03', description: '추가코드형식명3', required: false },
      { name: 'ADD_DATE_01', description: '추가일자형식1', required: false },
      { name: 'ADD_DATE_02', description: '추가일자형식2', required: false },
      { name: 'ADD_DATE_03', description: '추가일자형식3', required: false }
    ]
  },
  {
    name: '주문서입력',
    endpoint: '/api/ecount/sale-order',
    fields: [
      { name: 'UPLOAD_SER_NO', description: '순번', required: false },
      { name: 'IO_DATE', description: '주문일자', required: false },
      { name: 'CUST', description: '거래처코드', required: true },
      { name: 'CUST_DES', description: '거래처명', required: false },
      { name: 'EMP_CD', description: '담당자', required: false },
      { name: 'WH_CD', description: '출하창고', required: true },
      { name: 'IO_TYPE', description: '구분(거래유형)', required: false },
      { name: 'EXCHANGE_TYPE', description: '외화종류', required: false },
      { name: 'EXCHANGE_RATE', description: '환율', required: false },
      { name: 'PJT_CD', description: '프로젝트', required: false },
      { name: 'DOC_NO', description: '주문No.', required: false },
      { name: 'TTL_CTT', description: '제목', required: false },
      { name: 'REF_DES', description: '참조', required: false },
      { name: 'COLL_TERM', description: '결제조건', required: false },
      { name: 'AGREE_TERM', description: '유효기간', required: false },
      { name: 'TIME_DATE', description: '납기일자', required: false },
      { name: 'REMARKS_WIN', description: '검색창내용', required: false },
      { name: 'U_MEMO1', description: '문자형식1', required: false },
      { name: 'U_MEMO2', description: '문자형식2', required: false },
      { name: 'U_MEMO3', description: '문자형식3', required: false },
      { name: 'U_MEMO4', description: '문자형식4', required: false },
      { name: 'U_MEMO5', description: '문자형식5', required: false },
      { name: 'ADD_TXT_01_T', description: '추가문자형식1', required: false },
      { name: 'ADD_TXT_02_T', description: '추가문자형식2', required: false },
      { name: 'ADD_TXT_03_T', description: '추가문자형식3', required: false },
      { name: 'ADD_TXT_04_T', description: '추가문자형식4', required: false },
      { name: 'ADD_TXT_05_T', description: '추가문자형식5', required: false },
      { name: 'ADD_TXT_06_T', description: '추가문자형식6', required: false },
      { name: 'ADD_TXT_07_T', description: '추가문자형식7', required: false },
      { name: 'ADD_TXT_08_T', description: '추가문자형식8', required: false },
      { name: 'ADD_TXT_09_T', description: '추가문자형식9', required: false },
      { name: 'ADD_TXT_10_T', description: '추가문자형식10', required: false },
      { name: 'ADD_NUM_01_T', description: '추가숫자형식1', required: false },
      { name: 'ADD_NUM_02_T', description: '추가숫자형식2', required: false },
      { name: 'ADD_NUM_03_T', description: '추가숫자형식3', required: false },
      { name: 'ADD_NUM_04_T', description: '추가숫자형식4', required: false },
      { name: 'ADD_NUM_05_T', description: '추가숫자형식5', required: false },
      { name: 'ADD_CD_01_T', description: '추가코드형식1', required: false },
      { name: 'ADD_CD_02_T', description: '추가코드형식2', required: false },
      { name: 'ADD_CD_03_T', description: '추가코드형식3', required: false },
      { name: 'ADD_DATE_01_T', description: '추가일자형식1', required: false },
      { name: 'ADD_DATE_02_T', description: '추가일자형식2', required: false },
      { name: 'ADD_DATE_03_T', description: '추가일자형식3', required: false },
      { name: 'U_TXT1', description: '장문형식1', required: false },
      { name: 'ADD_LTXT_01_T', description: '추가장문형식1', required: false },
      { name: 'ADD_LTXT_02_T', description: '추가장문형식2', required: false },
      { name: 'ADD_LTXT_03_T', description: '추가장문형식3', required: false },
      { name: 'PROD_CD', description: '품목코드', required: true },
      { name: 'PROD_DES', description: '품목명', required: false },
      { name: 'SIZE_DES', description: '규격', required: false },
      { name: 'UQTY', description: '추가수량', required: false },
      { name: 'QTY', description: '주문수량', required: true },
      { name: 'PRICE', description: '주문단가', required: false },
      { name: 'USER_PRICE_VAT', description: '단가(vat포함)', required: false },
      { name: 'SUPPLY_AMT', description: '공급가액(원화)', required: false },
      { name: 'SUPPLY_AMT_F', description: '공급가액[외화]', required: false },
      { name: 'VAT_AMT', description: '부가세', required: false },
      { name: 'ITEM_TIME_DATE', description: '품목별납기일자', required: false },
      { name: 'REMARKS', description: '적요', required: false },
      { name: 'ITEM_CD', description: '관리항목', required: false },
      { name: 'P_REMARKS1', description: '적요1', required: false },
      { name: 'P_REMARKS2', description: '적요2', required: false },
      { name: 'P_REMARKS3', description: '적요3', required: false },
      { name: 'REL_DATE', description: '견적일자', required: false },
      { name: 'REL_NO', description: '견적번호', required: false },
      { name: 'P_AMT1', description: '금액1', required: false },
      { name: 'P_AMT2', description: '금액2', required: false },
      { name: 'ADD_TXT_01', description: '추가문자형식1', required: false },
      { name: 'ADD_TXT_02', description: '추가문자형식2', required: false },
      { name: 'ADD_TXT_03', description: '추가문자형식3', required: false },
      { name: 'ADD_TXT_04', description: '추가문자형식4', required: false },
      { name: 'ADD_TXT_05', description: '추가문자형식5', required: false },
      { name: 'ADD_TXT_06', description: '추가문자형식6', required: false },
      { name: 'ADD_NUM_01', description: '추가숫자형식1', required: false },
      { name: 'ADD_NUM_02', description: '추가숫자형식2', required: false },
      { name: 'ADD_NUM_03', description: '추가숫자형식3', required: false },
      { name: 'ADD_NUM_04', description: '추가숫자형식4', required: false },
      { name: 'ADD_NUM_05', description: '추가숫자형식5', required: false },
      { name: 'ADD_CD_01', description: '추가코드형식코드1', required: false },
      { name: 'ADD_CD_02', description: '추가코드형식코드2', required: false },
      { name: 'ADD_CD_03', description: '추가코드형식코드3', required: false },
      { name: 'ADD_CD_NM_01', description: '추가코드형식명1', required: false },
      { name: 'ADD_CD_NM_02', description: '추가코드형식명2', required: false },
      { name: 'ADD_CD_NM_03', description: '추가코드형식명3', required: false },
      { name: 'ADD_DATE_01', description: '추가일자형식1', required: false },
      { name: 'ADD_DATE_02', description: '추가일자형식2', required: false },
      { name: 'ADD_DATE_03', description: '추가일자형식3', required: false }
    ]
  },
  {
    name: '구매입력',
    endpoint: '/api/ecount/purchases',
    fields: [
      { name: 'UPLOAD_SER_NO', description: '순번', required: false },
      { name: 'IO_DATE', description: '일자', required: false },
      { name: 'CUST', description: '거래처코드', required: false },
      { name: 'CUST_DES', description: '거래처명', required: false },
      { name: 'EMP_CD', description: '담당자', required: false },
      { name: 'WH_CD', description: '입고창고', required: false },
      { name: 'IO_TYPE', description: '구분(거래유형)', required: false },
      { name: 'EXCHANGE_TYPE', description: '외화종류', required: false },
      { name: 'EXCHANGE_RATE', description: '환율', required: false },
      { name: 'SITE', description: '부서', required: false },
      { name: 'PJT_CD', description: '프로젝트', required: false },
      { name: 'DOC_NO', description: '구매No.', required: false },
      { name: 'TTL_CTT', description: '제목', required: false },
      { name: 'U_MEMO1', description: '문자형식1', required: false },
      { name: 'U_MEMO2', description: '문자형식2', required: false },
      { name: 'U_MEMO3', description: '문자형식3', required: false },
      { name: 'U_MEMO4', description: '문자형식4', required: false },
      { name: 'U_MEMO5', description: '문자형식5', required: false },
      { name: 'U_TXT1', description: '장문형식1', required: false },
      { name: 'ORD_DATE', description: '발주일자', required: false },
      { name: 'ORD_NO', description: '발주번호', required: false },
      { name: 'PROD_CD', description: '품목코드', required: true },
      { name: 'PROD_DES', description: '품목명', required: false },
      { name: 'SIZE_DES', description: '규격', required: false },
      { name: 'QTY', description: '수량', required: true },
      { name: 'UQTY', description: '추가수량', required: false },
      { name: 'PRICE', description: '단가', required: false },
      { name: 'USER_PRICE_VAT', description: '단가(vat포함)', required: false },
      { name: 'SUPPLY_AMT_F', description: '외화금액', required: false },
      { name: 'SUPPLY_AMT', description: '공급가액', required: false },
      { name: 'VAT_AMT', description: '부가세', required: false },
      { name: 'REMARKS', description: '적요', required: false },
      { name: 'ITEM_CD', description: '관리항목', required: false },
      { name: 'P_AMT1', description: '금액1', required: false },
      { name: 'P_AMT2', description: '금액2', required: false },
      { name: 'P_REMARKS1', description: '적요1', required: false },
      { name: 'P_REMARKS2', description: '적요2', required: false },
      { name: 'P_REMARKS3', description: '적요3', required: false },
      { name: 'CUST_AMT', description: '부대비용', required: false }
    ]
  },
  {
    name: '매출·매입전표 II 자동분개',
    endpoint: '/api/ecount/invoice-auto',
    fields: [
      { name: 'TRX_DATE', description: '일자', required: false },
      { name: 'ACCT_DOC_NO', description: '회계전표No.', required: false },
      { name: 'TAX_GUBUN', description: '매출/매입구분', required: true },
      { name: 'S_NO', description: '지급구분', required: false },
      { name: 'CUST', description: '거래처', required: false },
      { name: 'CUST_DES', description: '거래처명', required: false },
      { name: 'CR_CODE', description: '매출계정코드', required: true },
      { name: 'DR_CODE', description: '매입계정코드', required: true },
      { name: 'SUPPLY_AMT', description: '공급가액', required: false },
      { name: 'VAT_AMT', description: '부가세', required: false },
      { name: 'ACCT_NO', description: '수금구분', required: false },
      { name: 'REMARKS_CD', description: '적요코드', required: false },
      { name: 'REMARKS', description: '적요', required: false },
      { name: 'SITE_CD', description: '부서코드', required: false },
      { name: 'PJT_CD', description: '프로젝트', required: false },
      { name: 'ITEM1_CD', description: '추가항목1', required: false },
      { name: 'ITEM2_CD', description: '추가항목2', required: false },
      { name: 'ITEM3_CD', description: '추가항목3', required: false },
      { name: 'ITEM4', description: '추가항목4', required: false },
      { name: 'ITEM5', description: '추가항목5', required: false },
      { name: 'ITEM6', description: '추가항목6', required: false },
      { name: 'ITEM7', description: '추가항목7', required: false },
      { name: 'ITEM8', description: '추가항목8', required: false }
    ]
  },
  {
    name: '근태관리',
    endpoint: '/api/ecount/time-mgmt',
    fields: [
      { name: 'ATTDC_DTM_I', description: '출근일시', required: true },
      { name: 'ATTDC_DTM_O', description: '퇴근일시', required: true },
      { name: 'ATTDC_PLACE_I', description: '출근장소', required: false },
      { name: 'ATTDC_PLACE_O', description: '퇴근장소', required: false },
      { name: 'ATTDC_RSN_I', description: '출근사유', required: false },
      { name: 'ATTDC_RSN_O', description: '퇴근사유', required: false },
      { name: 'EMP_CD', description: '사원번호', required: true },
      { name: 'HDOFF_TYPE_CD_I', description: '출근시오전반차여부', required: true },
      { name: 'HDOFF_TYPE_CD_O', description: '퇴근시오후반차여부', required: true },
      { name: 'OUT_WORK_TF', description: '출근시외근구분', required: true }
    ]
  }
];

export default function UploadClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [selectedApi, setSelectedApi] = useState<ApiConfig | null>(null);
  const [columnMapping, setColumnMapping] = useState<{ [key: string]: string }>({});
     const [isUploading, setIsUploading] = useState(false);
         const [uploadResult, setUploadResult] = useState<string>('');
      const [uploadDetails, setUploadDetails] = useState<{
        success: boolean;
        message: string;
        details: string[];
      } | null>(null);
      const [uploadProgress, setUploadProgress] = useState<{
        current: number;
        total: number;
        batch: number;
        totalBatches: number;
        successCount: number;
        errorCount: number;
      } | null>(null);
  const [ecountConfig, setEcountConfig] = useState<EcountConfig>({
    comCode: '',
    userId: '',
    apiKey: '',
    zone: '',
    sessionId: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'yesnet630080!') {
      setIsAuthenticated(true);
    } else {
      alert('암호가 올바르지 않습니다.');
    }
  };

  const handleEcountConfigChange = (field: keyof EcountConfig, value: string) => {
    setEcountConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConnectEcount = async () => {
    if (!ecountConfig.comCode || !ecountConfig.userId || !ecountConfig.apiKey) {
      alert('회사코드, 사용자ID, API 키를 모두 입력해주세요.');
      return;
    }

    setIsConnecting(true);
    setConnectionResult('');

    try {
      // 1. Zone API 호출
      const zoneResponse = await fetch('/api/ecount/zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          COM_CODE: ecountConfig.comCode
        }),
      });

      const zoneResult = await zoneResponse.json();
      
      if (!zoneResponse.ok) {
        throw new Error(`Zone API 오류: ${zoneResult.error || '알 수 없는 오류'}`);
      }

      const zone = zoneResult.data?.ZONE || 'BA';
      console.log('Zone API 응답:', zoneResult);
      console.log('사용할 Zone:', zone);
      setEcountConfig(prev => ({ ...prev, zone }));

      // 2. 로그인 API 호출
      const loginResponse = await fetch('/api/ecount/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          COM_CODE: ecountConfig.comCode,
          USER_ID: ecountConfig.userId,
          API_CERT_KEY: ecountConfig.apiKey,
          ZONE: zone,
          LAN_TYPE: 'ko-KR'
        }),
      });

      const loginResult = await loginResponse.json();
      
      // 디버깅을 위한 응답 로깅
      console.log('로그인 API 응답:', loginResult);

      // 로그인 실패 체크 (success가 false인 경우)
      if (!loginResult.success) {
        let errorMessage = loginResult.message || '로그인에 실패했습니다.';
        
        // 이카운트 API에서 제공한 구체적인 에러 메시지가 있는 경우
        if (loginResult.rawData?.Data?.Message) {
          errorMessage = `이카운트 API 오류: ${loginResult.rawData.Data.Message}`;
        }
        
        throw new Error(errorMessage);
      }
      
      if (!loginResponse.ok) {
        throw new Error(`로그인 API 오류: ${loginResult.error || '알 수 없는 오류'}`);
      }

      // 세션 ID 추출 로직 개선
      let sessionId = '';
      
      // 응답 구조를 더 자세히 로깅
      console.log('loginResult.data:', loginResult.data);
      console.log('loginResult.rawData:', loginResult.rawData);
      
      if (loginResult.data?.SESSION_ID) {
        sessionId = loginResult.data.SESSION_ID;
        console.log('세션 ID 찾음 (data.SESSION_ID):', sessionId);
      } else if (loginResult.data?.Datas?.SESSION_ID) {
        sessionId = loginResult.data.Datas.SESSION_ID;
        console.log('세션 ID 찾음 (data.Datas.SESSION_ID):', sessionId);
      } else if (loginResult.rawData?.Data?.Datas?.SESSION_ID) {
        sessionId = loginResult.rawData.Data.Datas.SESSION_ID;
        console.log('세션 ID 찾음 (rawData.Data.Datas.SESSION_ID):', sessionId);
      } else if (loginResult.rawData?.Data?.SESSION_ID) {
        sessionId = loginResult.rawData.Data.SESSION_ID;
        console.log('세션 ID 찾음 (rawData.Data.SESSION_ID):', sessionId);
      } else if (loginResult.SESSION_ID) {
        sessionId = loginResult.SESSION_ID;
        console.log('세션 ID 찾음 (최상위 SESSION_ID):', sessionId);
      } else if (loginResult.data?.Data?.SESSION_ID) {
        sessionId = loginResult.data.Data.SESSION_ID;
        console.log('세션 ID 찾음 (data.Data.SESSION_ID):', sessionId);
      }
      
      if (!sessionId) {
        console.error('세션 ID를 찾을 수 없음. 전체 응답 구조:', JSON.stringify(loginResult, null, 2));
        throw new Error('세션 ID를 받지 못했습니다. 응답 구조를 확인해주세요.');
      }

      setEcountConfig(prev => ({ ...prev, sessionId }));
      setConnectionResult('이카운트 API 연결 성공! 세션 ID: ' + sessionId);
      
    } catch (error) {
      setConnectionResult(`연결 실패: ${error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length > 0) {
          setExcelData(jsonData as ExcelData[]);
          setExcelColumns(Object.keys(jsonData[0] as object));
        }
      } catch (error) {
        alert('엑셀 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleApiSelect = (apiConfig: ApiConfig | null) => {
    setSelectedApi(apiConfig);
    setColumnMapping({});
  };

  const handleColumnMapping = (apiField: string, excelColumn: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [apiField]: excelColumn
    }));
  };

     const handleSubmit = async () => {
     if (!selectedApi || !excelData.length) {
       alert('API와 엑셀 데이터를 모두 선택해주세요.');
       return;
     }

     if (!ecountConfig.sessionId) {
       alert('이카운트 API에 먼저 연결해주세요.');
       return;
     }

           // 필수 필드 확인
      const requiredFields = selectedApi.fields.filter(field => field.required);
      const mappedApiFields = Object.values(columnMapping).filter(Boolean);
      const missingFields = requiredFields.filter(field => !mappedApiFields.includes(field.name));
      
      if (missingFields.length > 0) {
        alert(`다음 필수 필드들을 매핑해주세요: ${missingFields.map(f => f.description).join(', ')}`);
        return;
      }

     // 1시간 최대 30,000건 제한 확인
     if (excelData.length > 30000) {
       alert('이카운트 API는 1시간에 최대 30,000건까지만 전송 가능합니다. 데이터를 분할하여 전송해주세요.');
       return;
     }

           setIsUploading(true);
      setUploadResult('');
      setUploadDetails(null);
      setUploadProgress(null);

     try {
               const mappedData = excelData.map(row => {
          const mappedRow: any = {};
          excelColumns.forEach(excelColumn => {
            const apiField = columnMapping[excelColumn];
            if (apiField && row[excelColumn] !== undefined) {
              mappedRow[apiField] = row[excelColumn];
            }
          });
          return mappedRow;
        });

       // 배치 크기 설정 (최대 300건)
       const BATCH_SIZE = 300;
       const totalBatches = Math.ceil(mappedData.length / BATCH_SIZE);
       let successCount = 0;
       let errorCount = 0;

       setUploadProgress({
         current: 0,
         total: mappedData.length,
         batch: 0,
         totalBatches,
         successCount: 0,
         errorCount: 0
       });

               // 배치별로 전송
        const batchResults: string[] = [];
        
        for (let i = 0; i < totalBatches; i++) {
          const startIndex = i * BATCH_SIZE;
          const endIndex = Math.min(startIndex + BATCH_SIZE, mappedData.length);
          const batchData = mappedData.slice(startIndex, endIndex);

          setUploadProgress(prev => prev ? {
            ...prev,
            current: startIndex,
            batch: i + 1,
            successCount,
            errorCount
          } : null);

          try {
            const requestBody = {
              SESSION_ID: ecountConfig.sessionId,
              ZONE: ecountConfig.zone,
              DOMAIN: ecountConfig.apiKey.includes('test') ? 'sboapi' : 'oapi',
              data: batchData
            };
            
            console.log(`배치 ${i + 1}/${totalBatches} 전송 데이터:`, {
              endpoint: selectedApi.endpoint,
              sessionId: ecountConfig.sessionId,
              zone: ecountConfig.zone,
              domain: ecountConfig.apiKey.includes('test') ? 'sboapi' : 'oapi',
              dataCount: batchData.length,
              sampleData: batchData[0]
            });

            const response = await fetch(selectedApi.endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
              successCount += batchData.length;
              console.log(`배치 ${i + 1}/${totalBatches} 성공: ${batchData.length}건`);
              batchResults.push(`배치 ${i + 1}: 성공 - ${result.message || '데이터가 성공적으로 처리되었습니다.'}`);
            } else {
              errorCount += batchData.length;
              const errorMessage = result.message || result.error || '알 수 없는 오류';
              console.error(`배치 ${i + 1}/${totalBatches} 실패:`, errorMessage);
              console.error(`배치 ${i + 1}/${totalBatches} 상세 오류:`, result);
              batchResults.push(`배치 ${i + 1}: 실패 - ${errorMessage}`);
            }
          } catch (error) {
            errorCount += batchData.length;
            const errorMessage = `네트워크 오류: ${error}`;
            console.error(`배치 ${i + 1}/${totalBatches} ${errorMessage}`);
            batchResults.push(`배치 ${i + 1}: ${errorMessage}`);
          }

          // 배치 간 1초 대기 (API 부하 방지)
          if (i < totalBatches - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

               // 최종 결과 업데이트
        setUploadProgress(prev => prev ? {
          ...prev,
          current: mappedData.length,
          successCount,
          errorCount
        } : null);

        // 상세 결과 저장
        setUploadDetails({
          success: errorCount === 0,
          message: errorCount === 0 
            ? `✅ 성공적으로 ${successCount}건의 데이터가 전송되었습니다. (${totalBatches}개 배치)`
            : `⚠️ 전송 완료: 성공 ${successCount}건, 실패 ${errorCount}건 (${totalBatches}개 배치)`,
          details: batchResults
        });

        if (errorCount === 0) {
          setUploadResult(`✅ 성공적으로 ${successCount}건의 데이터가 전송되었습니다. (${totalBatches}개 배치)`);
        } else {
          setUploadResult(`⚠️ 전송 완료: 성공 ${successCount}건, 실패 ${errorCount}건 (${totalBatches}개 배치)`);
        }

           } catch (error) {
        setUploadResult(`전송 중 오류가 발생했습니다: ${error}`);
        setUploadDetails({
          success: false,
          message: `전송 중 오류가 발생했습니다: ${error}`,
          details: [`전송 실패: ${error}`]
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
      }
   };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>관리자 접근</CardTitle>
            <CardDescription>암호를 입력하여 업로드 페이지에 접근하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">암호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="암호를 입력하세요"
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                접근
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">이카운트 데이터 업로드</h1>
          <p className="text-gray-600 mt-2">엑셀 파일을 업로드하여 이카운트 API로 데이터를 전송하세요.</p>
        </div>

                 <Tabs defaultValue="config" className="w-full">
           <TabsList className="grid w-full grid-cols-3">
             <TabsTrigger value="config">API 설정</TabsTrigger>
             <TabsTrigger value="upload">파일 업로드</TabsTrigger>
             <TabsTrigger value="result">결과</TabsTrigger>
           </TabsList>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>이카운트 API 설정</CardTitle>
                <CardDescription>이카운트 API 연결을 위한 정보를 입력하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="comCode">회사코드 *</Label>
                    <Input
                      id="comCode"
                      value={ecountConfig.comCode}
                      onChange={(e) => handleEcountConfigChange('comCode', e.target.value)}
                      placeholder="회사코드를 입력하세요"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="userId">사용자ID *</Label>
                    <Input
                      id="userId"
                      value={ecountConfig.userId}
                      onChange={(e) => handleEcountConfigChange('userId', e.target.value)}
                      placeholder="사용자ID를 입력하세요"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="apiKey">API 키 *</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={ecountConfig.apiKey}
                      onChange={(e) => handleEcountConfigChange('apiKey', e.target.value)}
                      placeholder="API 키를 입력하세요"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Test Key는 sboapi, API Key는 oapi 도메인을 사용합니다.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handleConnectEcount} 
                      disabled={isConnecting || !ecountConfig.comCode || !ecountConfig.userId || !ecountConfig.apiKey}
                      className="w-full"
                    >
                      {isConnecting ? '연결 중...' : '이카운트 API 연결'}
                    </Button>
                  </div>

                  {connectionResult && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <pre className="whitespace-pre-wrap text-sm">{connectionResult}</pre>
                    </div>
                  )}

                  {ecountConfig.sessionId && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-800 text-sm">
                        ✅ 이카운트 API 연결 완료<br/>
                        Zone: {ecountConfig.zone}<br/>
                        세션 ID: {ecountConfig.sessionId}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

                     <TabsContent value="upload" className="space-y-4">
             <Card>
               <CardHeader>
                 <CardTitle>엑셀 파일 업로드 및 API 설정</CardTitle>
                 <CardDescription>엑셀 파일을 선택하고 API를 설정하여 데이터를 전송하세요.</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="space-y-6">
                   {/* 파일 업로드 섹션 */}
                   <div>
                     <Label htmlFor="file">엑셀 파일 선택</Label>
                     <Input
                       id="file"
                       type="file"
                       accept=".xlsx,.xls"
                       onChange={handleFileUpload}
                       ref={fileInputRef}
                       className="mt-1"
                     />
                   </div>

                                       {/* API 선택 섹션 */}
                    {excelData.length > 0 && (
                      <div>
                        <Label>API 선택</Label>
                        <select
                          value={selectedApi?.name || ''}
                          onChange={(e) => {
                            const selectedApiConfig = API_CONFIGS.find(api => api.name === e.target.value);
                            handleApiSelect(selectedApiConfig || null);
                          }}
                          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">API를 선택하세요</option>
                          {API_CONFIGS.map((api) => (
                            <option key={api.name} value={api.name}>
                              {api.name} ({api.fields.length}개 필드)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                   {/* 데이터 미리보기 및 컬럼 매핑 */}
                   {excelData.length > 0 && selectedApi && (
                     <div>
                       <Label>컬럼 매핑 및 데이터 미리보기</Label>
                       <div className="mt-2 space-y-4">
                                                   {/* 컬럼 매핑 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {excelColumns.map((excelColumn) => (
                              <div key={excelColumn} className="flex items-center space-x-3">
                                <div className="w-32">
                                  <span className="text-sm font-medium">
                                    {excelColumn}
                                  </span>
                                </div>
                                <select
                                  value={columnMapping[excelColumn] || ''}
                                  onChange={(e) => handleColumnMapping(excelColumn, e.target.value)}
                                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                                >
                                  <option value="">매핑 안함</option>
                                  {selectedApi.fields.map((field) => (
                                    <option key={field.name} value={field.name}>
                                      {field.description}
                                      {field.required && <span className="text-red-500">*</span>}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>

                         {/* 데이터 미리보기 테이블 */}
                         <div className="max-h-60 overflow-auto border rounded-md">
                           <table className="w-full text-sm">
                                                           <thead className="bg-gray-50">
                                <tr>
                                  {excelColumns.map((column, index) => (
                                    <th key={index} className="px-3 py-2 text-left border-b">
                                      <div className="font-medium">{column}</div>
                                      {columnMapping[column] && (
                                        <div className="text-xs text-blue-600 mt-1">
                                          → {selectedApi.fields.find(f => f.name === columnMapping[column])?.description}
                                        </div>
                                      )}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                             <tbody>
                               {excelData.slice(0, 5).map((row, rowIndex) => (
                                 <tr key={rowIndex}>
                                   {excelColumns.map((column, colIndex) => (
                                     <td key={colIndex} className="px-3 py-2 border-b">
                                       {row[column]}
                                     </td>
                                   ))}
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                           {excelData.length > 5 && (
                             <div className="px-3 py-2 text-sm text-gray-500">
                               ... 외 {excelData.length - 5}건 더
                             </div>
                           )}
                         </div>

                                                   {/* 전송 버튼 및 진행 상황 */}
                          <div className="pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <div className="text-sm text-gray-600">
                                총 {excelData.length}건 • 최대 300건씩 배치 전송
                              </div>
                              <Button 
                                onClick={handleSubmit} 
                                disabled={isUploading || !ecountConfig.sessionId}
                                className="px-8"
                              >
                                {isUploading ? '전송 중...' : '데이터 전송'}
                              </Button>
                            </div>
                            
                            {!ecountConfig.sessionId && (
                              <p className="text-sm text-red-500 mt-2">
                                * 이카운트 API에 먼저 연결해주세요.
                              </p>
                            )}

                            {/* 진행 상황 표시 */}
                            {uploadProgress && (
                              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-blue-800">
                                    배치 {uploadProgress.batch}/{uploadProgress.totalBatches} 진행 중
                                  </span>
                                  <span className="text-sm text-blue-600">
                                    {uploadProgress.current}/{uploadProgress.total}건
                                  </span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-blue-600">
                                  <span>성공: {uploadProgress.successCount}건</span>
                                  <span>실패: {uploadProgress.errorCount}건</span>
                                  <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                       </div>
                     </div>
                   )}
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

          

          <TabsContent value="result" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>전송 결과</CardTitle>
                <CardDescription>API 전송 결과를 확인하세요.</CardDescription>
              </CardHeader>
                             <CardContent>
                 {uploadDetails ? (
                   <div className="space-y-4">
                     {/* 전체 결과 요약 */}
                     <div className={`p-4 rounded-md ${
                       uploadDetails.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                     }`}>
                       <h3 className={`font-semibold mb-2 ${
                         uploadDetails.success ? 'text-green-800' : 'text-red-800'
                       }`}>
                         {uploadDetails.message}
                       </h3>
                     </div>
                     
                     {/* 상세 결과 */}
                     <div className="p-4 bg-gray-50 rounded-md">
                       <h4 className="font-medium text-gray-900 mb-3">배치별 상세 결과:</h4>
                       <div className="space-y-2">
                         {uploadDetails.details.map((detail, index) => (
                           <div key={index} className={`p-2 rounded text-sm ${
                             detail.includes('성공') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                           }`}>
                             {detail}
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center text-gray-500 py-8">
                     아직 전송 결과가 없습니다.
                   </div>
                 )}
               </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 