import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface TaxOption {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}

const TaxScreen = () => {
  const navigate = useNavigate();
  const { tax, setTax } = useCart();
  
  const [selectedTax, setSelectedTax] = useState<TaxOption | null>(null);

  // Available tax options
  const taxOptions: TaxOption[] = [
    { id: '1', name: 'Gorjeta', type: 'percentage', value: 5 },
    { id: '2', name: 'Gorjeta', type: 'percentage', value: 10 },
    { id: '3', name: 'Couvert', type: 'fixed', value: 5.00 },
    { id: '4', name: 'Taxa da Rolha', type: 'fixed', value: 30.00 },
  ];

  // Load existing tax when component mounts
  useEffect(() => {
    if (tax) {
      const existingTax = taxOptions.find(option => 
        option.name === tax.name && 
        option.type === tax.type && 
        option.value === tax.value
      );
      if (existingTax) {
        setSelectedTax(existingTax);
      }
    }
  }, [tax]);

  const handleConfirm = () => {
    if (selectedTax) {
      setTax({
        id: selectedTax.id,
        name: selectedTax.name,
        type: selectedTax.type,
        value: selectedTax.value
      });
    }
    navigate("/sacola");
  };

  const handleRemoveTax = () => {
    setSelectedTax(null);
    setTax(null);
    navigate("/sacola");
  };

  const formatTaxValue = (tax: TaxOption) => {
    if (tax.type === 'percentage') {
      return `${tax.value}%`;
    } else {
      return `R$ ${tax.value.toFixed(2).replace('.', ',')}`;
    }
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
          
          <h1 className="text-lg font-semibold text-primary">TAXAS</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Tax Options */}
        <div className="space-y-3">
          {taxOptions.map((taxOption) => (
            <div
              key={taxOption.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedTax?.id === taxOption.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setSelectedTax(taxOption)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-primary">{taxOption.name}</h3>
                  <p className="text-sm text-gray-600">
                    {taxOption.type === 'percentage' 
                      ? 'Aplicado sobre o subtotal'
                      : 'Valor fixo'
                    }
                  </p>
                </div>
                <div className="text-lg font-semibold text-primary">
                  {formatTaxValue(taxOption)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Remove Tax Button */}
        {(selectedTax || tax) && (
          <div className="pt-4">
            <Button
              variant="ghost"
              onClick={handleRemoveTax}
              className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4 mr-2" />
              Remover taxa
            </Button>
          </div>
        )}
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

export default TaxScreen;