import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SangriaScreen = () => {
  const navigate = useNavigate();
  const [motivo, setMotivo] = useState("");
  const [valor, setValor] = useState("");

  const formatCurrency = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Convert to number and divide by 100 to get proper decimal places
    const numberValue = parseInt(numericValue) / 100;
    
    // Format as currency
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setValor(formatted);
  };

  const handleConfirm = () => {
    if (!motivo.trim()) {
      toast({
        title: "Erro",
        description: "O motivo é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!valor || valor === "R$ 0,00") {
      toast({
        title: "Erro", 
        description: "O valor deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }

    // Parse the value to number
    const numericValue = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));

    // Save sangria record
    const sangrias = JSON.parse(localStorage.getItem('sangrias') || '[]');
    const novaSangria = {
      id: Date.now(),
      motivo,
      valor: numericValue,
      data: new Date().toISOString(),
      timestamp: new Date().toLocaleString('pt-BR')
    };

    sangrias.push(novaSangria);
    localStorage.setItem('sangrias', JSON.stringify(sangrias));

    toast({
      title: "Sangria registrada",
      description: `Sangria de ${valor} registrada com sucesso`
    });

    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#E1E1E5] flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium text-[#180F33] flex-1 text-center mr-10">
          SANGRIA
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Motivo Field */}
            <div className="space-y-2">
              <Label htmlFor="motivo" className="text-[#180F33] font-medium">
                Motivo
              </Label>
              <div className="relative">
                <Input
                  id="motivo"
                  placeholder="Digite o motivo da sangria"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="pr-10"
                />
                <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Valor Field */}
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-[#180F33] font-medium">
                Valor
              </Label>
              <Input
                id="valor"
                placeholder="R$ 0,00"
                value={valor}
                onChange={handleValueChange}
                inputMode="numeric"
                className="text-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Buttons */}
      <div className="p-4 sm:p-6 bg-white border-t border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => navigate(-1)}
            className="flex-1 h-12 sm:h-14 bg-[#180F33] hover:bg-[#180F33]/90 text-white font-medium text-base"
          >
            Voltar
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 h-12 sm:h-14 bg-[#180F33] hover:bg-[#180F33]/90 text-white font-medium text-base"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SangriaScreen;