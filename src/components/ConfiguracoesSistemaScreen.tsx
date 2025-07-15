
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";

const ConfiguracoesSistemaScreen = () => {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({
    nfce: false,
    tef: false,
    ambienteSefaz: false // false = Homologação, true = Produção
  });

  const [formData, setFormData] = useState({
    cnpjLoja: "",
    urlIntegracao: "",
    identificadorRede: "",
    idKeySistema: "",
    urlConcentrador: "",
    periodoMaximoCancelamento: ""
  });

  const handleToggleChange = (field: string, value: boolean) => {
    setToggles(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = () => {
    navigate("/configuracoes-instalacao");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white flex items-center border-b border-[#E1E1E5]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-medium text-[#180F33] flex-1 text-center mr-10">
          CONFIGURAÇÕES DO SISTEMA
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 space-y-6">
            {/* Toggle Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#180F33]">
                  NFC-e
                </label>
                <Switch
                  checked={toggles.nfce}
                  onCheckedChange={(checked) => handleToggleChange("nfce", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#180F33]">
                  TEF
                </label>
                <Switch
                  checked={toggles.tef}
                  onCheckedChange={(checked) => handleToggleChange("tef", checked)}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  CNPJ da Loja
                </label>
                <Input
                  value={formData.cnpjLoja}
                  onChange={(e) => handleInputChange("cnpjLoja", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  URL de Integração
                </label>
                <Input
                  value={formData.urlIntegracao}
                  onChange={(e) => handleInputChange("urlIntegracao", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="https://api.exemplo.com.br"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  Identificador da Rede
                </label>
                <Input
                  value={formData.identificadorRede}
                  onChange={(e) => handleInputChange("identificadorRede", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="REDE001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  ID Key do Sistema
                </label>
                <Input
                  value={formData.idKeySistema}
                  onChange={(e) => handleInputChange("idKeySistema", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="SISTEMA123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  URL do Concentrador
                </label>
                <Input
                  value={formData.urlConcentrador}
                  onChange={(e) => handleInputChange("urlConcentrador", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="https://concentrador.exemplo.com.br"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#180F33]">
                  Ambiente SEFAZ: {toggles.ambienteSefaz ? "Produção" : "Homologação"}
                </label>
                <Switch
                  checked={toggles.ambienteSefaz}
                  onCheckedChange={(checked) => handleToggleChange("ambienteSefaz", checked)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  Período Máximo de Cancelamento (minutos)
                </label>
                <Input
                  type="number"
                  value={formData.periodoMaximoCancelamento}
                  onChange={(e) => handleInputChange("periodoMaximoCancelamento", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="30"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => navigate(-1)}
                className="flex-1 h-12 bg-[#180F33] hover:bg-[#180F33]/90 text-white font-medium"
              >
                VOLTAR
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 h-12 bg-[#180F33] hover:bg-[#180F33]/90 text-white font-medium"
              >
                CONFIRMAR
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfiguracoesSistemaScreen;
