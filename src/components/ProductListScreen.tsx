import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Search, Scan, ShoppingBag, Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ProductPhaseSelector } from "./ProductPhaseSelector";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { getNumericId } from "@/utils/productUtils";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPhaseSelector, setShowPhaseSelector] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Check if we're in mesa context
  const mesaId = searchParams.get('mesa');
  const isFromMesa = Boolean(mesaId);
  
  const { getTotalItems, getProductQuantity, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  
  // Set the first category as default when categories load
  const [activeCategory, setActiveCategory] = useState<string>("");
  const { products, loading: productsLoading } = useProducts(activeCategory);

  // Set active category to first category when categories load
  if (!activeCategory && categories.length > 0) {
    setActiveCategory(categories[0].id);
  }

  const handleProductClick = (product: any) => {
    const targetUrl = `/produto/${product.id}${isFromMesa ? `?mesa=${mesaId}` : ''}`;
    navigate(targetUrl, { 
      state: { 
        product: {
          id: product.id,
          name: product.nome,
          price: product.preco,
          image: product.imagem_url || "/api/placeholder/80/80",
          description: product.descricao
        }, 
        category: activeCategory
      } 
    });
  };

  const handleAddToCart = (product: any) => {
    const categoryName = categories.find(cat => cat.id === activeCategory)?.nome || '';
    
    // Check if product is from LANCHES category and needs phase selection
    if (categoryName === "LANCHES" && product.nome !== "Misto Quente") {
      setSelectedProduct(product);
      setShowPhaseSelector(true);
      return;
    }
    
    // For Misto Quente, also use phase selector but with different config
    if (product.nome === "Misto Quente") {
      setSelectedProduct(product);
      setShowPhaseSelector(true);
      return;
    }
    
    // For other products, add directly to cart
    addToCart(getNumericId(product.id), {
      name: product.nome,
      price: product.preco,
      image: product.imagem_url || "/api/placeholder/80/80"
    }, isFromMesa ? `mesa-${mesaId}` : 'balcao');
  };

  const handlePhaseSelectionComplete = (productData: any) => {
    addToCart(productData.id, {
      name: productData.name,
      price: productData.price,
      image: productData.image,
      customizations: productData.customizations
    }, isFromMesa ? `mesa-${mesaId}` : 'balcao');
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

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
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
          {categories.map((category) => (
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
              {category.nome}
            </Button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="p-4 space-y-3">
        {products.map((product) => {
          const quantity = getProductQuantity(getNumericId(product.id), isFromMesa ? `mesa-${mesaId}` : 'balcao');
          
          return (
            <Card key={product.id} className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.imagem_url || "/api/placeholder/80/80"}
                      alt={product.nome}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                    />
                  </div>
                  
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <h3 className="font-medium text-gray-900">{product.nome}</h3>
                    <p className="text-lg font-semibold text-primary">
                      R$ {product.preco.toFixed(2).replace('.', ',')}
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
                          onClick={() => removeFromCart(getNumericId(product.id), isFromMesa ? `mesa-${mesaId}` : 'balcao')}
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

      {/* Phase Selection Modal */}
      {selectedProduct && (
        <ProductPhaseSelector
          isOpen={showPhaseSelector}
          onClose={() => {
            setShowPhaseSelector(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onAddToCart={handlePhaseSelectionComplete}
        />
      )}
    </div>
  );
};

export default ProductListScreen;