import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, User, Search, Scan, ShoppingBag, Plus, Minus, Trash2, Users, ChefHat } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [numeroPessoas, setNumeroPessoas] = useState(1);
  const [showPendingItemsDialog, setShowPendingItemsDialog] = useState(false);
  
  // Check if we're in mesa context
  const mesaId = searchParams.get('mesa');
  const isFromMesa = Boolean(mesaId);
  const cartId = isFromMesa ? `mesa-${mesaId}` : 'balcao';
  
  const { 
    getCartItems,
    getTotalItems, 
    addToCart, 
    removeFromCart, 
    removeItemCompletely, 
    getSubtotal, 
    getDiscountAmount, 
    getTaxAmount,
    getTotal,
    markItemsAsEnviado,
    getItensEnviados,
    getItensNaoEnviados,
    hasItensEnviados
  } = useCart();

  const cart = getCartItems(cartId);
  const itensEnviados = getItensEnviados(cartId);
  const itensNaoEnviados = getItensNaoEnviados(cartId);
  const hasItensEnviadosCart = hasItensEnviados(cartId);

  // Debug logs para o CartScreen
  console.log('CartScreen - Cart Items:', cart);
  console.log('CartScreen - Itens Enviados:', itensEnviados);
  console.log('CartScreen - Itens Nao Enviados:', itensNaoEnviados);
  console.log('CartScreen - Has Itens Enviados:', hasItensEnviadosCart);
  console.log('CartScreen - Is From Mesa:', isFromMesa);

  const handleProductClick = (item: any) => {
    const targetUrl = `/produto/${item.productId}${isFromMesa ? `?mesa=${mesaId}` : ''}`;
    navigate(targetUrl, { 
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
    }, cartId);
  };

  const handleEditarPessoas = () => {
    if (isFromMesa) {
      navigate(`/mesa/${mesaId}/pessoas`);
    }
  };

  const handleEnviarCozinha = () => {
    markItemsAsEnviado(cartId);
    console.log('CartScreen - Itens marcados como enviados');
  };

  const handleFinalizarCompra = () => {
    const itensEnviadosArray = getItensEnviados(cartId);
    const itensNaoEnviados = getItensNaoEnviados(cartId);
    
    console.log('CartScreen - handleFinalizarCompra - Itens enviados:', itensEnviadosArray);
    console.log('CartScreen - handleFinalizarCompra - Itens não enviados:', itensNaoEnviados);
    
    if (isFromMesa) {
      // Para mesa, verificar se há itens enviados
      if (itensEnviadosArray.length === 0) {
        console.log('CartScreen - Bloqueado: nenhum item enviado para mesa');
        return;
      }
      
      if (itensNaoEnviados.length > 0) {
        console.log('CartScreen - Mostrando modal de confirmação para mesa');
        setShowPendingItemsDialog(true);
      } else {
        console.log('CartScreen - Navegando para CPF (mesa)');
        navigate(`/cpf?mesa=${mesaId}`, { state: { mesa: mesaId } });
      }
    } else {
      // Para balcão, pode finalizar direto
      console.log('CartScreen - Navegando para CPF (balcão)');
      navigate("/cpf");
    }
  };

  const handleConfirmWithPendingItems = () => {
    // Remove itens não enviados do carrinho
    const itensNaoEnviados = getItensNaoEnviados(cartId);
    itensNaoEnviados.forEach(item => {
      removeItemCompletely(item.productId, cartId);
    });
    setShowPendingItemsDialog(false);
    if (isFromMesa) {
      navigate(`/cpf?mesa=${mesaId}`, { state: { mesa: mesaId } });
    } else {
      navigate("/cpf");
    }
  };

  // Para mesa: só mostrar botão se há itens enviados
  // Para balcão: sempre mostrar se há itens
  const shouldShowFinalizarButton = isFromMesa ? hasItensEnviadosCart : cart.length > 0;
  const hasItensNaoEnviadosCart = itensNaoEnviados.length > 0;

  console.log('CartScreen - Button Logic:', {
    isFromMesa,
    totalItens: cart.length,
    itensEnviados: itensEnviados.length,
    itensNaoEnviados: itensNaoEnviados.length,
    hasItensEnviadosCart,
    hasItensNaoEnviadosCart,
    shouldShowFinalizarButton
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(isFromMesa ? `/produtos?mesa=${mesaId}` : "/produtos")}
              className="text-primary hover:bg-primary/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <h1 className="text-lg font-semibold text-primary">
              {isFromMesa ? `MESA ${mesaId}` : 'BALCÃO'}
            </h1>
            
            <div className="flex items-center space-x-2">
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
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
                {getTotalItems(cartId) > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-accent text-primary text-xs min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {getTotalItems(cartId)}
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
            onClick={() => navigate(isFromMesa ? `/produtos?mesa=${mesaId}` : "/produtos")}
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
            onClick={() => navigate(isFromMesa ? `/produtos?mesa=${mesaId}` : "/produtos")}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">
            {isFromMesa ? `MESA ${mesaId}` : 'BALCÃO'}
          </h1>
          
          <div className="flex items-center space-x-2">
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
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
                <ShoppingBag className="h-5 w-5" />
              </Button>
              {getTotalItems(cartId) > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-accent text-primary text-xs min-w-[20px] h-5 flex items-center justify-center"
                >
                  {getTotalItems(cartId)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mesa Action Buttons - Only show when from mesa */}
      {isFromMesa && (
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex gap-4">
            <Button
              onClick={handleEditarPessoas}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {numeroPessoas} Pessoa{numeroPessoas !== 1 ? 's' : ''}
            </Button>
            <Button
              onClick={handleEnviarCozinha}
              disabled={!hasItensNaoEnviadosCart}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2"
            >
              <ChefHat className="h-4 w-4" />
              Enviar Cozinha
            </Button>
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-3">
        {cart.map((item) => (
          <Card key={item.productId} className={`bg-white shadow-sm ${
            item.enviado ? "bg-[#E1E1E5] border-gray-300" : ""
          }`}>
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
                  <h3 className={`font-medium ${
                    item.enviado ? "text-gray-600" : "text-gray-900"
                  }`}>{item.name}</h3>
                  <p className={`text-lg font-semibold ${
                    item.enviado ? "text-gray-600" : "text-primary"
                  }`}>
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </p>
                  {item.enviado && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      ✓ Enviado para cozinha
                    </span>
                  )}
                </div>
                
                {!item.enviado && (
                  <div className="flex-shrink-0 flex items-center space-x-3">
                    <div className="flex items-center space-x-3 border border-primary rounded-md p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.productId, cartId)}
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
                      onClick={() => removeItemCompletely(item.productId, cartId)}
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
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
            <span className="font-semibold">R$ {getSubtotal(cartId).toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              className="text-primary underline"
              onClick={() => navigate(isFromMesa ? `/taxas?mesa=${mesaId}` : "/taxas")}
            >
              Taxas
            </button>
            <span className="font-semibold">R$ {getTaxAmount(cartId).toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              className="text-primary underline"
              onClick={() => navigate(isFromMesa ? `/desconto?mesa=${mesaId}` : "/desconto")}
            >
              Desconto
            </button>
            <span className="font-semibold text-red-500">
              -R$ {getDiscountAmount(cartId).toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="text-lg font-bold text-primary">Total:</span>
            <span className="text-lg font-bold text-primary">
              R$ {getTotal(cartId).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/5"
            onClick={() => navigate(isFromMesa ? `/produtos?mesa=${mesaId}` : "/produtos")}
          >
            CONTINUAR COMPRANDO
          </Button>
          
          {/* Botão Finalizar só aparece se: para mesa = há itens enviados, para balcão = há itens */}
          {shouldShowFinalizarButton && (
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleFinalizarCompra}
            >
              FINALIZAR COMPRA
            </Button>
          )}
        </div>
      </div>

      {/* Modal de confirmação para itens pendentes */}
      <AlertDialog open={showPendingItemsDialog} onOpenChange={setShowPendingItemsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Itens Pendentes</AlertDialogTitle>
            <AlertDialogDescription>
              Ainda há itens pendentes de envio. Ao continuar, os itens não enviados serão descartados. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmWithPendingItems}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
};

export default CartScreen;
