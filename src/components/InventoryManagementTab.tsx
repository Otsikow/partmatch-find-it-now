import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InventoryManagementTabProps {
  parts: CarPart[];
  onRefresh: () => void;
}

export const InventoryManagementTab = ({ parts, onRefresh }: InventoryManagementTabProps) => {
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<CarPart | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [updating, setUpdating] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'status'>('name');
  const { toast } = useToast();

  const getStockStatus = (quantity: number, threshold: number = 2) => {
    if (quantity === 0) return { status: 'out', color: 'bg-red-500', label: 'Out of Stock' };
    if (quantity <= threshold) return { status: 'low', color: 'bg-yellow-500', label: 'Low Stock' };
    return { status: 'in', color: 'bg-green-500', label: 'In Stock' };
  };

  const sortedParts = useMemo(() => {
    const sorted = [...parts].sort((a, b) => {
      switch (sortBy) {
        case 'quantity':
          return (a.quantity || 0) - (b.quantity || 0);
        case 'status':
          const statusA = getStockStatus(a.quantity || 0).status;
          const statusB = getStockStatus(b.quantity || 0).status;
          const statusOrder = { out: 0, low: 1, in: 2 };
          return statusOrder[statusA as keyof typeof statusOrder] - statusOrder[statusB as keyof typeof statusOrder];
        default:
          return a.title.localeCompare(b.title);
      }
    });
    return sorted;
  }, [parts, sortBy]);

  const handleRestock = async () => {
    if (!selectedPart || newQuantity < 0) return;

    setUpdating(true);
    try {
      console.log('Restocking part:', selectedPart.id, 'with quantity:', newQuantity);
      
      const updateData: any = { 
        quantity: newQuantity,
        last_restocked_at: new Date().toISOString(),
      };

      // Reactivate part if it was hidden due to being out of stock
      if (newQuantity > 0 && selectedPart.status === 'hidden') {
        updateData.status = 'available';
      }

      const { data, error } = await supabase
        .from('car_parts')
        .update(updateData)
        .eq('id', selectedPart.id)
        .select()
        .single();

      if (error) {
        console.error('Restock error:', error);
        throw error;
      }

      console.log('Restock successful:', data);

      toast({
        title: "Stock Updated",
        description: `${selectedPart.title} quantity updated to ${newQuantity}`,
      });

      setRestockDialogOpen(false);
      setSelectedPart(null);
      setNewQuantity(1);
      onRefresh();
    } catch (error: any) {
      console.error('Restock failed:', error);
      toast({
        title: "Update Failed", 
        description: error.message || "Failed to update stock",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const openRestockDialog = (part: CarPart) => {
    console.log('Opening restock dialog for part:', part.title, 'current quantity:', part.quantity);
    setSelectedPart(part);
    setNewQuantity(part.quantity || 1);
    setRestockDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-600" />
          <h2 className="text-xl font-semibold">Inventory Management</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('name')}
          >
            Sort by Name
          </Button>
          <Button
            variant={sortBy === 'quantity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('quantity')}
          >
            Sort by Quantity
          </Button>
          <Button
            variant={sortBy === 'status' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('status')}
          >
            Low Stock First
          </Button>
        </div>
      </div>

      {parts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No parts in inventory yet</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedParts.map((part) => {
                const stock = getStockStatus(part.quantity || 0, part.low_stock_threshold);
                return (
                  <TableRow key={part.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {part.images && part.images.length > 0 ? (
                          <img
                            src={part.images[0]}
                            alt={part.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{part.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {part.make} {part.model} ({part.year})
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{part.part_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{part.quantity || 0}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stock.color}`} />
                        <span className="text-sm">{stock.label}</span>
                        {stock.status === 'low' && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        {stock.status === 'out' && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {part.last_restocked_at
                          ? new Date(part.last_restocked_at).toLocaleDateString()
                          : 'Never'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRestockDialog(part)}
                      >
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock - {selectedPart?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="newQuantity">New Quantity</Label>
              <Input
                id="newQuantity"
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setRestockDialogOpen(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button onClick={handleRestock} disabled={updating}>
                {updating ? "Updating..." : "Update Stock"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};