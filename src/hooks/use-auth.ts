import { useSyncExternalStore } from "react";
import { getCurrentUser, subscribeAuthState } from "@/store/auth-store";

function getServerSnapshot() {
  return null;
}

export function useAuthUser() {
  return useSyncExternalStore(subscribeAuthState, getCurrentUser, getServerSnapshot);
}
