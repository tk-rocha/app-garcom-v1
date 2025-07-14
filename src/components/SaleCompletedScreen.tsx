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

    // Auto redirect after 4 seconds
    const timer = setTimeout(() => {
      navigate("/balcao");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, saleData, clearCart]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in max-w-md mx-auto">
        {/* Success Icon with Animation */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center animate-scale-in relative"
             style={{ backgroundColor: '#180F33' }}>
          <svg 
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              className="animate-check-draw"
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7"
              style={{
                strokeDasharray: '100',
                strokeDashoffset: '100',
              }}
            />
          </svg>
        </div>
        
        {/* Success Message */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight" 
              style={{ color: '#180F33' }}>
            Venda Finalizada
          </h1>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed" 
             style={{ color: '#8A8A8A' }}>
            Cupom fiscal gerado com sucesso
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaleCompletedScreen;