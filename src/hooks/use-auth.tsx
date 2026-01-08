import { useAuthStore } from "@/store/use-auth-store";
import type { User } from "@/lib/types";

export const useAuth = (): {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
} => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);

  return { user, isLoading, logout };
};
