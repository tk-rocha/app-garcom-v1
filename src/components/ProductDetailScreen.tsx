import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Search, Scan, ShoppingBag, Plus, Minus, Edit3, Home } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCategories } from "@/hooks/useCategories";

const ProductDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { product, categoryId } = location.state || {};
  
  const [observation, setObservation] = useState("");
  const [showObservation, setShowObservation] = useState(false);
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
      navigate("/balcao");
    } else if (section === "category") {
      navigate("/produtos", { state: { activeCategory: categoryId } });
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

  const handleAddToCart = () => {
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
            onClick={() => navigate("/produtos", { state: { activeCategory: categoryId } })}
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

        {/* Observation Button */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowObservation(!showObservation)}
            className="w-full py-3 text-primary border-primary hover:bg-primary/5 flex items-center justify-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Observação</span>
          </Button>
          
          {showObservation && (
            <Card className="mt-3">
              <CardContent className="p-4">
                <Textarea
                  placeholder="Digite suas observações aqui (ex: sem gelo, gelado, etc.)"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="min-h-[100px] border-gray-300 focus:border-primary"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;