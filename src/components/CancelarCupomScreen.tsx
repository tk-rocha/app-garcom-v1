import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";

interface Cupom {
  id: number;
  numero: string;
  timestamp: string;
  valorBruto: number;
  valorLiquido: number;
  cancelado?: boolean;
}

const CancelarCupomScreen = () => {
  const navigate = useNavigate();
  const [cupons, setCupons] = useState<Cupom[]>([]);

  useEffect(() => {
    // Load cupons from localStorage
    const storedCupons = JSON.parse(localStorage.getItem('cupons') || '[]');
    
    // Filter today's cupons
    const today = new Date().toDateString();
    const todayCupons = storedCupons.filter((cupom: Cupom) => {
      const cupomDate = new Date(cupom.timestamp).toDateString();
      return cupomDate === today;
    });

    setCupons(todayCupons);
  }, []);

  const handleCancelCupom = (cupom: Cupom) => {
    navigate("/confirmar-cancelamento", { state: { cupom } });
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
      <div className="flex-1 p-6">
        {cupons.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-center">
              Nenhum cupom encontrado para hoje
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
                    {!cupom.cancelado && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancelCupom(cupom)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
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

export default CancelarCupomScreen;