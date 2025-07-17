import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Search, ScanLine, ShoppingBag, Users, ChefHat, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCart } from "@/contexts/CartContext";

interface ItemMesa {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  enviado: boolean;
}

const MesaDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const mesaId = id || "1";
  const cartId = `mesa-${mesaId}`;
  
  // Use CartContext para gerenciar itens da mesa
  const { 
    getCartItems, 
    addToCart,
    removeFromCart,
    removeItemCompletely, 
    markItemsAsEnviado, 
    getItensEnviados,
    getItensNaoEnviados,
    hasItensEnviados: hasItensEnviadosCart,
    getTotal
  } = useCart();
  const cartItems = getCartItems(cartId);
  
  const [numeroPessoas, setNumeroPessoas] = useState(1);
  const [showPendingItemsDialog, setShowPendingItemsDialog] = useState(false);

  // Load saved number of people
  useEffect(() => {
    const savedPessoas = localStorage.getItem(`mesa-${mesaId}-pessoas`);
    if (savedPessoas) {
      setNumeroPessoas(parseInt(savedPessoas, 10));
    }
  }, [mesaId]);

  // Converte CartItems para ItemMesa e ordena por mais recente primeiro
  const itens: ItemMesa[] = cartItems.map(item => ({
    id: item.productId,
    nome: item.name,
    quantidade: item.quantity,
    precoUnitario: item.price,
    enviado: item.enviado || false
  })).reverse(); // Reverse to show newest items first

  // Debug: Log do estado dos itens para verificar se há itens marcados como enviados
  const itensEnviadosArray = getItensEnviados(cartId);
  const itensNaoEnviados = getItensNaoEnviados(cartId);
  const hasItensEnviados = hasItensEnviadosCart(cartId);
  
  console.log('MesaDetailScreen - Cart Items:', cartItems);
  console.log('MesaDetailScreen - Itens Enviados:', itensEnviadosArray);
  console.log('MesaDetailScreen - Itens Nao Enviados:', itensNaoEnviados);
  console.log('MesaDetailScreen - Has Itens Enviados:', hasItensEnviados);
  console.log('MesaDetailScreen - Total de itens:', cartItems.length);

  const handleVoltar = () => {
    navigate("/mesas");
  };

  const handleCliente = () => {
    navigate(`/cliente?mesa=${mesaId}`);
  };

  const handlePesquisa = () => {
    navigate(`/buscar-produto?mesa=${mesaId}`);
  };

  const handleScanner = () => {
    navigate(`/codigo-barras?mesa=${mesaId}`);
  };

  const handleSacola = () => {
    navigate(`/sacola?mesa=${mesaId}`);
  };

  const handleFinalizarPedido = () => {
    const itensEnviadosArray = getItensEnviados(cartId);
    const itensNaoEnviados = getItensNaoEnviados(cartId);
    
    console.log('handleFinalizarPedido - Itens enviados:', itensEnviadosArray);
    console.log('handleFinalizarPedido - Itens não enviados:', itensNaoEnviados);
    
    if (itensEnviadosArray.length === 0) {
      // Não há itens enviados para cozinha - não deve permitir finalizar
      console.log('handleFinalizarPedido - Bloqueado: nenhum item enviado');
      return;
    }
    
    if (itensNaoEnviados.length > 0) {
      // Há itens pendentes, mostrar modal de confirmação
      console.log('handleFinalizarPedido - Mostrando modal de confirmação');
      setShowPendingItemsDialog(true);
    } else {
      // Todos os itens foram enviados
      console.log('handleFinalizarPedido - Navegando para CPF');
      navigate(`/cpf?mesa=${mesaId}`, { state: { mesa: mesaId } });
    }
  };

  const handleConfirmWithPendingItems = () => {
    // Remove itens não enviados do carrinho
    const itensNaoEnviados = getItensNaoEnviados(cartId);
    itensNaoEnviados.forEach(item => {
      removeItemCompletely(item.productId, cartId);
    });
    setShowPendingItemsDialog(false);
    navigate(`/cpf?mesa=${mesaId}`, { state: { mesa: mesaId } });
  };

  const handleEditarPessoas = () => {
    navigate(`/mesa/${mesaId}/pessoas`);
  };

  const handleEnviarCozinha = () => {
    // Marca todos os itens como enviados
    markItemsAsEnviado(cartId);
    console.log('handleEnviarCozinha - Itens marcados como enviados');
  };

  const handleAdicionarItens = () => {
    navigate(`/produtos?mesa=${mesaId}`);
  };

  const handleEditarItem = (itemId: number) => {
    // TODO: Implementar edição de item
    console.log("Editar item:", itemId);
  };

  const handleRemoverItem = (itemId: number) => {
    removeItemCompletely(itemId, cartId);
  };

  const handleAddToCart = (item: any) => {
    addToCart(item.productId, {
      name: item.name,
      price: item.price,
      image: item.image
    }, cartId);
  };

  const calcularTotal = () => {
    return getTotal(cartId);
  };

  const hasItensNaoEnviados = itensNaoEnviados.length > 0;

  // Debug: Log específico do estado do botão
  console.log('MesaDetailScreen - Button Debug:', {
    totalItens: cartItems.length,
    itensEnviados: itensEnviadosArray.length,
    itensNaoEnviados: itensNaoEnviados.length,
    hasItensEnviados,
    hasItensNaoEnviados,
    buttonShouldBeEnabled: hasItensEnviados,
    buttonShouldBeDisabled: !hasItensEnviados
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoltar}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-primary">MESA {mesaId}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCliente}
              className="text-primary hover:text-primary/90"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePesquisa}
              className="text-primary hover:text-primary/90"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleScanner}
              className="text-primary hover:text-primary/90"
            >
              <ScanLine className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSacola}
              className="text-primary hover:text-primary/90"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
            disabled={!hasItensNaoEnviados}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground flex items-center gap-2"
          >
            <ChefHat className="h-4 w-4" />
            Enviar Cozinha
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {itens.length === 0 ? (
          // Estado inicial - sem itens
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <p className="text-muted-foreground text-center">ainda não há nenhum item</p>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/90 hover:bg-primary/5 font-medium"
              onClick={handleAdicionarItens}
            >
              + ADICIONAR ITENS MESA
            </Button>
          </div>
        ) : (
          // Lista de itens unificada com CartScreen
          <div className="space-y-4">
            {cartItems.slice().reverse().map((item) => (
              <div
                key={item.productId}
                className={`p-4 rounded-lg border ${
                  item.enviado 
                    ? "bg-muted/50 border-muted" 
                    : "bg-card border-border shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      item.enviado ? "text-muted-foreground" : "text-primary"
                    }`}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
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
                    {item.enviado && (
                      <span className="text-xs text-muted-foreground mt-1 block">
                        ✓ Enviado para cozinha
                      </span>
                    )}
                  </div>
                  
                  {!item.enviado && (
                    <div className="flex items-center gap-2 ml-4">
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
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItemCompletely(item.productId, cartId)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        Remover
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Botão adicionar mais itens */}
            <Button
              onClick={handleAdicionarItens}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              ADICIONAR MAIS ITENS
            </Button>
          </div>
        )}
      </div>

      {/* Summary - só mostra quando tem itens */}
      {cartItems.length > 0 && (
        <div className="bg-background border-t border-border p-6 space-y-4">
          {/* Total */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-primary">
                Total da Mesa:
              </span>
              <span className="text-xl font-bold text-primary">
                R$ {calcularTotal().toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
              onClick={handleAdicionarItens}
            >
              CONTINUAR COMPRANDO
            </Button>
            
            {/* Botão Finalizar Pedido - só aparece se há itens enviados */}
            {hasItensEnviados && (
              <Button 
                className="w-full py-4 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleFinalizarPedido}
              >
                FINALIZAR PEDIDO
              </Button>
            )}
          </div>
        </div>
      )}

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

export default MesaDetailScreen;