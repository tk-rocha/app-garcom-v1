import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface PaymentTotal {
  id: string;
  name: string;
  calculatedValue: number;
  adjustedValue: number;
}

const FechamentoPDVScreen = () => {
  const navigate = useNavigate();
  const [paymentTotals, setPaymentTotals] = useState<PaymentTotal[]>([]);

  // Payment methods matching PaymentScreen
  const paymentMethods = [
    { id: "cash", name: "Dinheiro" },
    { id: "debit_tef", name: "Débito TEF" },
    { id: "credit_tef", name: "Crédito TEF" },
    { id: "meal_voucher", name: "Vale Alimentação" },
    { id: "pix", name: "PIX" },
    { id: "debit_pos", name: "Débito POS" },
    { id: "credit_pos", name: "Crédito POS" },
  ];

  useEffect(() => {
    // Calculate actual sales totals by payment method
    const receipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
    const today = new Date().toDateString();
    
    // Filter today's receipts
    const todayReceipts = receipts.filter((receipt: any) => {
      const receiptDate = new Date(receipt.timestamp).toDateString();
      return receiptDate === today;
    });

    // Calculate totals by payment method
    const methodTotals: Record<string, number> = {};
    
    todayReceipts.forEach((receipt: any) => {
      if (receipt.payments && Array.isArray(receipt.payments)) {
        receipt.payments.forEach((payment: any) => {
          // Map payment method names to IDs
          let methodId = '';
          const methodName = payment.method.toLowerCase();
          
          if (methodName.includes('dinheiro')) methodId = 'cash';
          else if (methodName.includes('débito tef')) methodId = 'debit_tef';
          else if (methodName.includes('crédito tef')) methodId = 'credit_tef';
          else if (methodName.includes('vale alimentação')) methodId = 'meal_voucher';
          else if (methodName.includes('pix')) methodId = 'pix';
          else if (methodName.includes('débito pos')) methodId = 'debit_pos';
          else if (methodName.includes('crédito pos')) methodId = 'credit_pos';
          
          if (methodId) {
            methodTotals[methodId] = (methodTotals[methodId] || 0) + payment.amount;
          }
        });
      }
    });

    // Initialize payment totals
    const initialTotals = paymentMethods.map(method => ({
      id: method.id,
      name: method.name,
      calculatedValue: methodTotals[method.id] || 0,
      adjustedValue: methodTotals[method.id] || 0
    }));

    setPaymentTotals(initialTotals);
  }, []);

  const formatCurrencyInput = (value: string) => {
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

  const handleValueChange = (methodId: string, value: string) => {
    const formatted = formatCurrencyInput(value);
    const numericValue = parseFloat(formatted.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    
    setPaymentTotals(prev => 
      prev.map(total => 
        total.id === methodId 
          ? { ...total, adjustedValue: numericValue }
          : total
      )
    );
  };

  const handleConfirm = () => {
    const fundoCaixa = localStorage.getItem('fundoCaixaFechamento');
    
    if (!fundoCaixa) {
      toast({
        title: "Erro",
        description: "Valor do fundo de caixa não encontrado. Reinicie o processo.",
        variant: "destructive"
      });
      navigate('/fundo-caixa');
      return;
    }

    console.log('🔒 Iniciando fechamento do PDV - limpeza completa do sistema');

    // Save closing data
    const closingData = {
      date: new Date().toISOString(),
      fundoCaixa: parseFloat(fundoCaixa),
      paymentTotals: paymentTotals,
      closedBy: "Operador", // In a real system, this would be the logged user
      timestamp: new Date().toLocaleString('pt-BR')
    };

    // Save to localStorage
    const closings = JSON.parse(localStorage.getItem('pdvClosings') || '[]');
    closings.push(closingData);
    localStorage.setItem('pdvClosings', JSON.stringify(closings));

    // Mark that PDV was properly closed
    localStorage.setItem('pdvClosed', 'true');
    localStorage.setItem('lastClosingDate', new Date().toDateString());

    // COMPLETE SYSTEM CLEANUP - Clear all tables, commands, and counter cart
    console.log('🧹 Limpando todas as mesas e comandas');
    
    // Clear all mesa data (mesas 1-9)
    for (let mesaId = 1; mesaId <= 9; mesaId++) {
      console.log(`🧹 Limpando mesa ${mesaId}`);
      
      // Remove mesa specific data
      localStorage.removeItem(`mesa-${mesaId}-pessoas`);
      localStorage.removeItem(`mesa-${mesaId}-reviewed`);
    }

    // Clear all comanda data
    for (let comandaId = 1; comandaId <= 20; comandaId++) {
      console.log(`🧹 Limpando comanda ${comandaId}`);
      
      // Remove comanda specific data
      localStorage.removeItem(`comanda-${comandaId}-pessoas`);
      localStorage.removeItem(`comanda-${comandaId}-reviewed`);
    }

    // Clear all cart data (mesas, comandas, and balcao)
    console.log('🧹 Limpando todos os carrinhos');
    const cartData = localStorage.getItem('cartData');
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData);
        
        // Clear all carts
        if (parsed.carts) {
          // Clear mesa carts
          for (let mesaId = 1; mesaId <= 9; mesaId++) {
            delete parsed.carts[`mesa-${mesaId}`];
          }
          // Clear comanda carts
          for (let comandaId = 1; comandaId <= 20; comandaId++) {
            delete parsed.carts[`comanda-${comandaId}`];
          }
          // Clear balcao cart
          delete parsed.carts['balcao'];
        }
        
        // Clear all discounts
        if (parsed.discounts) {
          for (let mesaId = 1; mesaId <= 9; mesaId++) {
            delete parsed.discounts[`mesa-${mesaId}`];
          }
          for (let comandaId = 1; comandaId <= 20; comandaId++) {
            delete parsed.discounts[`comanda-${comandaId}`];
          }
          delete parsed.discounts['balcao'];
        }
        
        // Clear all taxes
        if (parsed.taxes) {
          for (let mesaId = 1; mesaId <= 9; mesaId++) {
            delete parsed.taxes[`mesa-${mesaId}`];
          }
          for (let comandaId = 1; comandaId <= 20; comandaId++) {
            delete parsed.taxes[`comanda-${comandaId}`];
          }
          delete parsed.taxes['balcao'];
        }
        
        // Clear all service fees
        if (parsed.serviceFees) {
          for (let mesaId = 1; mesaId <= 9; mesaId++) {
            delete parsed.serviceFees[`mesa-${mesaId}`];
          }
          for (let comandaId = 1; comandaId <= 20; comandaId++) {
            delete parsed.serviceFees[`comanda-${comandaId}`];
          }
          delete parsed.serviceFees['balcao'];
        }
        
        localStorage.setItem('cartData', JSON.stringify(parsed));
      } catch (e) {
        console.error('Erro ao limpar dados do carrinho:', e);
        // In case of error, completely reset cart data
        localStorage.removeItem('cartData');
      }
    }

    // Clear temporary closing data and session data
    localStorage.removeItem('fundoCaixaFechamento');
    localStorage.removeItem('currentShiftStarted');

    // Reset daily sales total (optional - depends on business logic)
    // const today = new Date().toDateString();
    // localStorage.setItem('dailySales', JSON.stringify({ [today]: 0 }));

    console.log('🔒 Fechamento do PDV concluído - sistema completamente limpo');

    // Force all screens to update
    window.dispatchEvent(new Event('storage'));

    toast({
      title: "PDV fechado com sucesso",
      description: "Sistema limpo e redirecionando para o login."
    });

    // Redirect to login after a short delay
    setTimeout(() => {
      navigate('/login');
    }, 1500);
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
          Fechar PDV
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Instructions */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-6 w-6 text-[#180F33]" />
              <div>
                <h2 className="text-lg font-semibold text-[#180F33]">Fechar PDV</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Digite os valores dos totalizadores para Fechar o PDV
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Totals */}
        <div className="space-y-3">
          {paymentTotals.map((total) => (
            <Card key={total.id} className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#180F33] font-medium">
                      {total.name}
                    </Label>
                    <span className="text-sm text-gray-500">
                      Calculado: {formatCurrency(total.calculatedValue)}
                    </span>
                  </div>
                  <Input
                    value={formatCurrency(total.adjustedValue)}
                    onChange={(e) => handleValueChange(total.id, e.target.value)}
                    inputMode="numeric"
                    className="text-lg"
                    placeholder="R$ 0,00"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

export default FechamentoPDVScreen;