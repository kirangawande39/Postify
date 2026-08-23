import { toast } from "react-toastify";

export const handleError = (err) => {
  const status = err.response?.status;
  const message = err.response?.data?.message || "Something went wrong!";
  // console.error(`Error ${status}: ${message}`);
  toast.error(message);
};

