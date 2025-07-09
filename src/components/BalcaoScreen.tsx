import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Table, QrCode, Puzzle } from "lucide-react";

const BalcaoScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inicio");
  
  // Get current date
  const currentDate = new Date().toLocaleDateString("pt-BR");

  const navItems = [
    { id: "inicio", label: "Início", icon: Home },
    { id: "mesa", label: "Mesa", icon: Table },
    { id: "comanda", label: "Comanda", icon: QrCode },
    { id: "funcoes", label: "Funções", icon: Puzzle },
  ];

  return (
    <div className="min-h-screen bg-[#E1E1E5] flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white">
        <h1 className="text-xl font-medium text-gray-800">Olá, Ester</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Sales Summary Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">Total Vendas Hoje</h2>
                <p className="text-sm text-gray-600">{currentDate}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">R$ 0,00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
          <p className="text-gray-600 text-center">ainda não há nenhum item</p>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/90 hover:bg-primary/5 font-medium"
            onClick={() => navigate("/produtos")}
          >
            + ADICIONAR ITENS BALCÃO
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary text-accent" 
                    : "text-primary hover:bg-gray-100"
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

export default BalcaoScreen;