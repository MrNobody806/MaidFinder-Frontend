<template>
  <section class="dark:bg-gray-900 min-h-screen dark:text-gray-100">
    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Maids Profiles Management</h2>
        <div class="flex space-x-2">
          <button
            @click="printUserList"
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
            placeholder="Search by name or address"
            class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :disabled="loading"
            @input="handleSearchInput"
          />
        </div>

        <!-- Date Range Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Registration Date (Range)</label
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

        <!-- Verification Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Verification</label
          >
          <select
            v-model="verificationFilter"
            class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :disabled="loading"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
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
      <p class="text-gray-500 dark:text-gray-400">Loading maid profiles...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <Icon
        name="mdi:alert-circle"
        class="h-12 w-12 text-red-500 mx-auto mb-2"
      />
      <p class="text-red-500 dark:text-red-400 mb-2">
        Failed to load maid profiles
      </p>
      <button
        @click="fetchMaids"
        class="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <!-- Maids Table -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow mb-6 overflow-x-auto"
    >
      <table class="w-full min-w-[1000px]" id="userListTable">
        <thead>
          <tr class="border-b dark:border-gray-700">
            <th class="text-left p-2 cursor-pointer" @click="sortBy('name')">
              <div class="flex items-center">
                Name
                <Icon
                  v-if="sortColumn === 'name'"
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
            <th
              class="text-left p-2 cursor-pointer"
              @click="sortBy('created_at')"
            >
              <div class="flex items-center">
                Registered
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
            <th
              class="text-left p-2 cursor-pointer"
              @click="sortBy('verification_status')"
            >
              <div class="flex items-center">
                Verification
                <Icon
                  v-if="sortColumn === 'verification_status'"
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
            v-for="maid in maids.data"
            :key="maid.id"
            class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="p-2">{{ getFullName(maid) }}</td>
            <td class="p-2">{{ maid.address || "N/A" }}</td>
            <td class="p-2">{{ formatDate(maid.created_at) }}</td>
            <td class="p-2">
              <span :class="verificationClass(maid.verification_status)">
                {{ formatVerificationStatus(maid.verification_status) }}
              </span>
            </td>
            <td class="p-2 space-x-2 whitespace-nowrap">
              <NuxtLink
                @click="viewUserDetails(maid.id)"
                class="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600 inline-block cursor-pointer"
              >
                View
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="maids.data.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          No maid profiles found matching your criteria
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="maids.data.length > 0"
        class="flex flex-col md:flex-row items-center justify-between mt-4"
      >
        <div class="mb-2 md:mb-0">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ maids.from }} to {{ maids.to }} of
            {{ maids.total }} entries
          </span>
        </div>
        <div class="flex space-x-1">
          <button
            @click="prevPage"
            :disabled="maids.current_page === 1"
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
            :disabled="maids.current_page === maids.last_page"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="mt-2 md:mt-0">
          <select
            v-model="perPage"
            class="p-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            @change="fetchMaids(1)"
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
const maids = ref({
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
const verificationFilter = ref("");
const searchQuery = ref("");
const perPage = ref(10);

// Sorting
const sortColumn = ref("created_at");
const sortDirection = ref("desc");

// Debounced search function
const debouncedSearch = debounce(() => {
  fetchMaids(1);
}, 500);

// Handle search input with debounce
const handleSearchInput = () => {
  debouncedSearch();
};

// Fetch maid profiles from API
const fetchMaids = async (page = 1) => {
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
    if (verificationFilter.value) {
      params.verification_status = verificationFilter.value;
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

    const response = await backendApi.get("/maid-profiles", {
      params,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    maids.value = {
      data: response.data.data || [],
      current_page: response.data.current_page || 1,
      from: response.data.from || 0,
      to: response.data.to || 0,
      total: response.data.total || 0,
      last_page: response.data.last_page || 1,
      per_page: response.data.per_page || perPage.value,
      links: response.data.links || [],
    };
  } catch (err) {
    console.error("Error fetching maid profiles:", err);
    error.value = "Failed to load maid profiles. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Format full name
const getFullName = (maid) => {
  return `${maid.first_name} ${maid.middle_name ? maid.middle_name + " " : ""}${
    maid.last_name
  }`;
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format verification status for display
const formatVerificationStatus = (status) => {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Verification Class
const verificationClass = (status) => {
  if (!status) status = "pending";

  switch (status.toLowerCase()) {
    case "verified":
      return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs dark:bg-green-700 dark:text-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs dark:bg-yellow-700 dark:text-yellow-100";
    case "rejected":
      return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm dark:bg-red-700 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs dark:bg-gray-700 dark:text-gray-100";
  }
};

// Navigation methods
const prevPage = () => {
  if (maids.value.current_page > 1) {
    fetchMaids(maids.value.current_page - 1);
  }
};

const nextPage = () => {
  if (maids.value.current_page < maids.value.last_page) {
    fetchMaids(maids.value.current_page + 1);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= maids.value.last_page) {
    fetchMaids(page);
  }
};

// Pagination buttons
const paginationButtons = computed(() => {
  if (!maids.value.links || maids.value.links.length <= 3) {
    return [];
  }
  return maids.value.links.slice(1, -1);
});

// Clear Filters
const clearFilters = () => {
  startDate.value = "";
  endDate.value = "";
  verificationFilter.value = "";
  searchQuery.value = "";
  fetchMaids(1);
};

const viewUserDetails = (maidID) => {
  router.push(`/mod/maidsprofilelist/${maidID}`);
};

// Print Maid List
const printUserList = () => {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Maids Profiles Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .verification-verified { background-color: #d4edda; color: #155724; }
          .verification-pending { background-color: #fff3cd; color: #856404; }
          .verification-rejected { background-color: #f8d7da; color: #721c24; }
          .print-date { text-align: right; margin-bottom: 20px; }
          .print-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .print-filters { margin-bottom: 20px; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div>
            <h1>Maids Profiles Report</h1>
            <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
          </div>
        </div>

        <div class="print-filters">
          <strong>Filters Applied:</strong><br>
          ${
            verificationFilter.value
              ? `Verification: ${formatVerificationStatus(
                  verificationFilter.value
                )}<br>`
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
              <th>Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Registered</th>
              <th>Verification</th>
            </tr>
          </thead>
          <tbody>
            ${maids.value.data
              .map(
                (maid) => `
              <tr>
                <td>${getFullName(maid)}</td>
                <td>${maid.phone_number1 || "N/A"}</td>
                <td>${maid.gender || "N/A"}</td>
                <td>${maid.address || "N/A"}</td>
                <td>${formatDate(maid.created_at)}</td>
                <td class="verification-${
                  maid.verification_status
                    ? maid.verification_status.toLowerCase()
                    : "pending"
                }">
                  ${formatVerificationStatus(maid.verification_status)}
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

// Sort method
const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
};

// Watchers for filters that should trigger API calls
watch([verificationFilter, startDate, endDate, perPage], () => {
  fetchMaids(1);
});

watch([sortColumn, sortDirection], () => {
  fetchMaids(maids.value.current_page);
});

// Initialize
onMounted(() => {
  fetchMaids();
});

definePageMeta({
  layout: "mod",
});
</script>
