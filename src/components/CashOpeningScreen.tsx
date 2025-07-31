import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const CashOpeningScreen = () => {
  const navigate = useNavigate();
  const [shift, setShift] = useState("");
  const [cashAmount, setCashAmount] = useState("");

  const handleBack = () => {
    navigate("/");
  };

  const handleConfirm = () => {
    if (!cashAmount) {
      return; // Could add toast notification here
    }
    
    // Save opening data
    const today = new Date().toDateString();
    const openingData = {
      date: today,
      shift: shift,
      cashAmount: cashAmount,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('lastOpeningDate', today);
    localStorage.setItem('currentOpening', JSON.stringify(openingData));
    localStorage.removeItem('pdvClosed'); // Ensure PDV is marked as open
    
    console.log("PDV aberto com sucesso:", openingData);
    navigate("/balcao");
  };

  const formatCurrency = (value: string) => {
    // Remove tudo que não for número
    let numericValue = value.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para ter os centavos
    const number = parseInt(numericValue) / 100;
    
    // Se não for um número válido, retorna vazio
    if (isNaN(number)) return '';
    
    // Formata com R$ e vírgula como separador decimal
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove formatação atual para evitar duplicação
    const rawValue = value.replace(/\D/g, '');
    setCashAmount(formatCurrency(rawValue));
  };

  return (
    <div className="min-h-screen bg-[#E1E1E5] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">ABERTURA DE CAIXA</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Shift Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <Label htmlFor="shift" className="text-sm font-medium text-gray-700 mb-2 block">
            Turno
          </Label>
          <Select value={shift} onValueChange={setShift}>
            <SelectTrigger className="w-full h-12 text-base border-input bg-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manha">Manhã</SelectItem>
              <SelectItem value="tarde">Tarde</SelectItem>
              <SelectItem value="noite">Noite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cash Amount */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <Label htmlFor="cashAmount" className="text-sm font-medium text-gray-700 mb-2 block">
            Fundo de Caixa *
          </Label>
          <Input
            id="cashAmount"
            type="text"
            placeholder="R$ 0,00"
            value={cashAmount}
            onChange={handleCashAmountChange}
            className="h-12 text-base border-input bg-white"
            inputMode="numeric"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="h-12 text-base font-semibold bg-white border-primary text-primary hover:bg-primary/5"
          >
            Voltar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!cashAmount || cashAmount === 'R$ 0,00'}
            className="h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CashOpeningScreen;