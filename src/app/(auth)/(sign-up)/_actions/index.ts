import { TRegisterUser } from "@/types/user.type";
import {  fetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<TRegisterUser, "id">) =>
      fetcher.post<TRegisterUser>("/auth/register", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
