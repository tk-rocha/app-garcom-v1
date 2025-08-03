import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { ProductPhaseSelector } from "./ProductPhaseSelector";

// Updated product data matching ProductListScreen
const allProducts = [
  // Prato do Dia
  { id: 1, name: "Virado à Paulista", price: 28.00, image: "/api/placeholder/80/80", category: "prato-do-dia" },
  { id: 2, name: "Bife à Rolê", price: 28.00, image: "/api/placeholder/80/80", category: "prato-do-dia" },
  { id: 3, name: "Feijoada", price: 32.00, image: "/api/placeholder/80/80", category: "prato-do-dia" },
  { id: 4, name: "Macarrão à Bolonhesa", price: 25.00, image: "/api/placeholder/80/80", category: "prato-do-dia" },
  { id: 5, name: "Peixe Empanado", price: 28.00, image: "/api/placeholder/80/80", category: "prato-do-dia" },
  { id: 6, name: "Churrasco", price: 34.00, image: "/api/placeholder/80/80", category: "prato-do-dia" },
  
  // Executivo
  { id: 7, name: "Bife à Parmegiana", price: 32.00, image: "/api/placeholder/80/80", category: "executivo" },
  { id: 8, name: "Frango com Fritas", price: 32.00, image: "/api/placeholder/80/80", category: "executivo" },
  { id: 9, name: "Bife com Fritas", price: 32.00, image: "/api/placeholder/80/80", category: "executivo" },
  { id: 10, name: "Panquecas", price: 30.00, image: "/api/placeholder/80/80", category: "executivo" },
  { id: 11, name: "Omelete", price: 25.00, image: "/api/placeholder/80/80", category: "executivo" },
  
  // Massas
  { id: 12, name: "Lasanha", price: 34.00, image: "/api/placeholder/80/80", category: "massas" },
  { id: 13, name: "Ravioli", price: 34.00, image: "/api/placeholder/80/80", category: "massas" },
  { id: 14, name: "Cappelletti", price: 38.00, image: "/api/placeholder/80/80", category: "massas" },
  { id: 15, name: "Gnocchi", price: 44.00, image: "/api/placeholder/80/80", category: "massas" },
  { id: 16, name: "Rondelli", price: 44.00, image: "/api/placeholder/80/80", category: "massas" },
  { id: 17, name: "Sorrentini", price: 45.00, image: "/api/placeholder/80/80", category: "massas" },
  
  // Lanches
  { id: 18, name: "Combo X-Salada", price: 29.99, image: "/api/placeholder/80/80", category: "lanches" },
  { id: 19, name: "Combo X-Bacon", price: 31.00, image: "/api/placeholder/80/80", category: "lanches" },
  { id: 20, name: "Combo X-Tudo", price: 36.99, image: "/api/placeholder/80/80", category: "lanches" },
  { id: 21, name: "Combo Pastel", price: 19.99, image: "/api/placeholder/80/80", category: "lanches" },
  { id: 22, name: "Misto Quente", price: 22.00, image: "/api/placeholder/80/80", category: "lanches" },
  
  // Bebidas
  { id: 23, name: "Suco de Laranja", price: 15.00, image: "/api/placeholder/80/80", category: "bebidas" },
  { id: 24, name: "Suco de Maracujá", price: 15.00, image: "/api/placeholder/80/80", category: "bebidas" },
  { id: 25, name: "Suco de Abacaxi", price: 15.00, image: "/api/placeholder/80/80", category: "bebidas" },
  { id: 26, name: "Sprite", price: 9.00, image: "/api/placeholder/80/80", category: "bebidas" },
  { id: 27, name: "Coca-Cola", price: 9.00, image: "/api/placeholder/80/80", category: "bebidas" },
  { id: 28, name: "Fanta Laranja", price: 9.90, image: "/api/placeholder/80/80", category: "bebidas" },
  
  // Cafés
  { id: 29, name: "Café Expresso", price: 8.00, image: "/api/placeholder/80/80", category: "cafes" },
  { id: 30, name: "Macchiato", price: 9.90, image: "/api/placeholder/80/80", category: "cafes" },
  { id: 31, name: "Carioca", price: 7.90, image: "/api/placeholder/80/80", category: "cafes" },
  { id: 32, name: "Café Coado", price: 10.00, image: "/api/placeholder/80/80", category: "cafes" },
  { id: 33, name: "Latte", price: 7.90, image: "/api/placeholder/80/80", category: "cafes" },
  { id: 34, name: "Prensa Francesa", price: 9.99, image: "/api/placeholder/80/80", category: "cafes" },
  { id: 35, name: "Mocaccino", price: 14.00, image: "/api/placeholder/80/80", category: "cafes" },
  
  // Porções
  { id: 36, name: "Batata Frita", price: 28.00, image: "/api/placeholder/80/80", category: "porcoes" },
  { id: 37, name: "Batata com Cheddar", price: 37.00, image: "/api/placeholder/80/80", category: "porcoes" },
  { id: 38, name: "Mandioca Frita", price: 29.90, image: "/api/placeholder/80/80", category: "porcoes" },
  { id: 39, name: "Calabresa", price: 32.00, image: "/api/placeholder/80/80", category: "porcoes" },
  
  // Sobremesas
  { id: 40, name: "Fondant de Chocolate", price: 13.00, image: "/api/placeholder/80/80", category: "sobremesas" },
  { id: 41, name: "Mousse de Limão", price: 14.00, image: "/api/placeholder/80/80", category: "sobremesas" },
  { id: 42, name: "Tiramisù", price: 21.00, image: "/api/placeholder/80/80", category: "sobremesas" },
];

const ProductSearchScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [showPhaseSelector, setShowPhaseSelector] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Check if we're in mesa or comanda context
  const mesaId = searchParams.get('mesa');
  const comandaId = searchParams.get('comanda');
  const isFromMesa = Boolean(mesaId);
  const isFromComanda = Boolean(comandaId);
  const cartId = isFromMesa ? `mesa-${mesaId}` : isFromComanda ? `comanda-${comandaId}` : 'balcao';
  
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
    const params = isFromMesa ? `?mesa=${mesaId}` : isFromComanda ? `?comanda=${comandaId}` : '';
    navigate(`/produto/${product.id}${params}`, { 
      state: { 
        product, 
        category: product.category
      } 
    });
  };

  const handleAddToCart = (product: any) => {
    // Check if product is from LANCHES category and needs phase selection
    if (product.category === "lanches" && product.name !== "Misto Quente") {
      setSelectedProduct(product);
      setShowPhaseSelector(true);
      return;
    }
    
    // For Misto Quente, also use phase selector
    if (product.name === "Misto Quente") {
      setSelectedProduct(product);
      setShowPhaseSelector(true);
      return;
    }
    
    // For other products, add directly to cart
    addToCart(product.id, {
      name: product.name,
      price: product.price,
      image: product.image
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
            const quantity = getProductQuantity(product.id, cartId);
            
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
                            onClick={() => removeFromCart(product.id, cartId)}
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