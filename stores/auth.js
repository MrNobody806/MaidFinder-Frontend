import backendApi from "@/networkServices/api/backendApi.js";
import { defineStore } from "pinia";
import { useCookie } from "#imports";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: "",
    email: "",
    verificationEmail: "",
    refreshToken: "",
    user: null,
    _hydrated: false,
  }),

  actions: {
    hydrate() {
      if (process.client) {
        const accessCookie = useCookie("access_token");
        const refreshCookie = useCookie("refresh_token");
        const userCookie = useCookie("user_data");

        this.accessToken = accessCookie.value;
        this.refreshToken = refreshCookie.value;

        try {
          this.user = userCookie.value ? JSON.parse(userCookie.value) : null;
        } catch (e) {
          console.error("Failed to parse user data:", e);
          this.user = null;
        }

        this._hydrated = true;
      }
    },

    async fetchUser() {
      if (!this.accessToken) return;

      try {
        const response = await backendApi.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

        this.setUser(response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user:", error);

        // Handle token expiration
        if (error.response?.status === 401) {
          try {
            await this.refreshToken();
            return await this.fetchUser();
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            this.logout();
            throw error;
          }
        }

        throw error;
      }
    },

    setTokens(accessToken, refreshToken, expiresIn) {
      const accessCookie = useCookie("access_token", {
        secure: true,
        sameSite: "strict",
        maxAge: expiresIn || 3600, // Default 24 hours
      });

      const refreshCookie = useCookie("refresh_token", {
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60, // 7 days
      });

      accessCookie.value = accessToken;
      refreshCookie.value = refreshToken;

      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    },

    setUser(user) {
      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        is_verified: user.is_verified,
        role: user.role,
        image_url: user.image_url || "/default-avatar.png",
      };
      this.user = data;
    },

    setVerificationEmail(email) {
      this.verificationEmail = email;
    },

    clearVerificationEmail() {
      this.verificationEmail = null;
    },

    setEmail(email) {
      this.email = email;
    },

    async logout() {
      try {
        // Call backend logout if token exists
        if (this.accessToken) {
          await backendApi.post(
            "/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
              },
            }
          );
        }
      } catch (error) {
        console.error("Logout API error:", error);
      } finally {
        const accessCookie = useCookie("access_token");
        const refreshCookie = useCookie("refresh_token");
        const userCookie = useCookie("user_data");

        accessCookie.value = null;
        refreshCookie.value = null;
        userCookie.value = null;

        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        this.verificationEmail = null;
      }
    },

    async refreshToken() {
      if (!this.refreshToken) {
        throw new Error("No refresh token available");
      }

      try {
        const response = await backendApi.post("/auth/refresh", {
          refresh_token: this.refreshToken,
        });

        this.setTokens(
          response.data.access_token,
          response.data.refresh_token,
          response.data.expires_in
        );

        // Refetch user data after token refresh
        await this.fetchUser();

        return true;
      } catch (error) {
        console.error("Token refresh failed:", error);
        this.logout();
        throw error;
      }
    },

    async checkVerificationStatus() {
      if (!this.user?.email) return false;

      try {
        const response = await backendApi.get(
          `/auth/verify-status?email=${encodeURIComponent(this.user.email)}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );
        return response.data.verified;
      } catch (error) {
        console.error("Verification check failed:", error);
        return false;
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken && !state.tokenExpired,
    currentUser: (state) => state.user,
    needsVerification: (state) => !!state.verificationEmail,
    hasRefreshToken: (state) => !!state.refreshToken,

    tokenExpired(state) {
      if (!state.accessToken) return true;
      try {
        const payload = JSON.parse(atob(state.accessToken.split(".")[1]));
        return payload.exp * 1000 < Date.now();
      } catch {
        return true;
      }
    },

    tokenExpiresSoon(state) {
      if (!state.accessToken) return true;
      try {
        const payload = JSON.parse(atob(state.accessToken.split(".")[1]));
        // Consider token expiring soon if it expires in less than 5 minutes
        return payload.exp * 1000 < Date.now() + 300000;
      } catch {
        return true;
      }
    },

    isHydrated: (state) => state._hydrated,
    userRole: (state) => state.user?.role || null,
    getVerificationEmail: (state) => state.verificationEmail,
  },
});
