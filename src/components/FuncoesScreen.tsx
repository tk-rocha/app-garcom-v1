import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, Trash2, Printer, Settings, LogOut, DollarSign } from "lucide-react";

const FuncoesScreen = () => {
  const navigate = useNavigate();
  const [dailyTotal, setDailyTotal] = useState(0);
  
  // Get current date
  const currentDate = new Date().toLocaleDateString("pt-BR");

  // Load daily sales total
  useEffect(() => {
    const today = new Date().toDateString();
    const dailySales = JSON.parse(localStorage.getItem('dailySales') || '{}');
    setDailyTotal(dailySales[today] || 0);
  }, []);

  const functionItems = [
    { 
      id: "sangria", 
      label: "Sangria", 
      icon: Minus, 
      color: "bg-red-500 hover:bg-red-600",
      action: () => navigate("/sangria")
    },
    { 
      id: "suprimento", 
      label: "Suprimento", 
      icon: Plus, 
      color: "bg-green-500 hover:bg-green-600",
      action: () => navigate("/suprimento")
    },
    { 
      id: "cancelar-cupom", 
      label: "Cancelar Cupom", 
      icon: Trash2, 
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => navigate("/cancelar-cupom")
    },
    { 
      id: "reimpressao", 
      label: "Reimpressão", 
      icon: Printer, 
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => navigate("/reimpressao")
    },
    { 
      id: "adm-tef", 
      label: "Adm TEF", 
      icon: DollarSign, 
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => console.log("Adm TEF - Em desenvolvimento")
    },
    { 
      id: "configuracoes", 
      label: "Configurações", 
      icon: Settings, 
      color: "bg-gray-500 hover:bg-gray-600",
      action: () => console.log("Configurações - Em desenvolvimento")
    },
    { 
      id: "sair-pdv", 
      label: "Sair PDV", 
      icon: LogOut, 
      color: "bg-red-600 hover:bg-red-700",
      action: () => navigate("/")
    },
    { 
      id: "fechar-pdv", 
      label: "Fechar PDV", 
      icon: DollarSign, 
      color: "bg-yellow-500 hover:bg-yellow-600",
      action: () => console.log("Fechar PDV - Em desenvolvimento")
    },
  ];

  return (
    <div className="min-h-screen bg-[#E1E1E5] flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium text-[#180F33] flex-1 text-center mr-10">
          FUNÇÕES
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
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
                  R$ {dailyTotal.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Function Buttons Grid */}
        <div className="grid grid-cols-2 gap-4">
          {functionItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                onClick={item.action}
                className={`${item.color} text-white h-24 flex flex-col items-center justify-center space-y-2 rounded-lg transition-colors`}
              >
                <Icon className="h-8 w-8" />
                <span className="text-sm font-medium text-center">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FuncoesScreen;