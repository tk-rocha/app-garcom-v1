import React, { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const CPFScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [cpf, setCpf] = useState("");
  
  const mesaId = searchParams.get('mesa') || location.state?.mesa;

  const formatCPF = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);
    
    // Aplica a máscara 000.000.000-00
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    } else if (limited.length <= 9) {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    } else {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setCpf(formattedValue);
  };

  const isValidCPF = () => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const handleContinueWithCPF = () => {
    const navigationState = { cpf };
    if (mesaId) {
      navigate(`/pagamento?mesa=${mesaId}`, { state: { ...navigationState, mesa: mesaId } });
    } else {
      navigate("/pagamento", { state: navigationState });
    }
  };

  const handleContinueWithoutCPF = () => {
    const navigationState = { cpf: "" };
    if (mesaId) {
      navigate(`/pagamento?mesa=${mesaId}`, { state: { ...navigationState, mesa: mesaId } });
    } else {
      navigate("/pagamento", { state: navigationState });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidCPF()) {
      handleContinueWithCPF();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (mesaId) {
              navigate(`/sacola?mesa=${mesaId}`);
            } else {
              navigate("/sacola");
            }
          }}
          className="text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <h1 className="text-lg font-semibold text-primary">CPF NA NOTA</h1>
        
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* CPF Input */}
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium text-foreground">
              CPF
            </Label>
            <Input
              id="cpf"
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCPFChange}
              onKeyPress={handleKeyPress}
              className="text-lg h-12 text-center"
              autoFocus
            />
          </div>

          {/* Info text */}
          <p className="text-sm text-muted-foreground text-center">
            O CPF será incluído na nota fiscal (opcional)
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-3">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleContinueWithoutCPF}
            className="flex-1 h-12 text-base"
          >
            Sem CPF
          </Button>
          
          <Button
            onClick={handleContinueWithCPF}
            disabled={!isValidCPF()}
            className="flex-1 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CPFScreen;