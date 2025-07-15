
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowLeft } from "lucide-react";

const ConfiguracoesInstalacaoScreen = () => {
  const navigate = useNavigate();
  const [novaInstalacao, setNovaInstalacao] = useState(true); // true = Nova, false = Existente
  const [tipoInstalacaoImpressora, setTipoInstalacaoImpressora] = useState("driver");
  
  const [formData, setFormData] = useState({
    numeroPdv: "",
    numeroSerie: "",
    nomeImpressora: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinuar = () => {
    // Redireciona para a tela de login
    navigate("/");
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
          INSTALAÇÃO
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 space-y-6">
            {/* Toggle para tipo de instalação */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#180F33]">
                  Tipo de Instalação: {novaInstalacao ? "Nova Instalação" : "Instalação Existente"}
                </label>
                <Switch
                  checked={novaInstalacao}
                  onCheckedChange={setNovaInstalacao}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  Número do PDV
                </label>
                <Input
                  value={formData.numeroPdv}
                  onChange={(e) => handleInputChange("numeroPdv", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  Número de Série
                </label>
                <Input
                  value={formData.numeroSerie}
                  onChange={(e) => handleInputChange("numeroSerie", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="ABC123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  Nome da Impressora
                </label>
                <Input
                  value={formData.nomeImpressora}
                  onChange={(e) => handleInputChange("nomeImpressora", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="EPSON TM-T20"
                />
              </div>

              {/* Tipo de Instalação da Impressora */}
              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-4">
                  Tipo de Instalação da Impressora
                </label>
                <ToggleGroup
                  type="single"
                  value={tipoInstalacaoImpressora}
                  onValueChange={(value) => value && setTipoInstalacaoImpressora(value)}
                  className="justify-start gap-4"
                >
                  <ToggleGroupItem
                    value="driver"
                    className="h-12 px-6 border-2 border-[#E1E1E5] data-[state=on]:border-[#180F33] data-[state=on]:bg-[#180F33] data-[state=on]:text-white"
                  >
                    Driver
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="escpos"
                    className="h-12 px-6 border-2 border-[#E1E1E5] data-[state=on]:border-[#180F33] data-[state=on]:bg-[#180F33] data-[state=on]:text-white"
                  >
                    ESC/POS
                  </ToggleGroupItem>
                </ToggleGroup>
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
                onClick={handleContinuar}
                className="flex-1 h-12 bg-[#180F33] hover:bg-[#180F33]/90 text-white font-medium"
              >
                CONTINUAR
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfiguracoesInstalacaoScreen;
