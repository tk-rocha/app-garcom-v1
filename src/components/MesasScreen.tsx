import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Home, Table, QrCode, Puzzle, Search, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Mesa {
  id: number;
}

const MesasScreen = () => {
  const navigate = useNavigate();
  const [activeTab] = useState("mesa");
  const { getCartItems, hasItensEnviados } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize 9 tables
  const [mesas] = useState<Mesa[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
    }))
  );

  // Filtrar mesas baseado no termo de busca
  const filteredMesas = mesas.filter(mesa => {
    const mesaNumber = mesa.id.toString().padStart(2, '0');
    return mesaNumber.includes(searchTerm);
  });

  // Limpar busca com Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchTerm("");
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto focus no campo de busca
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const getMesaStatus = (mesaId: number) => {
    const cartId = `mesa-${mesaId}`;
    const cartItems = getCartItems(cartId);
    const hasItems = cartItems.length > 0;
    const hasEnviados = hasItensEnviados(cartId);
    
    // Check if table was "conferenced" (reviewed) - this would be stored in localStorage or state
    const isReviewed = localStorage.getItem(`mesa-${mesaId}-reviewed`) === 'true';
    
    if (isReviewed) {
      return 'reviewed'; // Status 3: Table Reviewed (Conferenced)
    } else if (hasItems) {
      return 'in-service'; // Status 2: Items Launched (In Service) 
    } else {
      return 'free'; // Status 1: Free Table
    }
  };

  const getStatusColor = (mesaId: number) => {
    const status = getMesaStatus(mesaId);
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
        <h1 className="text-xl font-bold text-primary">MESAS</h1>
        <div className="w-10" />
      </div>

      {/* Action Buttons and Search */}
      <div className="p-4 space-y-4 bg-background border-b border-border">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar mesa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
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
          {filteredMesas.map((mesa) => (
            <div
              key={mesa.id}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-all ${getStatusColor(mesa.id)}`}
              onClick={() => navigate(`/mesa/${mesa.id}`)}
            >
              <span className="text-lg font-semibold">
                Mesa {mesa.id.toString().padStart(2, '0')}
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
                  } else if (item.id === "comanda") {
                    navigate("/comandas");
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

export default MesasScreen;