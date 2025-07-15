
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AutorizacaoScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");

  // Generate correct password based on today's date (ddmmNext)
  const generateTodayPassword = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${day}${month}Next`;
  };

  const handleConfirm = () => {
    const correctPassword = generateTodayPassword();
    
    if (password === correctPassword) {
      navigate("/configuracoes-base-dados");
    } else {
      toast({
        variant: "destructive",
        title: "Senha incorreta",
        description: "Digite a senha correta para acessar as configurações.",
      });
      setPassword("");
    }
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
          AUTORIZAÇÃO
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 space-y-6">
            {/* Lock Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#E1E1E5] rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-[#180F33]" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Digite a senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-center text-lg border-[#E1E1E5] focus:border-[#180F33]"
                onKeyPress={(e) => e.key === 'Enter' && handleConfirm()}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
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

export default AutorizacaoScreen;
