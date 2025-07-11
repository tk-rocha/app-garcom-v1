import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Smartphone, Banknote } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

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
  const { getSubtotal, getDiscountAmount, getTaxAmount, getTotal } = useCart();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPixQR, setShowPixQR] = useState(false);

  // Customer info from previous screen
  const customerCpf = location.state?.cpf || "";

  // Calculate totals
  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const taxAmount = getTaxAmount();
  const total = getTotal();
  
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = Math.max(0, total - totalPaid);
  const change = totalPaid > total ? totalPaid - total : 0;
  
  const canFinalize = remaining === 0;

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentAmount("");
    setShowPixQR(false);
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setPaymentAmount(sanitized);
  };

  const processPayment = async () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
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
        description: `${method.name}: R$ ${amount.toFixed(2).replace(".", ",")}`,
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
    if (!canFinalize) return;
    
    toast({
      title: "Pedido finalizado!",
      description: "Venda realizada com sucesso.",
    });
    
    // Navigate to success screen or reset
    navigate("/balcao");
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
            onClick={() => navigate("/cpf")}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">PAGAMENTO</h1>
          
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
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
                  placeholder="0,00"
                  className="text-lg text-center"
                  inputMode="decimal"
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
                      <span className="font-medium">R$ {payment.amount.toFixed(2).replace(".", ",")}</span>
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
                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxas:</span>
                  <span>R$ {taxAmount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto:</span>
                  <span>- R$ {discountAmount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-primary font-medium">
                <span>Pago:</span>
                <span>R$ {totalPaid.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Faltante:</span>
                <span className={remaining > 0 ? "text-red-500" : "text-green-600"}>
                  R$ {remaining.toFixed(2).replace(".", ",")}
                </span>
              </div>
              {change > 0 && (
                <div className="flex justify-between text-accent font-medium">
                  <span>Troco:</span>
                  <span>R$ {change.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finalize Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          onClick={handleFinalizeOrder}
          disabled={!canFinalize}
          className={`w-full py-4 text-lg font-semibold ${
            canFinalize
              ? "bg-[#180F33] text-[#FFC72C] hover:bg-[#180F33]/90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          FINALIZAR COMPRA
        </Button>
      </div>
    </div>
  );
};

export default PaymentScreen;