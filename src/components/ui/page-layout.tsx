import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen bg-[#E1E1E5] flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export default PageLayout;