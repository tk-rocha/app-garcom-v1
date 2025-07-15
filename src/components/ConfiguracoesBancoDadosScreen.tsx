
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

const ConfiguracoesBancoDadosScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ipServidor: "",
    portaConexao: "",
    nomeBanco: "",
    login: "",
    senha: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = () => {
    navigate("/configuracoes-sistema");
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
          BASE DE DADOS
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  IP do Servidor
                </label>
                <Input
                  value={formData.ipServidor}
                  onChange={(e) => handleInputChange("ipServidor", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="Ex: 192.168.1.100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  Porta de Conexão
                </label>
                <Input
                  value={formData.portaConexao}
                  onChange={(e) => handleInputChange("portaConexao", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="Ex: 5432"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  Nome do Banco
                </label>
                <Input
                  value={formData.nomeBanco}
                  onChange={(e) => handleInputChange("nomeBanco", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="Ex: sistema_pdv"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  Login
                </label>
                <Input
                  value={formData.login}
                  onChange={(e) => handleInputChange("login", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="Ex: admin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#180F33] mb-2">
                  Senha
                </label>
                <Input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => handleInputChange("senha", e.target.value)}
                  className="h-12 border-[#E1E1E5] focus:border-[#180F33]"
                  placeholder="Digite a senha"
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

export default ConfiguracoesBancoDadosScreen;
