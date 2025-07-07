<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div
      class="bg-white dark:bg-[#20233f] p-8 font-serif rounded-lg shadow-lg text-center max-w-xl w-full"
    >
      <h1
        class="w-full text-xl font-bold text-left text-gray-800 dark:text-[#F3F3F3] mb-4"
      >
        Welcome back!
      </h1>

      <!-- Login Form -->
      <form @submit.prevent="login" class="space-y-4">
        <!-- Email Input -->
        <div class="relative">
          <label class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >Email</label
          >
          <div class="relative">
            <input
              placeholder="user@example.com"
              v-model="email"
              type="email"
              class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              :disabled="isLoading"
              required
            />
            <Icon
              name="ic:baseline-email"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 dark:text-[#F3F3F3]"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="relative">
          <label
            class="block text-sm text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >Password</label
          >
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter a password"
              required
              minlength="8"
              class="w-full px-4 py-1.5 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              :disabled="isLoading"
            />
            <Icon
              name="ic:baseline-lock"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg focus:text-black text-gray-500 dark:text-[#F3F3F3]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-[#F3F3F3]"
              :disabled="isLoading"
            >
              <Icon
                :name="
                  showPassword
                    ? 'ic:baseline-visibility-off'
                    : 'ic:baseline-visibility'
                "
              />
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
            Minimum 8 characters
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-500 text-sm text-left">
          {{ errorMessage }}
        </div>

        <!-- Signin Button -->
        <button
          type="submit"
          class="w-full bg-black dark:bg-[#B9FF66] text-white dark:text-[#191A23] font-semibold px-6 py-2 rounded-lg hover:bg-[#191A23] dark:hover:bg-[#A0E55C] transition duration-300 disabled:opacity-50"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Sign in</span>
          <span v-else class="flex items-center justify-center">
            <Icon name="eos-icons:loading" class="mr-2" /> Signing in...
          </span>
        </button>

        <!-- Forgot Password Link -->
        <div class="text-right">
          <NuxtLink to="/" class="text-sm text-[#B9FF66] hover:underline">
            Forgot password?
          </NuxtLink>
        </div>
      </form>

      <!-- Signup Link -->
      <p class="text-center text-gray-600 dark:text-[#F3F3F3] mt-6">
        Don't have an account?
        <NuxtLink to="/signup" class="text-[#B9FF66] hover:underline"
          >Sign up</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import backendAPI from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
const authStore = useAuthStore();

onMounted(() => {
  authStore.hydrate();
});

const login = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    // Basic client-side validation
    if (!email.value.trim()) {
      throw new Error("Please enter your email");
    }
    if (!password.value) {
      throw new Error("Please enter your password");
    }

    const response = await backendAPI.post("/auth/login", {
      email: email.value.trim().toLowerCase(),
      password: password.value,
    });

    const {
      user,
      access_token,
      refresh_token,
      expires_in,
      is_verified,
      user_type,
    } = response.data;

    // Check if email is verified (keeping your original verification check)
    if ((response.data.is_verified = false)) {
      authStore.setVerificationEmail(email.value.trim().toLowerCase());
      return await navigateTo(
        `/verify/${user_type}?email=${encodeURIComponent(
          email.value.trim().toLowerCase()
        )}`
      );
    }

    // Store tokens and user data
    authStore.setTokens(access_token, refresh_token, expires_in);
    authStore.setUser(response.data.user);

    // Keeping your original navigation logic exactly as you had it
    switch (user.role) {
      case "admin":
        await navigateTo("/admin");
        break;
      case "maid":
        await navigateTo("/");
        break;
      case "household":
        await navigateTo("/");
        break;
      case "employee":
        await navigateTo("/mod");
        break;
      default:
        throw new Error("Unknown user role");
    }
  } catch (error) {
    // Enhanced error handling while keeping your original structure
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        if (data.error === "This email is not registered.") {
          errorMessage.value =
            "This email is not registered. Please sign up first.";
        } else if (data.error === "Incorrect password.") {
          const remainingAttempts = data.remaining_attempts || 0;
          errorMessage.value = `Incorrect password. ${
            remainingAttempts > 0
              ? `You have ${remainingAttempts} ${
                  remainingAttempts === 1 ? "attempt" : "attempts"
                } remaining.`
              : "No attempts remaining. Please try again later."
          }`;
        }
      } else if (status === 429) {
        errorMessage.value =
          data.error || "Too many login attempts. Please try again later.";
      } else if (status === 403) {
        // Keeping your original unverified email handling
        authStore.setVerificationEmail(email.value.trim().toLowerCase());
        const userType = error.response?.data?.user_type || "2";
        await navigateTo(
          `/verify/${userType}?email=${encodeURIComponent(
            email.value.trim().toLowerCase()
          )}`
        );
        return;
      } else {
        errorMessage.value = data.message || "Login failed. Please try again.";
      }
    } else {
      errorMessage.value =
        error.message ||
        "Login failed. Please check your connection and try again.";
    }
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: "custom",
});
</script>

<style scoped>
/* Custom loading spinner style */
.eos-icons.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
