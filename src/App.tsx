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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
