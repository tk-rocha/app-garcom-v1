import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Printer, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Cupom {
  id: number;
  numero: string;
  timestamp: string;
  valorBruto: number;
  valorLiquido: number;
  cancelado?: boolean;
}

const ReimpressaoScreen = () => {
  const navigate = useNavigate();
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [filtroData, setFiltroData] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Load cupons from localStorage
    const storedCupons = JSON.parse(localStorage.getItem('cupons') || '[]');
    
    // Filter cupons by selected date
    const selectedDate = new Date(filtroData).toDateString();
    const filteredCupons = storedCupons.filter((cupom: Cupom) => {
      const cupomDate = new Date(cupom.timestamp).toDateString();
      return cupomDate === selectedDate;
    });

    setCupons(filteredCupons);
  }, [filtroData]);

  const handleReimprimir = (cupom: Cupom) => {
    // Show confirmation dialog
    if (window.confirm(`Deseja reimprimir o cupom ${cupom.numero}?`)) {
      // Simulate reprint
      toast({
        title: "Cupom reimpresso",
        description: `Cupom ${cupom.numero} enviado para impressão`
      });
    }
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
          REIMPRESSÃO
        </h1>
      </div>

      {/* Date Filter */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="relative">
          <Input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="pr-10"
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {cupons.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-center">
              Nenhum cupom encontrado para a data selecionada
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cupons.map((cupom) => (
              <Card 
                key={cupom.id} 
                className={`bg-white shadow-sm ${cupom.cancelado ? 'opacity-50' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-[#180F33]">
                          Nº {cupom.numero}
                        </span>
                        <span className="text-sm text-gray-600">
                          {new Date(cupom.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>
                          Bruto: R$ {cupom.valorBruto.toFixed(2).replace(".", ",")}
                        </span>
                        <span>
                          Líquido: R$ {cupom.valorLiquido.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                      {cupom.cancelado && (
                        <span className="text-red-500 text-sm font-medium">
                          CANCELADO
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReimprimir(cupom)}
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Printer className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReimpressaoScreen;