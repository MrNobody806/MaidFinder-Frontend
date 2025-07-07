<template>
  <section
    class="max-w-7xl min-h-screen mx-auto dark:bg-gray-900 dark:text-gray-100 py-4"
  >
    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <h2 class="text-lg font-semibold mb-4">Filters</h2>
      <div
        class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4"
      >
        <!-- Date Range Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Date Posted (Range)</label
          >
          <div
            class="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"
          >
            <input
              type="date"
              v-model="filters.startDate"
              class="mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full"
              @change="fetchJobs"
            />
            <input
              type="date"
              v-model="filters.endDate"
              class="mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full"
              @change="fetchJobs"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Status</label
          >
          <select
            v-model="filters.status"
            class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            @change="fetchJobs"
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="cancel">Cancel</option>
            <option value="close">Close</option>
          </select>
        </div>

        <!-- Clear Filters Button -->
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 w-full md:w-auto"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <Spinner class="mx-auto" />
      <p class="mt-2">Loading jobs...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded-lg mb-6"
    >
      {{ error }}
      <button
        @click="fetchJobs()"
        class="ml-4 text-red-600 dark:text-red-300 hover:underline"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="jobs.length === 0" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">No jobs found</p>
      <button
        @click="resetFilters"
        class="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
        v-if="hasActiveFilters"
      >
        Clear filters to see all jobs
      </button>
    </div>

    <!-- Jobs Table -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow mb-6 overflow-x-auto"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Available Jobs</h2>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Showing {{ jobs.length }} of {{ pagination.total_jobs }} jobs
        </div>
      </div>

      <table class="w-full min-w-[600px]">
        <thead>
          <tr class="border-b dark:border-gray-700">
            <th
              v-for="header in tableHeaders"
              :key="header.key"
              class="text-left p-2 cursor-pointer"
              @click="sortJobs(header.key)"
            >
              <div class="flex items-center">
                {{ header.label }}
                <span v-if="sort.field === header.key" class="ml-1">
                  {{ sort.direction === "asc" ? "↑" : "↓" }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in jobs"
            :key="job.id"
            class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="p-2">
              <NuxtLink
                :to="`/maids/dashboard/jobs/${job.id}`"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {{ job.job_title }}
              </NuxtLink>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ job.job_time }}
              </div>
            </td>

            <td class="p-2">{{ formatSalary(job) }}</td>
            <td class="p-2">{{ formatDate(job.expected_start_date) }}</td>
            <td class="p-2">
              <span :class="statusClasses(job.status)">
                {{ formatStatus(job.status) }}
              </span>
              <div
                v-if="job.status === 'rejected' && job.rejection_reason"
                class="text-xs text-red-500 dark:text-red-400 mt-1 truncate"
              >
                {{ job.rejection_reason }}
              </div>
            </td>
            <td class="p-2">
              <NuxtLink
                :to="`/house/job/my-${job.id}`"
                class="inline-block p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
              >
                View Details
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Page {{ pagination.current_page }} of {{ pagination.total_pages }}
        </div>
        <div class="flex space-x-2">
          <button
            @click="prevPage"
            :disabled="pagination.current_page === 1"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.current_page === pagination.total_pages"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

import backendApi from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// Table configuration
const tableHeaders = [
  { key: "job_title", label: "Job Title" },
  { key: "salary", label: "Salary" },
  { key: "expected_start_date", label: "Start Date" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

// State
const jobs = ref([]);
const loading = ref(false);
const error = ref(null);

// Filters
const filters = ref({
  startDate: "",
  endDate: "",
  status: "",
});

// Sort
const sort = ref({
  field: "created_at",
  direction: "desc",
});

// Pagination
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_jobs: 0,
});

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    filters.value.startDate || filters.value.endDate || filters.value.status
  );
});

// Format status for display
const formatStatus = (status) => {
  const statusMap = {
    open: "Open",
    rejected: "Rejected",
  };
  return statusMap[status] || status;
};

// Status badge classes
const statusClasses = (status) => {
  const base = "px-2 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case "open":
      return `${base} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
    case "rejected":
      return `${base} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`;
    case "pending":
      return `${base} bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100`;
    case "cancel":
      return `${base} bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    default:
      return `${base} bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100`;
  }
};

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format salary range
const formatSalary = (job) => {
  if (job.salary_min && job.salary_max) {
    return `${job.salary_min} - ${job.salary_max}`;
  }
  return job.salary_min || job.salary_max || "Negotiable";
};

// Fetch jobs from API
const fetchJobs = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const params = {
      page: pagination.value.current_page,
      status: filters.value.status,
      start_date: filters.value.startDate,
      end_date: filters.value.endDate,
      sort_by: sort.value.field,
      sort_direction: sort.value.direction,
    };

    const response = await backendApi.get("/jobs/my", {
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
  } catch (err) {
    console.error("Error fetching jobs:", err);
    error.value = "Failed to load jobs. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Reset filters and refetch
const resetFilters = () => {
  filters.value = {
    startDate: "",
    endDate: "",
    status: "",
  };
  fetchJobs();
};

// Sort jobs
const sortJobs = (field) => {
  if (sort.value.field === field) {
    sort.value.direction = sort.value.direction === "asc" ? "desc" : "asc";
  } else {
    sort.value.field = field;
    sort.value.direction = "desc";
  }
  fetchJobs();
};

// Pagination controls
const nextPage = () => {
  if (pagination.value.current_page < pagination.value.total_pages) {
    pagination.value.current_page++;
    fetchJobs();
  }
};

const prevPage = () => {
  if (pagination.value.current_page > 1) {
    pagination.value.current_page--;
    fetchJobs();
  }
};

// Initialize
onMounted(() => {
  fetchJobs();
});

definePageMeta({
  layout: "house",
});
</script>
