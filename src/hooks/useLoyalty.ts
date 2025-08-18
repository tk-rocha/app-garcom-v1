
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

  const redeemPoints = async (maskedCpf: string, points: number): Promise<boolean> => {
    const cpf = stripCpf(maskedCpf);
    if (!cpf || points <= 0) return false;

    // Get current customer points first
    const currentCustomer = await getByCpf(cpf);
    if (!currentCustomer) return false;

    const newPoints = Math.max(0, currentCustomer.pontos - points);

    const { error } = await supabase
      .from("clientes_fidelidade")
      .update({ 
        pontos: newPoints,
        atualizado_em: new Date().toISOString()
      })
      .eq("cpf", cpf);

    if (error) {
      console.error("Erro ao resgatar pontos:", error);
      toast({
        title: "Erro no resgate",
        description: "Não foi possível resgatar os pontos.",
        variant: "destructive",
      });
      return false;
    }

    console.log(`✅ Pontos resgatados: ${points} para CPF ${cpf}, pontos restantes: ${newPoints}`);
    return true;
  };

  return {
    getByCpf,
    ensureCustomer,
    redeemPoints,
  };
};
