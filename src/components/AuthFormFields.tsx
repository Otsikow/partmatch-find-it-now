
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, Phone, MapPin } from "lucide-react";

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  userType: string;
}

interface AuthFormFieldsProps {
  isLogin: boolean;
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
}

const AuthFormFields = ({ isLogin, formData, onInputChange }: AuthFormFieldsProps) => {
  return (
    <>
      {!isLogin && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-sm sm:text-base font-inter">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                required={!isLogin}
                className="mt-1 text-base border-blue-200 focus:border-blue-400"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm sm:text-base font-inter">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                required={!isLogin}
                className="mt-1 text-base border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="userType" className="text-sm sm:text-base font-inter">I am a *</Label>
            <Select value={formData.userType} onValueChange={(value) => onInputChange('userType', value)}>
              <SelectTrigger className="mt-1 text-base border-blue-200 focus:border-blue-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Car Owner</SelectItem>
                <SelectItem value="supplier">Parts Supplier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm sm:text-base font-inter">Phone/WhatsApp *</Label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+233 20 123 4567"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                required={!isLogin}
                className="mt-1 pl-10 text-base border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="text-sm sm:text-base font-inter">Location *</Label>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="location"
                placeholder="e.g. Accra, Kumasi"
                value={formData.location}
                onChange={(e) => onInputChange('location', e.target.value)}
                required={!isLogin}
                className="mt-1 pl-10 text-base border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <Label htmlFor="email" className="text-sm sm:text-base font-inter">Email *</Label>
        <div className="relative">
          <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            required
            className="mt-1 pl-10 text-base border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="text-sm sm:text-base font-inter">Password *</Label>
        <div className="relative">
          <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            required
            className="mt-1 pl-10 text-base border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>
    </>
  );
};

export default AuthFormFields;
