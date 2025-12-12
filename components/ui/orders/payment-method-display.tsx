// components/orders/PaymentMethodDisplay.tsx

interface PaymentMethodDisplayProps {
  method: string;
}

export function PaymentMethodDisplay({ method }: PaymentMethodDisplayProps) {
  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'gcash':
        return '💳';
      case 'maya':
        return '📱';
      case 'credit_card':
        return '💳';
      case 'bank_transfer':
        return '🏦';
      case 'cash_on_delivery':
        return '💰';
      default:
        return '💳';
    }
  };

  return (
    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded">
      <span className="text-lg mr-2">{getPaymentMethodIcon(method)}</span>
      <span className="capitalize">{method.replace('_', ' ')}</span>
    </div>
  );
}