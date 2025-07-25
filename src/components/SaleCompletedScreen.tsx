import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface SaleData {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  serviceFeeAmount?: number;
  total: number;
  payments: Array<{
    method: string;
    amount: number;
  }>;
  customerCpf?: string;
  mesa?: string;
  comanda?: string;
}

const SaleCompletedScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearMesaCompletely } = useCart();
  const hasProcessed = useRef(false);
  const isMounted = useRef(true);
  
  const saleData: SaleData = location.state?.saleData || {};

  // Memoize the redirect function to avoid re-creating it
  const redirectToBalcao = useCallback(() => {
    if (isMounted.current) {
      console.log('🔄 Redirecting to balcao at:', new Date().toISOString());
      navigate("/balcao");
    }
  }, [navigate]);

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true;
    
    // Prevent multiple executions
    if (hasProcessed.current) {
      console.log('⚠️ Sale already processed, skipping...');
      return;
    }

    console.log('🚀 Processing sale completion - start:', new Date().toISOString());
    hasProcessed.current = true;

    // Clear cart immediately
    const cartId = saleData.comanda ? `comanda-${saleData.comanda}` : 
                  saleData.mesa ? `mesa-${saleData.mesa}` : 'balcao';
    console.log('🧹 Clearing cart for:', cartId);
    
    try {
      clearMesaCompletely(cartId);
      console.log('✅ Cart cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
    }

    // Create primary redirect timer immediately
    console.log('⏰ Setting primary redirect timer at:', new Date().toISOString());
    const primaryTimer = setTimeout(() => {
      console.log('🎯 Primary timer fired at:', new Date().toISOString());
      redirectToBalcao();
    }, 3000);

    // Create failsafe timer (backup)
    console.log('🛡️ Setting failsafe timer');
    const failsafeTimer = setTimeout(() => {
      console.log('🚨 Failsafe timer fired at:', new Date().toISOString());
      redirectToBalcao();
    }, 3500);

    // Generate receipt asynchronously (completely non-blocking)
    const generateReceiptAsync = () => {
      setTimeout(async () => {
        try {
          console.log('📄 Starting receipt generation...');
          
          const now = new Date();
          const receipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
          
          // Find next receipt number efficiently
          let receiptNumber = 700;
          if (receipts.length > 0) {
            const lastReceipt = receipts[receipts.length - 1];
            receiptNumber = (parseInt(lastReceipt.number) || 699) + 1;
          }
          
          const receipt = {
            id: `${now.getTime()}-${Math.random().toString(36).substring(2)}`,
            number: receiptNumber,
            timestamp: now.toISOString(),
            date: now.toLocaleDateString('pt-BR'),
            time: now.toLocaleTimeString('pt-BR'),
            grossAmount: saleData.subtotal + saleData.taxAmount + (saleData.serviceFeeAmount || 0),
            netAmount: saleData.total,
            discount: saleData.discountAmount,
            tax: saleData.taxAmount,
            serviceFee: saleData.serviceFeeAmount || 0,
            payments: saleData.payments,
            customerCpf: saleData.customerCpf,
          };

          receipts.push(receipt);
          localStorage.setItem('fiscalReceipts', JSON.stringify(receipts));

          // Update daily sales
          const today = new Date().toDateString();
          const dailySales = JSON.parse(localStorage.getItem('dailySales') || '{}');
          dailySales[today] = (dailySales[today] || 0) + saleData.total;
          localStorage.setItem('dailySales', JSON.stringify(dailySales));

          console.log('✅ Receipt generated successfully:', receiptNumber);
        } catch (error) {
          console.error('❌ Error generating receipt:', error);
        }
      }, 100); // Small delay to ensure it's completely async
    };

    // Start receipt generation (non-blocking)
    generateReceiptAsync();

    return () => {
      console.log('🧹 Cleanup - clearing timers');
      isMounted.current = false;
      clearTimeout(primaryTimer);
      clearTimeout(failsafeTimer);
    };
  }, []); // Remove all dependencies to prevent re-execution

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