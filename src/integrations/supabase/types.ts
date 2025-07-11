
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_settings: {
        Row: {
            row_id: string,
            user_id: string,
            about: string | null,
            services: string | null,
            location: string | null,
            calendar_email: string | null,
            notify_email: string | null,
            support_human_phone: string | null,
            doctor_details: Json | null,
            working_hours: string | null,
            lunch_hours: string | null,
            holidays: string | null,
            agent_voice: string | null,
            custom_greetings: string | null,
            custom_endings: string | null,
            onboarding_step: number | null,
            created_at: string,
            updated_at: string,
            calendar_auth: Json | null,
            agent_phone: string | null
        },
        Insert: {
            row_id?: string,
            user_id: string,
            about?: string | null,
            services?: string | null,
            location?: string | null,
            calendar_email?: string | null,
            notify_email?: string | null,
            support_human_phone?: string | null,
            doctor_details?: Json | null,
            working_hours?: string | null,
            lunch_hours?: string | null,
            holidays?: string | null,
            agent_voice?: string | null,
            custom_greetings?: string | null,
            custom_endings?: string | null,
            onboarding_step?: number | null,
            created_at?: string,
            updated_at?: string,
            calendar_auth?: Json | null,
            agent_phone?: string | null
        },
        Update: {
            row_id?: string,
            user_id?: string,
            about?: string | null,
            services?: string | null,
            location?: string | null,
            calendar_email?: string | null,
            notify_email?: string | null,
            support_human_phone?: string | null,
            doctor_details?: Json | null,
            working_hours?: string | null,
            lunch_hours?: string | null,
            holidays?: string | null,
            agent_voice?: string | null,
            custom_greetings?: string | null,
            custom_endings?: string | null,
            onboarding_step?: number | null,
            created_at?: string,
            updated_at?: string,
            calendar_auth?: Json | null,
            agent_phone?: string | null
        }
      },
      appointment_details: {
        Row: {
            row_id: number,
            created_at: string,
            patient_name: string | null,
            appointment_reason: string | null,
            appointment_date: string | null,
            appointment_time: string | null,
            event_id: string | null,
            user_id: string | null,
            call_id: number | null,
            appointment_id: number | null
        },
        Insert: {
            row_id?: number,
            created_at?: string,
            patient_name?: string | null,
            appointment_reason?: string | null,
            appointment_date?: string | null,
            appointment_time?: string | null,
            event_id?: string | null,
            user_id?: string | null,
            call_id?: number | null,
            appointment_id?: number | null
        },
        Update: {
            row_id?: number,
            created_at?: string,
            patient_name?: string | null,
            appointment_reason?: string | null,
            appointment_date?: string | null,
            appointment_time?: string | null,
            event_id?: string | null,
            user_id?: string | null,
            call_id?: number | null,
            appointment_id?: number | null
        }
      },
      call_history: {
        Row: {
            row_id: number,
            created_at: string,
            call_id: string | null,
            caller_number: string | null,
            called_number: string | null,
            call_start: string | null,
            call_end: string | null,
            call_duration: string | null,
            call_status: string | null,
            user_id: string | null,
            appointment_status: string | null,
            call_summary: string | null
        },
        Insert: {
            row_id?: number,
            created_at?: string,
            call_id?: string | null,
            caller_number?: string | null,
            called_number?: string | null,
            call_start?: string | null,
            call_end?: string | null,
            call_duration?: string | null,
            call_status?: string | null,
            user_id?: string | null,
            appointment_status?: string | null,
            call_summary?: string | null
        },
        Update: {
            row_id?: number,
            created_at?: string,
            call_id?: string | null,
            caller_number?: string | null,
            called_number?: string | null,
            call_start?: string | null,
            call_end?: string | null,
            call_duration?: string | null,
            call_status?: string | null,
            user_id?: string | null,
            appointment_status?: string | null,
            call_summary?: string | null
        }
      },
      profiles: {
        Row: {
            id: string,
            name: string,
            phone: string | null,
            created_at: string,
            updated_at: string
        },
        Insert: {
            id: string,
            name: string,
            phone?: string | null,
            created_at?: string,
            updated_at?: string
        },
        Update: {
            id?: string,
            name?: string,
            phone?: string | null,
            created_at?: string,
            updated_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
