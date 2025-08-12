import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Mock products with barcodes
const productsWithBarcodes = [
  { id: 1, name: "Coca Cola", price: 8.00, image: "/api/placeholder/80/80", barcode: "7891234567890" },
  { id: 2, name: "Sprite", price: 7.50, image: "/api/placeholder/80/80", barcode: "7891234567891" },
  { id: 3, name: "Fanta Laranja", price: 7.50, image: "/api/placeholder/80/80", barcode: "7891234567892" },
  { id: 4, name: "Água Mineral", price: 4.00, image: "/api/placeholder/80/80", barcode: "7891234567893" },
  { id: 5, name: "Chocolate", price: 12.00, image: "/api/placeholder/80/80", barcode: "7891234567894" },
];

const BarcodeScannerScreen = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [scanResult, setScanResult] = useState("");
  const { getProductQuantity, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    if (isScanning) {
      // Simulate barcode scanning
      const timer = setTimeout(() => {
        const randomBarcode = "7891234567890"; // Simulate scanned barcode
        setScanResult(randomBarcode);
        
        // Find product by barcode
        const product = productsWithBarcodes.find(p => p.barcode === randomBarcode);
        
        if (product) {
          setScannedProduct(product);
        }
        
        setIsScanning(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  const handleProductClick = (product: any) => {
    navigate(`/produto/${product.id}`, { 
      state: { 
        product, 
        categoryId: null // Scanner não tem categoria específica
      } 
    });
  };

  const handleAddToCart = (product: any) => {
    addToCart(product.id, {
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const handleScanAgain = () => {
    setIsScanning(true);
    setScannedProduct(null);
    setScanResult("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-primary">CÓDIGO DE BARRAS</h1>
          
          <div className="w-10" />
        </div>
      </div>

      {isScanning ? (
        /* Scanner Interface */
        <div className="flex-1 bg-black text-white flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="relative">
            {/* Scanner Frame */}
            <div className="w-64 h-64 border-4 border-white rounded-lg relative overflow-hidden">
              {/* Animated scanning line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent animate-pulse"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent animate-pulse"></div>
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-accent animate-pulse"></div>
              <div className="absolute top-0 bottom-0 right-0 w-1 bg-accent animate-pulse"></div>
              
              {/* Scanning laser effect */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent animate-pulse transform -translate-y-1/2"></div>
            </div>
          </div>
          
          <p className="text-center mt-6 text-lg">
            Aponte a câmera para o código de barras do produto
          </p>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-300">Escaneando...</p>
          </div>
        </div>
      ) : scannedProduct ? (
        /* Product Found */
        <div className="p-4 space-y-6">
          <div className="text-center py-4">
            <p className="text-green-600 font-semibold">Produto encontrado!</p>
            <p className="text-sm text-gray-600">Código: {scanResult}</p>
          </div>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div 
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => handleProductClick(scannedProduct)}
                >
                  <img
                    src={scannedProduct.image}
                    alt={scannedProduct.name}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                  />
                </div>
                
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleProductClick(scannedProduct)}
                >
                  <h3 className="font-medium text-gray-900">{scannedProduct.name}</h3>
                  <p className="text-lg font-semibold text-primary">
                    R$ {scannedProduct.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  {getProductQuantity(scannedProduct.id) === 0 ? (
                    <Button
                      onClick={() => handleAddToCart(scannedProduct)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                    >
                      ADICIONAR
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-3 border border-primary rounded-md p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(scannedProduct.id)}
                        className="h-8 w-8 text-primary hover:bg-primary/5"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium text-primary min-w-[20px] text-center">
                        {getProductQuantity(scannedProduct.id)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddToCart(scannedProduct)}
                        className="h-8 w-8 text-primary hover:bg-primary/5"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/5"
              onClick={handleScanAgain}
            >
              Escanear Novamente
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate(-1)}
            >
              Concluído
            </Button>
          </div>
        </div>
      ) : (
        /* Product Not Found */
        <div className="p-4 space-y-6">
          <div className="text-center py-8">
            <p className="text-red-600 font-semibold">Produto não encontrado</p>
            <p className="text-gray-600 mt-2">Código: {scanResult}</p>
            <p className="text-sm text-gray-500 mt-4">Tente novamente.</p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/5"
              onClick={handleScanAgain}
            >
              Tentar Novamente
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate(-1)}
            >
              Voltar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerScreen;