import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const SaleCompletedScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  const { clearCart, clearMesaCompletely } = useCart();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const total = searchParams.get('total') || '0';
  const cartId = searchParams.get('cartId') || 'balcao';
  const mesaId = searchParams.get('mesa');
  const comandaId = searchParams.get('comanda');

  useEffect(() => {
    // Update daily sales total
    const today = new Date().toDateString();
    const dailySales = JSON.parse(localStorage.getItem('dailySales') || '{}');
    const newTotal = (dailySales[today] || 0) + parseFloat(total);
    
    dailySales[today] = newTotal;
    localStorage.setItem('dailySales', JSON.stringify(dailySales));

    // Clear cart/mesa data immediately
    if (mesaId) {
      clearMesaCompletely(cartId);
    } else {
      clearCart(cartId);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    // Start countdown timer
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          // Clear timer and navigate when countdown reaches 1
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          navigate('/balcao');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Run only once on mount

  const formatBRL = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Success Icon with Animation */}
      <div className="mb-8 animate-scale-in">
        <div className="relative">
          <CheckCircle 
            className="w-24 h-24 text-green-500 animate-fade-in" 
            strokeWidth={2}
          />
          {/* Pulse effect */}
          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-green-500/30 animate-[ping_1s_ease-in-out_1]"></div>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">
          Venda finalizada com sucesso
        </h1>
        
        {/* Total Amount */}
        <div className="text-2xl font-semibold text-primary">
          {formatBRL(total)}
        </div>
        
        {/* Subtitle */}
        <p className="text-lg text-muted-foreground">
          Aguarde o fim do cupom fiscal
        </p>
        
        {/* Countdown */}
        <div className="text-sm text-muted-foreground mt-8">
          Redirecionando em {countdown} segundo{countdown !== 1 ? 's' : ''}...
        </div>
      </div>

      {/* Loading indicator */}
      <div className="mt-8 flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default SaleCompletedScreen;