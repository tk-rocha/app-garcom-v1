import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, Trash2, Printer, Settings, LogOut, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const FuncoesScreen = () => {
  const navigate = useNavigate();
  const [dailyTotal, setDailyTotal] = useState(0);
  
  // Get current date
  const currentDate = new Date().toLocaleDateString("pt-BR");

  // Load daily sales total - refresh on every render to catch updates
  useEffect(() => {
    const loadDailyTotal = () => {
      const today = new Date().toDateString();
      const dailySales = JSON.parse(localStorage.getItem('dailySales') || '{}');
      
      // Reset daily total if it's a new day (prototype behavior)
      const lastResetDate = localStorage.getItem('lastDailyReset');
      if (lastResetDate !== today) {
        console.log('🌅 Novo dia detectado - resetando dados diários');
        
        // Clear daily sales for new day
        localStorage.setItem('dailySales', JSON.stringify({ [today]: 0 }));
        localStorage.setItem('lastDailyReset', today);
        
        // Clear all mesa data for new day (mesas 1-9)
        for (let mesaId = 1; mesaId <= 9; mesaId++) {
          console.log(`🌅 Resetando mesa ${mesaId} para novo dia`);
          
          // Remove mesa cart data
          const cartData = localStorage.getItem('cartData');
          if (cartData) {
            try {
              const parsed = JSON.parse(cartData);
              if (parsed.carts) {
                delete parsed.carts[`mesa-${mesaId}`];
              }
              if (parsed.discounts) {
                delete parsed.discounts[`mesa-${mesaId}`];
              }
              if (parsed.taxes) {
                delete parsed.taxes[`mesa-${mesaId}`];
              }
              if (parsed.serviceFees) {
                delete parsed.serviceFees[`mesa-${mesaId}`];
              }
              localStorage.setItem('cartData', JSON.stringify(parsed));
            } catch (e) {
              console.error('Erro ao limpar dados do carrinho:', e);
            }
          }
          
          // Remove mesa specific data
          localStorage.removeItem(`mesa-${mesaId}-pessoas`);
          localStorage.removeItem(`mesa-${mesaId}-reviewed`);
        }
        
        console.log('🌅 Reset diário completo - todas as mesas foram limpas');
        setDailyTotal(0);
        
        // Trigger storage event to update all screens
        window.dispatchEvent(new Event('storage'));
      } else {
        setDailyTotal(dailySales[today] || 0);
      }
    };
    
    loadDailyTotal();
    
    // Add event listener for storage changes
    const handleStorageChange = () => loadDailyTotal();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const functionItems = [
    { 
      id: "sangria", 
      label: "Sangria", 
      icon: Minus, 
      action: () => navigate("/sangria")
    },
    { 
      id: "suprimento", 
      label: "Suprimento", 
      icon: Plus, 
      action: () => navigate("/suprimento")
    },
    { 
      id: "cancelar-cupom", 
      label: "Cancelar Cupom", 
      icon: Trash2, 
      action: () => navigate("/cancelar-cupom")
    },
    { 
      id: "reimpressao", 
      label: "Reimpressão", 
      icon: Printer, 
      action: () => navigate("/reimpressao")
    },
    { 
      id: "adm-tef", 
      label: "Adm TEF", 
      icon: DollarSign, 
      action: () => console.log("Adm TEF - Em desenvolvimento")
    },
    { 
      id: "configuracoes", 
      label: "Configurações", 
      icon: Settings, 
      action: () => navigate("/autorizacao")
    },
    { 
      id: "sair-pdv", 
      label: "Sair PDV", 
      icon: LogOut, 
      action: () => navigate("/login")
    },
    { 
      id: "fechar-pdv", 
      label: "Fechar PDV", 
      icon: DollarSign, 
      action: () => navigate("/fundo-caixa")
    },
  ];

  return (
    <div className="min-h-screen bg-[#E1E1E5] flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white flex items-center flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium text-[#180F33] flex-1 text-center mr-10">
          Funções
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Sales Summary Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-[#180F33]">Total Vendas Hoje</h2>
                <p className="text-sm text-gray-600">{currentDate}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#180F33]">
                  {formatCurrency(dailyTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Function Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-4">
          {functionItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                onClick={item.action}
                className="bg-[#180F33] hover:bg-[#180F33]/90 text-white h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 rounded-lg transition-colors font-medium"
              >
                <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm sm:text-base text-center leading-tight">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FuncoesScreen;
