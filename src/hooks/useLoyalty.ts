
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface LoyaltyCustomer {
  cpf: string;
  nome: string;
  pontos: number;
}

const stripCpf = (value: string) => value.replace(/\D/g, "").slice(0, 11);

export const useLoyalty = () => {
  const { toast } = useToast();

  const getByCpf = async (maskedCpf: string): Promise<LoyaltyCustomer | null> => {
    const cpf = stripCpf(maskedCpf);
    if (!cpf) return null;

    const { data, error } = await supabase
      .from("clientes_fidelidade")
      .select("cpf, nome, pontos")
      .eq("cpf", cpf)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar cliente de fidelidade:", error);
      return null;
    }

    return data as LoyaltyCustomer | null;
  };

  const ensureCustomer = async (
    maskedCpf: string,
    nome?: string
  ): Promise<LoyaltyCustomer> => {
    const cpf = stripCpf(maskedCpf);
    const existing = await getByCpf(cpf);
    if (existing) return existing;

    const fallbackName = (nome?.trim() || "Cliente Fidelidade").slice(0, 120);

    const { data, error } = await supabase
      .from("clientes_fidelidade")
      .insert({ cpf, nome: fallbackName })
      .select("cpf, nome, pontos")
      .single();

    if (error) {
      console.error("Erro ao cadastrar cliente de fidelidade:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Não foi possível cadastrar o CPF informado.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Cliente cadastrado",
      description: `CPF ${cpf} adicionado ao Fidelidade.`,
    });

    return data as LoyaltyCustomer;
  };

  return {
    getByCpf,
    ensureCustomer,
  };
};
