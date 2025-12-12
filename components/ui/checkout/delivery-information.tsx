import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DeliveryformationProps {
  deliveryAddress: string;
  paymentMethod: string;
  onAddressChange: (address: string) => void;
  onPaymentChange: (method: string) => void;
}

export function ShippingInformation({
  deliveryAddress,
  paymentMethod,
  onAddressChange,
  onPaymentChange,
}: DeliveryformationProps) {
  const paymentMethods = [
    { value: "GCash", label: "GCash" },
    { value: "Maya", label: "Maya" },
    { value: "Bank_Transfer", label: "Bank Transfer" },
    { value: "Credit_Card", label: "Credit Card" },
    { value: "Cash_on_Delivery", label: "Cash on Delivery" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address *</Label>
          <Textarea
            id="address"
            placeholder="Enter your complete shipping address"
            value={deliveryAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={onPaymentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}