import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface ProductPhaseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  onAddToCart: (productData: any) => void;
}

// Configuration for different product phases
const PHASE_CONFIG = {
  // Products with 3 phases
  "combo-x-salada": {
    phases: ["meat", "soda", "additional"]
  },
  "combo-x-bacon": {
    phases: ["meat", "soda", "additional"]
  },
  "combo-x-tudo": {
    phases: ["meat", "soda", "additional"]
  },
  // Products with 3 phases (Combo Pastel with flavor selection)
  "combo-pastel": {
    phases: ["flavor", "drink", "additional"]
  },
  "misto-quente": {
    phases: ["drink", "additional"]
  }
};

const PHASE_OPTIONS = {
  flavor: [
    { id: "carne", name: "Carne", price: 0 },
    { id: "queijo", name: "Queijo", price: 0 },
    { id: "pizza", name: "Pizza", price: 0 },
    { id: "palmito", name: "Palmito", price: 0 }
  ],
  meat: [
    { id: "mal-passada", name: "Mal passada", price: 0 },
    { id: "ao-ponto", name: "Ao ponto", price: 0 },
    { id: "bem-passada", name: "Bem passada", price: 0 }
  ],
  soda: [
    { id: "coca-cola", name: "Coca-Cola", price: 0 },
    { id: "fanta", name: "Fanta", price: 0 },
    { id: "sprite", name: "Sprite", price: 0 },
    { id: "guarana", name: "Guaraná", price: 0 }
  ],
  drink: [
    { id: "cafe", name: "Café", price: 0 },
    { id: "suco", name: "Suco", price: 0 },
    { id: "refrigerante", name: "Refrigerante", price: 0 }
  ],
  additional: [
    { id: "molho-barbecue", name: "Molho Barbecue", price: 2.50 },
    { id: "maionese-temperada", name: "Maionese temperada", price: 2.00 },
    { id: "fritas-extras", name: "Fritas extras", price: 5.00 },
    { id: "batata-palha", name: "Batata palha", price: 3.00 },
    { id: "ovo-extra", name: "Ovo extra", price: 4.00 }
  ]
};

const PHASE_TITLES = {
  flavor: "Sabor do Pastel",
  meat: "Ponto da Carne",
  soda: "Refrigerante",
  drink: "Bebida",
  additional: "Adicionais"
};

export const ProductPhaseSelector = ({ isOpen, onClose, product, onAddToCart }: ProductPhaseSelectorProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [finalPrice, setFinalPrice] = useState(product.price);

  // Get product key for configuration
  const productKey = product.name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const config = PHASE_CONFIG[productKey as keyof typeof PHASE_CONFIG];
  
  useEffect(() => {
    if (isOpen) {
      setCurrentPhase(0);
      setSelections({});
      setFinalPrice(product.price);
    }
  }, [isOpen, product.price]);

  useEffect(() => {
    // Calculate final price based on selections
    let newPrice = product.price;
    Object.values(selections).forEach((selection: any) => {
      if (selection && selection.price) {
        newPrice += selection.price;
      }
    });
    setFinalPrice(newPrice);
  }, [selections, product.price]);

  if (!config) return null;

  const currentPhaseType = config.phases[currentPhase];
  const isLastPhase = currentPhase === config.phases.length - 1;
  const isOptionalPhase = currentPhaseType === "additional";
  const hasSelection = selections[currentPhaseType];
  const canAdvance = hasSelection || isOptionalPhase;

  const handleOptionSelect = (option: any) => {
    setSelections(prev => ({
      ...prev,
      [currentPhaseType]: option
    }));
  };

  const handleNext = () => {
    if (isLastPhase) {
      // Add to cart with all selections
      const productData = {
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: product.image,
        selections,
        customizations: Object.entries(selections)
          .filter(([_, selection]) => selection)
          .map(([phase, selection]: [string, any]) => ({
            phase: PHASE_TITLES[phase as keyof typeof PHASE_TITLES],
            option: selection.name,
            price: selection.price || 0
          }))
      };
      onAddToCart(productData);
      onClose();
    } else {
      setCurrentPhase(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPhase > 0) {
      setCurrentPhase(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setSelections(prev => ({
      ...prev,
      [currentPhaseType]: null
    }));
    handleNext();
  };

  const phaseOptions = PHASE_OPTIONS[currentPhaseType as keyof typeof PHASE_OPTIONS] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="flex space-x-2">
            {config.phases.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded ${
                  index <= currentPhase ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Phase title */}
          <div className="text-center">
            <h3 className="text-lg font-medium">
              {PHASE_TITLES[currentPhaseType as keyof typeof PHASE_TITLES]}
            </h3>
            {isOptionalPhase && (
              <Badge variant="secondary" className="mt-1">
                Opcional
              </Badge>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {phaseOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-colors ${
                  selections[currentPhaseType]?.id === option.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.name}</span>
                    {option.price > 0 && (
                      <span className="text-primary font-semibold">
                        + R$ {option.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current price */}
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <span className="text-lg font-semibold text-primary">
              Total: R$ {finalPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            {currentPhase > 0 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            )}
            
            {isOptionalPhase && !hasSelection && (
              <Button variant="outline" onClick={handleSkip} className="flex-1">
                Pular
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!canAdvance}
              className="flex-1"
            >
              {isLastPhase ? 'Adicionar' : 'Próximo'}
              {!isLastPhase && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};