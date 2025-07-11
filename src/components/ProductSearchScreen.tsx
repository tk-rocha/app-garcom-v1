import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Mock data for all products
const allProducts = [
  { id: 1, name: "Coca Cola", price: 8.00, image: "/api/placeholder/80/80", category: "bebidas" },
  { id: 2, name: "Sprite", price: 7.50, image: "/api/placeholder/80/80", category: "bebidas" },
  { id: 3, name: "Fanta Laranja", price: 7.50, image: "/api/placeholder/80/80", category: "bebidas" },
  { id: 4, name: "Água Mineral", price: 4.00, image: "/api/placeholder/80/80", category: "bebidas" },
  { id: 5, name: "Chocolate", price: 12.00, image: "/api/placeholder/80/80", category: "doces" },
  { id: 6, name: "Bala de Goma", price: 3.50, image: "/api/placeholder/80/80", category: "doces" },
  { id: 7, name: "Combo Família", price: 45.00, image: "/api/placeholder/80/80", category: "combos" },
  { id: 8, name: "Combo Kids", price: 25.00, image: "/api/placeholder/80/80", category: "combos" },
];

const ProductSearchScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const { getProductQuantity, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery]);

  const handleProductClick = (product: any) => {
    navigate(`/produto/${product.id}`, { 
      state: { 
        product, 
        category: product.category
      } 
    });
  };

  const handleAddToCart = (product: any) => {
    addToCart(product.id, {
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

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
          
          <h1 className="text-lg font-semibold text-primary">BUSCAR PRODUTO</h1>
          
          <div className="w-10" />
        </div>
      </div>

      {/* Search Field */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar produto..."
          className="text-lg"
          autoFocus
        />
      </div>

      {/* Products List */}
      <div className="p-4 space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum produto encontrado com esse nome.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const quantity = getProductQuantity(product.id);
            
            return (
              <Card key={product.id} className="bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                      />
                    </div>
                    
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-lg font-semibold text-primary">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {quantity === 0 ? (
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                        >
                          ADICIONAR
                        </Button>
                      ) : (
                        <div className="flex items-center space-x-3 border border-primary rounded-md p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(product.id)}
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
                            onClick={() => handleAddToCart(product)}
                            className="h-8 w-8 text-primary hover:bg-primary/5"
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
          })
        )}
      </div>
    </div>
  );
};

export default ProductSearchScreen;