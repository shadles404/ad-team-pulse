import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DELIVERY_STATUSES } from "@/types/delivery";

interface DeliveryFormProps {
  onSubmit: (delivery: any) => void;
  userId: string;
}

export const DeliveryForm = ({ onSubmit, userId }: DeliveryFormProps) => {
  const [formData, setFormData] = useState({
    celebName: "",
    productName: "",
    quantity: 1,
    dateSent: new Date().toISOString().split("T")[0],
    deliveryStatus: "Pending",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      userId,
      dateSent: new Date(formData.dateSent).toISOString(),
    });
    setFormData({
      celebName: "",
      productName: "",
      quantity: 1,
      dateSent: new Date().toISOString().split("T")[0],
      deliveryStatus: "Pending",
      notes: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Delivery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="celebName">Celebrity Name *</Label>
              <Input
                id="celebName"
                value={formData.celebName}
                onChange={(e) => setFormData({ ...formData, celebName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateSent">Date Sent *</Label>
              <Input
                id="dateSent"
                type="date"
                value={formData.dateSent}
                onChange={(e) => setFormData({ ...formData, dateSent: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryStatus">Delivery Status *</Label>
              <Select
                value={formData.deliveryStatus}
                onValueChange={(value) => setFormData({ ...formData, deliveryStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
            />
          </div>

          <Button type="submit" className="w-full">Add Delivery</Button>
        </form>
      </CardContent>
    </Card>
  );
};
