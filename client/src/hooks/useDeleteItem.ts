import Swal from "sweetalert2";
import { coloredToast } from "@/hooks/useToast";
import { useApi } from "@/api";

/**
 * Handles confirmation and deletion of records with toast and refetch.
 */
export const useDeleteItem = (refetch: () => void) => {
  const api = useApi();

  const confirmAndDelete = (url: string, successMessage = "Deleted successfully") => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton: "ta-btn ta-btn-danger",
        cancelButton: "ta-btn ta-btn-secondary",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.delete(url);
          if (res.data.success) {
            coloredToast("success", successMessage);
            refetch();
          }
        } catch {
          coloredToast("error", "Failed to delete item");
        }
      }
    });
  };

  return { confirmAndDelete };
};
