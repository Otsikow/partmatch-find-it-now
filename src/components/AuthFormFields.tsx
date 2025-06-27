
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, Phone, MapPin, User } from "lucide-react";

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

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <Label htmlFor="userType" className="text-sm sm:text-base font-inter font-semibold text-blue-800 flex items-center gap-2">
              <User className="h-4 w-4" />
              Select Your Account Type *
            </Label>
            <Select value={formData.userType} onValueChange={(value) => onInputChange('userType', value)}>
              <SelectTrigger className="mt-2 text-base border-blue-200 focus:border-blue-400 bg-white">
                <SelectValue placeholder="Choose your account type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-blue-200 shadow-lg">
                <SelectItem value="owner" className="hover:bg-blue-50">
                  <div className="flex flex-col">
                    <span className="font-medium text-blue-700">🛒 Buyer</span>
                    <span className="text-sm text-gray-600">Find and purchase car parts</span>
                  </div>
                </SelectItem>
                <SelectItem value="supplier" className="hover:bg-orange-50">
                  <div className="flex flex-col">
                    <span className="font-medium text-orange-700">🏪 Seller</span>
                    <span className="text-sm text-gray-600">Sell and supply car parts</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin" className="hover:bg-purple-50">
                  <div className="flex flex-col">
                    <span className="font-medium text-purple-700">⚙️ Administrator</span>
                    <span className="text-sm text-gray-600">Manage platform and users</span>
                  </div>
                </SelectItem>
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
