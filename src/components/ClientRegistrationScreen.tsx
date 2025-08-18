import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useLoyalty } from "@/hooks/useLoyalty";
import { useToast } from "@/hooks/use-toast";

const ClientRegistrationScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { ensureCustomer } = useLoyalty();
  const { toast } = useToast();

  // Get CPF from location state or URL params
  const cpfFromState = location.state?.cpf || "";
  const mesaId = searchParams.get("mesa");
  const comandaId = searchParams.get("comanda");

  const [cpf, setCpf] = useState(cpfFromState);
  const [nome, setNome] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2");
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    setCpf(formatted);
  };

  const handleConfirm = async () => {
    if (!cpf || cpf.length !== 14 || !nome.trim()) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha o CPF e nome completos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await ensureCustomer(cpf, nome.trim());
      
      // Navigate back to customer screen with the registered CPF
      const params = new URLSearchParams();
      if (mesaId) params.set("mesa", mesaId);
      if (comandaId) params.set("comanda", comandaId);
      
      navigate(`/cliente?${params.toString()}`, {
        state: { registeredCpf: cpf }
      });
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    if (mesaId) params.set("mesa", mesaId);
    if (comandaId) params.set("comanda", comandaId);
    
    navigate(`/cliente?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBack}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">CADASTRO CLIENTE</h1>
          
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Novo Cliente</h2>
              <p className="text-sm text-gray-600">
                CPF não encontrado. Vamos cadastrá-lo no programa de fidelidade.
              </p>
            </div>

            <div className="space-y-4">
              {/* CPF Field */}
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                  CPF *
                </Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => handleCPFChange(e.target.value)}
                  placeholder="000.000.000-00"
                  className="text-lg"
                  inputMode="numeric"
                />
              </div>

              {/* Nome Field */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value.slice(0, 120))}
                  placeholder="Digite o nome completo"
                  className="text-lg"
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={handleConfirm}
                disabled={!cpf || cpf.length !== 14 || !nome.trim() || isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? "Cadastrando..." : "Confirmar Cadastro"}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full border-primary text-primary hover:bg-primary/5"
              >
                Cancelar
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center pt-2">
              * O cliente iniciará com 0 pontos e já poderá começar a pontuar nas próximas compras.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientRegistrationScreen;