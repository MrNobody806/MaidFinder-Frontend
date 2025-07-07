<template>
  <section
    class="mt-2 mx-auto max-w-7xl dark:bg-gray-900 min-h-screen dark:text-gray-100"
  >
    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Job Offers</h2>
        <div class="flex space-x-2">
          <button
            @click="toggleViewMode"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
            :disabled="loading"
          >
            <Icon
              :name="viewMode === 'list' ? 'mdi:view-grid' : 'mdi:view-list'"
              class="h-5 w-5 mr-1 text-black dark:text-white"
            />
            {{ viewMode === "list" ? "Card View" : "List View" }}
          </button>
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
            >Offer Date (Range)</label
          >
          <div class="flex space-x-2">
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
            >Offer Status</label
          >
          <select
            v-model="statusFilter"
            class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :disabled="loading"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
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
      <p class="text-gray-500 dark:text-gray-400">Loading job offers...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <Icon
        name="mdi:alert-circle"
        class="h-12 w-12 text-red-500 mx-auto mb-2"
      />
      <p class="text-red-500 dark:text-red-400 mb-2">
        Failed to load job offers
      </p>
      <button
        @click="fetchOffers"
        class="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <!-- Card View -->
    <div
      v-else-if="viewMode === 'card'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="offer in offers.data"
        :key="offer.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border-l-4"
        :class="{
          'border-yellow-500': offer.status === 'pending',
          'border-green-500': offer.status === 'accepted',
          'border-red-500': offer.status === 'rejected',
        }"
      >
        <div class="p-4 h-full flex flex-col">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold">{{ offer.job.job_title }}</h3>
            <span
              class="px-2 py-1 rounded-full text-xs"
              :class="{
                'bg-orange-100 text-yellow-800 dark:bg-yellow-700 dark:text-blue-100':
                  offer.status === 'pending',
                'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100':
                  offer.status === 'accepted',
                'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100':
                  offer.status === 'rejected',
              }"
            >
              {{ formatStatus(offer.status) }}
            </span>
          </div>

          <div class="mt-2">
            <div class="flex items-center">
              <Icon
                name="mdi:map-marker"
                class="text-gray-500 dark:text-gray-400 mr-1"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ offer.job.location }}
              </span>
            </div>
          </div>

          <div class="mt-2 grid grid-cols-2 gap-2">
            <div class="flex items-center">
              <Icon
                name="mdi:clock"
                class="text-gray-500 dark:text-gray-400 mr-1"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ formatJobTime(offer.job.job_time) }}
              </span>
            </div>
            <div class="flex items-center">
              <Icon
                name="mdi:calendar"
                class="text-gray-500 dark:text-gray-400 mr-1"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ formatDate(offer.created_at) }}
              </span>
            </div>
          </div>

          <div class="mt-3 flex-grow">
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {{ offer.job.job_description || "No description provided" }}
            </p>
          </div>

          <div class="mt-2">
            <div class="flex items-center">
              <Icon
                name="mdi:cash"
                class="text-gray-500 dark:text-gray-400 mr-1"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ formatSalary(offer.job) }}
              </span>
            </div>
          </div>

          <div
            v-if="offer.job.required_skills"
            class="mt-3 flex flex-wrap gap-2"
          >
            <span
              v-for="(skill, index) in offer.job.required_skills.split(',')"
              :key="index"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
            >
              {{ skill.trim() }}
            </span>
          </div>

          <div class="mt-4 flex space-x-2">
            <NuxtLink
              :to="`/maids/joboffer-${offer.id}`"
              class="flex-1 text-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600 text-sm"
            >
              View Details
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow mb-6 overflow-x-auto"
    >
      <table class="w-full min-w-[1000px]" id="offerListTable">
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
            <th class="text-left p-2">Job Type</th>
            <th
              class="text-left p-2 cursor-pointer"
              @click="sortBy('created_at')"
            >
              <div class="flex items-center">
                Offered On
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
            <th class="text-left p-2">Salary</th>
            <th class="text-left p-2">Status</th>
            <th class="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="offer in offers.data"
            :key="offer.id"
            class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="p-2 font-medium">{{ offer.job.job_title }}</td>
            <td class="p-2">{{ offer.job.location }}</td>
            <td class="p-2">{{ formatJobTime(offer.job.job_time) }}</td>
            <td class="p-2">{{ formatDate(offer.created_at) }}</td>
            <td class="p-2">{{ formatSalary(offer.job) }}</td>
            <td class="p-2">
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="{
                  'bg-orange-100 text-yellow-800 dark:bg-yellow-700 dark:text-blue-100':
                    offer.status === 'pending',
                  'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100':
                    offer.status === 'accepted',
                  'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100':
                    offer.status === 'rejected',
                }"
              >
                {{ formatStatus(offer.status) }}
              </span>
            </td>
            <td class="p-2 space-x-2 whitespace-nowrap">
              <NuxtLink
                :to="`/maids/joboffer-${offer.id}`"
                class="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600 inline-block cursor-pointer text-sm"
              >
                View
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="offers.data.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          No job offers found matching your criteria
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="offers.data.length > 0"
        class="flex flex-col md:flex-row items-center justify-between mt-4"
      >
        <div class="mb-2 md:mb-0">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ offers.from }} to {{ offers.to }} of
            {{ offers.total }} entries
          </span>
        </div>
        <div class="flex space-x-1">
          <button
            @click="prevPage"
            :disabled="pagination.current_page === 1"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            v-for="page in paginationButtons"
            :key="page"
            @click="goToPage(page)"
            :disabled="page === pagination.current_page"
            :class="[
              'px-3 py-1 border rounded-lg',
              page === pagination.current_page
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.current_page === pagination.total_pages"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="mt-2 md:mt-0">
          <select
            v-model="perPage"
            class="p-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            @change="fetchOffers(1)"
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
const offers = ref({
  data: [],
  from: 0,
  to: 0,
  total: 0,
});
const pagination = ref({
  current_page: 1,
  total_pages: 1,
});

const authStore = useAuthStore();
const viewMode = ref("list"); // 'list' or 'card'

// Filters
const startDate = ref("");
const endDate = ref("");
const statusFilter = ref("");
const searchQuery = ref("");
const perPage = ref(10);

// Sorting
const sortColumn = ref("created_at");
const sortDirection = ref("desc");

// Toggle view mode
const toggleViewMode = () => {
  viewMode.value = viewMode.value === "list" ? "card" : "list";
};

// Debounced search function
const debouncedSearch = debounce(() => {
  fetchOffers(1);
}, 500);

// Handle search input with debounce
const handleSearchInput = () => {
  debouncedSearch();
};

// Fetch job offers from API
const fetchOffers = async (page = 1) => {
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

    const response = await backendApi.get("/maid/offers", {
      params,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    offers.value = {
      data: response.data.data || [],
      from: response.data.from || 0,
      to: response.data.to || 0,
      total: response.data.total || 0,
    };

    pagination.value = {
      current_page: response.data.current_page || 1,
      total_pages: response.data.last_page || 1,
    };
  } catch (err) {
    console.error("Error fetching job offers:", err);
    error.value = "Failed to load job offers. Please try again later.";
  } finally {
    loading.value = false;
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

const formatSalary = (job) => {
  if (!job.salary_min && !job.salary_max) return "Negotiable";
  if (job.salary_min && job.salary_max) {
    return `ETB${job.salary_min} - ETB${job.salary_max}`;
  }
  return job.salary_min ? `$${job.salary_min}` : `$${job.salary_max}`;
};

// Navigation methods
const prevPage = () => {
  if (pagination.value.current_page > 1) {
    fetchOffers(pagination.value.current_page - 1);
  }
};

const nextPage = () => {
  if (pagination.value.current_page < pagination.value.total_pages) {
    fetchOffers(pagination.value.current_page + 1);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchOffers(page);
  }
};

// Pagination buttons
const paginationButtons = computed(() => {
  const buttons = [];
  const current = pagination.value.current_page;
  const total = pagination.value.total_pages;

  // Always show first page
  buttons.push(1);

  // Show pages around current page
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) buttons.push("...");

  for (let i = start; i <= end; i++) {
    buttons.push(i);
  }

  if (end < total - 1) buttons.push("...");

  // Always show last page if different from first
  if (total > 1) buttons.push(total);

  return buttons;
});

// Clear Filters
const clearFilters = () => {
  startDate.value = "";
  endDate.value = "";
  statusFilter.value = "";
  searchQuery.value = "";
  fetchOffers(1);
};

// Print Job List
const printJobList = () => {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Job Offers Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .print-date { text-align: right; margin-bottom: 20px; }
          .print-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .print-filters { margin-bottom: 20px; font-size: 0.9em; }
          .status-pending { color: #1d4ed8; }
          .status-accepted { color: #15803d; }
          .status-rejected { color: #b91c1c; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div>
            <h1>Job Offers Report</h1>
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
              <th>Job Type</th>
              <th>Offered On</th>
              <th>Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${offers.value.data
              .map(
                (offer) => `
              <tr>
                <td>${offer.job.job_title}</td>
                <td>${offer.job.location}</td>
                <td>${formatJobTime(offer.job.job_time)}</td>
                <td>${formatDate(offer.created_at)}</td>
                <td>${formatSalary(offer.job)}</td>
                <td class="status-${offer.status}">${formatStatus(
                  offer.status
                )}</td>
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

// Sort by column
const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "desc";
  }
  fetchOffers(pagination.value.current_page);
};

// Watchers for filters that should trigger API calls
watch([statusFilter, searchQuery, perPage, startDate, endDate], () => {
  fetchOffers(1);
});

watch([sortColumn, sortDirection], () => {
  fetchOffers(pagination.value.current_page);
});

// Initialize
onMounted(() => {
  fetchOffers();
});

definePageMeta({
  layout: "house",
});
</script>