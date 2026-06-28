import { toast } from "react-toastify";

export const showToast = ({ message, type = "info", duration = 250 }) => {
  const options = { autoClose: duration, position: "top-right" };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    default:
      toast.info(message, options);
      break;
  }
};
