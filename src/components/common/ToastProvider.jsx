import AppToaster from "@/components/common/AppToaster";

/** Mounts global toast UI (react-toastify). */
export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}
