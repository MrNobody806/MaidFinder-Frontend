<template>
  <section class="py-12 bg-gray-50 dark:bg-gray-900">
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
            You'll be notified when they respond.
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

    <div class="container mx-auto px-4">
      <h2
        class="text-3xl font-bold text-center text-lime-500 dark:text-lime-400 mb-8"
      >
        Find a Job
      </h2>

      <!-- Search and Filters -->
      <div class="mb-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
        <div class="flex flex-col gap-6">
          <!-- Search Bar -->
          <div class="flex items-center gap-4">
            <div class="flex-1 relative">
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Icon name="mdi:magnify" class="text-gray-400 text-xl" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="w-full pl-12 pr-36 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all"
                placeholder="Search for jobs, keywords, or locations"
                @keyup.enter="fetchJobs"
              />
              <button
                @click="fetchJobs"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 py-2 px-6 text-sm font-medium text-white bg-black hover:bg-lime-400 hover:text-black rounded-full transition-all duration-300"
              >
                Search
              </button>
            </div>

            <!-- Filter Toggle Button -->
            <button
              @click="showFilters = !showFilters"
              class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition"
            >
              <Icon
                :name="showFilters ? 'mdi:filter-list' : 'mdi:filter'"
                class="text-gray-700 dark:text-gray-300"
              />
            </button>
          </div>

          <!-- Filters (collapsible) -->
          <div
            v-show="showFilters"
            class="pt-4 border-t border-gray-200 dark:border-gray-700 transition-all duration-300"
          >
            <div class="flex flex-wrap gap-4 items-end">
              <!-- City -->
              <div class="min-w-[140px]">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >City</label
                >
                <select
                  v-model="filters.city"
                  class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Cities</option>
                  <option v-for="city in cities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
              </div>

              <!-- Category -->
              <div class="min-w-[140px]">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Category</label
                >
                <select
                  v-model="filters.category"
                  class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Categories</option>
                  <option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </div>

              <!-- Type -->
              <div class="min-w-[120px]">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Type</label
                >
                <select
                  v-model="filters.type"
                  class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option v-for="type in jobTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>

              <!-- Rate -->
              <div class="min-w-[120px]">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Rate</label
                >
                <select
                  v-model="filters.rate"
                  class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Rates</option>
                  <option
                    v-for="rate in rateRanges"
                    :key="rate.value"
                    :value="rate.value"
                  >
                    {{ rate.label }}
                  </option>
                </select>
              </div>

              <!-- Clear Button -->
              <div class="mt-1">
                <button
                  @click="clearFilters"
                  class="h-[42px] px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View Mode Toggle -->
      <div class="flex justify-end items-center gap-2 mb-8 px-1">
        <span class="text-sm text-gray-700 dark:text-gray-300">View:</span>
        <button
          @click="viewMode = 'grid'"
          class="p-2 rounded-lg transition"
          :class="
            viewMode === 'grid'
              ? 'bg-lime-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          "
        >
          <Icon name="mdi:view-grid" />
        </button>
        <button
          @click="viewMode = 'list'"
          class="p-1.5 rounded-lg transition"
          :class="
            viewMode === 'list'
              ? 'bg-lime-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          "
        >
          <Icon name="mdi:view-list" />
        </button>
      </div>

      

      <!-- Job Listings -->
      <div>
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-300">Loading jobs...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 dark:text-red-400">{{ error }}</p>
          <button
            @click="fetchJobs"
            class="mt-4 px-6 py-2 bg-lime-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>

        <div
          v-else-if="filteredJobs.length === 0"
          class="text-center py-12 text-gray-600 dark:text-gray-300"
        >
          No jobs found matching your criteria.
        </div>

        <!-- Grid View -->
        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="job in filteredJobs"
            :key="job.id"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            @click="viewJobDetail(job.id)"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3
                  class="text-xl font-semibold text-gray-800 dark:text-gray-100"
                >
                  {{ job.job_title }}
                </h3>
                <div class="flex items-center mt-1">
                  <Icon
                    name="mdi:map-marker"
                    class="text-gray-500 dark:text-gray-400 mr-1"
                  />
                  <span class="text-gray-600 dark:text-gray-300">{{
                    job.location
                  }}</span>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="statusClasses(job.status)"
                >
                  {{ job.status }}
                </span>
              </div>
            </div>

            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-300">Type:</span>
                <span class="text-gray-800 dark:text-gray-200 capitalize">{{
                  job.job_time
                }}</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-300">Salary:</span>
                <span class="text-gray-800 dark:text-gray-200">
                  {{ job.salary_min }} - {{ job.salary_max }} ETB/hr
                </span>
              </div>
            </div>

            <div class="mb-4">
              <h4
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description:
              </h4>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-2">
                {{ job.job_description }}
              </p>
            </div>

            <div class="mb-4">
              <h4
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Requirements:
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-if="job.gender_preference"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-xs"
                >
                  {{ job.gender_preference }}
                </span>
                <span
                  v-if="job.religion_preference"
                  class="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 rounded-full text-xs"
                >
                  {{ job.religion_preference }}
                </span>
                <span
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs"
                >
                  {{ job.language_requirement }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between border-t pt-4">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3"
                >
                  <Icon
                    name="mdi:account"
                    class="text-gray-500 dark:text-gray-300 text-xl"
                  />
                </div>
                <div>
                  <p class="text-gray-800 dark:text-gray-200 font-medium">
                    {{ job.household?.first_name }}
                    {{ job.household?.last_name }}
                  </p>
                  <div class="flex items-center">
                    <Icon
                      name="mdi:shield-check"
                      class="text-green-500 mr-1"
                      v-if="job.household?.verification_status === 'verified'"
                    />
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ job.household?.verification_status }}
                    </span>
                  </div>
                </div>
              </div>
              <button
                @click.stop="applyForJob(job.id)"
                class="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition text-sm"
                :disabled="
                  job.application_status === 'pending' ||
                  job.application_status === 'accepted'
                "
                :class="{
                  'bg-gray-400 cursor-not-allowed':
                    job.application_status === 'pending' ||
                    job.application_status === 'accepted',
                  'hover:bg-gray-400':
                    job.application_status === 'pending' ||
                    job.application_status === 'accepted',
                }"
              >
                {{ getApplyButtonText(job.application_status) }}
              </button>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <div
            v-for="job in filteredJobs"
            :key="job.id"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            @click="viewJobDetail(job.id)"
          >
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div>
                    <h3
                      class="text-xl font-semibold text-gray-800 dark:text-gray-100"
                    >
                      {{ job.job_title }}
                    </h3>
                    <div class="flex items-center mt-1">
                      <Icon
                        name="mdi:map-marker"
                        class="text-gray-500 dark:text-gray-400 mr-1"
                      />
                      <span class="text-gray-600 dark:text-gray-300">{{
                        job.location
                      }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="statusClasses(job.status)"
                    >
                      {{ job.status }}
                    </span>
                    <span
                      v-if="job.application_status"
                      class="px-2 py-1 text-xs rounded-full"
                      :class="applicationStatusClasses(job.application_status)"
                    >
                      {{ job.application_status }}
                    </span>
                  </div>
                </div>

                <div class="mt-2">
                  <p class="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {{ job.job_description }}
                  </p>
                </div>

                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs"
                  >
                    {{ job.job_time }}
                  </span>
                  <span
                    v-if="job.gender_preference"
                    class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-xs"
                  >
                    {{ job.gender_preference }}
                  </span>
                  <span
                    v-if="job.religion_preference"
                    class="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 rounded-full text-xs"
                  >
                    {{ job.religion_preference }}
                  </span>
                </div>
              </div>

              <div
                class="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4"
              >
                <div class="text-right">
                  <p class="text-gray-800 dark:text-gray-200 font-medium">
                    {{ job.salary_min }} - {{ job.salary_max }} ETB/hr
                  </p>
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2"
                    >
                      <Icon
                        name="mdi:account"
                        class="text-gray-500 dark:text-gray-300 text-sm"
                      />
                    </div>
                    <div>
                      <p class="text-sm text-gray-800 dark:text-gray-200">
                        {{ job.household?.first_name }}
                      </p>
                      <div class="flex items-center">
                        <Icon
                          name="mdi:shield-check"
                          class="text-green-500 mr-1 text-xs"
                          v-if="
                            job.household?.verification_status === 'verified'
                          "
                        />
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ job.household?.verification_status }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    @click.stop="applyForJob(job.id)"
                    class="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition text-sm whitespace-nowrap"
                    :disabled="
                      job.application_status === 'pending' ||
                      job.application_status === 'accepted'
                    "
                    :class="{
                      'bg-gray-400 cursor-not-allowed':
                        job.application_status === 'pending' ||
                        job.application_status === 'accepted',
                      'hover:bg-gray-400':
                        job.application_status === 'pending' ||
                        job.application_status === 'accepted',
                    }"
                  >
                    {{ getApplyButtonText(job.application_status) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total_pages > 1" class="flex justify-center mt-8">
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="pagination.current_page === 1"
            class="px-4 py-2 rounded-lg border"
            :class="{
              'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200':
                pagination.current_page !== 1,
              'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed':
                pagination.current_page === 1,
            }"
          >
            Previous
          </button>

          <div class="flex items-center gap-1">
            <button
              v-for="page in pagination.total_pages"
              :key="page"
              @click="goToPage(page)"
              class="w-10 h-10 flex items-center justify-center rounded-lg"
              :class="{
                'bg-lime-500 text-white': page === pagination.current_page,
                'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200':
                  page !== pagination.current_page,
              }"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="nextPage"
            :disabled="pagination.current_page === pagination.total_pages"
            class="px-4 py-2 rounded-lg border"
            :class="{
              'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200':
                pagination.current_page !== pagination.total_pages,
              'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed':
                pagination.current_page === pagination.total_pages,
            }"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import backendApi from "@/networkServices/api/backendApi.js";

const router = useRouter();
const authStore = useAuthStore();

// Data
const loading = ref(false);
const error = ref(null);
const showSuccessModal = ref(false);
const jobs = ref([]);
const showFilters = ref(false);
const recentlyAppliedJobId = ref(null); // Track the most recently applied job
const recommendedJobs = ref([]);
const viewMode = ref("grid"); // 'grid' or 'list'
const searchQuery = ref("");
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_jobs: 0,
});

const filters = ref({
  city: "",
  category: "",
  type: "",
  rate: "",
});

const cities = ref([
  "Hawassa",
  "Arbaminch",
  "Addis Ababa",
  "Bahrdar",
  "Gonder",
  "Other",
]);
const categories = ref(["Cleaning", "Babysitting", "Cooking", "Other"]);
const jobTypes = ref(["Full-time", "Part-time", "One-Time"]);
const rateRanges = ref([
  { label: "0-10 ETB/hr", value: "0-10" },
  { label: "10-15 ETB/hr", value: "10-15" },
  { label: "15-20 ETB/hr", value: "15-20" },
  { label: "20+ ETB/hr", value: "20+" },
]);

// Computed
const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
    const matchesSearch = searchQuery.value
      ? job.job_title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        job.job_description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true;

    const matchesCity = filters.value.city
      ? job.location.includes(filters.value.city)
      : true;
    const matchesCategory = filters.value.category
      ? job.job_title.includes(filters.value.category)
      : true;
    const matchesType = filters.value.type
      ? job.job_time === filters.value.type.toLowerCase()
      : true;

    const jobSalary = parseFloat(job.salary_min);
    let matchesRate = true;

    if (filters.value.rate) {
      if (filters.value.rate.includes("+")) {
        const min = parseFloat(filters.value.rate.replace("+", ""));
        matchesRate = jobSalary >= min;
      } else {
        const [min, max] = filters.value.rate.split("-").map(Number);
        matchesRate = jobSalary >= min && jobSalary <= max;
      }
    }

    return (
      matchesSearch &&
      matchesCity &&
      matchesCategory &&
      matchesType &&
      matchesRate
    );
  });
});

// Methods
const statusClasses = (status) => {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "cancel":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const applicationStatusClasses = (status) => {
  switch (status) {
    case "pending":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const getApplyButtonText = (status) => {
  switch (status) {
    case "pending":
      return "Already Applied";
    default:
      return "Apply";
  }
};

const fetchJobs = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const params = {
      page: pagination.value.current_page,
      search: searchQuery.value,
      city: filters.value.city,
      category: filters.value.category,
      type: filters.value.type,
      rate: filters.value.rate,
    };

    const response = await backendApi.get("/jobs/open", {
      params,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    jobs.value = response.data.jobs || [];
    pagination.value = {
      current_page: response.data.pagination.current_page || 1,
      total_pages: response.data.pagination.total_pages || 1,
      total_jobs: response.data.pagination.total_jobs || 0,
    };

    recommendedJobs.value = jobs.value.slice(0, 3);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const applyForJob = async (jobId) => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  try {
    loading.value = true;
    const response = await backendApi.post(
      `/job/${jobId}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to apply for job");
    }
    recentlyAppliedJobId.value = jobId;
    showSuccessModal.value = true;
    // Update the application status for the job in our local state
    const jobIndex = jobs.value.findIndex((job) => job.id === jobId);

    if (jobIndex !== -1) {
      jobs.value[jobIndex].application_status = "pending";
    }
    // Also update in recommended jobs if present
    const recJobIndex = recommendedJobs.value.findIndex(
      (job) => job.id === jobId
    );
    if (recJobIndex !== -1) {
      recommendedJobs.value[recJobIndex].application_status = "pending";
    } else {
      throw new Error(response.data.message || "Failed to apply for job");
    }

    await fetchJobs();
  } catch (err) {
    error.value = err.message;
    alert("Error applying for job: " + err.message);
  }
};
const viewApplications = () => {
  showSuccessModal.value = false;
  router.push("/worker/applications");
};

const clearFilters = () => {
  filters.value = {
    city: "",
    category: "",
    type: "",
    rate: "",
  };
  searchQuery.value = "";
  fetchJobs();
};

const viewJobDetail = (jobId) => {
  router.push(`/jobs/job/${jobId}`);
};

const prevPage = () => {
  if (pagination.value.current_page > 1) {
    pagination.value.current_page--;
    fetchJobs();
  }
};

const nextPage = () => {
  if (pagination.value.current_page < pagination.value.total_pages) {
    pagination.value.current_page++;
    fetchJobs();
  }
};

const goToPage = (page) => {
  pagination.value.current_page = page;
  fetchJobs();
};

// Lifecycle
onMounted(() => {
  fetchJobs();
});

definePageMeta({
  layout: "house",
});
</script>
