<template>
  <section class="dark:bg-gray-900 min-h-screen dark:text-gray-100">
    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Jobs Management</h2>
        <div class="flex space-x-2">
          <button
            @click="printJobList"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
            :disabled="loading"
          >
            <Icon
              name="mdi:printer"
              class="h-5 w-5 mr-1 text-black dark:text-white"
            />
            Print List
          </button>
        </div>
      </div>
      <div
        class="flex flex-col md:flex-row md:space-y-0 md:space-x-4 space-y-4"
      >
        <!-- Search Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Search</label
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by job title or location"
            class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :disabled="loading"
            @input="handleSearchInput"
          />
        </div>

        <!-- Date Range Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Posted Date (Range)</label
          >
          <div
            class="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"
          >
            <input
              type="date"
              v-model="startDate"
              class="mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full"
              :disabled="loading"
            />
            <input
              type="date"
              v-model="endDate"
              class="mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full"
              :disabled="loading"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Job Status</label
          >
          <select
            v-model="statusFilter"
            class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :disabled="loading"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="open">Open</option>
            <option value="close">Close</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <!-- Clear Filters Button -->
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 w-full md:w-auto"
            :disabled="loading"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"
      ></div>
      <p class="text-gray-500 dark:text-gray-400">Loading jobs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <Icon
        name="mdi:alert-circle"
        class="h-12 w-12 text-red-500 mx-auto mb-2"
      />
      <p class="text-red-500 dark:text-red-400 mb-2">Failed to load jobs</p>
      <button
        @click="fetchJobs"
        class="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <!-- Jobs Table -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow mb-6 overflow-x-auto"
    >
      <table class="w-full min-w-[1000px]" id="jobListTable">
        <thead>
          <tr class="border-b dark:border-gray-700">
            <th
              class="text-left p-2 cursor-pointer"
              @click="sortBy('job_title')"
            >
              <div class="flex items-center">
                Job Title
                <Icon
                  v-if="sortColumn === 'job_title'"
                  :name="
                    sortDirection === 'asc'
                      ? 'mdi:chevron-up'
                      : 'mdi:chevron-down'
                  "
                  class="ml-1"
                />
              </div>
            </th>
            <th class="text-left p-2">Location</th>
            <th class="text-left p-2">Salary Range</th>
            <th class="text-left p-2">Job Type</th>
            <th
              class="text-left p-2 cursor-pointer"
              @click="sortBy('created_at')"
            >
              <div class="flex items-center">
                Posted Date
                <Icon
                  v-if="sortColumn === 'created_at'"
                  :name="
                    sortDirection === 'asc'
                      ? 'mdi:chevron-up'
                      : 'mdi:chevron-down'
                  "
                  class="ml-1"
                />
              </div>
            </th>
            <th class="text-left p-2 cursor-pointer" @click="sortBy('status')">
              <div class="flex items-center">
                Status
                <Icon
                  v-if="sortColumn === 'status'"
                  :name="
                    sortDirection === 'asc'
                      ? 'mdi:chevron-up'
                      : 'mdi:chevron-down'
                  "
                  class="ml-1"
                />
              </div>
            </th>
            <th class="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in jobs.data"
            :key="job.id"
            class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="p-2">{{ job.job_title || "N/A" }}</td>
            <td class="p-2">{{ job.location || "N/A" }}</td>
            <td class="p-2">
              {{ formatSalaryRange(job.salary_min, job.salary_max) }}
            </td>
            <td class="p-2">{{ formatJobType(job.job_time) }}</td>
            <td class="p-2">{{ formatDate(job.created_at) }}</td>
            <td class="p-2">
              <span :class="statusClass(job.status)">
                {{ formatStatus(job.status) }}
              </span>
            </td>
            <td class="p-2 space-x-2 whitespace-nowrap">
              <NuxtLink
                @click="viewJobDetails(job.id)"
                class="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600 inline-block cursor-pointer"
              >
                View
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="jobs.data.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          No jobs found matching your criteria
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="jobs.data.length > 0"
        class="flex flex-col md:flex-row items-center justify-between mt-4"
      >
        <div class="mb-2 md:mb-0">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ jobs.from }} to {{ jobs.to }} of {{ jobs.total }} entries
          </span>
        </div>
        <div class="flex space-x-1">
          <button
            @click="prevPage"
            :disabled="jobs.current_page === 1"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            v-for="(link, index) in paginationButtons"
            :key="index"
            @click="goToPage(parseInt(link.label))"
            :disabled="link.active"
            :class="[
              'px-3 py-1 border rounded-lg',
              link.active
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            {{ link.label }}
          </button>
          <button
            @click="nextPage"
            :disabled="jobs.current_page === jobs.last_page"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="mt-2 md:mt-0">
          <select
            v-model="perPage"
            class="p-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            @change="fetchJobs(1)"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { debounce } from "lodash";
import backendApi from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
// State
const loading = ref(true);
const error = ref(null);
const jobs = ref({
  data: [],
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  last_page: 1,
  per_page: 10,
  links: [],
});

const authStore = useAuthStore();

// Filters
const startDate = ref("");
const endDate = ref("");
const statusFilter = ref("");
const searchQuery = ref("");
const perPage = ref(10);

// Sorting
const sortColumn = ref("created_at");
const sortDirection = ref("desc");

// Debounced search function
const debouncedSearch = debounce(() => {
  fetchJobs(1);
}, 500);

// Handle search input with debounce
const handleSearchInput = () => {
  debouncedSearch();
};

// Fetch jobs from API
const fetchJobs = async (page = 1) => {
  try {
    loading.value = true;
    error.value = null;
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const params = {
      page,
      per_page: perPage.value,
    };

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }
    if (statusFilter.value) {
      params.status = statusFilter.value;
    }
    if (startDate.value) {
      params.start_date = startDate.value;
    }
    if (endDate.value) {
      params.end_date = endDate.value;
    }
    if (sortColumn.value) {
      params.sort_by = sortColumn.value;
      params.sort_direction = sortDirection.value;
    }

    const response = await backendApi.get("/jobs/all", {
      params,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    jobs.value = {
      data: response.data.jobs || [],
      current_page: response.data.current_page || 1,
      from: response.data.from || 0,
      to: response.data.to || 0,
      total: response.data.total || 0,
      last_page: response.data.last_page || 1,
      per_page: response.data.per_page || perPage.value,
      links: response.data.links || [],
    };
  } catch (err) {
    console.error("Error fetching jobs:", err);
    error.value = "Failed to load jobs. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const viewJobDetails = (jobId) => {
  router.push(`/mod/jobs/${jobId}`);
};

// Format salary range
const formatSalaryRange = (min, max) => {
  if (!min && !max) return "N/A";
  return `${min ? formatCurrency(min) : "N/A"} - ${
    max ? formatCurrency(max) : "N/A"
  }`;
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format job type
const formatJobType = (type) => {
  if (!type) return "N/A";
  return type
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format status for display
const formatStatus = (status) => {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Status Class
const statusClass = (status) => {
  if (!status) status = "pending";

  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs dark:bg-green-700 dark:text-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs dark:bg-yellow-700 dark:text-yellow-100";
    case "completed":
      return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs dark:bg-blue-700 dark:text-blue-100";
    case "rejected":
      return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm dark:bg-red-700 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs dark:bg-gray-700 dark:text-gray-100";
  }
};

// Navigation methods
const prevPage = () => {
  if (jobs.value.current_page > 1) {
    fetchJobs(jobs.value.current_page - 1);
  }
};

const nextPage = () => {
  if (jobs.value.current_page < jobs.value.last_page) {
    fetchJobs(jobs.value.current_page + 1);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= jobs.value.last_page) {
    fetchJobs(page);
  }
};

// Pagination buttons
const paginationButtons = computed(() => {
  if (!jobs.value.links || jobs.value.links.length <= 3) {
    return [];
  }
  return jobs.value.links.slice(1, -1);
});

// Clear Filters
const clearFilters = () => {
  startDate.value = "";
  endDate.value = "";
  statusFilter.value = "";
  searchQuery.value = "";
  fetchJobs(1);
};

// Sort by column
const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
  fetchJobs(jobs.value.current_page);
};

// Print Job List
const printJobList = () => {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Jobs Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .status-active { background-color: #d4edda; color: #155724; }
          .status-pending { background-color: #fff3cd; color: #856404; }
          .status-completed { background-color: #cce5ff; color: #004085; }
          .status-rejected { background-color: #f8d7da; color: #721c24; }
          .print-date { text-align: right; margin-bottom: 20px; }
          .print-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .print-filters { margin-bottom: 20px; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div>
            <h1>Jobs Report</h1>
            <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
          </div>
        </div>

        <div class="print-filters">
          <strong>Filters Applied:</strong><br>
          ${
            statusFilter.value
              ? `Status: ${formatStatus(statusFilter.value)}<br>`
              : ""
          }
          ${
            startDate.value || endDate.value
              ? `Date Range: ${startDate.value} to ${endDate.value}<br>`
              : ""
          }
          ${searchQuery.value ? `Search: "${searchQuery.value}"` : ""}
        </div>

        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Location</th>
              <th>Salary Range</th>
              <th>Job Type</th>
              <th>Posted Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${jobs.value.data
              .map(
                (job) => `
              <tr>
                <td>${job.job_title || "N/A"}</td>
                <td>${job.location || "N/A"}</td>
                <td>${formatSalaryRange(job.salary_min, job.salary_max)}</td>
                <td>${formatJobType(job.job_time)}</td>
                <td>${formatDate(job.created_at)}</td>
                <td class="status-${
                  job.status ? job.status.toLowerCase() : "pending"
                }">
                  ${formatStatus(job.status)}
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

// Watchers for filters that should trigger API calls
watch([statusFilter, startDate, endDate, perPage], () => {
  fetchJobs(1);
});

watch([sortColumn, sortDirection], () => {
  fetchJobs(jobs.value.current_page);
});

// Initialize
onMounted(() => {
  fetchJobs();
});

definePageMeta({
  layout: "mod",
});
</script>
