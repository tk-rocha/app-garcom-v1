import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Search, Scan, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for products
const productCategories = [
  { id: "prato-do-dia", name: "Prato do Dia" },
  { id: "executivo", name: "Executivo" },
  { id: "massas", name: "Massas" },
  { id: "lanches", name: "Lanches" },
  { id: "bebidas", name: "Bebidas" },
  { id: "cafes", name: "Cafés" },
  { id: "porcoes", name: "Porções" },
  { id: "sobremesas", name: "Sobremesas" },
];

const mockProducts = {
  "prato-do-dia": [
    { id: 1, name: "Virado à Paulista", price: 28.00, image: "/api/placeholder/80/80" },
    { id: 2, name: "Bife à Rolê", price: 28.00, image: "/api/placeholder/80/80" },
    { id: 3, name: "Feijoada", price: 32.00, image: "/api/placeholder/80/80" },
    { id: 4, name: "Macarrão à Bolonhesa", price: 25.00, image: "/api/placeholder/80/80" },
    { id: 5, name: "Peixe Empanado", price: 28.00, image: "/api/placeholder/80/80" },
    { id: 6, name: "Churrasco", price: 34.00, image: "/api/placeholder/80/80" },
  ],
  executivo: [
    { id: 7, name: "Bife à Parmegiana", price: 32.00, image: "/api/placeholder/80/80" },
    { id: 8, name: "Frango com Fritas", price: 32.00, image: "/api/placeholder/80/80" },
    { id: 9, name: "Bife com Fritas", price: 32.00, image: "/api/placeholder/80/80" },
    { id: 10, name: "Panquecas", price: 30.00, image: "/api/placeholder/80/80" },
    { id: 11, name: "Omelete", price: 25.00, image: "/api/placeholder/80/80" },
  ],
  massas: [
    { id: 12, name: "Lasanha", price: 34.00, image: "/api/placeholder/80/80" },
    { id: 13, name: "Ravioli", price: 34.00, image: "/api/placeholder/80/80" },
    { id: 14, name: "Cappelletti", price: 38.00, image: "/api/placeholder/80/80" },
    { id: 15, name: "Gnocchi", price: 44.00, image: "/api/placeholder/80/80" },
    { id: 16, name: "Rondelli", price: 44.00, image: "/api/placeholder/80/80" },
    { id: 17, name: "Sorrentini", price: 45.00, image: "/api/placeholder/80/80" },
  ],
  lanches: [
    { id: 18, name: "Combo X-Salada", price: 29.99, image: "/api/placeholder/80/80" },
    { id: 19, name: "Combo X-Bacon", price: 31.00, image: "/api/placeholder/80/80" },
    { id: 20, name: "Combo X-Tudo", price: 36.99, image: "/api/placeholder/80/80" },
    { id: 21, name: "Combo Pastel", price: 19.99, image: "/api/placeholder/80/80" },
    { id: 22, name: "Misto Quente", price: 22.00, image: "/api/placeholder/80/80" },
  ],
  bebidas: [
    { id: 23, name: "Suco de Laranja", price: 15.00, image: "/api/placeholder/80/80" },
    { id: 24, name: "Suco de Maracujá", price: 15.00, image: "/api/placeholder/80/80" },
    { id: 25, name: "Suco de Abacaxi", price: 15.00, image: "/api/placeholder/80/80" },
    { id: 26, name: "Sprite", price: 9.00, image: "/api/placeholder/80/80" },
    { id: 27, name: "Coca-Cola", price: 9.00, image: "/api/placeholder/80/80" },
    { id: 28, name: "Fanta Laranja", price: 9.90, image: "/api/placeholder/80/80" },
  ],
  cafes: [
    { id: 29, name: "Café Expresso", price: 8.00, image: "/api/placeholder/80/80" },
    { id: 30, name: "Macchiato", price: 9.90, image: "/api/placeholder/80/80" },
    { id: 31, name: "Carioca", price: 7.90, image: "/api/placeholder/80/80" },
    { id: 32, name: "Café Coado", price: 10.00, image: "/api/placeholder/80/80" },
    { id: 33, name: "Latte", price: 7.90, image: "/api/placeholder/80/80" },
    { id: 34, name: "Prensa Francesa", price: 9.99, image: "/api/placeholder/80/80" },
    { id: 35, name: "Mocaccino", price: 14.00, image: "/api/placeholder/80/80" },
  ],
  porcoes: [
    { id: 36, name: "Batata Frita", price: 28.00, image: "/api/placeholder/80/80" },
    { id: 37, name: "Batata com Cheddar", price: 37.00, image: "/api/placeholder/80/80" },
    { id: 38, name: "Mandioca Frita", price: 29.90, image: "/api/placeholder/80/80" },
    { id: 39, name: "Calabresa", price: 32.00, image: "/api/placeholder/80/80" },
  ],
  sobremesas: [
    { id: 40, name: "Fondant de Chocolate", price: 13.00, image: "/api/placeholder/80/80" },
    { id: 41, name: "Mousse de Limão", price: 14.00, image: "/api/placeholder/80/80" },
    { id: 42, name: "Tiramisù", price: 21.00, image: "/api/placeholder/80/80" },
  ],
};

const ProductListScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("prato-do-dia");
  
  // Check if we're in mesa context
  const mesaId = searchParams.get('mesa');
  const isFromMesa = Boolean(mesaId);
  
  const { getTotalItems, getProductQuantity, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();

  const handleProductClick = (product: any) => {
    const targetUrl = `/produto/${product.id}${isFromMesa ? `?mesa=${mesaId}` : ''}`;
    navigate(targetUrl, { 
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
    }, isFromMesa ? `mesa-${mesaId}` : 'balcao');
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
            onClick={() => navigate(isFromMesa ? `/mesa/${mesaId}` : "/balcao")}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-primary">
            {isFromMesa ? `MESA ${mesaId}` : 'BALCÃO'}
          </h1>
          <div className="flex items-center space-x-2">
            {user && (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                {user.id}
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary hover:bg-primary/5"
              onClick={() => navigate(isFromMesa ? `/cliente?mesa=${mesaId}` : "/cliente")}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary hover:bg-primary/5"
              onClick={() => navigate(isFromMesa ? `/pesquisar?mesa=${mesaId}` : "/pesquisar")}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary hover:bg-primary/5"
              onClick={() => navigate(isFromMesa ? `/scanner?mesa=${mesaId}` : "/scanner")}
            >
              <Scan className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary hover:bg-primary/5"
                onClick={() => {
                  if (getTotalItems(isFromMesa ? `mesa-${mesaId}` : 'balcao') > 0) {
                    navigate(isFromMesa ? `/sacola?mesa=${mesaId}` : "/sacola");
                  }
                }}
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
              {getTotalItems(isFromMesa ? `mesa-${mesaId}` : 'balcao') > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-accent text-primary text-xs min-w-[20px] h-5 flex items-center justify-center animate-scale-in"
                >
                  {getTotalItems(isFromMesa ? `mesa-${mesaId}` : 'balcao')}
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
          const quantity = getProductQuantity(product.id, isFromMesa ? `mesa-${mesaId}` : 'balcao');
          
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
                          onClick={() => removeFromCart(product.id, isFromMesa ? `mesa-${mesaId}` : 'balcao')}
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