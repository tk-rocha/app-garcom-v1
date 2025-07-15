import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CashOpeningScreen from "./components/CashOpeningScreen";
import BalcaoScreen from "./components/BalcaoScreen";
import ProductListScreen from "./components/ProductListScreen";
import ProductDetailScreen from "./components/ProductDetailScreen";
import CartScreen from "./components/CartScreen";
import DiscountScreen from "./components/DiscountScreen";
import TaxScreen from "./components/TaxScreen";
import CPFScreen from "./components/CPFScreen";
import CustomerScreen from "./components/CustomerScreen";
import PaymentScreen from "./components/PaymentScreen";
import ProductSearchScreen from "./components/ProductSearchScreen";
import BarcodeScannerScreen from "./components/BarcodeScannerScreen";
import SaleCompletedScreen from "./components/SaleCompletedScreen";
import FuncoesScreen from "./components/FuncoesScreen";
import SangriaScreen from "./components/SangriaScreen";
import SuprimentoScreen from "./components/SuprimentoScreen";
import CancelarCupomScreen from "./components/CancelarCupomScreen";
import ConfirmarCancelamentoScreen from "./components/ConfirmarCancelamentoScreen";
import ReimpressaoScreen from "./components/ReimpressaoScreen";
import AutorizacaoScreen from "./components/AutorizacaoScreen";
import ConfiguracoesBancoDadosScreen from "./components/ConfiguracoesBancoDadosScreen";
import ConfiguracoesSistemaScreen from "./components/ConfiguracoesSistemaScreen";
import ConfiguracoesInstalacaoScreen from "./components/ConfiguracoesInstalacaoScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/abertura-caixa" element={<CashOpeningScreen />} />
            <Route path="/balcao" element={<BalcaoScreen />} />
            <Route path="/produtos" element={<ProductListScreen />} />
            <Route path="/produto/:id" element={<ProductDetailScreen />} />
            <Route path="/sacola" element={<CartScreen />} />
            <Route path="/desconto" element={<DiscountScreen />} />
            <Route path="/taxas" element={<TaxScreen />} />
            <Route path="/cpf" element={<CPFScreen />} />
            <Route path="/cliente" element={<CustomerScreen />} />
            <Route path="/pagamento" element={<PaymentScreen />} />
            <Route path="/pesquisar" element={<ProductSearchScreen />} />
            <Route path="/scanner" element={<BarcodeScannerScreen />} />
            <Route path="/venda-finalizada" element={<SaleCompletedScreen />} />
            <Route path="/funcoes" element={<FuncoesScreen />} />
            <Route path="/sangria" element={<SangriaScreen />} />
            <Route path="/suprimento" element={<SuprimentoScreen />} />
            <Route path="/cancelar-cupom" element={<CancelarCupomScreen />} />
            <Route path="/confirmar-cancelamento" element={<ConfirmarCancelamentoScreen />} />
            <Route path="/reimpressao" element={<ReimpressaoScreen />} />
            <Route path="/autorizacao" element={<AutorizacaoScreen />} />
            <Route path="/configuracoes-base-dados" element={<ConfiguracoesBancoDadosScreen />} />
            <Route path="/configuracoes-sistema" element={<ConfiguracoesSistemaScreen />} />
            <Route path="/configuracoes-instalacao" element={<ConfiguracoesInstalacaoScreen />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
