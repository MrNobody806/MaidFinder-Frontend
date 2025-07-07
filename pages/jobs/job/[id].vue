<template>
  <section class="py-8 bg-gray-50 dark:bg-gray-900">
    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div class="text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-4"
          >
            <Icon
              name="mdi:check"
              class="text-green-600 dark:text-green-400 text-2xl"
            />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Application Submitted!
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Your application has been successfully submitted to the household.
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="showSuccessModal = false"
              class="px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
            <button
              @click="viewApplications"
              class="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium border border-gray-300 dark:border-gray-600"
            >
              View Applications
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div
      v-if="showErrorModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div class="text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 mb-4"
          >
            <Icon
              name="mdi:alert-circle-outline"
              class="text-red-600 dark:text-red-400 text-2xl"
            />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Application Error
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ applicationError }}
          </p>
          <div class="flex justify-center">
            <button
              @click="showErrorModal = false"
              class="px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Back Button -->
      <button
        @click="$router.push('/jobs/job')"
        class="mb-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
      >
        <Icon name="mdi:chevron-left" class="text-lg" />
        <span>Back to Listings</span>
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center gap-3">
          <div
            class="w-5 h-5 border-2 border-lime-500 border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="text-gray-600 dark:text-gray-300">Loading job details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="fetchError" class="text-center py-12">
        <div
          class="max-w-md mx-auto p-4 bg-red-50 dark:bg-red-900/20 rounded-xl"
        >
          <p class="text-red-500 dark:text-red-400 mb-4">{{ fetchError }}</p>
          <button
            @click="fetchJobDetails"
            class="px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-6">
        <!-- Job Header Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div class="p-6 md:p-8">
            <div
              class="flex flex-col md:flex-row md:items-start md:justify-between gap-6"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-4">
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400':
                        job.job.status === 'open',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400':
                        job.job.status === 'pending',
                      'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400':
                        job.job.status === 'closed',
                    }"
                  >
                    {{ job.job.status }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    Posted {{ formatRelativeDate(job.job.created_at) }}
                  </span>
                </div>

                <h1
                  class="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {{ job.job.job_title }}
                </h1>

                <div
                  class="flex items-center gap-4 text-gray-600 dark:text-gray-300 mb-6"
                >
                  <div class="flex items-center gap-1">
                    <Icon name="mdi:map-marker-outline" class="text-lg" />
                    <span>{{ job.job.location }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Icon name="mdi:clock-outline" class="text-lg" />
                    <span>{{ formatJobTime(job.job.job_time) }}</span>
                  </div>
                </div>

                <div
                  class="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 p-5 rounded-lg border border-lime-100 dark:border-lime-800/50 mb-6"
                >
                  <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-300">
                        Hourly Rate
                      </p>
                      <p
                        class="text-2xl font-bold text-gray-900 dark:text-white"
                      >
                        {{ job.job.salary_min }} - {{ job.job.salary_max }} ETB
                      </p>
                    </div>
                    <button
                      @click.stop="applyForJob(job.job.id)"
                      :disabled="
                        applying ||
                        job.has_applied ||
                        job.job.status !== 'open'
                      "
                      class="px-6 py-3 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      :class="{
                        'bg-lime-500 hover:bg-lime-600 text-white':
                          !applying &&
                          !job.has_applied &&
                          job.job.status === 'open',
                        'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed':
                          applying ||
                          job.has_applied ||
                          job.job.status !== 'open',
                        'bg-green-500 hover:bg-green-600 text-white':
                          job.has_applied,
                      }"
                    >
                      <span v-if="applying">Applying...</span>
                      <span v-else-if="job.has_applied">Already Applied</span>
                      <span v-else-if="job.job.status !== 'open'">Closed</span>
                      <span v-else>Apply Now</span>
                      <Icon
                        v-if="applying"
                        name="mdi:loading"
                        class="animate-spin text-lg"
                      />
                      <Icon
                        v-else-if="job.has_applied"
                        name="mdi:check"
                        class="text-lg"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Job Details Sections -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="md:col-span-2 space-y-6">
            <!-- About the Job -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div class="p-6 md:p-8">
                <h2
                  class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                >
                  <Icon name="mdi:text-box-outline" class="text-lime-500" />
                  <span>Job Description</span>
                </h2>
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {{ job.job.job_description }}
                </p>
              </div>
            </div>

            <!-- Requirements -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div class="p-6 md:p-8">
                <h2
                  class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                >
                  <Icon
                    name="mdi:clipboard-list-outline"
                    class="text-lime-500"
                  />
                  <span>Requirements</span>
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <h3
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                    >
                      Skills Needed
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ job.job.required_skills || "Not specified" }}
                    </p>
                  </div>

                  <div
                    class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <h3
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                    >
                      Language
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ job.job.language_requirement || "Not specified" }}
                    </p>
                  </div>

                  <div
                    class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <h3
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                    >
                      Gender Preference
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ job.job.gender_preference || "No preference" }}
                    </p>
                  </div>

                  <div
                    class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <h3
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                    >
                      Religion Preference
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ job.job.religion_preference || "No preference" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Benefits -->
            <div
              v-if="job.job.benefit"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div class="p-6 md:p-8">
                <h2
                  class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                >
                  <Icon name="mdi:gift-outline" class="text-lime-500" />
                  <span>Benefits</span>
                </h2>
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {{ job.job.benefit }}
                </p>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Household Profile -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div class="p-6">
                <h2
                  class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                >
                  <Icon name="mdi:account-outline" class="text-lime-500" />
                  <span>Household Profile</span>
                </h2>

                <div class="flex items-center gap-4 mb-4">
                  <div class="relative">
                    <div
                      class="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-600 shadow"
                    >
                      <img
                        v-if="job.household?.image_url"
                        :src="job.household.image_url"
                        class="w-full h-full object-cover"
                        alt="Household"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center"
                      >
                        <span
                          class="text-2xl font-semibold text-gray-400 dark:text-gray-300"
                        >
                          {{ job.household?.first_name?.charAt(0) || "H" }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="job.household?.verification_status === 'verified'"
                      class="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 p-1 rounded-full shadow"
                    >
                      <Icon
                        name="mdi:shield-check"
                        class="text-green-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 class="font-bold text-gray-900 dark:text-white">
                      {{ householdFullName }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ job.household?.address || "Address not specified" }}
                    </p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Member since</span
                    >
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ formatDate(job.household?.created_at) || "Unknown" }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Response rate</span
                    >
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ job.household?.response_rate || "Unknown" }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Jobs posted</span
                    >
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ job.household?.jobs_posted || "Unknown" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Job Summary -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div class="p-6">
                <h2
                  class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                >
                  <Icon name="mdi:information-outline" class="text-lime-500" />
                  <span>Job Summary</span>
                </h2>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Start Date</span
                    >
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{
                        formatDate(job.job.expected_start_date) || "Flexible"
                      }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Maids Needed</span
                    >
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ job.job.num_of_maids || "1" }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Schedule</span
                    >
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ job.job.schedule_details || "Not specified" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div class="p-6 md:p-8">
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
            >
              <h2
                class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
              >
                <Icon name="mdi:star-outline" class="text-lime-500" />
                <span>Household Reviews</span>
              </h2>

              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <div class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ job.household?.rate || "0.0" }}
                  </div>
                  <div class="flex flex-col">
                    <div class="flex items-center">
                      <span
                        v-for="star in 5"
                        :key="star"
                        class="text-xl"
                        :class="{
                          'text-yellow-400':
                            star <= Math.floor(job.household?.rate || 0),
                          'text-gray-300 dark:text-gray-600':
                            star > Math.floor(job.household?.rate || 0),
                        }"
                      >
                        ★
                      </span>
                    </div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ job.household?.total_reviews || 0 }} reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="job.household?.reviews?.length > 0" class="space-y-6">
              <div
                v-for="(review, index) in visibleReviews"
                :key="index"
                class="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div
                      class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow"
                    >
                      <img
                        v-if="review.maid_image"
                        :src="review.maid_image"
                        class="w-full h-full object-cover"
                        :alt="review.maid_name"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center"
                      >
                        <span
                          class="text-lg font-semibold text-gray-400 dark:text-gray-300"
                        >
                          {{ review.maid_name?.charAt(0) || "M" }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <h4 class="font-medium text-gray-900 dark:text-white">
                        {{ review.maid_name }}
                      </h4>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatRelativeDate(review.created_at) }}
                      </span>
                    </div>

                    <div class="flex items-center mb-2">
                      <div class="flex mr-2">
                        <span
                          v-for="star in 5"
                          :key="star"
                          class="text-lg"
                          :class="{
                            'text-yellow-400': star <= review.rating,
                            'text-gray-300 dark:text-gray-600':
                              star > review.rating,
                          }"
                        >
                          ★
                        </span>
                      </div>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ review.rating }}.0
                      </span>
                    </div>

                    <p class="text-gray-700 dark:text-gray-300">
                      {{ review.review }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="job.household.reviews.length > 3" class="pt-4">
                <button
                  @click="showAllReviews = !showAllReviews"
                  class="w-full py-2 px-4 text-lime-500 hover:text-lime-600 dark:hover:text-lime-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>{{ showAllReviews ? "Show Less" : "Show More" }}</span>
                  <Icon
                    :name="
                      showAllReviews ? 'mdi:chevron-up' : 'mdi:chevron-down'
                    "
                    class="text-lg"
                  />
                </button>
              </div>
            </div>

            <div v-else class="py-8 text-center">
              <div class="mx-auto max-w-xs text-center">
                <Icon
                  name="mdi:comment-question-outline"
                  class="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-3"
                />
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-white mb-1"
                >
                  No reviews yet
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import backendApi from "@/networkServices/api/backendApi.js";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const jobId = route.params.id;

// Data
const loading = ref(false);
const applying = ref(false);
const fetchError = ref(null);
const applicationError = ref(null);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const job = ref({
  job: {},
  household: {},
  has_applied: false,
});
const showAllReviews = ref(false);

// Computed
const householdFullName = computed(() => {
  if (!job.value.household) return "";
  return `${job.value.household.first_name || ""} ${
    job.value.household.middle_name || ""
  } ${job.value.household.last_name || ""}`.trim();
});

const visibleReviews = computed(() => {
  if (!job.value.household?.reviews) return [];
  return showAllReviews.value
    ? job.value.household.reviews
    : job.value.household.reviews.slice(0, 3);
});

// Methods
const viewApplications = () => {
  showSuccessModal.value = false;
  router.push("maids/applications");
};

const formatJobTime = (jobTime) => {
  if (!jobTime) return "";
  return jobTime
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatRelativeDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return formatDate(dateString);
};

const applyForJob = async (jobId) => {
  try {
    applying.value = true;
    applicationError.value = null;

    // Ensure auth store is hydrated
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Make the request with proper headers
    const response = await backendApi.post(
      `/job/${jobId}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Handle successful application
    if (response.data) {
      job.value.has_applied = true;
      showSuccessModal.value = true;
    }
  } catch (err) {
    console.error("Application error:", err);

    if (err.response && err.response.status === 401) {
      // Token expired or invalid - force logout
      authStore.logout();
      router.push("/auth/login");
      applicationError.value = "Your session has expired. Please log in again.";
    } else if (err.response && err.response.status === 403) {
      applicationError.value =
        err.response?.data?.error || "You're not authorized to apply for this job";
    } else if (err.response && err.response.status === 404) {
      applicationError.value =
        err.response?.data?.error || "Job not found or is no longer open";
    } else if (err.response && err.response.status === 409) {
      // Already applied - update the UI state
      job.value.has_applied = true;
      applicationError.value = "You have already applied for this job.";
    } else {
      applicationError.value =
        err.response?.data?.error || "Failed to apply for job";
    }

    // Show error modal if there's an error message
    if (applicationError.value) {
      showErrorModal.value = true;
    }
  } finally {
    applying.value = false;
  }
};

const fetchJobDetails = async () => {
  try {
    loading.value = true;
    fetchError.value = null;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.get(`/maid/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    // Ensure the response has the expected structure
    if (response.data) {
      job.value = {
        job: response.data.job || {},
        household: response.data.household || {},
        has_applied: response.data.has_applied || false,
      };
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (err) {
    console.error("Error fetching job details:", err);
    fetchError.value =
      err.response?.data?.error ||
      err.message ||
      "Failed to fetch job details";
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchJobDetails();
});

definePageMeta({
  layout: "house",
});
</script>

<style scoped>
.whitespace-pre-line {
  white-space: pre-line;
}

.review-enter-active,
.review-leave-active {
  transition: all 0.3s ease;
}
.review-enter-from,
.review-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>