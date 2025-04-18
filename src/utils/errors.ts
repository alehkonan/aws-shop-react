import { isAxiosError, HttpStatusCode } from "axios";

/**
 * Dispatches alert event in case of network error
 */
export function handleNetworkError(error: unknown) {
  if (isAxiosError(error)) {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      window.dispatchEvent(
        new CustomEvent<AlertDetail>("alert", {
          detail: {
            message:
              "Status code is 401 Unauthorized. Please, check if token exists",
          },
        })
      );
      return;
    }
    if (error.response?.status === HttpStatusCode.Forbidden) {
      window.dispatchEvent(
        new CustomEvent<AlertDetail>("alert", {
          detail: {
            message:
              "Status code is 403 Forbidden. Please, check if token is valid",
          },
        })
      );
      return;
    }
  }
}
