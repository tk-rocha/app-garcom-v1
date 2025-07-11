import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const DiscountScreen = () => {
  const navigate = useNavigate();
  const { getSubtotal, applyDiscount, getDiscountAmount } = useCart();
  const [discountType, setDiscountType] = useState<"percentage" | "value">("percentage");
  const [discountValue, setDiscountValue] = useState("");

  const subtotal = getSubtotal();
  const currentDiscount = getDiscountAmount();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const handleDiscountValueChange = (value: string) => {
    if (discountType === "percentage") {
      // Only allow numbers and limit to 100%
      const sanitized = value.replace(/[^0-9]/g, "");
      const numValue = parseInt(sanitized);
      if (numValue <= 100 || sanitized === "") {
        setDiscountValue(sanitized);
      }
    } else {
      // For currency values, allow numbers and decimal
      const sanitized = value.replace(/[^0-9.,]/g, "").replace(",", ".");
      const numValue = parseFloat(sanitized);
      if (numValue <= subtotal || sanitized === "" || sanitized === ".") {
        setDiscountValue(sanitized);
      }
    }
  };

  const calculateDiscountAmount = () => {
    if (!discountValue) return 0;

    if (discountType === "percentage") {
      const percentage = parseInt(discountValue);
      return (subtotal * percentage) / 100;
    } else {
      return parseFloat(discountValue) || 0;
    }
  };

  const handleApplyDiscount = () => {
    const discountAmount = calculateDiscountAmount();
    applyDiscount(discountAmount);
    navigate(-1);
  };

  const handleRemoveDiscount = () => {
    applyDiscount(0);
    navigate(-1);
  };

  const discountAmount = calculateDiscountAmount();
  const newTotal = subtotal - discountAmount;

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
        {/* Current Values */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Valores Atuais</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Desconto atual:</span>
                <span className="text-green-600">- {formatCurrency(currentDiscount)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(subtotal - currentDiscount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discount Type Selection */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Tipo de Desconto</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={discountType === "percentage" ? "default" : "outline"}
                className={`${
                  discountType === "percentage"
                    ? "bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary/5"
                }`}
                onClick={() => {
                  setDiscountType("percentage");
                  setDiscountValue("");
                }}
              >
                Percentual (%)
              </Button>
              <Button
                variant={discountType === "value" ? "default" : "outline"}
                className={`${
                  discountType === "value"
                    ? "bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary/5"
                }`}
                onClick={() => {
                  setDiscountType("value");
                  setDiscountValue("");
                }}
              >
                Valor (R$)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Discount Value Input */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-sm font-medium text-gray-700">
                {discountType === "percentage" ? "Percentual de desconto" : "Valor do desconto"}
              </Label>
              <div className="relative">
                <Input
                  id="discount"
                  value={discountValue}
                  onChange={(e) => handleDiscountValueChange(e.target.value)}
                  placeholder={discountType === "percentage" ? "0" : "0,00"}
                  className="text-lg text-center pr-12"
                  inputMode="decimal"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {discountType === "percentage" ? "%" : "R$"}
                </span>
              </div>
            </div>
            
            {discountValue && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Desconto aplicado:</span>
                    <span className="text-green-600 font-medium">
                      - {formatCurrency(discountAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Novo total:</span>
                    <span>{formatCurrency(newTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleApplyDiscount}
            disabled={!discountValue || discountAmount <= 0}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Aplicar Desconto
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
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountScreen;