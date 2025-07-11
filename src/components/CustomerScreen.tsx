import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Mock customer data
const mockCustomers: Record<string, { name: string; points: number }> = {
  "22553346824": { name: "Ester Rocha", points: 80 },
  "37097181800": { name: "Fagner Barreto", points: 50 },
  "35649814899": { name: "Rodolpho Florentino", points: 1 },
};

// Mock redeemable products - sorted by points (highest last)
const redeemableProducts = [
  { id: 1003, name: "Água Mineral", points: 5, image: "/api/placeholder/80/80" },
  { id: 1004, name: "Café", points: 8, image: "/api/placeholder/80/80" },
  { id: 1001, name: "Coca Cola", points: 10, image: "/api/placeholder/80/80" },
  { id: 1002, name: "Chocolate", points: 15, image: "/api/placeholder/80/80" },
  { id: 1006, name: "Sobremesa", points: 25, image: "/api/placeholder/80/80" },
  { id: 1005, name: "Combo Premium", points: 100, image: "/api/placeholder/80/80" },
];

const CustomerScreen = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [cpf, setCpf] = useState("");
  const [customer, setCustomer] = useState<{ name: string; points: number } | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2");
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    setCpf(formatted);
    
    // Auto-fill customer data when CPF is complete
    if (formatted.length === 14) {
      const cpfNumbers = formatted.replace(/\D/g, "");
      if (mockCustomers[cpfNumbers]) {
        setCustomer(mockCustomers[cpfNumbers]);
      } else {
        // Default customer for any other valid CPF
        setCustomer({ name: "Igor Monteiro", points: 90 });
      }
    } else {
      setCustomer(null);
    }
  };

  const handleQuantityChange = (productId: number, delta: number) => {
    setSelectedItems(prev => {
      const newQuantity = (prev[productId] || 0) + delta;
      if (newQuantity <= 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  const getTotalPointsUsed = () => {
    return Object.entries(selectedItems).reduce((total, [productIdStr, quantity]) => {
      const productId = parseInt(productIdStr);
      const product = redeemableProducts.find(p => p.id === productId);
      return total + (product ? product.points * quantity : 0);
    }, 0);
  };

  const canRedeem = (product: any) => {
    if (!customer) return false;
    const currentUsed = getTotalPointsUsed();
    const currentProductUsed = (selectedItems[product.id] || 0) * product.points;
    const availablePoints = customer.points - (currentUsed - currentProductUsed);
    return availablePoints >= product.points;
  };

  const handleRedeem = () => {
    if (!customer) return;
    
    // Add selected items to cart with symbolic price of R$ 0.01
    Object.entries(selectedItems).forEach(([productIdStr, quantity]) => {
      const productId = parseInt(productIdStr);
      const product = redeemableProducts.find(p => p.id === productId);
      if (product) {
        for (let i = 0; i < quantity; i++) {
          // Use unique IDs for redeemed products (negative numbers to avoid conflicts)
          const uniqueId = -(Date.now() + Math.random() * 1000);
          addToCart(uniqueId, {
            name: `${product.name} (Resgate)`,
            price: 0.01,
            image: product.image
          });
        }
      }
    });
    
    navigate("/sacola");
  };

  const hasSelectedItems = Object.keys(selectedItems).length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/produtos")}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">DETALHES CLIENTE</h1>
          
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* CPF Field */}
        <div className="space-y-2">
          <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
            CPF
          </Label>
          <Input
            id="cpf"
            value={cpf}
            onChange={(e) => handleCPFChange(e.target.value)}
            placeholder="000.000.000-00"
            className="text-lg"
            inputMode="numeric"
          />
        </div>

        {/* Customer Info */}
        {customer && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">{customer.name}</h3>
                <p className="text-accent font-medium">
                  {customer.points} pontos disponíveis
                </p>
                <p className="text-sm text-gray-600">
                  Pontos usados: {getTotalPointsUsed()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Redeemable Products */}
        {customer && (
          <div className="space-y-3 pb-20">
            <h2 className="text-lg font-semibold text-gray-900">Produtos para Resgate</h2>
            
            {redeemableProducts.map((product) => {
              const quantity = selectedItems[product.id] || 0;
              const isAvailable = canRedeem(product);
              
              return (
                <Card 
                  key={product.id} 
                  className={`bg-white shadow-sm ${!isAvailable ? 'opacity-50' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-accent font-semibold">
                          {product.points} pontos
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {quantity === 0 ? (
                          <Button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            disabled={!isAvailable}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 disabled:opacity-50"
                          >
                            ADICIONAR
                          </Button>
                        ) : (
                          <div className="flex items-center space-x-3 border border-primary rounded-md p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(product.id, -1)}
                              className="h-8 w-8 text-primary hover:bg-primary/5"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium text-primary min-w-[20px] text-center">
                              {quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(product.id, 1)}
                              disabled={!isAvailable}
                              className="h-8 w-8 text-primary hover:bg-primary/5 disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      {customer && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/5"
              onClick={() => navigate("/produtos")}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleRedeem}
              disabled={!hasSelectedItems}
            >
              Resgatar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerScreen;