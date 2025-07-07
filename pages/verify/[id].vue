<template>
  <div
    class="mx-auto w-full p-4 md:p-8 lg:w-1/2 transition-colors duration-300"
  >
    <div class="h-full w-full py-6 md:py-10"></div>
    <form
      @submit.prevent="confirm"
      class="flex flex-col justify-between gap-4 px-4 py-2"
    >
      <p class="font-serif text-lg text-slate-800 dark:text-slate-200">
        Verification code sent to:
        <span class="font-semibold text-blue-600 dark:text-blue-400">{{
          emailToVerify
        }}</span>
      </p>

      <div>
        <input
          v-model="code"
          type="text"
          placeholder="Enter 6-digit verification code"
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          :disabled="isLoading"
          maxlength="6"
          inputmode="numeric"
          pattern="\d{6}"
          @input="validateCode"
        />
        <p
          v-if="errors.code"
          class="mt-1 text-sm text-red-500 dark:text-red-400"
        >
          {{ errors.code }}
        </p>
      </div>

      <button
        type="submit"
        class="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        :disabled="isLoading || !isCodeValid"
      >
        <div class="flex items-center justify-center">
          <span v-if="!isLoading">Verify Email</span>
          <Loader v-else />
        </div>
      </button>

      <div
        v-if="errorMessage"
        class="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-lg"
      >
        {{ errorMessage }}
      </div>

      <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Didn't receive a code?
        <button
          @click.prevent="resendCode"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-50"
          :disabled="isResending || resendCooldown > 0"
        >
          <span v-if="!isResending && resendCooldown <= 0">Resend code</span>
          <span v-else class="inline-flex items-center">
            <template v-if="isResending">
              <svg
                class="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600 dark:text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </template>
            <template v-else> Resend in {{ resendCooldown }}s </template>
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import backendAPI from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const store = useAuthStore();

// Custom loader component
const Loader = {
  template: `
    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  `,
};

const id = ref(route.params.id);
// const email = ref(router, params.email);
const code = ref("");
const isLoading = ref(false);
const isResending = ref(false);
const resendCooldown = ref(0);
const errorMessage = ref("");
const errors = ref({ code: "" });

// Get email from store or route query
const emailToVerify = computed(() => {
  return store.getVerificationEmail || route.query.email || store.email;
});

// Validate code format in real-time
const isCodeValid = computed(() => {
  return code.value.length === 6 && /^\d+$/.test(code.value);
});

// Countdown timer for resend cooldown
let cooldownInterval;
const startCooldown = () => {
  resendCooldown.value = 60; // 60 seconds cooldown
  cooldownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval);
    }
  }, 1000);
};

// Validate route on component mount
onMounted(() => {
  if (!["2", "3"].includes(id.value)) {
    errorMessage.value = "Invalid user type";
    return router.push("/signup");
  }

  if (!emailToVerify.value && !authstore.hasRefreshToken) {
    errorMessage.value =
      "Email verification session expired. Please register again.";
    setTimeout(() => router.push(`/signup/${id.value}`), 3000);
  }
  // Start cooldown timer on mount
  startCooldown();
});

// Cleanup interval on unmount
onUnmounted(() => {
  clearInterval(cooldownInterval);
});

const validateCode = () => {
  if (!code.value) {
    errors.value.code = "Verification code is required";
    return false;
  }
  if (code.value.length !== 6 || !/^\d+$/.test(code.value)) {
    errors.value.code = "Please enter a valid 6-digit code";
    return false;
  }
  errors.value.code = "";
  return true;
};

const confirm = async () => {
  if (!validateCode()) return;
  if (!emailToVerify.value) {
    errorMessage.value =
      "Email verification failed. Please try registering again.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await backendAPI.post("/auth/verify-email", {
      email: emailToVerify.value,
      verification_code: code.value,
    });

    if ((response.data.is_verified = true)) {
      // If user data is returned, store it
      if (response.data.user) {
        const { user, access_token, refresh_token, expires_in } = response.data;
        store.setTokens(access_token, refresh_token, expires_in);
        store.setUser(user);
        store.clearVerificationEmail();
      }
      // Determine user type from response or route param
      const userType =
        response.data.user?.role?.toLowerCase() ||
        response.data.user_type?.toLowerCase() ||
        (id.value === "3" ? "maid" : "household");
      // Redirect based on user type
      switch (userType) {
        case "maid":
          await router.push(
            `/signup/profile/3?email=${encodeURIComponent(emailToVerify.value)}`
          );
          break;
        case "household":
          await router.push(
            `/signup/profile/2?email=${encodeURIComponent(emailToVerify.value)}`
          );
          break;

        default:
          throw new Error("Unknown user role");
        // Default to household if type not recognized
      }

      // Redirect to profile setup
      // await router.push(`/signup/profile/${id.value}`);
    } else {
      throw new Error(response.data?.message || "Verification failed");
    }
  } catch (error) {
    console.error("Verification error:", error);
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      "Verification failed. Please check the code and try again.";

    // Clear code on error
    code.value = "";
  } finally {
    isLoading.value = false;
  }
};

const resendCode = async () => {
  if (!emailToVerify.value) {
    errorMessage.value = "Cannot resend code - no email found";
    return;
  }

  isResending.value = true;
  errorMessage.value = "";

  try {
    const response = await backendAPI.post("/auth/resend-verification-code", {
      email: emailToVerify.value,
    });

    if (response.data) {
      errorMessage.value = "New verification code sent! Check your email.";
      startCooldown(); // Reset cooldown timer
    } else {
      throw new Error(response.data?.message || "Failed to resend code");
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      "Failed to resend code. Please try again.";
  } finally {
    isResending.value = false;
  }
};

definePageMeta({
  layout: "custom",
  // middleware: ["auth"], // Add auth middleware if needed
});
</script>

<style>
/* Smooth transitions for dark mode */
.dark {
  color-scheme: dark;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  input {
    padding: 0.75rem;
  }
  button {
    padding: 0.75rem;
  }
}

/* Input focus styles */
input:focus {
  outline: none;
}

/* Dark mode transitions */
input,
button,
.error-message {
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;
}

/* Disabled state styling */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
