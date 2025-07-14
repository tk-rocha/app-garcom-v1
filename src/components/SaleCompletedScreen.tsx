import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface SaleData {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  payments: Array<{
    method: string;
    amount: number;
  }>;
  customerCpf?: string;
}

const SaleCompletedScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  
  const saleData: SaleData = location.state?.saleData || {};

  useEffect(() => {
    // Generate fiscal receipt
    const generateReceipt = () => {
      const now = new Date();
      const receiptNumber = Date.now(); // Simple sequential number based on timestamp
      
      const receipt = {
        number: receiptNumber,
        timestamp: now.toISOString(),
        date: now.toLocaleDateString('pt-BR'),
        time: now.toLocaleTimeString('pt-BR'),
        grossAmount: saleData.subtotal + saleData.taxAmount, // Valor bruto
        netAmount: saleData.total, // Valor líquido após desconto
        discount: saleData.discountAmount,
        tax: saleData.taxAmount,
        payments: saleData.payments,
        customerCpf: saleData.customerCpf,
      };

      // Store receipt in localStorage for future "Cupons Emitidos" screen
      const existingReceipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
      existingReceipts.push(receipt);
      localStorage.setItem('fiscalReceipts', JSON.stringify(existingReceipts));

      // Update daily sales total
      const today = now.toDateString();
      const dailySales = JSON.parse(localStorage.getItem('dailySales') || '{}');
      dailySales[today] = (dailySales[today] || 0) + saleData.total;
      localStorage.setItem('dailySales', JSON.stringify(dailySales));

      console.log('Receipt generated:', receipt);
    };

    generateReceipt();
    clearCart(); // Clear cart after successful sale

    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/balcao");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, saleData, clearCart]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Success Icon with Animation */}
        <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center animate-scale-in">
          <Check className="h-10 w-10 text-primary-foreground animate-pulse" />
        </div>
        
        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            Venda Finalizada
          </h1>
          <p className="text-lg text-muted-foreground">
            Cupom fiscal gerado com sucesso
          </p>
        </div>

        {/* Sale Summary */}
        <div className="bg-card border rounded-lg p-4 max-w-sm mx-auto">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total da venda:</span>
              <span className="font-semibold text-primary">
                R$ {saleData.total?.toFixed(2).replace(".", ",") || "0,00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cupom nº:</span>
              <span className="font-mono text-xs">
                {Date.now().toString().slice(-6)}
              </span>
            </div>
          </div>
        </div>

        {/* Redirect Message */}
        <p className="text-sm text-muted-foreground">
          Redirecionando automaticamente...
        </p>
      </div>
    </div>
  );
};

export default SaleCompletedScreen;