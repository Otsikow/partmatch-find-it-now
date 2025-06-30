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
      admin_audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          admin_id: string | null
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      ai_reviews: {
        Row: {
          ai_reasoning: string | null
          confidence_score: number | null
          created_at: string
          id: string
          request_id: string
          review_status: string
          reviewed_at: string
        }
        Insert: {
          ai_reasoning?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          request_id: string
          review_status: string
          reviewed_at?: string
        }
        Update: {
          ai_reasoning?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          request_id?: string
          review_status?: string
          reviewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_reviews_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "part_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      car_parts: {
        Row: {
          address: string | null
          condition: string
          created_at: string | null
          currency: string
          description: string | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          make: string
          model: string
          part_type: string
          price: number
          status: string
          supplier_id: string
          title: string
          updated_at: string | null
          year: number
        }
        Insert: {
          address?: string | null
          condition: string
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          make: string
          model: string
          part_type: string
          price: number
          status?: string
          supplier_id: string
          title: string
          updated_at?: string | null
          year: number
        }
        Update: {
          address?: string | null
          condition?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          make?: string
          model?: string
          part_type?: string
          price?: number
          status?: string
          supplier_id?: string
          title?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "car_parts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          buyer_id: string
          buyer_unread_count: number | null
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          part_id: string | null
          seller_id: string
          seller_unread_count: number | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          buyer_unread_count?: number | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          part_id?: string | null
          seller_id: string
          seller_unread_count?: number | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          buyer_unread_count?: number | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          part_id?: string | null
          seller_id?: string
          seller_unread_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "car_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ghana_regions: {
        Row: {
          created_at: string | null
          id: string
          major_cities: string[]
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          major_cities: string[]
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          major_cities?: string[]
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_url: string | null
          chat_id: string
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          chat_id: string
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          recipient: string
          sent: boolean | null
          sent_at: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          recipient: string
          sent?: boolean | null
          sent_at?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          recipient?: string
          sent?: boolean | null
          sent_at?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          buyer_id: string | null
          completed_at: string | null
          contact_unlock_fee: number | null
          contact_unlocked: boolean | null
          created_at: string | null
          id: string
          message: string | null
          photo_url: string | null
          price: number
          request_id: string
          status: Database["public"]["Enums"]["offer_status"] | null
          supplier_id: string
          transaction_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          completed_at?: string | null
          contact_unlock_fee?: number | null
          contact_unlocked?: boolean | null
          created_at?: string | null
          id?: string
          message?: string | null
          photo_url?: string | null
          price: number
          request_id: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          supplier_id: string
          transaction_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          completed_at?: string | null
          contact_unlock_fee?: number | null
          contact_unlocked?: boolean | null
          created_at?: string | null
          id?: string
          message?: string | null
          photo_url?: string | null
          price?: number
          request_id?: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          supplier_id?: string
          transaction_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "part_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      part_requests: {
        Row: {
          car_make: string
          car_model: string
          car_year: number
          created_at: string | null
          description: string | null
          id: string
          location: string
          owner_id: string
          part_needed: string
          phone: string
          photo_url: string | null
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
        }
        Insert: {
          car_make: string
          car_model: string
          car_year: number
          created_at?: string | null
          description?: string | null
          id?: string
          location: string
          owner_id: string
          part_needed: string
          phone: string
          photo_url?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Update: {
          car_make?: string
          car_model?: string
          car_year?: number
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string
          owner_id?: string
          part_needed?: string
          phone?: string
          photo_url?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          mobile_money_number: string | null
          mobile_money_provider: string | null
          offer_id: string | null
          payer_id: string
          payment_method: string | null
          payment_reference: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          mobile_money_number?: string | null
          mobile_money_provider?: string | null
          offer_id?: string | null
          payer_id: string
          payment_method?: string | null
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          mobile_money_number?: string | null
          mobile_money_provider?: string | null
          offer_id?: string | null
          payer_id?: string
          payment_method?: string | null
          payment_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          first_name: string | null
          id: string
          is_blocked: boolean | null
          is_verified: boolean | null
          last_name: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          phone: string | null
          rating: number | null
          total_ratings: number | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          verification_documents: string[] | null
          verified_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          is_blocked?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          phone?: string | null
          rating?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          verification_documents?: string[] | null
          verified_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_blocked?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          phone?: string | null
          rating?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          verification_documents?: string[] | null
          verified_at?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rated_id: string
          rater_id: string
          rating: number
          request_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_id: string
          rater_id: string
          rating: number
          request_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_id?: string
          rater_id?: string
          rating?: number
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_rated_id_fkey"
            columns: ["rated_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "part_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          offer_id: string | null
          rating: number
          review_text: string | null
          reviewer_id: string
          seller_id: string
          transaction_verified: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          offer_id?: string | null
          rating: number
          review_text?: string | null
          reviewer_id: string
          seller_id: string
          transaction_verified?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          offer_id?: string | null
          rating?: number
          review_text?: string | null
          reviewer_id?: string
          seller_id?: string
          transaction_verified?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_verifications: {
        Row: {
          admin_notes: string | null
          business_address: string
          business_location_photo_url: string | null
          business_name: string | null
          business_registration_number: string | null
          business_registration_url: string | null
          created_at: string
          date_of_birth: string
          email: string
          email_verified: boolean | null
          full_name: string
          government_id_url: string | null
          id: string
          latitude: number | null
          longitude: number | null
          phone: string
          phone_verified: boolean | null
          profile_photo_url: string | null
          proof_of_address_url: string | null
          seller_type: string
          updated_at: string
          user_id: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_notes?: string | null
          business_address: string
          business_location_photo_url?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          business_registration_url?: string | null
          created_at?: string
          date_of_birth: string
          email: string
          email_verified?: boolean | null
          full_name: string
          government_id_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone: string
          phone_verified?: boolean | null
          profile_photo_url?: string | null
          proof_of_address_url?: string | null
          seller_type: string
          updated_at?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_notes?: string | null
          business_address?: string
          business_location_photo_url?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          business_registration_url?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string
          email_verified?: boolean | null
          full_name?: string
          government_id_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string
          phone_verified?: boolean | null
          profile_photo_url?: string | null
          proof_of_address_url?: string | null
          seller_type?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      user_chat_status: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          is_typing: boolean | null
          last_seen: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          is_typing?: boolean | null
          last_seen?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          is_typing?: boolean | null
          last_seen?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chat_status_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chat_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_authorized_admin_email: {
        Args: { email_to_check: string }
        Returns: boolean
      }
      log_admin_security_event: {
        Args: {
          event_type: string
          event_details?: Json
          target_user_id?: string
        }
        Returns: undefined
      }
      mark_messages_as_read: {
        Args: { chat_id_param: string; user_id_param: string }
        Returns: undefined
      }
      process_contact_unlock_payment: {
        Args: {
          offer_id_param: string
          payment_method_param: string
          mobile_money_provider_param?: string
          mobile_money_number_param?: string
          payment_reference_param?: string
        }
        Returns: Json
      }
      update_supplier_verification: {
        Args: {
          supplier_id_param: string
          is_verified_param: boolean
          documents_param?: string[]
        }
        Returns: boolean
      }
    }
    Enums: {
      notification_type: "sms" | "whatsapp" | "email"
      offer_status: "pending" | "accepted" | "rejected" | "expired"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      request_status:
        | "pending"
        | "offer_received"
        | "contact_unlocked"
        | "completed"
        | "cancelled"
      user_type: "owner" | "supplier" | "admin"
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
    Enums: {
      notification_type: ["sms", "whatsapp", "email"],
      offer_status: ["pending", "accepted", "rejected", "expired"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      request_status: [
        "pending",
        "offer_received",
        "contact_unlocked",
        "completed",
        "cancelled",
      ],
      user_type: ["owner", "supplier", "admin"],
    },
  },
} as const
