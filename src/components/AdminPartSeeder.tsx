
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
          currency: 'GHS',
          address: part.address,
          images: [part.imageUrl],
          status: 'available'
        };

        console.log('Inserting part:', partData.title);

        const { data, error } = await supabase
          .from('car_parts')
          .insert([partData])
          .select()
          .single();

        if (error) {
          console.error('Error inserting part:', error);
          throw error;
        }

        console.log('Successfully inserted part:', data.title);
        return data.title;
      });

      const results = await Promise.all(insertPromises);
      setSeededParts(results);

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
                Seed 5 Sample Parts
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPartSeeder;
