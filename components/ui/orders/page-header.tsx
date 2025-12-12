import { Package } from "lucide-react";

interface PageHeaderProps {
  title?: string;
  description?: string;
}

export function PageHeader({ 
  title = "Order History", 
  description = "View all your past orders" 
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-2 flex items-center">
        <Package className="h-8 w-8 mr-3" />
        {title}
      </h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}