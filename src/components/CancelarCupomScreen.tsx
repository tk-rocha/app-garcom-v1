import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Cupom {
  id: string; // Changed to string since we're using composite key
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
    // Load cupons from localStorage (stored by SaleCompletedScreen)
    const storedReceipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
    
    // Filter today's cupons
    const today = new Date().toDateString();
    const todayCupons = storedReceipts
      .filter((receipt: any) => {
        const receiptDate = new Date(receipt.timestamp).toDateString();
        return receiptDate === today;
      })
      .map((receipt: any, index: number) => ({
        id: `${receipt.number}-${receipt.timestamp}-${index}`, // Unique key combining multiple fields
        numero: receipt.number.toString(),
        timestamp: receipt.timestamp,
        valorBruto: receipt.grossAmount || 0,
        valorLiquido: receipt.netAmount || 0,
        cancelado: receipt.cancelado || false
      }))
      .sort((a, b) => parseInt(a.numero) - parseInt(b.numero)); // Sort by coupon number

    setCupons(todayCupons);
  }, []);

  // Calculate total sales for today
  const totalVendasHoje = cupons
    .filter(cupom => !cupom.cancelado)
    .reduce((total, cupom) => total + (cupom.valorLiquido || 0), 0);

  const handleCancelCupom = (cupom: Cupom) => {
    navigate("/confirmar-cancelamento", { state: { cupom } });
  };

  const today = new Date().toLocaleDateString('pt-BR');

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
          CUPONS EMITIDOS
        </h1>
      </div>

      {/* Total Sales Box */}
      <div className="p-6 bg-[#E1E1E5]">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Vendas Hoje</p>
            <p className="text-lg font-medium text-[#180F33]">{today}</p>
            <p className="text-2xl font-bold text-[#180F33] mt-2">
              {formatCurrency(totalVendasHoje)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-[#E1E1E5]">
        {cupons.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-center">
              Nenhum cupom encontrado para hoje
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E1E1E5]">
                  <TableHead className="text-[#180F33] font-medium w-[80px]"></TableHead>
                  <TableHead className="text-[#180F33] font-medium">Nº do Cupom</TableHead>
                  <TableHead className="text-[#180F33] font-medium">Data / Hora</TableHead>
                  <TableHead className="text-[#180F33] font-medium">Valor Bruto</TableHead>
                  <TableHead className="text-[#180F33] font-medium">Valor Líquido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cupons.map((cupom) => (
                  <TableRow 
                    key={cupom.id} 
                    className={cupom.cancelado ? 'opacity-50' : ''}
                  >
                    <TableCell>
                      {!cupom.cancelado && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelCupom(cupom)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-[#180F33]">
                      {cupom.numero}
                      {cupom.cancelado && (
                        <span className="ml-2 text-red-500 text-xs font-medium">
                          CANCELADO
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(cupom.timestamp).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-[#180F33]">
                      {formatCurrency(cupom.valorBruto)}
                    </TableCell>
                    <TableCell className="text-[#180F33] font-medium">
                      {formatCurrency(cupom.valorLiquido)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelarCupomScreen;