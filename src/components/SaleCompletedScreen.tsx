import { useEffect, useRef } from "react";
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
  mesa?: string;
}

const SaleCompletedScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const hasProcessed = useRef(false);
  
  const saleData: SaleData = location.state?.saleData || {};

  useEffect(() => {
    // Prevent multiple executions with stronger safeguards
    if (hasProcessed.current) {
      console.log('Sale already processed, skipping...');
      return;
    }

    // Generate unique receipt with lock mechanism
    const generateReceipt = () => {
      const now = new Date();
      const lockKey = 'receipts_generating_lock';
      const timestampKey = 'last_receipt_timestamp';
      
      // Check if we're already generating a receipt (within 5 seconds)
      const lastTimestamp = localStorage.getItem(timestampKey);
      const timeDiff = lastTimestamp ? now.getTime() - parseInt(lastTimestamp) : Infinity;
      
      if (timeDiff < 5000) {
        console.log('Recibo já sendo gerado recentemente, pulando...');
        return;
      }

      // Set lock
      localStorage.setItem(lockKey, 'true');
      localStorage.setItem(timestampKey, now.getTime().toString());
      
      try {
        // Clean duplicates first
        const rawReceipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
        console.log('Raw receipts before cleaning:', rawReceipts.length);
        
        // Remove duplicates based on number AND timestamp similarity (within 10 seconds)
        const cleanReceipts = rawReceipts.filter((receipt: any, index: number) => {
          const firstOccurrence = rawReceipts.findIndex((r: any) => {
            const timeDiff = Math.abs(new Date(r.timestamp).getTime() - new Date(receipt.timestamp).getTime());
            return r.number === receipt.number && timeDiff < 10000;
          });
          return firstOccurrence === index;
        });
        
        console.log('Cleaned receipts:', cleanReceipts.length, 'removed:', rawReceipts.length - cleanReceipts.length);
        
        // Find the highest coupon number and increment
        let receiptNumber = 700;
        if (cleanReceipts.length > 0) {
          const maxNumber = Math.max(...cleanReceipts.map((r: any) => parseInt(r.number) || 699));
          receiptNumber = maxNumber + 1;
        }
        
        // Create unique receipt with stronger ID
        const uniqueId = `${now.getTime()}-${Math.random().toString(36).substring(2)}`;
        const receipt = {
          id: uniqueId,
          number: receiptNumber,
          timestamp: now.toISOString(),
          date: now.toLocaleDateString('pt-BR'),
          time: now.toLocaleTimeString('pt-BR'),
          grossAmount: saleData.subtotal + saleData.taxAmount,
          netAmount: saleData.total,
          discount: saleData.discountAmount,
          tax: saleData.taxAmount,
          payments: saleData.payments,
          customerCpf: saleData.customerCpf,
        };

        // Store updated receipts
        cleanReceipts.push(receipt);
        localStorage.setItem('fiscalReceipts', JSON.stringify(cleanReceipts));

        // Update daily sales total
        const today = new Date().toDateString();
        const dailySales = JSON.parse(localStorage.getItem('dailySales') || '{}');
        const currentDailyTotal = dailySales[today] || 0;
        const newDailyTotal = currentDailyTotal + saleData.total;
        dailySales[today] = newDailyTotal;
        localStorage.setItem('dailySales', JSON.stringify(dailySales));

        console.log('Recibo gerado com sucesso:', receipt);
        console.log('Total de recibos após geração:', cleanReceipts.length);
        console.log('Total diário atualizado:', { anterior: currentDailyTotal, novo: newDailyTotal, venda: saleData.total });
        
      } finally {
        // Always remove lock
        localStorage.removeItem(lockKey);
      }
    };

    console.log('Processing sale completion...');
    hasProcessed.current = true;
    generateReceipt();
    
    // Clear the appropriate cart (mesa or balcao)
    const cartId = saleData.mesa ? `mesa-${saleData.mesa}` : 'balcao';
    console.log('Clearing cart for:', cartId);
    clearCart(cartId);

    // Auto redirect after 3 seconds
    console.log('Setting 3-second timer for redirect...');
    const timer = setTimeout(() => {
      console.log('Timer fired, redirecting to /balcao');
      navigate("/balcao");
    }, 3000);

    return () => {
      console.log('Cleaning up timer');
      clearTimeout(timer);
    };
  }, []); // Empty dependencies to run only once

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