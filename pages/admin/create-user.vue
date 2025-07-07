<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <!-- Main Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <!-- Form Content -->
        <div class="p-6">
          <!-- Main Error/Success Messages -->
          <transition name="message-fade">
            <div
              v-if="errorMessage"
              class="p-4 mb-6 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 flex items-start"
            >
              <Icon
                name="heroicons:exclamation-circle"
                class="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-red-600 dark:text-red-400"
              />
              <div>
                <div v-if="Array.isArray(errorMessage)">
                  <p
                    v-for="(error, index) in errorMessage"
                    :key="index"
                    class="mb-1.5 last:mb-0 text-red-700 dark:text-red-300"
                  >
                    {{ error }}
                  </p>
                </div>
                <p v-else class="text-red-700 dark:text-red-300">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </transition>

          <transition name="message-fade">
            <div
              v-if="successMessage"
              class="p-4 mb-6 text-sm rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 flex items-start"
            >
              <Icon
                name="heroicons:check-circle"
                class="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-600 dark:text-green-400"
              />
              <div>
                <p class="text-green-700 dark:text-green-300">
                  {{ successMessage }}
                </p>
                <div v-if="createdUser" class="mt-2">
                  <p class="text-green-700 dark:text-green-300">
                    <span class="font-medium">Name:</span>
                    {{ createdUser.name }}
                  </p>
                  <p class="text-green-700 dark:text-green-300">
                    <span class="font-medium">Email:</span>
                    {{ createdUser.email }}
                  </p>
                  <p class="text-green-700 dark:text-green-300">
                    <span class="font-medium">Role:</span>
                    {{ createdUser.role }}
                  </p>
                </div>
              </div>
            </div>
          </transition>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Full Name <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="John Doe"
                    required
                    class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    :class="{
                      'border-red-500 focus:ring-red-500': fieldErrors.name,
                    }"
                  />
                  <Icon
                    name="heroicons:user"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                  />
                </div>
                <transition name="message-fade">
                  <p
                    v-if="fieldErrors.name"
                    class="mt-1 text-sm text-red-600 dark:text-red-400"
                  >
                    {{ fieldErrors.name }}
                  </p>
                </transition>
              </div>

              <!-- Email -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="user@example.com"
                    required
                    class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    :class="{
                      'border-red-500 focus:ring-red-500': fieldErrors.email,
                    }"
                  />
                  <Icon
                    name="heroicons:envelope"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                  />
                </div>
                <transition name="message-fade">
                  <p
                    v-if="fieldErrors.email"
                    class="mt-1 text-sm text-red-600 dark:text-red-400"
                  >
                    {{ fieldErrors.email }}
                  </p>
                </transition>
              </div>

              <!-- Password -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    minlength="8"
                    class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    :class="{
                      'border-red-500 focus:ring-red-500': fieldErrors.password,
                    }"
                  />
                  <Icon
                    name="heroicons:lock-closed"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                  >
                    <Icon
                      :name="
                        showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'
                      "
                    />
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 8 characters
                </p>
                <transition name="message-fade">
                  <p
                    v-if="fieldErrors.password"
                    class="mt-1 text-sm text-red-600 dark:text-red-400"
                  >
                    {{ fieldErrors.password }}
                  </p>
                </transition>
              </div>

              <!-- Role -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Role <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="form.role"
                    required
                    class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 appearance-none"
                    :class="{
                      'border-red-500 focus:ring-red-500': fieldErrors.role,
                    }"
                  >
                    <option value="" disabled selected>Select a role</option>
                    <option value="1">Admin</option>
                    <option value="4">Employee</option>
                  </select>
                  <Icon
                    name="heroicons:user-circle"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                  />
                  <Icon
                    name="heroicons:chevron-down"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none"
                  />
                </div>
                <transition name="message-fade">
                  <p
                    v-if="fieldErrors.role"
                    class="mt-1 text-sm text-red-600 dark:text-red-400"
                  >
                    {{ fieldErrors.role }}
                  </p>
                </transition>
                <p
                  v-if="form.role === '1'"
                  class="mt-1 text-xs text-blue-600 dark:text-blue-400"
                >
                  Note: Only Super Admin can create Admin accounts
                </p>
              </div>
            </div>

            <!-- Form Actions -->
            <div
              class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600"
            >
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Reset
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="!isLoading">Create User</span>
                <span v-else class="flex items-center justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Creating...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import backendAPI from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";
import { navigateTo } from "#app";

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);
const createdUser = ref(null);
const authStore = useAuthStore();

// Field-specific error messages
const fieldErrors = reactive({
  name: "",
  email: "",
  password: "",
  role: "",
});

// Form data
const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "",
});

// Clear all errors
const clearErrors = () => {
  errorMessage.value = "";
  successMessage.value = "";
  createdUser.value = null;
  Object.keys(fieldErrors).forEach((key) => {
    fieldErrors[key] = "";
  });
};

// Reset form to initial state
const resetForm = () => {
  form.name = "";
  form.email = "";
  form.password = "";
  form.role = "";
  clearErrors();
};

// // Check authentication and redirect if not authenticated
// const checkAuth = async () => {
//   await authStore.hydrate();
//   if (!authStore.isAuthenticated) {
//     navigateTo("/login");
//   }
// };

// Form submission
const handleSubmit = async () => {
  clearErrors();
  let hasErrors = false;

  // Client-side validation
  if (!form.name) {
    fieldErrors.name = "Name is required";
    hasErrors = true;
  }

  if (!form.email) {
    fieldErrors.email = "Email is required";
    hasErrors = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    fieldErrors.email = "Please enter a valid email address";
    hasErrors = true;
  }

  if (!form.password) {
    fieldErrors.password = "Password is required";
    hasErrors = true;
  } else if (form.password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters";
    hasErrors = true;
  }

  if (!form.role) {
    fieldErrors.role = "Please select a role";
    hasErrors = true;
  }

  if (hasErrors) {
    // Scroll to first error
    setTimeout(() => {
      const firstErrorElement = document.querySelector(".border-red-500");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 50);
    return;
  }

  isLoading.value = true;
  if (!authStore._hydrated) {
    await authStore.hydrate();
  }

  try {
    const response = await backendAPI.post(
      "/auth/create-admin-employee",
      {
        name: form.name,
        email: form.email,
        password: form.password,
        role: parseInt(form.role), // Ensure role is sent as integer
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    if (response.data) {
      successMessage.value =
        response.data.message || "User created successfully!";
      createdUser.value = response.data.user;
      resetForm();
    }
  } catch (error) {
    console.error("User creation error:", error);

    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      errorMessage.value = "Your session has expired. Please log in again.";
      authStore.logout();
      navigateTo("/login");
    } else if (error.response?.status === 403) {
      errorMessage.value =
        error.response.data.error ||
        "You don't have permission to perform this action.";
    } else if (error.response?.status === 422) {
      // Handle validation errors from backend
      const backendErrors = error.response.data.errors;

      for (const field in backendErrors) {
        const errorMsg = backendErrors[field][0];

        // Special handling for email already taken
        if (field === "email" && errorMsg.includes("taken")) {
          fieldErrors.email =
            "This email is already registered. Please use a different email.";
        } else {
          fieldErrors[field] = errorMsg;
        }
      }
    } else {
      errorMessage.value =
        error.response?.data?.message ||
        "User creation failed. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};

// onMounted(() => {
//   checkAuth();
// });

definePageMeta({
  layout: "admin",
  // middleware: ["auth", "admin"],
});
</script>

<style scoped>
/* Message animations */
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}
.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Form input transitions */
input,
select {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Custom select dropdown arrow */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Dark mode select arrow */
.dark select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23d1d5db' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}
</style>
