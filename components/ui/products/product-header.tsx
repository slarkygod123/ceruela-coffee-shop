import { CoffeeProduct } from "@/lib/types/coffee-product";

interface ProductHeaderProps {
  product: CoffeeProduct;
  formatPrice: (price: number) => string;
}

export function ProductHeader({ product, formatPrice }: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold text-amber-900">{product.name}</h1>
      <span className="text-3xl font-bold text-amber-900">
        {formatPrice(product.price)}
      </span>
    </div>
  );
}