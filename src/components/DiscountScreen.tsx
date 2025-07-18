import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const DiscountScreen = () => {
  const navigate = useNavigate();
  const { getSubtotal, applyDiscount, getDiscountAmount, getDiscountType, getDiscountValue } = useCart();
  const [discountType, setDiscountType] = useState<"percentage" | "value">("percentage");
  const [discountValue, setDiscountValue] = useState("");

  const subtotal = getSubtotal();
  const currentDiscount = getDiscountAmount();

  // Carrega os valores salvos quando a tela é aberta
  useEffect(() => {
    const savedType = getDiscountType();
    const savedValue = getDiscountValue();
    setDiscountType(savedType);
    setDiscountValue(savedValue);
  }, [getDiscountType, getDiscountValue]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const formatInputValue = (value: string, isMonetary: boolean) => {
    if (isMonetary) {
      // Remove tudo que não for número ou vírgula
      let cleaned = value.replace(/[^\d,]/g, '');
      // Garante apenas uma vírgula decimal
      const parts = cleaned.split(',');
      if (parts.length > 2) {
        cleaned = parts[0] + ',' + parts.slice(1).join('');
      }
      // Limita a 2 casas decimais
      if (parts[1] && parts[1].length > 2) {
        cleaned = parts[0] + ',' + parts[1].substring(0, 2);
      }
      return cleaned;
    } else {
      // Para percentual, apenas números
      return value.replace(/[^\d]/g, '');
    }
  };

  const handleDiscountValueChange = (value: string) => {
    const isMonetary = discountType === "value";
    const formatted = formatInputValue(value, isMonetary);
    
    if (isMonetary) {
      // Converte vírgula para ponto para validação numérica
      const numValue = parseFloat(formatted.replace(',', '.'));
      if (isNaN(numValue) || numValue <= subtotal || formatted === "" || formatted.endsWith(",")) {
        setDiscountValue(formatted);
      }
    } else {
      const numValue = parseInt(formatted);
      if (numValue <= 100 || formatted === "") {
        setDiscountValue(formatted);
      }
    }
  };

  const handlePresetValue = (value: string) => {
    setDiscountValue(value);
  };

  const calculateDiscountAmount = () => {
    if (!discountValue) return 0;

    if (discountType === "percentage") {
      const percentage = parseInt(discountValue);
      return (subtotal * percentage) / 100;
    } else {
      // Converte vírgula para ponto antes de fazer o parseFloat
      return parseFloat(discountValue.replace(',', '.')) || 0;
    }
  };

  const handleConfirm = () => {
    const discountAmount = calculateDiscountAmount();
    applyDiscount(discountAmount, discountType, discountValue);
    navigate(-1);
  };

  const handleRemoveDiscount = () => {
    applyDiscount(0, discountType, "0");
    setDiscountValue("");
    navigate(-1);
  };

  const discountAmount = calculateDiscountAmount();
  const newTotal = subtotal - discountAmount;

  const percentagePresets = ["5", "10", "15", "20"];
  const valuePresets = ["2,00", "5,00"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">DESCONTO</h1>
          
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Toggle para tipo de desconto */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
              <Button
                variant={discountType === "percentage" ? "default" : "ghost"}
                className={`${
                  discountType === "percentage"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setDiscountType("percentage");
                  setDiscountValue("");
                }}
              >
                %
              </Button>
              <Button
                variant={discountType === "value" ? "default" : "ghost"}
                className={`${
                  discountType === "value"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setDiscountType("value");
                  setDiscountValue("");
                }}
              >
                R$
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botões de valores predefinidos */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Valores Rápidos</h3>
            
            <div className="grid grid-cols-4 gap-3">
              {(discountType === "percentage" ? percentagePresets : valuePresets).map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  className="h-12 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handlePresetValue(preset)}
                >
                  {discountType === "percentage" ? `${preset}%` : `R$ ${preset}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campo de entrada customizado */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-sm font-medium text-gray-700">
                Desconto
              </Label>
              <div className="relative">
                <Input
                  id="discount"
                  value={discountValue}
                  onChange={(e) => handleDiscountValueChange(e.target.value)}
                  placeholder={discountType === "percentage" ? "00,00" : "0,00"}
                  className="text-lg text-center pr-12"
                  inputMode="decimal"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  {discountType === "percentage" ? "%" : "R$"}
                </span>
              </div>
            </div>
            
            {discountValue && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Desconto aplicado:</span>
                    <span className="text-green-600 font-medium">
                      - {formatCurrency(discountAmount)}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Novo total:</span>
                    <span>{formatCurrency(Math.max(0, newTotal))}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={!discountValue || discountAmount <= 0}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirmar
          </Button>
          
          {currentDiscount > 0 && (
            <Button
              variant="outline"
              onClick={handleRemoveDiscount}
              className="w-full border-red-500 text-red-500 hover:bg-red-50"
            >
              Remover Desconto
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full text-gray-600 hover:bg-gray-100"
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountScreen;