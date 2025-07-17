
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { sampleParts } from '@/utils/sampleParts';
import { Package, Upload } from 'lucide-react';

const AdminPartSeeder = () => {
  const { user, userType } = useAuth();
  const [loading, setLoading] = useState(false);
  const [seededParts, setSeededParts] = useState<string[]>([]);

  const seedParts = async () => {
    if (!user || userType !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only admins can seed sample parts.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    console.log('Starting to seed sample parts for admin user:', user.id);

    try {
      // First, ensure the admin user has a profile
      console.log('Checking/creating admin profile...');
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        console.log('Creating admin profile...');
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            first_name: 'Admin',
            last_name: 'User',
            user_type: 'admin',
            is_verified: true,
            phone: '+233200000000',
            location: 'Accra, Ghana'
          });

        if (profileError) {
          console.error('Error creating admin profile:', profileError);
          throw profileError;
        }
        console.log('Admin profile created successfully');
      } else {
        console.log('Admin profile exists:', existingProfile);
      }

      // Clear existing seeded parts first
      console.log('Clearing existing parts for admin...');
      const { error: deleteError } = await supabase
        .from('car_parts')
        .delete()
        .eq('supplier_id', user.id);

      if (deleteError) {
        console.error('Error clearing existing parts:', deleteError);
      }

      const insertPromises = sampleParts.map(async (part) => {
        const partData = {
          supplier_id: user.id,
          title: part.title,
          description: part.description,
          make: part.make,
          model: part.model,
          year: part.year,
          part_type: part.partType,
          condition: part.condition,
          price: parseFloat(part.price),
          currency: part.currency || 'GHS',
          country: part.country || 'GH',
          address: part.address,
          images: [part.imageUrl],
          status: 'available'
        };

        console.log('Inserting part:', partData.title, 'with data:', partData);

        const { data, error } = await supabase
          .from('car_parts')
          .insert([partData])
          .select()
          .single();

        if (error) {
          console.error('Error inserting part:', partData.title, error);
          throw error;
        }

        console.log('Successfully inserted part:', data);
        return data.title;
      });

      const results = await Promise.all(insertPromises);
      setSeededParts(results);

      // Verify the parts were actually inserted and are retrievable
      console.log('Verifying inserted parts...');
      const { data: allParts, error: fetchError } = await supabase
        .from('car_parts')
        .select(`
          *,
          profiles!inner(first_name, last_name, is_verified)
        `)
        .eq('supplier_id', user.id);

      console.log('Verification query result:', allParts);
      if (fetchError) {
        console.error('Error in verification query:', fetchError);
      }

      // Also test the main fetch query
      console.log('Testing main fetch query...');
      const { data: testFetch, error: testError } = await supabase
        .from('car_parts')
        .select(`
          id,
          supplier_id,
          title,
          description,
          make,
          model,
          year,
          part_type,
          condition,
          price,
          currency,
          images,
          latitude,
          longitude,
          address,
          created_at,
          updated_at,
          status,
          profiles!inner(
            first_name,
            last_name,
            phone,
            location,
            profile_photo_url,
            is_verified,
            rating,
            total_ratings
          )
        `)
        .eq('status', 'available');

      console.log('Main fetch test result:', testFetch);
      if (testError) {
        console.error('Error in main fetch test:', testError);
      }

      toast({
        title: "Parts Seeded Successfully!",
        description: `Added ${results.length} sample car parts to the marketplace.`,
      });

    } catch (error: any) {
      console.error('Error seeding parts:', error);
      toast({
        title: "Seeding Failed",
        description: error.message || "Failed to seed sample parts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (userType !== 'admin') {
    return null;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Admin Part Seeder
        </CardTitle>
        <p className="text-gray-600">
          Add 5 sample car parts to the marketplace for testing
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Sample Parts to be Added:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              {sampleParts.map((part, index) => (
                <li key={index}>
                  • {part.title} - GHS {part.price}
                </li>
              ))}
            </ul>
          </div>

          {seededParts.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Successfully Added:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                {seededParts.map((title, index) => (
                  <li key={index}>✓ {title}</li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={seedParts}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Seeding Parts...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Seed 5 Sample Parts (Clear & Recreate)
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPartSeeder;
