import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Printer, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

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
  const [filtroData, setFiltroData] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Load cupons from fiscalReceipts (correct source)
    const storedReceipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
    
    // Filter cupons by selected date
    const selectedDate = new Date(filtroData).toDateString();
    const filteredCupons = storedReceipts
      .filter((receipt: any) => {
        if (!receipt || !receipt.timestamp) return false;
        const receiptDate = new Date(receipt.timestamp);
        if (isNaN(receiptDate.getTime())) return false;
        return receiptDate.toDateString() === selectedDate;
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

    setCupons(filteredCupons);
  }, [filtroData]);

  const handleReimprimir = (cupom: Cupom) => {
    // Simulate reprint
    toast({
      title: "✅ Cupom reenviado com sucesso",
      description: `Cupom #${cupom.numero} enviado para impressão`
    });
  };

  return (
    <div className="min-h-screen bg-[#E1E1E5] flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white flex items-center border-b border-[#E1E1E5]">
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
                     <div className="flex items-center space-x-4">
                       <Printer className="h-5 w-5 text-gray-400" />
                       <div className="flex-1 space-y-1">
                         <div className="flex items-center space-x-4">
                           <span className="font-medium text-[#180F33]">
                             #CUPOM {cupom.numero.padStart(6, '0')}
                           </span>
                           {cupom.cancelado && (
                             <span className="text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded">
                               CANCELADO
                             </span>
                           )}
                         </div>
                         <div className="text-sm text-gray-600">
                           {new Date(cupom.timestamp).toLocaleDateString('pt-BR')} – {new Date(cupom.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                         </div>
                         <div className="text-lg font-medium text-[#180F33]">
                           {formatCurrency(cupom.valorLiquido)}
                         </div>
                         <div className="text-sm text-gray-500">
                           Status: {cupom.cancelado ? 'Cancelado' : 'Válido'}
                         </div>
                       </div>
                     </div>
                     {!cupom.cancelado && (
                       <AlertDialog>
                         <AlertDialogTrigger asChild>
                           <Button
                             variant="outline"
                             className="bg-[#FFC72C] text-[#180F33] border-[#FFC72C] hover:bg-[#FFD700] font-medium"
                           >
                             <Printer className="h-4 w-4 mr-2" />
                             Reimprimir
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