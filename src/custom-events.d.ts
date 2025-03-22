type AlertDetail = {
  message: string;
} | null;

interface WindowEventMap {
  alert: CustomEvent<AlertDetail>;
}
