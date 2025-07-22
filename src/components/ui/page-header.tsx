import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const PageHeader = ({ title, onBack, showBackButton = true }: PageHeaderProps) => {
  // Convert to Title Case
  const formatTitle = (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        {showBackButton ? (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="text-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
        
        <h1 className="text-lg font-semibold text-primary text-center">
          {formatTitle(title)}
        </h1>
        
        <div className="w-10" />
      </div>
    </div>
  );
};

export default PageHeader;