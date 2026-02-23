// Re-export Sonner toast with custom wrapper for convenience
import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    sonnerToast.error(message, { description });
  },
  info: (message: string, description?: string) => {
    sonnerToast.info(message, { description });
  },
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, { description });
  },
  message: (message: string, description?: string) => {
    sonnerToast.message(message, { description });
  },
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
  loading: sonnerToast.loading,
};

// Legacy compatibility - accepts title and description
export const useToast = () => {
  return {
    toast: ({
      title,
      description,
      variant,
    }: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      if (variant === "destructive") {
        return sonnerToast.error(title || "", { description });
      }
      return sonnerToast.message(title || "", { description });
    },
  };
};
