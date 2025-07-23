import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Table, QrCode, Puzzle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Comanda {
  id: number;
}

const ComandasScreen = () => {
  const navigate = useNavigate();
  const [activeTab] = useState("comanda");
  const { getCartItems, hasItensEnviados } = useCart();
  
  // Initialize 10 comandas (100-109)
  const [comandas] = useState<Comanda[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: 100 + i,
    }))
  );

  const getComandaStatus = (comandaId: number) => {
    const cartId = `comanda-${comandaId}`;
    const cartItems = getCartItems(cartId);
    const hasItems = cartItems.length > 0;
    const hasEnviados = hasItensEnviados(cartId);
    
    // Check if comanda was "conferenced" (reviewed)
    const isReviewed = localStorage.getItem(`comanda-${comandaId}-reviewed`) === 'true';
    
    if (isReviewed) {
      return 'reviewed'; // Status 3: Comanda Reviewed (Conferenced)
    } else if (hasItems) {
      return 'in-service'; // Status 2: Items Launched (In Service) 
    } else {
      return 'free'; // Status 1: Free Comanda
    }
  };

  const getStatusColor = (comandaId: number) => {
    const status = getComandaStatus(comandaId);
    switch (status) {
      case 'free':
        return "bg-table-free text-table-free-foreground border-primary/20";
      case 'in-service':
        return "bg-table-in-service text-table-in-service-foreground border-table-in-service";
      case 'reviewed':
        return "bg-table-reviewed text-table-reviewed-foreground border-table-reviewed";
      default:
        return "bg-table-free text-table-free-foreground border-primary/20";
    }
  };


  const navItems = [
    { id: "inicio", label: "Início", icon: Home },
    { id: "mesa", label: "Mesa", icon: Table },
    { id: "comanda", label: "Comanda", icon: QrCode },
    { id: "funcoes", label: "Funções", icon: Puzzle },
  ];

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/balcao")}
          className="text-primary hover:bg-muted"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-primary">COMANDAS</h1>
        <div className="w-10" />
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-background border-b border-border">
        <div className="flex gap-4">
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            Fechamento Parcial
          </Button>
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            Transferência
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {comandas.map((comanda) => (
            <div
              key={comanda.id}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-all ${getStatusColor(comanda.id)}`}
              onClick={() => {
                navigate(`/comanda/${comanda.id}`);
              }}
            >
              <span className="text-lg font-semibold">
                Comanda {comanda.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-background border-t border-border px-2 py-1">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "inicio") {
                    navigate("/balcao");
                  } else if (item.id === "mesa") {
                    navigate("/mesas");
                  } else if (item.id === "funcoes") {
                    navigate("/funcoes");
                  }
                }}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary text-accent" 
                    : "text-primary hover:bg-muted"
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComandasScreen;