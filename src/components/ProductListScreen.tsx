import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Search, Scan, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Mock data for products
const productCategories = [
  { id: "bebidas", name: "Bebidas" },
  { id: "doces", name: "Doces" },
  { id: "combos", name: "Combos" },
  { id: "porcoes", name: "Porções" },
  { id: "sobremesas", name: "Sobremesas" },
  { id: "refeicoes", name: "Refeições" },
];

const mockProducts = {
  bebidas: [
    { id: 1, name: "Coca Cola", price: 8.00, image: "/api/placeholder/80/80" },
    { id: 2, name: "Sprite", price: 7.50, image: "/api/placeholder/80/80" },
    { id: 3, name: "Fanta Laranja", price: 7.50, image: "/api/placeholder/80/80" },
    { id: 4, name: "Água Mineral", price: 4.00, image: "/api/placeholder/80/80" },
  ],
  doces: [
    { id: 5, name: "Chocolate", price: 12.00, image: "/api/placeholder/80/80" },
    { id: 6, name: "Bala de Goma", price: 3.50, image: "/api/placeholder/80/80" },
  ],
  combos: [
    { id: 7, name: "Combo Família", price: 45.00, image: "/api/placeholder/80/80" },
    { id: 8, name: "Combo Kids", price: 25.00, image: "/api/placeholder/80/80" },
  ],
};

const ProductListScreen = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("bebidas");
  const { getTotalItems, getProductQuantity, addToCart, removeFromCart } = useCart();

  const handleProductClick = (product: any) => {
    navigate(`/produto/${product.id}`, { 
      state: { 
        product, 
        category: activeCategory
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

  const currentProducts = mockProducts[activeCategory as keyof typeof mockProducts] || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/balcao")}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">Balcão</h1>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary hover:bg-primary/5"
              onClick={() => navigate("/cliente")}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
              <Scan className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary hover:bg-primary/5"
                onClick={() => {
                  if (getTotalItems() > 0) {
                    navigate("/sacola");
                  }
                }}
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
              {getTotalItems() > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-accent text-primary text-xs min-w-[20px] h-5 flex items-center justify-center animate-scale-in"
                >
                  {getTotalItems()}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Carousel */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-3 overflow-x-auto">
          {productCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "border-primary text-primary hover:bg-primary/5"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="p-4 space-y-3">
        {currentProducts.map((product) => {
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
        })}
      </div>
    </div>
  );
};

export default ProductListScreen;