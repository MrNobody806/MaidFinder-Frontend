import { useAuthStore } from "@/stores/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  const adminRoutes = ["/admin", "/dashboard"];

  if (adminRoutes.includes(to.path) && auth.userRole !== "admin") {
    return navigateTo("/forbidden");
  }
});
