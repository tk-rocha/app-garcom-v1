import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Search, Scan, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartScreen = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    getTotalItems, 
    addToCart, 
    removeFromCart, 
    removeItemCompletely, 
    getSubtotal, 
    getDiscountAmount, 
    getTaxAmount,
    getTotal 
  } = useCart();

  const handleProductClick = (item: any) => {
    navigate(`/produto/${item.productId}`, { 
      state: { 
        product: {
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image
        },
        fromCart: true
      } 
    });
  };

  const handleAddToCart = (item: any) => {
    addToCart(item.productId, {
      name: item.name,
      price: item.price,
      image: item.image
    });
  };

  if (cart.length === 0) {
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
                    className="absolute -top-2 -right-2 bg-accent text-primary text-xs min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Empty Cart Message */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
          <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">Sua sacola está vazia</h2>
          <p className="text-gray-600 text-center mb-6">Adicione produtos para começar sua compra</p>
          <Button 
            onClick={() => navigate("/produtos")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            CONTINUAR COMPRANDO
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                  className="absolute -top-2 -right-2 bg-accent text-primary text-xs min-w-[20px] h-5 flex items-center justify-center"
                >
                  {getTotalItems()}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-3">
        {cart.map((item) => (
          <Card key={item.productId} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div 
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => handleProductClick(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                  />
                </div>
                
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleProductClick(item)}
                >
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-lg font-semibold text-primary">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                
                <div className="flex-shrink-0 flex items-center space-x-3">
                  <div className="flex items-center space-x-3 border border-primary rounded-md p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.productId)}
                      className="h-8 w-8 text-primary hover:bg-primary/5"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium text-primary min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddToCart(item)}
                      className="h-8 w-8 text-primary hover:bg-primary/5"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItemCompletely(item.productId)}
                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white border-t border-gray-200 p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">R$ {getSubtotal().toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              className="text-primary underline"
              onClick={() => navigate("/taxas")}
            >
              Taxas
            </button>
            <span className="font-semibold">R$ {getTaxAmount().toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              className="text-primary underline"
              onClick={() => navigate("/desconto")}
            >
              Desconto
            </button>
            <span className="font-semibold text-red-500">
              -R$ {getDiscountAmount().toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="text-lg font-bold text-primary">Total:</span>
            <span className="text-lg font-bold text-primary">
              R$ {getTotal().toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/5"
            onClick={() => navigate("/produtos")}
          >
            CONTINUAR COMPRANDO
          </Button>
          
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/cpf")}
          >
            FINALIZAR COMPRA
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;