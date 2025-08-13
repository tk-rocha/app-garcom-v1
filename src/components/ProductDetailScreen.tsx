import { useState } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Search, Scan, ShoppingBag, Plus, Minus, Home } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCategories } from "@/hooks/useCategories";
import { ProductPhaseSelector } from "./ProductPhaseSelector";

const ProductDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { product, categoryId } = location.state || {};
  
  const [showPhaseSelector, setShowPhaseSelector] = useState(false);
  
  // Determinar se está em contexto de mesa
  const mesaId = searchParams.get('mesa');
  const isFromMesa = !!mesaId;
  const { getTotalItems, getProductQuantity, addToCart, removeFromCart } = useCart();
  const { categories } = useCategories();

  // Encontrar o nome da categoria pelo ID
  const getCategoryName = (catId: string | null) => {
    if (!catId) return 'Categoria';
    const category = categories.find(cat => cat.id === catId);
    return category?.nome || 'Categoria';
  };


  const handleBreadcrumbClick = (section: string) => {
    if (section === "home") {
      if (isFromMesa) {
        navigate(`/mesa/${mesaId}`);
      } else {
        navigate("/balcao");
      }
    } else if (section === "category") {
      if (isFromMesa) {
        navigate(`/produtos?mesa=${mesaId}`, { state: { activeCategory: categoryId } });
      } else {
        navigate("/produtos", { state: { activeCategory: categoryId } });
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-500">Produto não encontrado</p>
      </div>
    );
  }

  const quantity = getProductQuantity(product.id);

  // Check if product needs phase selection
  const needsPhaseSelection = (productName: string) => {
    const productKey = productName?.toLowerCase()
      ?.replace(/[^a-z0-9\s-]/g, '')
      ?.replace(/\s+/g, '-') || '';
    
    const phaseConfig = {
      "combo-x-salada": true,
      "combo-x-bacon": true,
      "combo-x-tudo": true,
      "combo-pastel": true,
      "misto-quente": true,
      "hamburguer-classico": true
    };
    
    return phaseConfig[productKey as keyof typeof phaseConfig] || false;
  };

  const handleAddToCart = () => {
    // Check if product needs phase selection
    if (needsPhaseSelection(product.name)) {
      setShowPhaseSelector(true);
      return;
    }
    
    addToCart(product.id, {
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const handlePhaseSelectionComplete = (productData: any) => {
    addToCart(productData.id, {
      name: productData.name,
      price: productData.price,
      image: productData.image,
      customizations: productData.customizations
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
            onClick={() => {
              if (isFromMesa) {
                navigate(`/produtos?mesa=${mesaId}`, { state: { activeCategory: categoryId } });
              } else {
                navigate("/produtos", { state: { activeCategory: categoryId } });
              }
            }}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">BALCÃO</h1>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
              <Scan className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
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

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-2 text-sm">
          <button 
            onClick={() => handleBreadcrumbClick("home")}
            className="text-primary hover:underline flex items-center"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </button>
          <span className="text-gray-400">/</span>
          <button 
            onClick={() => handleBreadcrumbClick("category")}
            className="text-primary hover:underline"
          >
            {getCategoryName(categoryId)}
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 space-y-6">
        {/* Product Image and Info */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-48 h-48 rounded-lg object-cover shadow-lg bg-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-primary">{product.name}</h1>
            <p className="text-2xl font-bold text-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>

        {/* Quantity Control */}
        <div className="flex justify-center">
          {quantity === 0 ? (
            <Button
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg"
            >
              ADICIONAR
            </Button>
          ) : (
            <div className="flex items-center space-x-4 border border-primary rounded-lg p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(product.id)}
                className="h-10 w-10 text-primary hover:bg-primary/5"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <span className="font-semibold text-primary text-xl min-w-[40px] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddToCart}
                className="h-10 w-10 text-primary hover:bg-primary/5"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Descrição:</h3>
          <p className="text-gray-600 text-center leading-relaxed">
            {product.name === "Coca Cola" 
              ? "A Coca-Cola Sem Açúcar é um refrigerante que não contém calorias, mantendo todo o sabor refrescante que você conhece e ama."
              : `Delicioso ${product.name.toLowerCase()} preparado com ingredientes selecionados para proporcionar uma experiência única de sabor.`
            }
          </p>
        </div>

      </div>

      {/* Phase Selection Modal */}
      <ProductPhaseSelector
        isOpen={showPhaseSelector}
        onClose={() => setShowPhaseSelector(false)}
        product={product}
        onAddToCart={handlePhaseSelectionComplete}
      />
    </div>
  );
};

export default ProductDetailScreen;