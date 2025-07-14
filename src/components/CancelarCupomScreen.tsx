import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CancelarCupomScreen = () => {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState<any[]>([]);

  useEffect(() => {
    // Debug: Load all receipts from localStorage
    const storedReceipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
    console.log('Todos os recibos armazenados:', storedReceipts);
    
    // Filter to get only today's sales
    const today = new Date().toDateString();
    console.log('Data de hoje:', today);
    
    const vendasHoje = storedReceipts.filter((receipt: any) => {
      const receiptDate = new Date(receipt.timestamp).toDateString();
      console.log('Comparando:', receiptDate, 'com', today);
      return receiptDate === today;
    });
    
    console.log('Vendas de hoje encontradas:', vendasHoje);
    setVendas(vendasHoje);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white border-b border-[#E1E1E5] flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4 text-[#180F33]"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium text-[#180F33] flex-1 text-center mr-10">
          VENDAS FINALIZADAS HOJE
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <h2 className="text-lg font-medium text-[#180F33] mb-4">
          Lista Simples das Vendas de Hoje
        </h2>
        
        {vendas.length === 0 ? (
          <p className="text-gray-600">
            Nenhuma venda finalizada encontrada para hoje.
          </p>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Total de vendas encontradas: {vendas.length}
            </p>
            <ul className="space-y-3">
              {vendas.map((venda, index) => (
                <li key={`venda-${index}`} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>ID da Venda (Cupom):</strong> {venda.number || 'N/A'}
                    </div>
                    <div>
                      <strong>Valor Total:</strong> {formatCurrency(venda.netAmount || 0)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Data/Hora:</strong> {new Date(venda.timestamp).toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Valor Bruto:</strong> {formatCurrency(venda.grossAmount || 0)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelarCupomScreen;