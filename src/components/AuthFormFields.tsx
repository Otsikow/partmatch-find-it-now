
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Phone, MapPin, User, Eye, EyeOff, Globe, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { useCountryDetection, Country, SUPPORTED_COUNTRIES } from "@/hooks/useCountryDetection";
import CountrySelector from "@/components/CountrySelector";

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  userType: string;
  country: string;
  city: string;
  language: string;
  currency: string;
}

interface AuthFormFieldsProps {
  isLogin: boolean;
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
}

const AuthFormFields = ({ isLogin, formData, onInputChange }: AuthFormFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { country: detectedCountry } = useCountryDetection();

  // Auto-set currency based on country selection
  useEffect(() => {
    if (formData.country) {
      const selectedCountry = SUPPORTED_COUNTRIES.find(c => c.name === formData.country);
      if (selectedCountry && selectedCountry.currency !== formData.currency) {
        onInputChange('currency', selectedCountry.currency);
      }
    }
  }, [formData.country, formData.currency, onInputChange]);

  // Auto-set detected country if none selected
  useEffect(() => {
    if (detectedCountry && !formData.country) {
      onInputChange('country', detectedCountry.name);
    }
  }, [detectedCountry, formData.country, onInputChange]);

  const handleCountrySelect = (country: Country) => {
    onInputChange('country', country.name);
    onInputChange('currency', country.currency);
  };

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
              <SelectTrigger className="mt-2 text-base border-blue-200 focus:border-blue-400 bg-background">
                <SelectValue placeholder="Choose your account type" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-blue-200 shadow-lg">
                <SelectItem value="owner" className="hover:bg-blue-50">
                  <div className="flex flex-col">
                    <span className="font-medium text-blue-700">🛒 Buyer</span>
                    <span className="text-sm text-muted-foreground">Find and purchase car parts</span>
                  </div>
                </SelectItem>
                <SelectItem value="supplier" className="hover:bg-orange-50">
                  <div className="flex flex-col">
                    <span className="font-medium text-orange-700">🏪 Seller</span>
                    <span className="text-sm text-muted-foreground">Sell and supply car parts</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm sm:text-base font-inter">Phone/WhatsApp *</Label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
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
               <MapPin className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
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

           {/* Country & Location Details */}
           <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
             <Label className="text-sm sm:text-base font-inter font-semibold text-green-800 flex items-center gap-2 mb-3">
               <Globe className="h-4 w-4" />
               Country & Location Details
             </Label>
             
             <div className="space-y-3">
               <div>
                 <Label htmlFor="country" className="text-sm font-inter">Country *</Label>
                 <div className="mt-1">
                   <CountrySelector
                     onCountrySelect={handleCountrySelect}
                     showTrigger={false}
                   >
                     <Button
                       type="button"
                       variant="outline"
                       className="w-full justify-start text-left border-blue-200 focus:border-blue-400"
                     >
                       <Globe className="h-4 w-4 mr-2" />
                       {formData.country ? (
                         <>
                           {SUPPORTED_COUNTRIES.find(c => c.name === formData.country)?.flag} {formData.country}
                         </>
                       ) : (
                         'Select your country'
                       )}
                     </Button>
                   </CountrySelector>
                 </div>
               </div>

               <div>
                 <Label htmlFor="city" className="text-sm font-inter">City *</Label>
                 <Input
                   id="city"
                   placeholder="e.g. Accra, Lagos, Nairobi"
                   value={formData.city}
                   onChange={(e) => onInputChange('city', e.target.value)}
                   required={!isLogin}
                   className="mt-1 text-base border-blue-200 focus:border-blue-400"
                 />
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <Label htmlFor="language" className="text-sm font-inter">Language</Label>
                   <Select value={formData.language} onValueChange={(value) => onInputChange('language', value)}>
                     <SelectTrigger className="mt-1 text-base border-blue-200 focus:border-blue-400">
                       <SelectValue placeholder="Select language" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="en">
                         <div className="flex items-center gap-2">
                           <Languages className="h-4 w-4" />
                           English
                         </div>
                       </SelectItem>
                       <SelectItem value="fr">
                         <div className="flex items-center gap-2">
                           <Languages className="h-4 w-4" />
                           Français
                         </div>
                       </SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                 <div>
                   <Label htmlFor="currency" className="text-sm font-inter">Currency</Label>
                   <Input
                     id="currency"
                     value={formData.currency}
                     readOnly
                     className="mt-1 text-base border-blue-200 bg-background"
                     placeholder="Auto-detected"
                   />
                 </div>
               </div>
             </div>
           </div>
        </>
      )}

      <div>
        <Label htmlFor="email" className="text-sm sm:text-base font-inter">Email *</Label>
        <div className="relative">
          <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
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
          <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            required
            className="mt-1 pl-10 pr-10 text-base border-blue-200 focus:border-blue-400"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AuthFormFields;
