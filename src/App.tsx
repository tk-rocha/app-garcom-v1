import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CashOpeningScreen from "./components/CashOpeningScreen";
import BalcaoScreen from "./components/BalcaoScreen";
import ProductListScreen from "./components/ProductListScreen";
import ProductDetailScreen from "./components/ProductDetailScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/abertura-caixa" element={<CashOpeningScreen />} />
          <Route path="/balcao" element={<BalcaoScreen />} />
          <Route path="/produtos" element={<ProductListScreen />} />
          <Route path="/produto/:id" element={<ProductDetailScreen />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
