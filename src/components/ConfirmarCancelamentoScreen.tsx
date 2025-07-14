import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Cupom {
  id: number;
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

    // Load and update cupons
    const storedCupons = JSON.parse(localStorage.getItem('cupons') || '[]');
    const updatedCupons = storedCupons.map((c: Cupom) => 
      c.id === cupom.id 
        ? { ...c, cancelado: true, motivoCancelamento: motivo }
        : c
    );
    localStorage.setItem('cupons', JSON.stringify(updatedCupons));

    // Update daily sales (subtract the cancelled cupom value)
    const today = new Date().toDateString();
    const dailySales = JSON.parse(localStorage.getItem('dailySales') || '{}');
    if (dailySales[today]) {
      dailySales[today] -= cupom.valorLiquido;
      if (dailySales[today] < 0) dailySales[today] = 0;
      localStorage.setItem('dailySales', JSON.stringify(dailySales));
    }

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
          CANCELAR CUPOM
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Cupom Details Card */}
        <Card className="bg-white shadow-sm border-2 border-red-200">
          <CardContent className="p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#180F33]">
                Cupom #{cupom.numero}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(cupom.timestamp).toLocaleString('pt-BR')}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm">Valor Bruto:</span>
                <span className="font-medium">
                  R$ {cupom.valorBruto.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Valor Líquido:</span>
                <span className="font-medium">
                  R$ {cupom.valorLiquido.toFixed(2).replace(".", ",")}
                </span>
              </div>
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
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Confirmar Cancelamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarCancelamentoScreen;