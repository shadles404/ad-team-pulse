import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trash2 } from "lucide-react";
import { PaymentConfirmation } from "@/types/payment";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PaymentConfirmationTableProps {
  confirmations: PaymentConfirmation[];
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export const PaymentConfirmationTable = ({
  confirmations,
  onDelete,
  isAdmin,
}: PaymentConfirmationTableProps) => {
  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Celebrity Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead className="text-center">Job Completed</TableHead>
              <TableHead>Salary Amount</TableHead>
              <TableHead className="text-center">Confirmed</TableHead>
              <TableHead>Confirmed Date</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {confirmations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
                  className="text-center text-muted-foreground py-8"
                >
                  No payment confirmations yet
                </TableCell>
              </TableRow>
            ) : (
              confirmations.map((confirmation) => (
                <TableRow key={confirmation.id}>
                  <TableCell className="font-medium">
                    {confirmation.celebrity_name}
                  </TableCell>
                  <TableCell>{confirmation.phone_number}</TableCell>
                  <TableCell className="text-center">
                    {confirmation.job_completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${confirmation.salary.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </TableCell>
                  <TableCell>
                    {format(new Date(confirmation.confirmed_at), "PPP")}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this payment confirmation
                              for {confirmation.celebrity_name}? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(confirmation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
