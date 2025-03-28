import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

export function AlertProvider() {
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    const onAlert = (event: CustomEvent<AlertDetail>) => {
      setMessage(event.detail?.message);
    };
    window.addEventListener("alert", onAlert);
    return () => window.removeEventListener("alert", onAlert);
  }, []);

  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={2000}
      onClose={(_, reason) => reason === "timeout" && setMessage(undefined)}
    >
      <Alert severity="error">{message}</Alert>
    </Snackbar>
  );
}
