import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const TaxScreen = () => {
  const navigate = useNavigate();
  const { getSubtotal, applyTax, getTaxAmount } = useCart();
  const [taxType, setTaxType] = useState<"percentage" | "value">("percentage");
  const [taxValue, setTaxValue] = useState("");

  const subtotal = getSubtotal();
  const currentTax = getTaxAmount();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const handleTaxValueChange = (value: string) => {
    if (taxType === "percentage") {
      // Only allow numbers and limit to reasonable percentage
      const sanitized = value.replace(/[^0-9]/g, "");
      const numValue = parseInt(sanitized);
      if (numValue <= 100 || sanitized === "") {
        setTaxValue(sanitized);
      }
    } else {
      // For currency values, allow numbers and decimal
      const sanitized = value.replace(/[^0-9.,]/g, "").replace(",", ".");
      setTaxValue(sanitized);
    }
  };

  const calculateTaxAmount = () => {
    if (!taxValue) return 0;

    if (taxType === "percentage") {
      const percentage = parseInt(taxValue);
      return (subtotal * percentage) / 100;
    } else {
      return parseFloat(taxValue) || 0;
    }
  };

  const handleApplyTax = () => {
    const taxAmount = calculateTaxAmount();
    applyTax(taxAmount);
    navigate(-1);
  };

  const handleRemoveTax = () => {
    applyTax(0);
    navigate(-1);
  };

  const taxAmount = calculateTaxAmount();
  const newTotal = subtotal + taxAmount;

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
          
          <h1 className="text-lg font-semibold text-primary">TAXAS</h1>
          
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
                <span className="text-gray-600">Taxa atual:</span>
                <span className="text-orange-600">+ {formatCurrency(currentTax)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(subtotal + currentTax)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Type Selection */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Tipo de Taxa</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={taxType === "percentage" ? "default" : "outline"}
                className={`${
                  taxType === "percentage"
                    ? "bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary/5"
                }`}
                onClick={() => {
                  setTaxType("percentage");
                  setTaxValue("");
                }}
              >
                Percentual (%)
              </Button>
              <Button
                variant={taxType === "value" ? "default" : "outline"}
                className={`${
                  taxType === "value"
                    ? "bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary/5"
                }`}
                onClick={() => {
                  setTaxType("value");
                  setTaxValue("");
                }}
              >
                Valor (R$)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tax Value Input */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tax" className="text-sm font-medium text-gray-700">
                {taxType === "percentage" ? "Percentual da taxa" : "Valor da taxa"}
              </Label>
              <div className="relative">
                <Input
                  id="tax"
                  value={taxValue}
                  onChange={(e) => handleTaxValueChange(e.target.value)}
                  placeholder={taxType === "percentage" ? "0" : "0,00"}
                  className="text-lg text-center pr-12"
                  inputMode="decimal"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {taxType === "percentage" ? "%" : "R$"}
                </span>
              </div>
            </div>
            
            {taxValue && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa aplicada:</span>
                    <span className="text-orange-600 font-medium">
                      + {formatCurrency(taxAmount)}
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
            onClick={handleApplyTax}
            disabled={!taxValue || taxAmount <= 0}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Aplicar Taxa
          </Button>
          
          {currentTax > 0 && (
            <Button
              variant="outline"
              onClick={handleRemoveTax}
              className="w-full border-red-500 text-red-500 hover:bg-red-50"
            >
              Remover Taxa
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

export default TaxScreen;