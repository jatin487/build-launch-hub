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
      developer_screenshots: {
        Row: {
          created_at: string
          developer_id: string
          file_name: string
          file_url: string
          id: string
        }
        Insert: {
          created_at?: string
          developer_id: string
          file_name: string
          file_url: string
          id?: string
        }
        Update: {
          created_at?: string
          developer_id?: string
          file_name?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_screenshots_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_skills: {
        Row: {
          created_at: string
          developer_id: string
          id: string
          skill_name: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string
          developer_id: string
          id?: string
          skill_name: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string
          developer_id?: string
          id?: string
          skill_name?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "developer_skills_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      developers: {
        Row: {
          created_at: string
          email: string
          experience_years: number
          github_url: string | null
          id: string
          is_available: boolean | null
          location: string | null
          name: string
          portfolio_url: string | null
          preferred_project_types: string[] | null
          role: string
          status: Database["public"]["Enums"]["developer_status"]
          updated_at: string
          user_id: string
          weekly_hours: number | null
        }
        Insert: {
          created_at?: string
          email: string
          experience_years?: number
          github_url?: string | null
          id?: string
          is_available?: boolean | null
          location?: string | null
          name: string
          portfolio_url?: string | null
          preferred_project_types?: string[] | null
          role: string
          status?: Database["public"]["Enums"]["developer_status"]
          updated_at?: string
          user_id: string
          weekly_hours?: number | null
        }
        Update: {
          created_at?: string
          email?: string
          experience_years?: number
          github_url?: string | null
          id?: string
          is_available?: boolean | null
          location?: string | null
          name?: string
          portfolio_url?: string | null
          preferred_project_types?: string[] | null
          role?: string
          status?: Database["public"]["Enums"]["developer_status"]
          updated_at?: string
          user_id?: string
          weekly_hours?: number | null
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
      project_assignments: {
        Row: {
          assigned_at: string
          developer_id: string
          id: string
          notes: string | null
          project_submission_id: string
          status: string | null
        }
        Insert: {
          assigned_at?: string
          developer_id: string
          id?: string
          notes?: string | null
          project_submission_id: string
          status?: string | null
        }
        Update: {
          assigned_at?: string
          developer_id?: string
          id?: string
          notes?: string | null
          project_submission_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_project_submission_id_fkey"
            columns: ["project_submission_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          project_submission_id: string | null
          temp_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          project_submission_id?: string | null
          temp_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          project_submission_id?: string | null
          temp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_submission_id_fkey"
            columns: ["project_submission_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
        ]
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "developer"
      developer_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "developer"],
      developer_status: ["pending", "approved", "rejected"],
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
