export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          business_number: string
          company_name: string
          business_type: string
          business_item: string
          last_year_revenue: number | null
          current_erp: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_number: string
          company_name: string
          business_type: string
          business_item: string
          last_year_revenue?: number | null
          current_erp?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_number?: string
          company_name?: string
          business_type?: string
          business_item?: string
          last_year_revenue?: number | null
          current_erp?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      questionnaires: {
        Row: {
          id: string
          company_id: string
          common_answers: Json
          sales_answers: Json
          purchase_answers: Json
          production_answers: Json
          accounting_answers: Json
          management_answers: Json
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          common_answers: Json
          sales_answers: Json
          purchase_answers: Json
          production_answers: Json
          accounting_answers: Json
          management_answers: Json
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          common_answers?: Json
          sales_answers?: Json
          purchase_answers?: Json
          production_answers?: Json
          accounting_answers?: Json
          management_answers?: Json
          created_at?: string
          updated_at?: string | null
        }
      }
      recommendations: {
        Row: {
          id: string
          company_id: string
          questionnaire_id: string
          recommended_erp: string
          reasons: Json
          setup_guide: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          questionnaire_id: string
          recommended_erp: string
          reasons: Json
          setup_guide: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          questionnaire_id?: string
          recommended_erp?: string
          reasons?: Json
          setup_guide?: string
          created_at?: string
        }
      }
      contact_requests: {
        Row: {
          id: string
          company_id: string
          recommendation_id: string
          additional_info: string | null
          request_ip: string
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          company_id: string
          recommendation_id: string
          additional_info?: string | null
          request_ip: string
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          company_id?: string
          recommendation_id?: string
          additional_info?: string | null
          request_ip?: string
          created_at?: string
          status?: string
        }
      }
      ecount_consultings: {
        Row: {
          id: string
          business_number: string
          company_name: string
          contact_person: string
          email: string
          phone: string
          current_usage_years: number
          current_usage_level: string
          main_modules: string[]
          pain_points: string
          improvement_needs: string
          sales_item_management: string
          sales_credit_management: string
          purchase_item_management: string
          purchase_debt_management: string
          inventory_accuracy: string
          account_tax_invoice: string
          account_bank_data: string
          account_card_data: string
          account_purchase_invoice: string
          production_item_management: string
          hr_payroll_management: string
          hr_vacation_management: string
          score: number
          consulting_type: string
          created_at: string
        }
        Insert: {
          id?: string
          business_number: string
          company_name: string
          contact_person: string
          email: string
          phone: string
          current_usage_years: number
          current_usage_level: string
          main_modules: string[]
          pain_points: string
          improvement_needs: string
          sales_item_management?: string
          sales_credit_management?: string
          purchase_item_management?: string
          purchase_debt_management?: string
          inventory_accuracy?: string
          account_tax_invoice?: string
          account_bank_data?: string
          account_card_data?: string
          account_purchase_invoice?: string
          production_item_management?: string
          hr_payroll_management?: string
          hr_vacation_management?: string
          score?: number
          consulting_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          business_number?: string
          company_name?: string
          contact_person?: string
          email?: string
          phone?: string
          current_usage_years?: number
          current_usage_level?: string
          main_modules?: string[]
          pain_points?: string
          improvement_needs?: string
          sales_item_management?: string
          sales_credit_management?: string
          purchase_item_management?: string
          purchase_debt_management?: string
          inventory_accuracy?: string
          account_tax_invoice?: string
          account_bank_data?: string
          account_card_data?: string
          account_purchase_invoice?: string
          production_item_management?: string
          hr_payroll_management?: string
          hr_vacation_management?: string
          score?: number
          consulting_type?: string
          created_at?: string
        }
      }
      ecount_email_requests: {
        Row: {
          id: string
          consulting_id: string
          request_type: string
          additional_info: string | null
          email_to: string
          email_from: string
          email_subject: string
          email_body: string
          is_sent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          consulting_id: string
          request_type: string
          additional_info?: string | null
          email_to: string
          email_from: string
          email_subject: string
          email_body: string
          is_sent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          consulting_id?: string
          request_type?: string
          additional_info?: string | null
          email_to?: string
          email_from?: string
          email_subject?: string
          email_body?: string
          is_sent?: boolean
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          created_at?: string
          is_read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 