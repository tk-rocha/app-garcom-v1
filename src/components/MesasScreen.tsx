import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Table, QrCode, Puzzle } from "lucide-react";

interface Mesa {
  id: number;
  status: "vazia" | "em-atendimento" | "em-fechamento";
}

const MesasScreen = () => {
  const navigate = useNavigate();
  const [activeTab] = useState("mesa");
  
  // Initialize 9 tables
  const [mesas] = useState<Mesa[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      status: "vazia"
    }))
  );

  const getStatusColor = (status: Mesa["status"]) => {
    switch (status) {
      case "vazia":
        return "bg-white text-[#180F33] border-gray-200";
      case "em-atendimento":
        return "bg-yellow-300 text-[#180F33] border-yellow-400";
      case "em-fechamento":
        return "bg-pink-200 text-[#180F33] border-pink-300";
      default:
        return "bg-white text-[#180F33] border-gray-200";
    }
  };

  const navItems = [
    { id: "inicio", label: "Início", icon: Home },
    { id: "mesa", label: "Mesa", icon: Table },
    { id: "comanda", label: "Comanda", icon: QrCode },
    { id: "funcoes", label: "Funções", icon: Puzzle },
  ];

  return (
    <div className="min-h-screen bg-[#E1E1E5] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-[#180F33] hover:bg-gray-100"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-[#180F33]">MESAS</h1>
        <div className="w-10" />
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-4">
          <Button className="flex-1 bg-[#180F33] text-white hover:bg-[#180F33]/90">
            Fechamento Parcial
          </Button>
          <Button className="flex-1 bg-[#180F33] text-white hover:bg-[#180F33]/90">
            Transferência
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {mesas.map((mesa) => (
            <div
              key={mesa.id}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-all ${getStatusColor(mesa.status)}`}
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
      <div className="bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "inicio") {
                    navigate("/");
                  } else if (item.id === "comanda") {
                    navigate("/comandas");
                  } else if (item.id === "funcoes") {
                    navigate("/funcoes");
                  }
                }}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-[#180F33] text-[#FFC72C]" 
                    : "text-[#180F33] hover:bg-gray-100"
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