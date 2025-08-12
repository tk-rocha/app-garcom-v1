import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, User, Search, Scan, ShoppingBag, Plus, Minus, Trash2, Users, ChefHat, Pencil, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const CartScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [numeroPessoas, setNumeroPessoas] = useState(1);
  const [showPendingItemsDialog, setShowPendingItemsDialog] = useState(false);
  const [editingObservationId, setEditingObservationId] = useState<number | null>(null);
  
  // Check if we're in mesa context
  const mesaId = searchParams.get('mesa');
  const isFromMesa = Boolean(mesaId);
  const cartId = isFromMesa ? `mesa-${mesaId}` : 'balcao';
  
  // Load saved number of people for mesa
  React.useEffect(() => {
    if (isFromMesa && mesaId) {
      const loadPessoas = () => {
        const savedPessoas = localStorage.getItem(`mesa-${mesaId}-pessoas`);
        if (savedPessoas) {
          setNumeroPessoas(parseInt(savedPessoas, 10));
        }
      };
      
      // Load on mount
      loadPessoas();
      
      // Listen for storage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === `mesa-${mesaId}-pessoas`) {
          loadPessoas();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      // Custom event for same-window changes
      const handlePessoasChange = () => {
        loadPessoas();
      };
      
      window.addEventListener('pessoasUpdated', handlePessoasChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('pessoasUpdated', handlePessoasChange);
      };
    }
  }, [isFromMesa, mesaId]);
  
  const { 
    getCartItems,
    getTotalItems, 
    addToCart, 
    removeFromCart, 
    removeItemCompletely, 
    getSubtotal, 
    getDiscountAmount, 
    getTaxAmount,
    getServiceFeeAmount,
    getTotal,
    markItemsAsEnviado,
    getItensEnviados,
    getItensNaoEnviados,
    hasItensEnviados,
    ensureMesaServiceFee,
    updateObservation
  } = useCart();

  const cart = getCartItems(cartId);
  const itensEnviados = getItensEnviados(cartId);
  const itensNaoEnviados = getItensNaoEnviados(cartId);
  const hasItensEnviadosCart = hasItensEnviados(cartId);

  // Ensure Mesa has automatic 10% service fee
  React.useEffect(() => {
    if (isFromMesa) {
      ensureMesaServiceFee(cartId);
    }
  }, [isFromMesa, cartId, ensureMesaServiceFee]);

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
        categoryId: null // Carrinho não tem categoria específica
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

  const handleObservationChange = (productId: number, value: string) => {
    updateObservation(productId, value, cartId);
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

  const { user } = useAuth();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="bg-background border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(isFromMesa ? `/produtos?mesa=${mesaId}` : "/produtos")}
                className="text-primary hover:text-primary/90"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-bold text-primary">
                {isFromMesa ? `MESA ${mesaId}` : 'BALCÃO'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(isFromMesa ? `/cliente?mesa=${mesaId}` : "/cliente")}
                className="text-primary hover:text-primary/90"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(isFromMesa ? `/buscar-produto?mesa=${mesaId}` : "/buscar-produto")}
                className="text-primary hover:text-primary/90"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(isFromMesa ? `/codigo-barras?mesa=${mesaId}` : "/codigo-barras")}
                className="text-primary hover:text-primary/90"
              >
                <Scan className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:text-primary/90"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Empty Cart Message */}
          <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
            <p className="text-muted-foreground text-center">ainda não há nenhum item</p>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/90 hover:bg-primary/5 font-medium"
              onClick={() => navigate(isFromMesa ? `/produtos?mesa=${mesaId}` : "/produtos")}
            >
              + ADICIONAR ITENS {isFromMesa ? 'MESA' : 'BALCÃO'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(isFromMesa ? `/produtos?mesa=${mesaId}` : "/produtos")}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-primary">
              {isFromMesa ? `MESA ${mesaId}` : 'BALCÃO'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                {user.name?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase() || 'U'}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(isFromMesa ? `/cliente?mesa=${mesaId}` : "/cliente")}
              className="text-primary hover:text-primary/90"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(isFromMesa ? `/buscar-produto?mesa=${mesaId}` : "/buscar-produto")}
              className="text-primary hover:text-primary/90"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(isFromMesa ? `/codigo-barras?mesa=${mesaId}` : "/codigo-barras")}
              className="text-primary hover:text-primary/90"
            >
              <Scan className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary/90"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mesa Action Buttons - Only show when from mesa */}
      {isFromMesa && (
        <div className="p-4 bg-background border-b border-border">
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
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground flex items-center gap-2"
            >
              <ChefHat className="h-4 w-4" />
              Enviar Cozinha
            </Button>
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {cart.slice().reverse().map((item) => (
            <div
              key={item.productId}
              className={`p-4 rounded-lg border ${
                item.enviado 
                  ? "bg-muted/50 border-muted" 
                  : "bg-card border-border shadow-sm"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex-1">
                  <div className="flex justify-between items-center w-full">
                    <h3 className={`font-medium ${
                      item.enviado ? "text-muted-foreground" : "text-primary"
                    }`}>
                      {item.name}
                    </h3>
                    {item.operator && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full ml-2">
                        {item.operator.name?.split(' ')?.[0] || 'OP'}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-between mt-1">
                    <span className={`text-sm ${
                      item.enviado ? "text-muted-foreground" : "text-foreground"
                    }`}>
                      Qtd: {item.quantity}
                    </span>
                    <span className={`text-sm ${
                      item.enviado ? "text-muted-foreground" : "text-foreground"
                    }`}>
                      Unitário: R$ {item.price.toFixed(2)}
                    </span>
                    <span className={`text-sm font-medium ${
                      item.enviado ? "text-muted-foreground" : "text-primary"
                    }`}>
                      Total: R$ {(item.quantity * item.price).toFixed(2)}
                     </span>
                   </div>
                   
                   {/* Exibir customizações quando existirem */}
                   {item.customizations && item.customizations.length > 0 && (
                     <div className="text-xs text-muted-foreground mt-2 pl-2 border-l-2 border-primary/30">
                       {item.customizations.map((customization, index) => (
                         <div key={index} className="flex justify-between">
                           <span>{customization.phase}: {customization.option}</span>
                           {customization.price > 0 && (
                             <span className="text-primary font-medium">
                               + R$ {customization.price.toFixed(2).replace('.', ',')}
                             </span>
                           )}
                         </div>
                       ))}
                     </div>
                   )}
                   
                   {/* Exibir observação quando existir */}
                   {item.observacao && (
                     <div className="text-xs text-muted-foreground italic mt-2 pl-2 border-l-2 border-muted">
                       "{item.observacao}"
                     </div>
                   )}
                   {item.enviado && (
                     <span className="text-xs text-muted-foreground mt-1 block">
                       ✓ Enviado para cozinha
                     </span>
                   )}
                </div>
                
                {!item.enviado && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 border border-primary rounded-md p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId, cartId)}
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium text-primary min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      {editingObservationId === item.productId && (item.observacao || "").length > 0 ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingObservationId(null)}
                          className="text-green-600 hover:bg-green-100"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingObservationId(editingObservationId === item.productId ? null : item.productId)}
                          className="text-muted-foreground hover:bg-muted/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItemCompletely(item.productId, cartId)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
                {editingObservationId === item.productId && (
                  <div className="mt-2">
                    <input
                      type="text"
                      maxLength={40}
                      value={item.observacao || ""}
                      onChange={e => handleObservationChange(item.productId, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder="Observação (ex: Sem gelo, Com limão...)"
                    />
                    <div className="text-xs text-muted-foreground text-right">{(item.observacao || "").length}/40</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-background border-t border-border p-6 space-y-4">
        {/* Resumo Financeiro */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Subtotal:</span>
            <span className="text-sm font-medium">R$ {getSubtotal(cartId).toFixed(2)}</span>
          </div>
          {isFromMesa && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Taxa de Serviço (10%):</span>
              <span className="text-sm font-medium">R$ {getServiceFeeAmount(cartId).toFixed(2)}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-primary">Total:</span>
            <span className="text-xl font-bold text-primary">R$ {getTotal(cartId).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate(isFromMesa ? `/produtos?mesa=${mesaId}` : "/produtos")}
          >
            CONTINUAR COMPRANDO
          </Button>
          
          {/* Botão Finalizar só aparece se: para mesa = há itens enviados, para balcão = há itens */}
          {shouldShowFinalizarButton && (
            <Button 
              className="w-full py-4 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleFinalizarCompra}
            >
              FINALIZAR {isFromMesa ? 'PEDIDO' : 'COMPRA'}
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
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CartScreen;
