import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { ProductPhaseSelector } from "./ProductPhaseSelector";
import { useAllProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { getNumericId } from "@/utils/productUtils";

const ProductSearchScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showPhaseSelector, setShowPhaseSelector] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Check if we're in mesa or comanda context
  const mesaId = searchParams.get('mesa');
  const comandaId = searchParams.get('comanda');
  const isFromMesa = Boolean(mesaId);
  const isFromComanda = Boolean(comandaId);
  const cartId = isFromMesa ? `mesa-${mesaId}` : isFromComanda ? `comanda-${comandaId}` : 'balcao';
  
  const { getProductQuantity, addToCart, removeFromCart } = useCart();
  const { products, loading } = useAllProducts();
  const { categories } = useCategories();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleProductClick = (product: any) => {
    const params = isFromMesa ? `?mesa=${mesaId}` : isFromComanda ? `?comanda=${comandaId}` : '';
    navigate(`/produto/${product.id}${params}`, { 
      state: { 
        product: {
          id: product.id,
          name: product.nome,
          price: product.preco,
          image: product.imagem_url || "/api/placeholder/80/80",
          description: product.descricao
        }, 
        categoryId: product.categoria_id
      } 
    });
  };

  const handleAddToCart = (product: any) => {
    // Check if product is from LANCHES category and needs phase selection
    if (product.categoria?.nome === "LANCHES" && product.nome !== "Misto Quente") {
      setSelectedProduct(product);
      setShowPhaseSelector(true);
      return;
    }
    
    // For Misto Quente, also use phase selector
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
    }, cartId);
  };

  const handlePhaseSelectionComplete = (productData: any) => {
    addToCart(productData.id, {
      name: productData.name,
      price: productData.price,
      image: productData.image,
      customizations: productData.customizations
    }, cartId);
  };

  if (loading) {
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
            onClick={() => {
              const backUrl = isFromMesa ? `/produtos?mesa=${mesaId}` : 
                             isFromComanda ? `/produtos?comanda=${comandaId}` : "/produtos";
              navigate(backUrl);
            }}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">
            BUSCAR PRODUTO {isFromMesa ? `MESA ${mesaId}` : isFromComanda ? `COMANDA ${comandaId}` : ''}
          </h1>
          
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
            const quantity = getProductQuantity(getNumericId(product.id), cartId);
            
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
                            onClick={() => removeFromCart(getNumericId(product.id), cartId)}
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

export default ProductSearchScreen;