import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Search, ScanLine, ShoppingBag, Users, ChefHat, Plus } from "lucide-react";
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
  const { getCartItems, removeItemCompletely } = useCart();
  const cartItems = getCartItems(cartId);
  
  const [numeroPessoas, setNumeroPessoas] = useState(1);
  const [itensEnviados, setItensEnviados] = useState<Set<number>>(new Set());
  const [showPendingItemsDialog, setShowPendingItemsDialog] = useState(false);

  // Converte CartItems para ItemMesa
  const itens: ItemMesa[] = cartItems.map(item => ({
    id: item.productId,
    nome: item.name,
    quantidade: item.quantity,
    precoUnitario: item.price,
    enviado: itensEnviados.has(item.productId)
  }));

  // Debug: Log do estado dos itens para verificar se há itens marcados como enviados
  console.log('MesaDetailScreen - Cart Items:', cartItems);
  console.log('MesaDetailScreen - Itens Enviados Set:', itensEnviados);
  console.log('MesaDetailScreen - Itens:', itens);
  console.log('MesaDetailScreen - Itens enviados:', itens.filter(item => item.enviado));
  console.log('MesaDetailScreen - hasItensEnviados:', itens.filter(item => item.enviado).length > 0);

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
    const itensEnviadosArray = itens.filter(item => item.enviado);
    const itensNaoEnviados = itens.filter(item => !item.enviado);
    
    if (itensEnviadosArray.length === 0) {
      // Não há itens enviados para cozinha
      return;
    }
    
    if (itensNaoEnviados.length > 0) {
      // Há itens pendentes, mostrar modal de confirmação
      setShowPendingItemsDialog(true);
    } else {
      // Todos os itens foram enviados
      navigate(`/cpf?mesa=${mesaId}`, { state: { mesa: mesaId } });
    }
  };

  const handleConfirmWithPendingItems = () => {
    // Remove itens não enviados do carrinho
    const itensNaoEnviados = itens.filter(item => !item.enviado);
    itensNaoEnviados.forEach(item => {
      removeItemCompletely(item.id, cartId);
    });
    setShowPendingItemsDialog(false);
    navigate(`/cpf?mesa=${mesaId}`, { state: { mesa: mesaId } });
  };

  const handleEditarPessoas = () => {
    navigate(`/mesa/${mesaId}/pessoas`);
  };

  const handleEnviarCozinha = () => {
    // Marca todos os itens como enviados
    const newItensEnviados = new Set(itensEnviados);
    itens.forEach(item => {
      newItensEnviados.add(item.id);
    });
    setItensEnviados(newItensEnviados);
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
    // Remove também do set de itens enviados se estiver lá
    const newItensEnviados = new Set(itensEnviados);
    newItensEnviados.delete(itemId);
    setItensEnviados(newItensEnviados);
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.quantidade * item.precoUnitario), 0);
  };

  const itensNaoEnviados = itens.filter(item => !item.enviado);
  const itensEnviadosArray = itens.filter(item => item.enviado);
  const hasItensNaoEnviados = itensNaoEnviados.length > 0;
  const hasItensEnviados = itensEnviadosArray.length > 0;

  // Debug: Log específico do estado do botão
  console.log('MesaDetailScreen - Button Debug:', {
    hasItens: itens.length > 0,
    hasItensEnviados,
    hasItensNaoEnviados,
    buttonShouldBeEnabled: hasItensEnviados,
    buttonShouldBeDisabled: !hasItensEnviados
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoltar}
              className="text-[#180F33]"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-[#180F33]">MESA {mesaId}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCliente}
              className="text-[#180F33]"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePesquisa}
              className="text-[#180F33]"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleScanner}
              className="text-[#180F33]"
            >
              <ScanLine className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSacola}
              className="text-[#180F33]"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-4">
          <Button
            onClick={handleEditarPessoas}
            className="flex-1 bg-[#180F33] text-white hover:bg-[#180F33]/90 flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {numeroPessoas} Pessoa{numeroPessoas !== 1 ? 's' : ''}
          </Button>
          <Button
            onClick={handleEnviarCozinha}
            disabled={!hasItensNaoEnviados}
            className="flex-1 bg-[#180F33] text-white hover:bg-[#180F33]/90 disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2"
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
            <p className="text-gray-500 text-center">ainda não há nenhum item</p>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/90 hover:bg-primary/5 font-medium"
              onClick={handleAdicionarItens}
            >
              + ADICIONAR ITENS MESA
            </Button>
          </div>
        ) : (
          // Lista de itens
          <div className="space-y-4">
            {itens.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border ${
                  item.enviado 
                    ? "bg-[#E1E1E5] border-gray-300" 
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      item.enviado ? "text-gray-600" : "text-[#180F33]"
                    }`}>
                      {item.nome}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-sm ${
                        item.enviado ? "text-gray-500" : "text-gray-600"
                      }`}>
                        Qtd: {item.quantidade}
                      </span>
                      <span className={`text-sm ${
                        item.enviado ? "text-gray-500" : "text-gray-600"
                      }`}>
                        Unitário: R$ {item.precoUnitario.toFixed(2)}
                      </span>
                      <span className={`text-sm font-medium ${
                        item.enviado ? "text-gray-600" : "text-[#180F33]"
                      }`}>
                        Total: R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                      </span>
                    </div>
                    {item.enviado && (
                      <span className="text-xs text-gray-500 mt-1 block">
                        ✓ Enviado para cozinha
                      </span>
                    )}
                  </div>
                  
                  {!item.enviado && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditarItem(item.id)}
                        className="text-[#180F33] hover:bg-[#180F33]/10"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoverItem(item.id)}
                        className="text-red-600 hover:bg-red-50"
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
              className="w-full border-[#180F33] text-[#180F33] hover:bg-[#180F33]/10 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              ADICIONAR MAIS ITENS
            </Button>
            
            {/* Total */}
            {itens.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-[#180F33]">
                    Total da Mesa:
                  </span>
                  <span className="text-xl font-bold text-[#180F33]">
                    R$ {calcularTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            )}
            
            {/* Botão Finalizar Pedido */}
            {itens.length > 0 && (
              <div className="mt-4">
                <Button
                  onClick={handleFinalizarPedido}
                  disabled={!hasItensEnviados}
                  className={`w-full py-4 text-lg font-semibold ${
                    hasItensEnviados
                      ? "bg-[#180F33] text-[#FFC72C] hover:bg-[#180F33]/90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  FINALIZAR PEDIDO
                </Button>
              </div>
            )}
          </div>
        )}
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

export default MesaDetailScreen;