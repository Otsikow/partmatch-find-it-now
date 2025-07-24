export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      blog_posts: {
        Row: {
          author_id: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published: boolean
          published_at: string | null
fix/admin-home-button
          scheduled_publish_at: string | null
main
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
fix/admin-home-button
          scheduled_publish_at?: string | null
main
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
fix/admin-home-button
          scheduled_publish_at?: string | null
main
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      business_subscriptions: {
        Row: {
          active: boolean | null
          auto_renew: boolean | null
          created_at: string | null
          end_date: string | null
          id: string
          payment_reference: string | null
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_reference?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_reference?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      car_parts: {
        Row: {
          address: string | null
          boosted_until: string | null
          city: string | null
          click_count: number | null
          condition: string
          country: string | null
          created_at: string | null
          currency: string
          description: string | null
          extra_photos_count: number | null
          featured_until: string | null
          has_verified_badge: boolean | null
          highlighted_until: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_highlighted: boolean | null
          is_urgent: boolean | null
          last_suggested_promotion: string | null
          latitude: number | null
          longitude: number | null
          make: string
          model: string
          part_type: string
          price: number
          promotion_suggestions_count: number | null
          quality_checked_at: string | null
          quality_feedback: string | null
          quality_score: number | null
          status: string
          supplier_id: string
          title: string
          updated_at: string | null
          urgent_until: string | null
          verified_badge_until: string | null
          view_count: number | null
          year: number
        }
        Insert: {
          address?: string | null
          boosted_until?: string | null
          city?: string | null
          click_count?: number | null
          condition: string
          country?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          extra_photos_count?: number | null
          featured_until?: string | null
          has_verified_badge?: boolean | null
          highlighted_until?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_highlighted?: boolean | null
          is_urgent?: boolean | null
          last_suggested_promotion?: string | null
          latitude?: number | null
          longitude?: number | null
          make: string
          model: string
          part_type: string
          price: number
          promotion_suggestions_count?: number | null
          quality_checked_at?: string | null
          quality_feedback?: string | null
          quality_score?: number | null
          status?: string
          supplier_id: string
          title: string
          updated_at?: string | null
          urgent_until?: string | null
          verified_badge_until?: string | null
          view_count?: number | null
          year: number
        }
        Update: {
          address?: string | null
          boosted_until?: string | null
          city?: string | null
          click_count?: number | null
          condition?: string
          country?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          extra_photos_count?: number | null
          featured_until?: string | null
          has_verified_badge?: boolean | null
          highlighted_until?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_highlighted?: boolean | null
          is_urgent?: boolean | null
          last_suggested_promotion?: string | null
          latitude?: number | null
          longitude?: number | null
          make?: string
          model?: string
          part_type?: string
          price?: number
          promotion_suggestions_count?: number | null
          quality_checked_at?: string | null
          quality_feedback?: string | null
          quality_score?: number | null
          status?: string
          supplier_id?: string
          title?: string
          updated_at?: string | null
          urgent_until?: string | null
          verified_badge_until?: string | null
          view_count?: number | null
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
      listing_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          listing_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          listing_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          listing_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_analytics_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "car_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_quality_checks: {
        Row: {
          auto_approved: boolean | null
          checked_at: string | null
          created_at: string | null
          feedback_message: string | null
          flagged_issues: Json | null
          id: string
          listing_id: string
          quality_score: number
        }
        Insert: {
          auto_approved?: boolean | null
          checked_at?: string | null
          created_at?: string | null
          feedback_message?: string | null
          flagged_issues?: Json | null
          id?: string
          listing_id: string
          quality_score: number
        }
        Update: {
          auto_approved?: boolean | null
          checked_at?: string | null
          created_at?: string | null
          feedback_message?: string | null
          flagged_issues?: Json | null
          id?: string
          listing_id?: string
          quality_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "listing_quality_checks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "car_parts"
            referencedColumns: ["id"]
          },
        ]
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
      monetization_pricing: {
        Row: {
          active: boolean | null
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          duration_days: number | null
          feature_type: string
          id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          feature_type: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          feature_type?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monetization_purchases: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          duration_days: number | null
          expires_at: string | null
          id: string
          listing_id: string | null
          metadata: Json | null
          payment_reference: string | null
          payment_status: string | null
          purchase_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          duration_days?: number | null
          expires_at?: string | null
          id?: string
          listing_id?: string | null
          metadata?: Json | null
          payment_reference?: string | null
          payment_status?: string | null
          purchase_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          duration_days?: number | null
          expires_at?: string | null
          id?: string
          listing_id?: string | null
          metadata?: Json | null
          payment_reference?: string | null
          payment_status?: string | null
          purchase_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monetization_purchases_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "car_parts"
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
          country: string | null
          created_at: string | null
          currency: string | null
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
          country?: string | null
          created_at?: string | null
          currency?: string | null
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
          country?: string | null
          created_at?: string | null
          currency?: string | null
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
          city: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          first_name: string | null
          id: string
          is_blocked: boolean | null
          is_verified: boolean | null
          language: string | null
          last_name: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          notification_preferences: Json | null
          phone: string | null
          profile_photo_url: string | null
          rating: number | null
          subscription_expiry: string | null
          subscription_type: string | null
          total_ratings: number | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          verification_documents: string[] | null
          verified_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_blocked?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          last_name?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notification_preferences?: Json | null
          phone?: string | null
          profile_photo_url?: string | null
          rating?: number | null
          subscription_expiry?: string | null
          subscription_type?: string | null
          total_ratings?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          verification_documents?: string[] | null
          verified_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_blocked?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          last_name?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notification_preferences?: Json | null
          phone?: string | null
          profile_photo_url?: string | null
          rating?: number | null
          subscription_expiry?: string | null
          subscription_type?: string | null
          total_ratings?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          verification_documents?: string[] | null
          verified_at?: string | null
        }
        Relationships: []
      }
      promotion_suggestions: {
        Row: {
          converted: boolean | null
          converted_at: string | null
          created_at: string
          currency: string | null
          id: string
          listing_id: string
          price_suggested: number | null
          seller_id: string
          suggested_at: string
          suggestion_criteria: Json | null
          suggestion_type: string
        }
        Insert: {
          converted?: boolean | null
          converted_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          listing_id: string
          price_suggested?: number | null
          seller_id: string
          suggested_at?: string
          suggestion_criteria?: Json | null
          suggestion_type: string
        }
        Update: {
          converted?: boolean | null
          converted_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          listing_id?: string
          price_suggested?: number | null
          seller_id?: string
          suggested_at?: string
          suggestion_criteria?: Json | null
          suggestion_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_suggestions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "car_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_suggestions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rating_reminders: {
        Row: {
          buyer_id: string
          created_at: string | null
          id: string
          offer_id: string
          reminder_count: number | null
          seller_id: string
          sent_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          id?: string
          offer_id: string
          reminder_count?: number | null
          seller_id: string
          sent_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          id?: string
          offer_id?: string
          reminder_count?: number | null
          seller_id?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rating_reminders_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
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
      saved_parts: {
        Row: {
          created_at: string
          id: string
          list_name: string | null
          notes: string | null
          part_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          list_name?: string | null
          notes?: string | null
          part_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          list_name?: string | null
          notes?: string | null
          part_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "car_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_follows: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          seller_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          seller_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          seller_id?: string
          updated_at?: string
        }
        Relationships: []
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
      smart_match_notifications: {
        Row: {
          created_at: string
          email_sent: boolean | null
          id: string
          in_app_sent: boolean | null
          match_criteria: Json | null
          notification_type: string
          request_id: string
          seller_id: string
          sent_at: string
        }
        Insert: {
          created_at?: string
          email_sent?: boolean | null
          id?: string
          in_app_sent?: boolean | null
          match_criteria?: Json | null
          notification_type?: string
          request_id: string
          seller_id: string
          sent_at?: string
        }
        Update: {
          created_at?: string
          email_sent?: boolean | null
          id?: string
          in_app_sent?: boolean | null
          match_criteria?: Json | null
          notification_type?: string
          request_id?: string
          seller_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_match_notifications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "part_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smart_match_notifications_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      user_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean
          title: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          title?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_publish_scheduled_posts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      expire_monetization_features: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_weekly_insights_now: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_click_count: {
        Args: { listing_id: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { listing_id: string }
        Returns: undefined
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
