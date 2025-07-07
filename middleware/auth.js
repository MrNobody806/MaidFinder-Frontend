import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore(); // Or any other auth technique

  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }
});
