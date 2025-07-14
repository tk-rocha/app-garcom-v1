import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface Cupom {
  id: string; // Changed to string to match CancelarCupomScreen
  numero: string;
  timestamp: string;
  valorBruto: number;
  valorLiquido: number;
  cancelado?: boolean;
}

const ConfirmarCancelamentoScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cupom = location.state?.cupom as Cupom;
  const [motivo, setMotivo] = useState("");

  if (!cupom) {
    navigate(-1);
    return null;
  }

  const handleConfirm = () => {
    if (!motivo.trim()) {
      toast({
        title: "Erro",
        description: "O motivo é obrigatório",
        variant: "destructive"
      });
      return;
    }

    // Load and update fiscal receipts
    const storedReceipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
    const updatedReceipts = storedReceipts.map((receipt: any) => 
      receipt.number.toString() === cupom.numero 
        ? { ...receipt, cancelado: true, motivoCancelamento: motivo }
        : receipt
    );
    localStorage.setItem('fiscalReceipts', JSON.stringify(updatedReceipts));

    toast({
      title: "Cupom cancelado",
      description: `Cupom ${cupom.numero} cancelado com sucesso`
    });

    navigate("/cancelar-cupom");
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
          Cancelar Cupom
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Cupom Details Card */}
        <Card className="bg-white shadow-sm border-2 border-red-200">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-[#180F33]">
                Cupom Nº {cupom.numero} – {formatCurrency(cupom.valorLiquido)}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(cupom.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Motivo Field */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="motivo" className="text-[#180F33] font-medium">
                Motivo do Cancelamento
              </Label>
              <div className="relative">
                <Input
                  id="motivo"
                  placeholder="Digite o motivo do cancelamento"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="pr-10"
                />
                <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Buttons */}
      <div className="p-6 bg-white border-t border-[#E1E1E5]">
        <div className="flex gap-4">
          <Button
            onClick={() => navigate(-1)}
            className="flex-1 h-14 bg-[#180F33] hover:bg-[#180F33]/90 text-white font-medium text-lg rounded-lg"
          >
            Voltar
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 h-14 bg-[#180F33] hover:bg-[#180F33]/90 text-white font-medium text-lg rounded-lg"
          >
            Confirmar Cancelamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarCancelamentoScreen;