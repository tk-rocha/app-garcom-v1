import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { getValidatedDailySalesTotalWithSync } from "@/utils/salesCalculations";

interface Cupom {
  id: string;
  numero: string;
  timestamp: string;
  valorBruto: number;
  valorLiquido: number;
  cancelado?: boolean;
}

const ReimpressaoScreen = () => {
  const navigate = useNavigate();
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [totalVendasHoje, setTotalVendasHoje] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      // Clean and load receipts from localStorage (same logic as CancelarCupomScreen)
      const cleanAndLoadReceipts = () => {
        const rawReceipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
        
        // Remove duplicates based on number AND timestamp similarity (within 10 seconds)
        const cleanReceipts = rawReceipts.filter((receipt: any, index: number) => {
          // Skip invalid receipts
          if (!receipt || !receipt.number || !receipt.timestamp) return false;
          
          const firstOccurrence = rawReceipts.findIndex((r: any) => {
            if (!r || !r.number || !r.timestamp) return false;
            
            const rTime = new Date(r.timestamp).getTime();
            const receiptTime = new Date(receipt.timestamp).getTime();
            
            // Skip if dates are invalid
            if (isNaN(rTime) || isNaN(receiptTime)) return false;
            
            const timeDiff = Math.abs(rTime - receiptTime);
            return r.number === receipt.number && timeDiff < 10000;
          });
          return firstOccurrence === index;
        });
        
        // Save cleaned receipts back if we removed duplicates
        if (cleanReceipts.length !== rawReceipts.length) {
          localStorage.setItem('fiscalReceipts', JSON.stringify(cleanReceipts));
        }
        
        // Filter to get only today's sales
        const today = new Date().toDateString();
        
        const todayCupons = cleanReceipts
          .filter((receipt: any) => {
            if (!receipt || !receipt.timestamp) return false;
            
            const receiptDate = new Date(receipt.timestamp);
            if (isNaN(receiptDate.getTime())) return false;
            
            return receiptDate.toDateString() === today;
          })
          .map((receipt: any, index: number) => ({
            id: receipt.id || `${receipt.number || 'unknown'}-${receipt.timestamp}-${index}`,
            numero: (receipt.number || 0).toString(),
            timestamp: receipt.timestamp,
            valorBruto: receipt.grossAmount || 0,
            valorLiquido: receipt.netAmount || 0,
            cancelado: receipt.cancelado || false
          }))
          .sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
        
        return todayCupons;
      };

      setCupons(cleanAndLoadReceipts());
      
      // Calculate total sales for today using validated data with sync
      const total = await getValidatedDailySalesTotalWithSync();
      setTotalVendasHoje(total);
    };

    loadData();
  }, []);

  const handleReimprimir = (cupom: Cupom) => {
    // Simulate reprint
    toast({
      title: "✅ Cupom reenviado com sucesso",
      description: `Cupom #${cupom.numero} enviado para impressão`
    });
  };

  const todayFormatted = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white border-b border-[#E1E1E5] flex items-center flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/funcoes")}
          className="mr-4 text-[#180F33]"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium text-[#180F33] flex-1 text-center mr-10">
          REIMPRESSÃO
        </h1>
      </div>

      {/* Total Sales Box */}
      <div className="p-6 bg-[#E1E1E5]">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">Total Vendas Hoje</h2>
                <p className="text-sm text-gray-600">{todayFormatted}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(totalVendasHoje)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-[#E1E1E5] overflow-y-auto">
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#FFC72C] hover:text-[#FFD700] hover:bg-yellow-50 h-8 w-8"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[#180F33] flex items-center">
                                <Printer className="h-5 w-5 mr-2" />
                                Reimprimir Cupom Fiscal
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600">
                                Deseja reimprimir o cupom fiscal <strong>#{cupom.numero.padStart(6, '0')}</strong>?
                                <br />
                                Essa ação enviará novamente o comando à impressora.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="text-gray-600 hover:text-gray-800">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleReimprimir(cupom)}
                                className="bg-[#FFC72C] text-[#180F33] hover:bg-[#FFD700]"
                              >
                                Reimprimir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

export default ReimpressaoScreen;