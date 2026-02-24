import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { variables } from "@/utils/env";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";

interface PaymentEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  outstandingAmount?: number;
  onSuccess?: () => void;
}

export function PaymentEntryModal({
  isOpen,
  onClose,
  invoiceId,
  outstandingAmount = 0,
  onSuccess,
}: PaymentEntryModalProps) {
  const maxOutstanding = Number.isFinite(outstandingAmount)
    ? outstandingAmount
    : 0;
  const validationSchema = useMemo(
    () =>
      Yup.object({
        amount: Yup.number()
          .required("Amount is required")
          .positive("Amount must be greater than 0")
          .max(
            maxOutstanding,
            `Amount cannot exceed ${maxOutstanding.toFixed(2)}`,
          )
          .test(
            "decimal-places",
            "Amount can have at most 2 decimal places",
            (value) => {
              if (!value) return true;
              return /^\d+(\.\d{1,2})?$/.test(value.toString());
            },
          ),
        mode: Yup.string()
          .oneOf(
            ["Mobile Money", "Cash", "Credit Card", "Wire Transfer"],
            "Invalid payment mode",
          )
          .required("Payment mode is required"),
      }),
    [maxOutstanding],
  );
  const initialValues = useMemo(
    () => ({
      amount: maxOutstanding > 0 ? maxOutstanding.toFixed(2) : "",
      mode: "Cash" as "Mobile Money" | "Cash",
    }),
    [maxOutstanding],
  );
  const createPaymentMutation = useMutation({
    mutationFn: async (payload: { id: string; amount: number; mode: string }) =>
      await apiClient({
        url: `${variables().BUSINESS_API}/core/create/transaction`,
        method: "POST",
        data: payload,
      }),
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Error occurred. Try again";
      toast.error(errorMessage);
    },
    onSuccess: () => {
      toast.success("Payment Recorded Successfully");
      onSuccess?.();
      formik.resetForm();
      onClose();
    },
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload = {
        id: invoiceId,
        amount: Number(values.amount),
        mode: values.mode,
      };

      createPaymentMutation.mutate(payload);
    },
  });

  const handleClose = () => {
    if (!createPaymentMutation.isPending) {
      formik.resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment for invoice {invoiceId}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4 py-4">
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              label="Amount *"
              placeholder="Enter payment amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.amount && formik.errors.amount
                  ? formik.errors.amount
                  : undefined
              }
              max={maxOutstanding}
              disabled={createPaymentMutation.isPending}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Payment Mode *
              </label>
              <Select
                value={formik.values.mode}
                onValueChange={(value) => formik.setFieldValue("mode", value)}
                disabled={createPaymentMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Credit Card">Card</SelectItem>
                  <SelectItem value="Wire Transfer">Bank</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.mode && formik.errors.mode && (
                <p className="text-sm text-destructive">{formik.errors.mode}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createPaymentMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPaymentMutation.isPending}>
              {createPaymentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
