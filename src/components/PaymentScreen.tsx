import React, { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Smartphone, Banknote } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency as formatBRL } from "@/lib/utils";

interface Payment {
  id: string;
  method: string;
  amount: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  allowsPartial: boolean;
  allowsOverpayment: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "cash",
    name: "Dinheiro",
    icon: <Banknote className="h-6 w-6" />,
    allowsPartial: true,
    allowsOverpayment: true,
  },
  {
    id: "debit_tef",
    name: "Débito TEF",
    icon: <CreditCard className="h-6 w-6" />,
    allowsPartial: true,
    allowsOverpayment: false,
  },
  {
    id: "credit_tef",
    name: "Crédito TEF",
    icon: <CreditCard className="h-6 w-6" />,
    allowsPartial: true,
    allowsOverpayment: false,
  },
  {
    id: "meal_voucher",
    name: "Vale Alimentação",
    icon: <CreditCard className="h-6 w-6" />,
    allowsPartial: true,
    allowsOverpayment: false,
  },
  {
    id: "pix",
    name: "PIX",
    icon: <Smartphone className="h-6 w-6" />,
    allowsPartial: true,
    allowsOverpayment: false,
  },
  {
    id: "debit_pos",
    name: "Débito POS",
    icon: <CreditCard className="h-6 w-6" />,
    allowsPartial: true,
    allowsOverpayment: false,
  },
  {
    id: "credit_pos",
    name: "Crédito POS",
    icon: <CreditCard className="h-6 w-6" />,
    allowsPartial: true,
    allowsOverpayment: false,
  },
];

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { getSubtotal, getDiscountAmount, getTaxAmount, getServiceFeeAmount, getTotal, ensureMesaServiceFee, setServiceFee } = useCart();
  const { toast } = useToast();
  
  const mesaId = searchParams.get('mesa') || location.state?.mesa;
  const comandaId = searchParams.get('comanda') || location.state?.comanda;
  
  console.log('PaymentScreen - Component loaded');
  console.log('PaymentScreen - Location state:', location.state);
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPixQR, setShowPixQR] = useState(false);
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);

  // Customer info from previous screen
  const customerCpf = location.state?.cpf || "";

  // Calculate totals - use mesa or comanda cart if available
  const cartId = comandaId ? `comanda-${comandaId}` : mesaId ? `mesa-${mesaId}` : 'balcao';
  
  // Ensure Mesa orders have automatic 10% service fee
  React.useEffect(() => {
    if (mesaId) {
      ensureMesaServiceFee(cartId);
    }
  }, [mesaId, cartId, ensureMesaServiceFee]);
  
  const subtotal = getSubtotal(cartId);
  const discountAmount = getDiscountAmount(cartId);
  const taxAmount = getTaxAmount(cartId);
  const serviceFeeAmount = getServiceFeeAmount(cartId);
  const total = getTotal(cartId);
  
  console.log('PaymentScreen - Valores detalhados:', {
    subtotal,
    serviceFeeAmount,
    discountAmount,
    taxAmount,
    total,
    cartId,
    isMesa: cartId.startsWith('mesa-')
  });
  
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Round to 2 decimal places to avoid floating-point precision issues
  const roundedTotal = Math.round(total * 100) / 100;
  const roundedTotalPaid = Math.round(totalPaid * 100) / 100;
  const remaining = Math.max(0, roundedTotal - roundedTotalPaid);
  const change = roundedTotalPaid > roundedTotal ? roundedTotalPaid - roundedTotal : 0;
  
  // Use tolerance for finalization check (accept differences smaller than 1 cent)
  const canFinalize = remaining < 0.01;
  
  // Debug logs for troubleshooting
  console.log('PaymentScreen - Payment calculations:', {
    total: total,
    roundedTotal: roundedTotal,
    totalPaid: totalPaid,
    roundedTotalPaid: roundedTotalPaid,
    remaining: remaining,
    canFinalize: canFinalize
  });

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentAmount("");
    setShowPixQR(false);
  };

  // Format currency as user types (Brazilian format)
  const formatCurrency = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Convert to number and divide by 100 to get decimal places
    const number = parseInt(numericValue) / 100;
    
    // Format with Brazilian locale (R$ and comma as decimal separator)
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    setPaymentAmount(formatted);
  };

  const processPayment = async () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method || !paymentAmount) return;

    // Parse amount from Brazilian currency format (R$ 1.234,56)
    const numericString = paymentAmount.replace(/[^\d,]/g, '').replace(',', '.');
    const amount = parseFloat(numericString);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para o pagamento.",
        variant: "destructive",
      });
      return;
    }

    // Validate overpayment
    if (!method.allowsOverpayment && amount > remaining) {
      toast({
        title: "Valor não permitido",
        description: "Não é possível pagar um valor maior do que o total nesta forma de pagamento.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing based on method
      if (selectedMethod === "pix") {
        setShowPixQR(true);
        // Simulate PIX processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        setShowPixQR(false);
      } else if (selectedMethod.includes("tef") || selectedMethod.includes("pos")) {
        // Simulate card processing
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Add payment to list
      const newPayment: Payment = {
        id: Date.now().toString(),
        method: method.name,
        amount: amount,
      };

      setPayments(prev => [...prev, newPayment]);
      setSelectedMethod("");
      setPaymentAmount("");

      toast({
        title: "Pagamento processado",
        description: `${method.name}: ${formatBRL(amount)}`,
      });
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizeOrder = () => {
    if (!canFinalize || isFinalizingOrder) return;
    
    console.log('=== FINALIZAR COMPRA - DEBUG INICIO ===');
    
    // Log de cada variável individual
    console.log('subtotal:', subtotal, 'tipo:', typeof subtotal);
    console.log('discountAmount:', discountAmount, 'tipo:', typeof discountAmount);
    console.log('taxAmount:', taxAmount, 'tipo:', typeof taxAmount);
    console.log('total:', total, 'tipo:', typeof total);
    console.log('payments:', payments, 'tipo:', typeof payments, 'length:', payments?.length);
    console.log('customerCpf:', customerCpf, 'tipo:', typeof customerCpf);
    
    // Validação básica dos dados essenciais
    if (total === null || total === undefined || isNaN(total)) {
      console.error('ERRO: Total inválido:', total);
      toast({
        title: "Erro na finalização",
        description: "Total da venda inválido. Tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    if (!Array.isArray(payments) || payments.length === 0) {
      console.error('ERRO: Pagamentos inválidos:', payments);
      toast({
        title: "Erro na finalização",
        description: "Nenhum pagamento encontrado. Adicione pelo menos um pagamento.",
        variant: "destructive",
      });
      return;
    }
    
    if (subtotal === null || subtotal === undefined || isNaN(subtotal)) {
      console.error('ERRO: Subtotal inválido:', subtotal);
      toast({
        title: "Erro na finalização",
        description: "Subtotal da venda inválido. Tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    setIsFinalizingOrder(true);
    
    try {
      // Prepare sale data for the completion screen
      const saleData = {
        subtotal,
        discountAmount,
        taxAmount,
        serviceFeeAmount,
        total,
        payments,
        customerCpf,
        mesa: mesaId,
        comanda: comandaId,
      };
      
      console.log('saleData completo:', JSON.stringify(saleData, null, 2));
      console.log('Navegando para /venda-finalizada...');
      
      // Navigate to sale completed screen with data
      navigate("/venda-finalizada", { state: { saleData } });
      
      console.log('Navegação executada com sucesso');
      
    } catch (error) {
      console.error('ERRO durante a navegação:', error);
      setIsFinalizingOrder(false);
      
      toast({
        title: "Erro na finalização",
        description: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
    
    console.log('=== FINALIZAR COMPRA - DEBUG FIM ===');
  };

  const removePayment = (paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId));
  };

  return (
    <div className="min-h-screen bg-[#E1E1E5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              if (comandaId) {
                navigate(`/cpf?comanda=${comandaId}`);
              } else if (mesaId) {
                navigate(`/cpf?mesa=${mesaId}`);
              } else {
                navigate("/cpf");
              }
            }}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">
            {comandaId ? `PAGAMENTO - COMANDA ${comandaId}` : mesaId ? `PAGAMENTO - MESA ${mesaId}` : "PAGAMENTO"}
          </h1>
          
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Payment Methods */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Formas de Pagamento</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                variant={selectedMethod === method.id ? "default" : "outline"}
                className={`h-16 flex flex-col items-center justify-center space-y-2 ${
                  selectedMethod === method.id
                    ? "bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary/5"
                }`}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                {method.icon}
                <span className="text-sm font-medium">{method.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        {selectedMethod && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Valor a pagar
                </Label>
                <Input
                  id="amount"
                  value={paymentAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="R$ 0,00"
                  className="text-lg text-center"
                  inputMode="numeric"
                />
              </div>
              
              <Button
                onClick={processPayment}
                disabled={!paymentAmount || isProcessing}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isProcessing ? "Processando..." : "Confirmar Pagamento"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* PIX QR Code Modal */}
        {showPixQR && (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">QR Code PIX</span>
              </div>
              <p className="text-gray-600">Aguardando pagamento via PIX...</p>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        {payments.length > 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Pagamentos Realizados</h3>
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">{payment.method}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{formatBRL(payment.amount)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePayment(payment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Summary */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Resumo Financeiro</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatBRL(subtotal)}</span>
              </div>
              {/* Service Fee for Mesa orders */}
              {mesaId && serviceFeeAmount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxa de Serviço (10%):</span>
                  <div className="flex items-center space-x-2">
                    <span>{formatBRL(serviceFeeAmount)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setServiceFee(null, cartId)}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      title="Remover Taxa de Serviço"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}
              {mesaId && serviceFeeAmount === 0 && (
                <div className="flex justify-between cursor-pointer text-blue-600" onClick={() => {
                  setServiceFee({
                    id: 'mesa-service',
                    name: 'Taxa de Serviço',
                    type: 'percentage',
                    value: 10
                  }, cartId);
                }}>
                  <span>+ Adicionar Taxa de Serviço (10%)</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div className="flex justify-between cursor-pointer" onClick={() => {
                  const params = new URLSearchParams();
                  if (comandaId) params.set('comanda', comandaId);
                  else if (mesaId) params.set('mesa', mesaId);
                  navigate(`/taxas${params.toString() ? '?' + params.toString() : ''}`);
                }}>
                  <span className="text-gray-600">Taxas:</span>
                  <span>{formatBRL(taxAmount)}</span>
                </div>
              )}
              {taxAmount === 0 && (
                <div className="flex justify-between cursor-pointer text-blue-600" onClick={() => {
                  const params = new URLSearchParams();
                  if (comandaId) params.set('comanda', comandaId);
                  else if (mesaId) params.set('mesa', mesaId);
                  navigate(`/taxas${params.toString() ? '?' + params.toString() : ''}`);
                }}>
                  <span>+ Adicionar Taxa</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 cursor-pointer" onClick={() => {
                  const params = new URLSearchParams();
                  if (comandaId) params.set('comanda', comandaId);
                  else if (mesaId) params.set('mesa', mesaId);
                  navigate(`/desconto${params.toString() ? '?' + params.toString() : ''}`);
                }}>
                  <span>Desconto:</span>
                  <span>- {formatBRL(discountAmount)}</span>
                </div>
              )}
              {discountAmount === 0 && (
                <div className="flex justify-between cursor-pointer text-blue-600" onClick={() => {
                  const params = new URLSearchParams();
                  if (comandaId) params.set('comanda', comandaId);
                  else if (mesaId) params.set('mesa', mesaId);
                  navigate(`/desconto${params.toString() ? '?' + params.toString() : ''}`);
                }}>
                  <span>+ Adicionar Desconto</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatBRL(total)}</span>
              </div>
              <div className="flex justify-between text-primary font-medium">
                <span>Pago:</span>
                <span>{formatBRL(totalPaid)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Faltante:</span>
                <span className={remaining > 0.01 ? "text-red-500" : "text-green-600"}>
                  {formatBRL(remaining < 0.01 ? 0 : remaining)}
                </span>
              </div>
              {change > 0 && (
                <div className="flex justify-between text-accent font-medium">
                  <span>Troco:</span>
                  <span>{formatBRL(change)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finalize Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4" style={{paddingBottom: "env(safe-area-inset-bottom)"}}>
        <Button
          onClick={handleFinalizeOrder}
          disabled={!canFinalize || isFinalizingOrder}
          className={`w-full py-4 text-lg font-semibold ${
            canFinalize && !isFinalizingOrder
              ? "bg-[#180F33] text-[#FFC72C] hover:bg-[#180F33]/90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isFinalizingOrder ? "FINALIZANDO..." : "FINALIZAR COMPRA"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentScreen;