import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const DiscountScreen = () => {
  const navigate = useNavigate();
  const { discount, setDiscount } = useCart();
  
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');

  // Load existing discount when component mounts
  useEffect(() => {
    if (discount) {
      setDiscountType(discount.type);
      setDiscountValue(discount.value.toString());
    }
  }, [discount]);

  const percentageOptions = [5, 10, 15, 20];
  const fixedOptions = [2.00, 5.00];

  const handleQuickDiscount = (value: number) => {
    setDiscountValue(value.toString());
  };

  const handleConfirm = () => {
    const value = parseFloat(discountValue) || 0;
    
    if (value === 0) {
      setDiscount(null);
    } else {
      setDiscount({
        type: discountType,
        value: value
      });
    }
    
    navigate("/sacola");
  };

  const formatPercentageInput = (value: string) => {
    // Remove non-numeric characters except comma and dot
    const numericValue = value.replace(/[^0-9.,]/g, '');
    return numericValue;
  };

  const formatCurrencyInput = (value: string) => {
    // Remove non-numeric characters except comma and dot
    const numericValue = value.replace(/[^0-9.,]/g, '');
    return numericValue;
  };

  const formatCurrencyMask = (value: string) => {
    // Convert string to number and format as R$ X,XX
    const numericValue = parseFloat(value.replace(',', '.')) || 0;
    return numericValue.toFixed(2).replace('.', ',');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/sacola")}
            className="text-primary hover:bg-primary/5 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">DESCONTO</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={discountType === 'percentage' ? 'default' : 'ghost'}
            className={`flex-1 ${
              discountType === 'percentage'
                ? 'bg-primary text-primary-foreground'
                : 'text-primary hover:bg-primary/5'
            }`}
            onClick={() => {
              setDiscountType('percentage');
              setDiscountValue('');
            }}
          >
            %
          </Button>
          <Button
            variant={discountType === 'fixed' ? 'default' : 'ghost'}
            className={`flex-1 ${
              discountType === 'fixed'
                ? 'bg-primary text-primary-foreground'
                : 'text-primary hover:bg-primary/5'
            }`}
            onClick={() => {
              setDiscountType('fixed');
              setDiscountValue('');
            }}
          >
            R$
          </Button>
        </div>

        {/* Quick Options */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {discountType === 'percentage' ? (
              percentageOptions.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  className="h-12 rounded-full border-primary text-primary hover:bg-primary/5"
                  onClick={() => handleQuickDiscount(value)}
                >
                  {value}%
                </Button>
              ))
            ) : (
              fixedOptions.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  className="h-12 rounded-full border-primary text-primary hover:bg-primary/5"
                  onClick={() => handleQuickDiscount(value)}
                >
                  R$ {value.toFixed(2).replace('.', ',')}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <Label htmlFor="discount" className="text-primary font-medium">
            Desconto
          </Label>
          <div className="relative">
            <Input
              id="discount"
              type="text"
              value={discountType === 'fixed' ? formatCurrencyMask(discountValue) : discountValue}
              onChange={(e) => {
                const value = discountType === 'percentage' 
                  ? formatPercentageInput(e.target.value)
                  : formatCurrencyInput(e.target.value);
                setDiscountValue(value);
              }}
              placeholder={discountType === 'percentage' ? '00,00%' : '00,00'}
              className="text-center text-lg border-primary focus:ring-primary pl-12"
            />
            {discountType === 'percentage' && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
                %
              </span>
            )}
            {discountType === 'fixed' && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
                R$
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
            onClick={() => navigate("/sacola")}
          >
            VOLTAR
          </Button>
          
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleConfirm}
          >
            CONFIRMAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountScreen;