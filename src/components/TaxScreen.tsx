import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface TaxOption {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  displayValue: string;
}

const TaxScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { getSubtotal, setTax, tax } = useCart();
  const [selectedTaxId, setSelectedTaxId] = useState<string | null>(null);

  const mesaId = searchParams.get('mesa') || location.state?.mesa;
  const comandaId = searchParams.get('comanda') || location.state?.comanda;
  
  // Get the correct cart ID and subtotal
  const cartId = comandaId ? `comanda-${comandaId}` : mesaId ? `mesa-${mesaId}` : 'balcao';
  const subtotal = getSubtotal(cartId);

  // Lista de taxas disponíveis
  const taxOptions: TaxOption[] = [
    { id: 'gorjeta_5', name: 'Gorjeta', type: 'percentage', value: 5, displayValue: '5%' },
    { id: 'gorjeta_10', name: 'Gorjeta', type: 'percentage', value: 10, displayValue: '10%' },
    { id: 'gorjeta_15', name: 'Gorjeta', type: 'percentage', value: 15, displayValue: '15%' },
    { id: 'couvert_5', name: 'Couvert', type: 'fixed', value: 5, displayValue: 'R$ 5,00' },
    { id: 'couvert_10', name: 'Couvert', type: 'fixed', value: 10, displayValue: 'R$ 10,00' },
    { id: 'taxa_rolha', name: 'Taxa da Rolha', type: 'fixed', value: 30, displayValue: 'R$ 30,00' },
  ];

  // Carrega a taxa atual se houver
  useEffect(() => {
    if (tax) {
      const currentTax = taxOptions.find(option => 
        option.type === tax.type && 
        option.value === tax.value
      );
      if (currentTax) {
        setSelectedTaxId(currentTax.id);
      }
    }
  }, [tax]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const calculateTaxAmount = (taxOption: TaxOption) => {
    if (taxOption.type === 'percentage') {
      return (subtotal * taxOption.value) / 100;
    } else {
      return taxOption.value;
    }
  };

  const getSelectedTax = () => {
    return taxOptions.find(option => option.id === selectedTaxId);
  };

  const handleTaxSelect = (taxId: string) => {
    setSelectedTaxId(selectedTaxId === taxId ? null : taxId);
  };

  const handleConfirm = () => {
    const selectedTax = getSelectedTax();
    if (selectedTax) {
      setTax({
        id: selectedTax.id,
        name: selectedTax.name,
        type: selectedTax.type,
        value: selectedTax.value
      }, cartId);
    } else {
      setTax(null, cartId);
    }
    navigate(-1);
  };

  const handleRemoveTax = () => {
    setSelectedTaxId(null);
    setTax(null, cartId);
    navigate(-1);
  };

  const selectedTaxOption = getSelectedTax();
  const selectedTaxAmount = selectedTaxOption ? calculateTaxAmount(selectedTaxOption) : 0;
  const newTotal = subtotal + selectedTaxAmount;

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
          
          <h1 className="text-lg font-semibold text-primary">
            {comandaId ? `TAXAS - COMANDA ${comandaId}` : mesaId ? `TAXAS - MESA ${mesaId}` : "TAXAS"}
          </h1>
          
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Lista de Taxas Disponíveis */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Taxas Disponíveis</h3>
            
            <div className="space-y-2">
              {taxOptions.map((taxOption) => {
                const isSelected = selectedTaxId === taxOption.id;
                const taxAmount = calculateTaxAmount(taxOption);
                
                return (
                  <div
                    key={taxOption.id}
                    onClick={() => handleTaxSelect(taxOption.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? "border-primary bg-primary" 
                            : "border-gray-300"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-900">
                            {taxOption.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {taxOption.displayValue}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium text-primary">
                          + {formatCurrency(taxAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Resumo do Cálculo */}
        {selectedTaxOption && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Resumo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {selectedTaxOption.name} ({selectedTaxOption.displayValue}):
                  </span>
                  <span className="text-orange-600 font-medium">
                    + {formatCurrency(selectedTaxAmount)}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(newTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirmar
          </Button>
          
          {tax && (
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
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxScreen;