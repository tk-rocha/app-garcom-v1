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
      clientes_fidelidade: {
        Row: {
          atualizado_em: string | null
          cpf: string
          criado_em: string | null
          id: string
          nome: string
          pontos: number
        }
        Insert: {
          atualizado_em?: string | null
          cpf: string
          criado_em?: string | null
          id?: string
          nome: string
          pontos?: number
        }
        Update: {
          atualizado_em?: string | null
          cpf?: string
          criado_em?: string | null
          id?: string
          nome?: string
          pontos?: number
        }
        Relationships: []
      }
      formas_pagamento: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          id: string
          nome: string
          padrao_sangria: boolean | null
          padrao_suprimento: boolean | null
          parcelas_permitidas: number | null
          permite_troco: boolean | null
          situacao: string
          traz_fechamento: boolean | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          nome: string
          padrao_sangria?: boolean | null
          padrao_suprimento?: boolean | null
          parcelas_permitidas?: number | null
          permite_troco?: boolean | null
          situacao?: string
          traz_fechamento?: boolean | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          nome?: string
          padrao_sangria?: boolean | null
          padrao_suprimento?: boolean | null
          parcelas_permitidas?: number | null
          permite_troco?: boolean | null
          situacao?: string
          traz_fechamento?: boolean | null
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
      pagamentos_venda: {
        Row: {
          criado_em: string | null
          id: string
          id_forma_pagamento: string
          id_venda: string
          valor_pago: number
        }
        Insert: {
          criado_em?: string | null
          id?: string
          id_forma_pagamento: string
          id_venda: string
          valor_pago: number
        }
        Update: {
          criado_em?: string | null
          id?: string
          id_forma_pagamento?: string
          id_venda?: string
          valor_pago?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_venda_id_forma_pagamento_fkey"
            columns: ["id_forma_pagamento"]
            isOneToOne: false
            referencedRelation: "formas_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_venda_id_venda_fkey"
            columns: ["id_venda"]
            isOneToOne: false
            referencedRelation: "vendas"
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
          cpf_cliente: string | null
          cpf_fidelidade: string | null
          criado_em: string | null
          finalizado_em: string | null
          id: string
          numero_cupom: number
          numero_mesa_comanda: number | null
          status: string | null
          tipo: string
          valor_bruto: number
          valor_desconto: number | null
          valor_liquido: number
          valor_taxa: number | null
          valor_troco: number | null
          vendedor_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cpf_cliente?: string | null
          cpf_fidelidade?: string | null
          criado_em?: string | null
          finalizado_em?: string | null
          id?: string
          numero_cupom?: number
          numero_mesa_comanda?: number | null
          status?: string | null
          tipo?: string
          valor_bruto?: number
          valor_desconto?: number | null
          valor_liquido?: number
          valor_taxa?: number | null
          valor_troco?: number | null
          vendedor_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cpf_cliente?: string | null
          cpf_fidelidade?: string | null
          criado_em?: string | null
          finalizado_em?: string | null
          id?: string
          numero_cupom?: number
          numero_mesa_comanda?: number | null
          status?: string | null
          tipo?: string
          valor_bruto?: number
          valor_desconto?: number | null
          valor_liquido?: number
          valor_taxa?: number | null
          valor_troco?: number | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vendas_clientes_fidelidade"
            columns: ["cpf_fidelidade"]
            isOneToOne: false
            referencedRelation: "clientes_fidelidade"
            referencedColumns: ["cpf"]
          },
          {
            foreignKeyName: "vendas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "garcons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      strip_digits: {
        Args: { value: string }
        Returns: string
      }
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
