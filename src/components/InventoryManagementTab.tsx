import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, AlertTriangle, CheckCircle2, SortAsc } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface InventoryManagementTabProps {
  parts: CarPart[];
  onRefresh: () => void;
}

export const InventoryManagementTab = ({ parts: initialParts, onRefresh }: InventoryManagementTabProps) => {
  const [parts, setParts] = useState<CarPart[]>(initialParts);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<CarPart | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [updating, setUpdating] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'status'>('name');
  const { toast } = useToast();

  // Sync local parts state with prop changes
  useEffect(() => {
    setParts(initialParts);
  }, [initialParts]);

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

      // Optimistically update local state immediately
      setParts(prevParts => 
        prevParts.map(p => 
          p.id === selectedPart.id 
            ? { ...p, quantity: newQuantity, last_restocked_at: new Date().toISOString() }
            : p
        )
      );

      toast({
        title: "Stock Updated",
        description: `${selectedPart.title} quantity updated to ${newQuantity}`,
      });

      setRestockDialogOpen(false);
      setSelectedPart(null);
      setNewQuantity(1);
      
      // Also refresh the parent data
      setTimeout(() => {
        onRefresh();
      }, 100);
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

  const isMobile = useIsMobile();

  const InventoryCard = ({ part }: { part: CarPart }) => {
    const stock = getStockStatus(part.quantity || 0, part.low_stock_threshold);
    
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            {part.images && part.images.length > 0 ? (
              <img
                src={part.images[0]}
                alt={part.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm leading-tight mb-1 truncate">{part.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {part.make} {part.model} ({part.year})
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">{part.part_type}</Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Quantity</p>
              <p className="font-semibold text-sm">{part.quantity || 0}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${stock.color}`} />
                <span className="text-xs">{stock.label}</span>
                {stock.status === 'low' && (
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                )}
                {stock.status === 'out' && (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Last Restocked</p>
              <p className="text-xs">
                {part.last_restocked_at
                  ? new Date(part.last_restocked_at).toLocaleDateString()
                  : 'Never'}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openRestockDialog(part)}
              className="text-xs px-3 py-1 h-8"
            >
              Restock
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-600" />
          <h2 className="text-lg sm:text-xl font-semibold">Inventory Management</h2>
        </div>
        
        {/* Sort Controls */}
        {isMobile ? (
          <div className="w-full sm:w-auto">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'quantity' | 'status')}>
              <SelectTrigger className="w-full">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="quantity">Sort by Quantity</SelectItem>
                <SelectItem value="status">Low Stock First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
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
        )}
      </div>

      {/* Empty State */}
      {parts.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm sm:text-base">No parts in inventory yet</p>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          {isMobile ? (
            <div className="grid gap-4">
              {sortedParts.map((part) => (
                <InventoryCard key={part.id} part={part} />
              ))}
            </div>
          ) : (
            /* Desktop Table Layout */
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[250px]">Part</TableHead>
                      <TableHead className="min-w-[120px]">Category</TableHead>
                      <TableHead className="min-w-[100px]">Quantity</TableHead>
                      <TableHead className="min-w-[140px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Last Restocked</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
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
                                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-medium truncate">{part.title}</p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {part.make} {part.model} ({part.year})
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="whitespace-nowrap">{part.part_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">{part.quantity || 0}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${stock.color}`} />
                              <span className="text-sm whitespace-nowrap">{stock.label}</span>
                              {stock.status === 'low' && (
                                <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                              )}
                              {stock.status === 'out' && (
                                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
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
                              className="whitespace-nowrap"
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
            </div>
          )}
        </>
      )}

      {/* Restock Dialog - Optimized for mobile */}
      <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-base line-clamp-2">
              Update Stock - {selectedPart?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedPart && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                {selectedPart.images && selectedPart.images.length > 0 ? (
                  <img
                    src={selectedPart.images[0]}
                    alt={selectedPart.title}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-background flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{selectedPart.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Current: {selectedPart.quantity || 0} units
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="newQuantity" className="text-sm">New Quantity</Label>
              <Input
                id="newQuantity"
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                className="text-base" // Better for mobile input
                autoFocus={!isMobile} // Avoid auto-focus on mobile to prevent keyboard issues
              />
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setRestockDialogOpen(false)}
                disabled={updating}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRestock} 
                disabled={updating}
                className="w-full sm:w-auto"
              >
                {updating ? "Updating..." : "Update Stock"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};