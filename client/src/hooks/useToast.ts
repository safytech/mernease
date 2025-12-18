import Swal from "sweetalert2";

export const coloredToast = (
  type: "success" | "error" | "warning" | "info",
  title: string
) => {
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showCloseButton: true,
    background: "transparent",
    customClass: {
      popup: `ta-toast ta-toast-${type}`,
      title: "ta-toast-title",
      closeButton: "ta-toast-close",
    },
  });

  toast.fire({
    icon: type,
    title,
  });
};
