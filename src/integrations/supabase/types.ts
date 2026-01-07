export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_image: string | null
          author_name: string
          category: string
          content: string
          cover_image: string | null
          created_at: string | null
          excerpt: string
          featured: boolean | null
          id: string
          published: boolean | null
          read_time: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_image?: string | null
          author_name?: string
          category: string
          content: string
          cover_image?: string | null
          created_at?: string | null
          excerpt: string
          featured?: boolean | null
          id?: string
          published?: boolean | null
          read_time?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_image?: string | null
          author_name?: string
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string
          featured?: boolean | null
          id?: string
          published?: boolean | null
          read_time?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          email: string
          id: string
          job_title: string
          job_type: Database["public"]["Enums"]["job_type"]
          name: string
          phone: string | null
          portfolio_url: string | null
          resume_url: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          email: string
          id?: string
          job_title: string
          job_type: Database["public"]["Enums"]["job_type"]
          name: string
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          email?: string
          id?: string
          job_title?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          name?: string
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category: string
          client_name: string | null
          created_at: string | null
          description: string
          featured: boolean | null
          id: string
          image_url: string | null
          project_url: string | null
          technologies: string[] | null
          title: string
        }
        Insert: {
          category: string
          client_name?: string | null
          created_at?: string | null
          description: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          technologies?: string[] | null
          title: string
        }
        Update: {
          category?: string
          client_name?: string | null
          created_at?: string | null
          description?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          technologies?: string[] | null
          title?: string
        }
        Relationships: []
      }
      project_submissions: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          company: string | null
          created_at: string | null
          custom_requirements: string | null
          email: string
          features: string[] | null
          id: string
          name: string
          phone: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          timeline: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          company?: string | null
          created_at?: string | null
          custom_requirements?: string | null
          email: string
          features?: string[] | null
          id?: string
          name: string
          phone?: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          timeline?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          company?: string | null
          created_at?: string | null
          custom_requirements?: string | null
          email?: string
          features?: string[] | null
          id?: string
          name?: string
          phone?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          timeline?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_company: string | null
          client_image: string | null
          client_name: string
          client_title: string | null
          created_at: string | null
          featured: boolean | null
          id: string
          quote: string
          rating: number | null
        }
        Insert: {
          client_company?: string | null
          client_image?: string | null
          client_name: string
          client_title?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          quote: string
          rating?: number | null
        }
        Update: {
          client_company?: string | null
          client_image?: string | null
          client_name?: string
          client_title?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          quote?: string
          rating?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      experience_level: "junior" | "mid" | "senior"
      job_type: "frontend" | "backend" | "fullstack"
      project_type:
        | "new_website"
        | "shopify_store"
        | "website_redesign"
        | "maintenance"
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
      experience_level: ["junior", "mid", "senior"],
      job_type: ["frontend", "backend", "fullstack"],
      project_type: [
        "new_website",
        "shopify_store",
        "website_redesign",
        "maintenance",
      ],
    },
  },
} as const
