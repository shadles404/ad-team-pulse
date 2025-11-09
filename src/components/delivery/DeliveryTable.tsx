import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Search } from "lucide-react";
import { Delivery } from "@/types/delivery";
import { EditDeliveryDialog } from "./EditDeliveryDialog";
import { format } from "date-fns";

interface DeliveryTableProps {
  deliveries: Delivery[];
  onUpdate: (id: string, updates: Partial<Delivery>) => void;
  onDelete: (id: string) => void;
}

export const DeliveryTable = ({ deliveries, onUpdate, onDelete }: DeliveryTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);

  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.celebName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.deliveryStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "Sent":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Delivery Records</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Celebrity Name</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No delivery records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.celebName}</TableCell>
                      <TableCell>{delivery.productName}</TableCell>
                      <TableCell>{delivery.quantity}</TableCell>
                      <TableCell>{format(new Date(delivery.dateSent), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(delivery.deliveryStatus)}>
                          {delivery.deliveryStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {delivery.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingDelivery(delivery)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(delivery.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingDelivery && (
        <EditDeliveryDialog
          delivery={editingDelivery}
          open={!!editingDelivery}
          onOpenChange={(open) => !open && setEditingDelivery(null)}
          onSave={(updates) => {
            onUpdate(editingDelivery.id, updates);
            setEditingDelivery(null);
          }}
        />
      )}
    </>
  );
};
