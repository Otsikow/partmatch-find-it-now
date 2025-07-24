// **Step 7: Country-Specific Payment Methods**

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, Building, Bitcoin } from 'lucide-react';
import { getPaymentMethodsForCountry, PaymentMethod } from '@/lib/countryConfig';
import { useTranslation } from 'react-i18next';

interface PaymentMethodSelectorProps {
  countryCode: string;
  selectedMethod?: string;
  onMethodSelect: (method: PaymentMethod) => void;
  onContinue?: () => void;
}

const getPaymentIcon = (type: PaymentMethod['type']) => {
  switch (type) {
    case 'mobile_money': return <Smartphone className="h-5 w-5" />;
    case 'card': return <CreditCard className="h-5 w-5" />;
    case 'bank_transfer': return <Building className="h-5 w-5" />;
    case 'crypto': return <Bitcoin className="h-5 w-5" />;
    default: return <CreditCard className="h-5 w-5" />;
  }
};

const PaymentMethodSelector = ({ 
  countryCode, 
  selectedMethod, 
  onMethodSelect, 
  onContinue 
}: PaymentMethodSelectorProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>(selectedMethod || '');
  const paymentMethods = getPaymentMethodsForCountry(countryCode);

  const handleMethodChange = (methodId: string) => {
    setSelected(methodId);
    const method = paymentMethods.find(m => m.id === methodId);
    if (method) {
      onMethodSelect(method);
    }
  };

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            No payment methods available for this country yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Choose Payment Method
        </CardTitle>
        <CardDescription>
          Select your preferred payment method for this transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selected} onValueChange={handleMethodChange} className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-3">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label 
                htmlFor={method.id} 
                className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getPaymentIcon(method.type)}
                  <span className="text-lg">{method.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{method.name}</div>
                  {method.provider && (
                    <div className="text-sm text-muted-foreground">
                      via {method.provider}
                    </div>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {onContinue && selected && (
          <Button onClick={onContinue} className="w-full mt-4">
            Continue with {paymentMethods.find(m => m.id === selected)?.name}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;