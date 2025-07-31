import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";

const QuantidadePessoasScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Determine if this is a mesa or comanda based on the current path
  const isMesa = location.pathname.includes('/mesa/');
  const isComanda = location.pathname.includes('/comanda/');
  
  const itemId = id || (isMesa ? "1" : "100");
  const cartId = isMesa ? `mesa-${itemId}` : `comanda-${itemId}`;
  const storageKey = isMesa ? `mesa-${itemId}-pessoas` : `comanda-${itemId}-pessoas`;
  
  const { getSubtotal, getTaxAmount, getTotal, getServiceFeeAmount } = useCart();
  const [numeroPessoas, setNumeroPessoas] = useState(1);

  // Load saved number of people on component mount
  useEffect(() => {
    const savedPessoas = localStorage.getItem(storageKey);
    if (savedPessoas) {
      setNumeroPessoas(parseInt(savedPessoas, 10));
    }
  }, [storageKey]);

  const subtotal = getSubtotal(cartId);
  const taxa = isMesa ? getServiceFeeAmount(cartId) : getTaxAmount(cartId);
  const total = getTotal(cartId);
  const totalPorPessoa = total / numeroPessoas;

  const handleVoltar = () => {
    if (isMesa) {
      navigate(`/mesa/${itemId}`);
    } else {
      navigate(`/comanda/${itemId}`);
    }
  };

  const handleDecrementar = () => {
    if (numeroPessoas > 1) {
      setNumeroPessoas(numeroPessoas - 1);
    }
  };

  const handleIncrementar = () => {
    setNumeroPessoas(numeroPessoas + 1);
  };

  const handleConferenciaMesa = () => {
    // Save number of people and mark table/comanda as reviewed
    localStorage.setItem(storageKey, numeroPessoas.toString());
    const reviewedKey = isMesa ? `mesa-${itemId}-reviewed` : `comanda-${itemId}-reviewed`;
    localStorage.setItem(reviewedKey, 'true');
    console.log(`${isMesa ? 'Mesa' : 'Comanda'} ${itemId} marked as reviewed with ${numeroPessoas} people`);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('pessoasUpdated'));
    
    handleVoltar();
  };

  const handleConfirmar = () => {
    // Save number of people
    localStorage.setItem(storageKey, numeroPessoas.toString());
    console.log(`${isMesa ? 'Mesa' : 'Comanda'} ${itemId} saved with ${numeroPessoas} people`);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('pessoasUpdated'));
    
    handleVoltar();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoltar}
            className="absolute left-0 text-[#180F33]"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-[#180F33]">QUANTIDADE PESSOAS</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto">
        {/* Card de Resumo */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#180F33] font-medium">Subtotal</span>
                <span className="text-[#180F33] font-semibold">
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              {(isMesa || taxa > 0) && (
                <div className="flex justify-between items-center">
                  <span className="text-[#180F33] font-medium">
                    Taxa (10%)
                  </span>
                  <span className="text-[#180F33] font-semibold">
                    R$ {taxa.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#180F33] font-medium">Total</span>
                  <span className="text-[#180F33] font-bold text-lg">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[#180F33] font-bold text-lg">TOTAL POR PESSOA</span>
                  <span className="text-[#180F33] font-bold text-xl">
                    R$ {totalPorPessoa.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seletor de Pessoas */}
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrementar}
            disabled={numeroPessoas <= 1}
            className="w-12 h-12 border-[#180F33] text-[#180F33] hover:bg-[#180F33]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-6 w-6" />
          </Button>
          
          <div className="w-20 h-12 flex items-center justify-center border-2 border-[#180F33] rounded-md">
            <span className="text-2xl font-bold text-[#180F33]">
              {numeroPessoas}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrementar}
            className="w-12 h-12 border-[#180F33] text-[#180F33] hover:bg-[#180F33]/10"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Botões Inferiores */}
        <div className="space-y-4 pb-4">
          <Button
            onClick={handleConferenciaMesa}
            className="w-full py-4 text-lg font-semibold bg-[#180F33] text-[#FFC72C] hover:bg-[#180F33]/90"
          >
            Conferência de {isMesa ? 'Mesa' : 'Comanda'}
          </Button>
          
          <div className="flex gap-4">
            <Button
              onClick={handleVoltar}
              variant="outline"
              className="flex-1 py-4 text-lg font-semibold border-[#180F33] text-[#180F33] hover:bg-[#180F33]/10"
            >
              Voltar
            </Button>
            
            <Button
              onClick={handleConfirmar}
              className="flex-1 py-4 text-lg font-semibold bg-[#180F33] text-white hover:bg-[#180F33]/90"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantidadePessoasScreen;