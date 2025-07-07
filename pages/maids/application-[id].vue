<template>
  <section class="mx-auto max-w-6xl min-h-screen p-4 md:p-6">
    <!-- Back Button -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      >
        <Icon name="mdi:arrow-left" class="mr-2" />
        <span class="font-medium">Back to Applications</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="flex flex-col items-center justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"
        ></div>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          Loading application details...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="flex flex-col items-center justify-center">
        <Icon
          name="mdi:alert-circle-outline"
          class="h-16 w-16 text-red-500 mb-4"
        />
        <h3 class="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
          Failed to load application
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {{ error }}
        </p>
        <button
          @click="fetchApplicationDetails"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Application Details -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Application Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Application Header Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-l-4"
          :class="{
            'border-yellow-500': application.status === 'pending',
            'border-green-500': application.status === 'selected',
            'border-red-500': application.status === 'rejected',
          }"
        >
          <div class="p-6 md:p-8">
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h1
                  class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {{ application.job.title }}
                </h1>
                <div class="flex items-center mt-2">
                  <Icon
                    name="mdi:calendar"
                    class="text-gray-500 dark:text-gray-400 mr-2"
                  />
                  <span class="text-gray-600 dark:text-gray-300">
                    Applied on {{ formatDate(application.applied_at) }}
                  </span>
                </div>
              </div>
              <div>
                <span
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                      application.status === 'pending',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                      application.status === 'selected',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                      application.status === 'rejected',
                  }"
                >
                  <Icon
                    :name="
                      {
                        pending: 'mdi:clock-outline',
                        selected: 'mdi:check-circle-outline',
                        rejected: 'mdi:close-circle-outline',
                      }[application.status]
                    "
                    class="mr-1.5"
                  />
                  {{ formatStatus(application.status) }}
                </span>
              </div>
            </div>

            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                class="flex items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
              >
                <div class="bg-white dark:bg-gray-600 p-2 rounded-lg mr-4">
                  <Icon
                    name="mdi:map-marker"
                    class="text-gray-600 dark:text-gray-300 text-xl"
                  />
                </div>
                <div>
                  <p
                    class="text-sm text-gray-500 dark:text-gray-400 font-medium"
                  >
                    Location
                  </p>
                  <p class="text-gray-900 dark:text-white font-medium mt-1">
                    {{ application.job.location || "Not specified" }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
              >
                <div class="bg-white dark:bg-gray-600 p-2 rounded-lg mr-4">
                  <Icon
                    name="mdi:clock-outline"
                    class="text-gray-600 dark:text-gray-300 text-xl"
                  />
                </div>
                <div>
                  <p
                    class="text-sm text-gray-500 dark:text-gray-400 font-medium"
                  >
                    Job Type
                  </p>
                  <p class="text-gray-900 dark:text-white font-medium mt-1">
                    {{ formatJobTime(application.job.job_time) }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
              >
                <div class="bg-white dark:bg-gray-600 p-2 rounded-lg mr-4">
                  <Icon
                    name="mdi:cash"
                    class="text-gray-600 dark:text-gray-300 text-xl"
                  />
                </div>
                <div>
                  <p
                    class="text-sm text-gray-500 dark:text-gray-400 font-medium"
                  >
                    Salary
                  </p>
                  <p class="text-gray-900 dark:text-white font-medium mt-1">
                    {{ formatSalary(application.job) }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
              >
                <div class="bg-white dark:bg-gray-600 p-2 rounded-lg mr-4">
                  <Icon
                    name="mdi:calendar-range"
                    class="text-gray-600 dark:text-gray-300 text-xl"
                  />
                </div>
                <div>
                  <p
                    class="text-sm text-gray-500 dark:text-gray-400 font-medium"
                  >
                    Start Date
                  </p>
                  <p class="text-gray-900 dark:text-white font-medium mt-1">
                    {{
                      application.job.expected_start_date
                        ? formatDate(application.job.expected_start_date)
                        : "Flexible"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Job Description Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <div class="p-6 md:p-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Job Description
            </h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {{
                  application.job.description ||
                  "No detailed description provided for this job."
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Application Actions Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <div class="p-6 md:p-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Manage Application
            </h2>
            <div class="flex flex-wrap gap-4">
              <button
                v-if="application.status === 'pending'"
                @click="withdrawApplication"
                class="flex-1 min-w-[200px] px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
                :disabled="processing"
              >
                <Icon name="mdi:close" class="mr-2 text-xl" />
                <span class="font-medium">Withdraw Application</span>
              </button>
              <NuxtLink
                to="/maids/applications"
                class="flex-1 min-w-[200px] px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Icon name="mdi:arrow-left" class="mr-2 text-xl" />
                <span class="font-medium">Back to Applications</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Household Info -->
      <div class="space-y-6">
        <!-- Household Profile Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <div class="p-6 md:p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Household Profile
              </h2>
              <div
                class="flex items-center bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full"
              >
                <Icon name="mdi:star" class="text-yellow-500 mr-1.5" />
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ application.household.rating?.toFixed(1) || "0.0" }}
                </span>
                <span class="text-gray-600 dark:text-gray-300 text-sm ml-1">
                  ({{ application.household.total_reviews || 0 }})
                </span>
              </div>
            </div>

            <div class="flex flex-col items-center text-center mb-6">
              <div class="relative mb-4">
                <img
                  :src="
                    application.household.image_url || '/default-avatar.png'
                  "
                  alt="Household"
                  class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ application.household.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ application.household.first_name }}
                {{ application.household.middle_name }}
                {{ application.household.last_name }}
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-start">
                <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-4">
                  <Icon
                    name="mdi:account-outline"
                    class="text-gray-600 dark:text-gray-300 text-xl"
                  />
                </div>
                <div>
                  <p
                    class="text-sm text-gray-500 dark:text-gray-400 font-medium"
                  >
                    Gender
                  </p>
                  <p class="text-gray-900 dark:text-white font-medium mt-1">
                    {{ formatGender(application.household.gender) }}
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-4">
                  <Icon
                    name="mdi:home-outline"
                    class="text-gray-600 dark:text-gray-300 text-xl"
                  />
                </div>
                <div>
                  <p
                    class="text-sm text-gray-500 dark:text-gray-400 font-medium"
                  >
                    Address
                  </p>
                  <p class="text-gray-900 dark:text-white font-medium mt-1">
                    {{ application.household.address || "Not provided" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <div class="p-6 md:p-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Household Reviews
            </h2>

            <div
              v-if="
                application.household.reviews &&
                application.household.reviews.length > 0
              "
              class="space-y-6"
            >
              <div
                v-for="review in application.household.reviews"
                :key="review.id"
                class="border-b dark:border-gray-700 pb-6 last:border-b-0 last:pb-0"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div
                      class="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full mr-3"
                    >
                      <Icon name="mdi:star" class="text-yellow-500 mr-1.5" />
                      <span class="font-medium text-gray-900 dark:text-white">
                        {{ review.rating?.toFixed(1) || "0.0" }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(review.created_at) }}
                    </span>
                  </div>
                </div>
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {{ review.review || "No review text provided" }}
                </p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="flex flex-col items-center justify-center">
                <Icon
                  name="mdi:comment-text-outline"
                  class="h-12 w-12 text-gray-400 mb-4"
                />
                <h3
                  class="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1"
                >
                  No reviews yet
                </h3>
                <p class="text-gray-500 dark:text-gray-400">
                  This household hasn't received any reviews yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import backendApi from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";
const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();
const authStore = useAuthStore();

// State
const loading = ref(true);
const error = ref(null);
const application = ref({
  application_id: null,
  status: "",
  applied_at: "",
  job: {
    id: null,
    title: "",
    description: "",
    location: "",
    salary_min: "",
    salary_max: "",
    expected_start_date: "",
    job_time: "",
    status: "",
  },
  household: {
    id: null,
    name: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    phone_number1: "",
    address: "",
    image_url: "",
    rating: 0,
    total_reviews: 0,
    reviews: [], // Initialize as empty array
  },
});

const processing = ref(false);

// Fetch application details
const fetchApplicationDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.get(
      `/maid/applications/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    // Ensure reviews is always an array
    application.value = {
      ...response.data,
      household: {
        ...response.data.household,
        reviews: response.data.household.reviews || [], // Fallback to empty array if null/undefined
        rating: response.data.household.rating || 0, // Fallback to 0 if null/undefined
        total_reviews: response.data.household.total_reviews || 0, // Fallback to 0 if null/undefined
      },
    };
  } catch (err) {
    console.error("Error fetching application details:", err);
    error.value = "Failed to load application details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Withdraw application
const withdrawApplication = async () => {
  try {
    processing.value = true;
    await backendApi.delete(
      `/maid/applications/${application.value.application_id}`
    );

    $toast.success("Application withdrawn successfully");
    router.push("/maids/applications");
  } catch (err) {
    console.error("Error withdrawing application:", err);
    $toast.error("Failed to withdraw application");
  } finally {
    processing.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatJobTime = (jobTime) => {
  if (!jobTime) return "N/A";
  return jobTime
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatStatus = (status) => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatGender = (gender) => {
  if (!gender) return "N/A";
  return gender.charAt(0).toUpperCase() + gender.slice(1);
};

const formatSalary = (job) => {
  if (!job.salary_min && !job.salary_max) return "Negotiable";
  if (job.salary_min && job.salary_max) {
    return `ETB ${job.salary_min} - ETB ${job.salary_max}`;
  }
  return job.salary_min ? `ETB ${job.salary_min}` : `ETB ${job.salary_max}`;
};

const goBack = () => {
  router.push("/maids/applications");
};

// Initialize
onMounted(() => {
  fetchApplicationDetails();
});

definePageMeta({
  layout: "house",
});
</script>

<style scoped>
.prose {
  color: inherit;
}

.prose p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose-dark p {
  color: #d1d5db; /* gray-300 */
}
</style>
