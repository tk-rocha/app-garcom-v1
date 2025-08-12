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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      categorias: {
        Row: {
          criado_em: string | null
          id: string
          nome: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          nome: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      garcons: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          id: string
          nome: string
          senha: string
          usuario: string
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          id?: string
          nome: string
          senha: string
          usuario: string
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          id?: string
          nome?: string
          senha?: string
          usuario?: string
        }
        Relationships: []
      }
      itens_venda: {
        Row: {
          criado_em: string | null
          enviado_em: string | null
          id: string
          observacao: string | null
          preco_unitario: number
          produto_id: string
          quantidade: number | null
          status: string | null
          venda_id: string
        }
        Insert: {
          criado_em?: string | null
          enviado_em?: string | null
          id?: string
          observacao?: string | null
          preco_unitario: number
          produto_id: string
          quantidade?: number | null
          status?: string | null
          venda_id: string
        }
        Update: {
          criado_em?: string | null
          enviado_em?: string | null
          id?: string
          observacao?: string | null
          preco_unitario?: number
          produto_id?: string
          quantidade?: number | null
          status?: string | null
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_venda_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_venda_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      mesas: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          descricao: string | null
          id: string
          numero: number
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          numero: number
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          numero?: number
        }
        Relationships: []
      }
      opcoes_fase: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          id: string
          nome: string
          preco_adicional: number | null
          tipo_fase_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          id?: string
          nome: string
          preco_adicional?: number | null
          tipo_fase_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          id?: string
          nome?: string
          preco_adicional?: number | null
          tipo_fase_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opcoes_fase_tipo_fase_id_fkey"
            columns: ["tipo_fase_id"]
            isOneToOne: false
            referencedRelation: "tipos_fase"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_componentes: {
        Row: {
          componente_id: string
          id: string
          produto_id: string
          quantidade: number | null
        }
        Insert: {
          componente_id: string
          id?: string
          produto_id: string
          quantidade?: number | null
        }
        Update: {
          componente_id?: string
          id?: string
          produto_id?: string
          quantidade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_componentes_componente_id_fkey"
            columns: ["componente_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_componentes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_fases: {
        Row: {
          criado_em: string | null
          id: string
          obrigatorio: boolean | null
          ordem: number
          produto_id: string | null
          tipo_fase_id: string | null
        }
        Insert: {
          criado_em?: string | null
          id?: string
          obrigatorio?: boolean | null
          ordem: number
          produto_id?: string | null
          tipo_fase_id?: string | null
        }
        Update: {
          criado_em?: string | null
          id?: string
          obrigatorio?: boolean | null
          ordem?: number
          produto_id?: string | null
          tipo_fase_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_fases_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fases_tipo_fase_id_fkey"
            columns: ["tipo_fase_id"]
            isOneToOne: false
            referencedRelation: "tipos_fase"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          categoria_id: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          imagem_url: string | null
          nome: string
          preco: number
        }
        Insert: {
          ativo?: boolean | null
          categoria_id?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          preco: number
        }
        Update: {
          ativo?: boolean | null
          categoria_id?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          preco?: number
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_fase: {
        Row: {
          criado_em: string | null
          id: string
          nome: string
          opcional: boolean | null
          titulo: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          nome: string
          opcional?: boolean | null
          titulo: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          nome?: string
          opcional?: boolean | null
          titulo?: string
        }
        Relationships: []
      }
      vendas: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          garcom_id: string | null
          id: string
          mesa_id: string | null
          numero_pedido: number
          status: string | null
          valor_total: number | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          garcom_id?: string | null
          id?: string
          mesa_id?: string | null
          numero_pedido?: number
          status?: string | null
          valor_total?: number | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          garcom_id?: string | null
          id?: string
          mesa_id?: string | null
          numero_pedido?: number
          status?: string | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_garcom_id_fkey"
            columns: ["garcom_id"]
            isOneToOne: false
            referencedRelation: "garcons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_mesa_id_fkey"
            columns: ["mesa_id"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
