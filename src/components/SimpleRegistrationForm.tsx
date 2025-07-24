import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

function SimpleRegistrationForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Simple Registration: Starting registration process...');

    // Sign up with Supabase Auth
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: form.phone,
          location: form.location,
          user_type: 'owner'
        }
      }
    });

    setLoading(false);

    if (signUpError) {
      console.error('Simple Registration: Error:', signUpError);
      toast({
        title: "Registration Error",
        description: signUpError.message,
        variant: "destructive"
      });
    } else {
      console.log('Simple Registration: Success!');
      toast({
        title: "Registration Successful!",
        description: "Please check your email to verify your account."
      });
      setForm({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        location: ""
      });
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          name="fullName" 
          placeholder="Full Name" 
          value={form.fullName} 
          onChange={handleChange} 
          required 
        />
        <Input 
          name="phone" 
          placeholder="Phone/WhatsApp" 
          value={form.phone} 
          onChange={handleChange} 
          required 
        />
        <Input 
          name="location" 
          placeholder="Location" 
          value={form.location} 
          onChange={handleChange} 
          required 
        />
        <Input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handleChange} 
          required 
        />
        <Input 
          name="password" 
          type="password" 
          placeholder="Password (min 6 characters)" 
          value={form.password} 
          onChange={handleChange} 
          required 
          minLength={6} 
        />
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full"
        >
          {loading ? "Registering..." : "Create Account"}
        </Button>
      </form>
    </Card>
  );
}

export default SimpleRegistrationForm;