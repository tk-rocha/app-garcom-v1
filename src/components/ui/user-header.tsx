import { useAuth } from "@/contexts/AuthContext";

interface UserHeaderProps {
  greeting?: string;
  className?: string;
}

const UserHeader = ({ greeting = "Olá", className = "" }: UserHeaderProps) => {
  const { user } = useAuth();

  return (
    <div className={`p-6 bg-white ${className}`}>
      <h1 className="text-xl font-medium text-gray-800">
        {greeting}, {user?.name || 'Usuário'}
      </h1>
    </div>
  );
};

export default UserHeader;