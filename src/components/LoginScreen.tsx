import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import waiterBackground from "@/assets/waiter-background.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Garcom {
  id: string;
  nome: string;
  usuario: string;
  ativo: boolean;
}

const LoginScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [password, setPassword] = useState("");
  const [garcons, setGarcons] = useState<Garcom[]>([]);
  const [loading, setLoading] = useState(true);
  const { login, isLoading } = useAuth();

  // Load garcons from database
  useEffect(() => {
    const loadGarcons = async () => {
      try {
        const { data, error } = await supabase
          .from('garcons')
          .select('id, nome, usuario, ativo')
          .eq('ativo', true)
          .order('nome');

        if (error) {
          console.error('Error loading garcons:', error);
          toast.error('Erro ao carregar garçons');
          return;
        }

        setGarcons(data || []);
        if (data && data.length > 0) {
          setSelectedUser(data[0].usuario);
        }
      } catch (error) {
        console.error('Error loading garcons:', error);
        toast.error('Erro ao conectar com o banco de dados');
      } finally {
        setLoading(false);
      }
    };

    loadGarcons();
  }, []);

  const handleLogin = async () => {
    if (!selectedUser || !password) {
      toast.error('Selecione um garçom e digite a senha');
      return;
    }

    try {
      const success = await login(selectedUser, password);
      
      if (success) {
        toast.success('Login realizado com sucesso!');
        
        // Check if PDV needs to be opened
        const pdvClosed = localStorage.getItem('pdvClosed');
        const lastOpeningDate = localStorage.getItem('lastOpeningDate');
        const today = new Date().toDateString();
        
        // If PDV was closed or it's a new day, require cash opening
        if (pdvClosed === 'true' || !lastOpeningDate || lastOpeningDate !== today) {
          console.log("PDV precisa ser aberto - redirecionando para abertura de caixa");
          localStorage.removeItem('pdvClosed'); // Clear the flag
          navigate("/abertura-caixa");
        } else {
          // PDV is already open for today, go directly to balcao
          console.log("PDV já está aberto - redirecionando para balcão");
          navigate("/balcao");
        }
      } else {
        toast.error('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${waiterBackground})` }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
            <p className="text-gray-600">Carregando garçons...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${waiterBackground})` }}>
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/c7dfd135-3029-4f5e-b4e3-c77ab375ae1f.png" 
            alt="The Cuisine Restaurant" 
            className="w-24 h-24 rounded-full shadow-lg"
          />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Sistema PDV
            </h1>
            <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
              <span>Garçom</span>
              <span className="text-xl">🧑‍🍳</span>
            </p>
          </div>

          {/* User Selection */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-center items-center gap-3 mb-4">
              {garcons.map((garcom) => (
                <button
                  key={garcom.usuario}
                  onClick={() => setSelectedUser(garcom.usuario)}
                  className={`relative transition-all duration-300 ${
                    garcom.usuario === selectedUser 
                      ? "scale-110" 
                      : "scale-100 opacity-60 hover:opacity-80"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ${
                    garcom.usuario === selectedUser 
                      ? "bg-primary" 
                      : "bg-gray-400"
                  }`}>
                    <User className="h-6 w-6" />
                  </div>
                  {garcom.usuario === selectedUser && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white"></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Selected user name */}
            <div className="text-center">
              <p className="text-gray-700 font-medium text-sm">
                {garcons.find(g => g.usuario === selectedUser)?.nome || 'Selecione um garçom'}
              </p>
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 text-base border-input bg-white"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={isLoading || !selectedUser}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'VERIFICANDO...' : 'CONFIRMAR (ENTER)'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;