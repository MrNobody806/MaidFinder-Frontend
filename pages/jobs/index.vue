<template>
  <!---listing section-->
  <section class="py-12 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl font-bold text-center text-lime-500 dark:text-lime-400 mb-8"
      >
        Find a Job
      </h2>

      <!-- Job Listings -->
      <div>
        <!-- Search Bar -->
        <div
          class="mb-8 flex flex-col md:flex-row justify-center items-center gap-4"
        >
          <!-- Search Bar -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title or description"
            class="w-full md:w-1/2 p-2 border border-lime-300 dark:border-lime-600 rounded-lg focus:border-lime-300 dark:focus:border-lime-400 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />

          <!-- Toggle Filters Button -->
          <button
            @click="toggleFilters"
            class="w-full md:w-auto py-2 px-4 text-white bg-black hover:text-black hover:bg-lime-400 dark:bg-[#B9FF66] dark:text-[#191A23] rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Icon
              :name="
                showFilters
                  ? 'ic:baseline-filter-alt-off'
                  : 'ic:baseline-filter-alt'
              "
              class="transition-transform duration-300"
            />
            <span>{{ showFilters ? "Hide Filters" : "Show Filters" }}</span>
          </button>
        </div>

        <!-- Filters Section (Conditional Rendering) -->
        <div
          v-if="showFilters"
          class="flex flex-col md:flex-row justify-center gap-4 mb-8"
        >
          <!-- Category Dropdown -->
          <select
            v-model="filters.category"
            class="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Category</option>
            <option value="Cooking">Cooking</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Childcare">Childcare</option>
          </select>

          <!-- Type Dropdown -->
          <select
            v-model="filters.type"
            class="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Type</option>
            <option value="full time">Full Time</option>
            <option value="part time">Part Time</option>
            <option value="contract">Contract</option>
          </select>

          <!-- Rate Dropdown -->
          <select
            v-model="filters.rate"
            class="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Rate</option>
            <option value="0-15">0-15 ETB/hr</option>
            <option value="15-25">15-25 ETB/hr</option>
            <option value="25-35">25-35 ETB/hr</option>
            <option value="35+">35+ ETB/hr</option>
          </select>

          <button
            @click="applyFilters"
            class="w-full md:w-auto px-6 py-2 text-white bg-black hover:text-black hover:bg-lime-400 dark:bg-[#B9FF66] dark:text-[#191A23] rounded-lg"
          >
            Apply Filters
          </button>
        </div>

        <!-- Selected Filters with Cancel Option -->
        <div v-if="activeFilters.length > 0" class="mb-8">
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(filter, index) in activeFilters"
              :key="index"
              class="flex items-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full px-3 py-1"
            >
              <span>{{ filter.label }}: {{ filter.value }}</span>
              <button
                @click="removeFilter(filter)"
                class="ml-2 text-blue-800 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-300"
              >
                &times;
              </button>
            </div>
          </div>
        </div>

        <!-- View Toggle Buttons -->
        <div class="flex justify-end mb-8">
          <button
            @click="viewMode = 'grid'"
            :class="{
              'bg-black text-white': viewMode === 'grid',
              'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200':
                viewMode !== 'grid',
            }"
            class="p-2 rounded-l-lg hover:bg-gray-900"
          >
            Grid View
          </button>
          <button
            @click="viewMode = 'list'"
            :class="{
              'bg-black text-white': viewMode === 'list',
              'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200':
                viewMode !== 'list',
            }"
            class="p-2 rounded-r-lg hover:bg-gray-900"
          >
            List View
          </button>
        </div>

        <!-- Loading State with Skeleton -->
        <div v-if="loading" class="space-y-6">
          <div
            v-for="i in 6"
            :key="i"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse"
          >
            <div
              class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"
            ></div>
            <div
              class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"
            ></div>
            <div
              class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"
            ></div>
            <div
              class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"
            ></div>
            <div
              class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"
            ></div>
            <div class="flex space-x-2 mb-6">
              <div
                class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
              ></div>
              <div
                class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
              ></div>
            </div>
            <div
              class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"
            ></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 dark:text-red-400">{{ error }}</p>
          <button
            @click="fetchJobs"
            class="mt-4 px-6 py-2 text-white bg-black hover:text-black hover:bg-lime-400 dark:bg-[#B9FF66] dark:text-[#191A23] rounded-lg"
          >
            Retry
          </button>
        </div>

        <!-- Job Listings -->
        <div v-else>
          <div
            v-if="filteredJobs.length === 0"
            class="text-center py-12 text-gray-600 dark:text-gray-300"
          >
            No jobs found matching your criteria.
          </div>

          <div
            v-else
            :class="{
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8':
                viewMode === 'grid',
              'space-y-4': viewMode === 'list',
            }"
          >
            <div
              v-for="job in paginatedJobs"
              :key="job.id"
              :class="{
                'bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg':
                  viewMode === 'grid',
                'bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between':
                  viewMode === 'list',
              }"
            >
              <div
                :class="{
                  'w-full': viewMode === 'grid',
                  'md:w-2/3': viewMode === 'list',
                }"
              >
                <h3
                  class="text-xl font-semibold text-gray-800 dark:text-gray-100"
                >
                  {{ job.title }}
                </h3>
                <div class="flex items-center mt-2 mb-3">
                  <svg
                    class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <p class="text-gray-600 dark:text-gray-300">
                    {{ job.location }}
                  </p>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ job.description }}
                </p>

                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    class="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-sm capitalize"
                  >
                    {{ job.job_time }}
                  </span>
                  <span
                    v-if="job.household_name"
                    class="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-sm"
                  >
                    {{ job.household_name }}
                  </span>
                </div>
              </div>

              <div
                :class="{
                  'w-full': viewMode === 'grid',
                  'md:w-1/3 md:text-right': viewMode === 'list',
                }"
              >
                <div class="mb-4">
                  <p
                    class="text-lg font-semibold text-gray-800 dark:text-gray-100"
                  >
                    {{ job.salary_range }} ETB
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Starts: {{ formatDate(job.expected_start_date) }}
                  </p>
                </div>
                <button
                  @click="applyForJob(job.id)"
                  class="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-200 flex items-center justify-center"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div class="flex justify-center items-center mt-6 space-x-4">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-700 dark:text-gray-300 font-semibold">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import backendApi from "@/networkServices/api/backendApi.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  job_time: string;
  salary_range: string;
  expected_start_date: string;
  created_at: string;
  household_name: string;
}

interface Filter {
  category: string;
  type: string;
  rate: string;
}

interface ActiveFilter {
  key: keyof Filter;
  label: string;
  value: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_jobs: number;
}

const router = useRouter();
const authStore = useAuthStore();

// State
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const jobs = ref<Job[]>([]);
const pagination = ref<Pagination>({
  current_page: 1,
  total_pages: 1,
  total_jobs: 0,
});
const searchQuery = ref<string>("");
const filters = ref<Filter>({
  category: "",
  type: "",
  rate: "",
});
const activeFilters = ref<ActiveFilter[]>([]);
const showFilters = ref<boolean>(false);
const viewMode = ref<"grid" | "list">("grid");
const currentPage = ref<number>(1);
const itemsPerPage = 6;

// Computed properties
const filteredJobs = computed<Job[]>(() => {
  return jobs.value.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory = filters.value.category
      ? job.title.includes(filters.value.category)
      : true;
    const matchesType = filters.value.type
      ? job.job_time === filters.value.type.toLowerCase()
      : true;

    const salaryParts = job.salary_range.split(" - ");
    const minSalary = parseFloat(salaryParts[0]);
    const rateFilter = filters.value.rate;
    let matchesRate = true;

    if (rateFilter) {
      if (rateFilter.includes("+")) {
        const min = parseFloat(rateFilter.replace("+", ""));
        matchesRate = minSalary >= min;
      } else {
        const [min, max] = rateFilter.split("-").map(Number);
        matchesRate = minSalary >= min && minSalary <= max;
      }
    }

    return matchesSearch && matchesCategory && matchesType && matchesRate;
  });
});

const paginatedJobs = computed<Job[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredJobs.value.slice(start, end);
});

const totalPages = computed<number>(() => {
  return Math.ceil(filteredJobs.value.length / itemsPerPage);
});

// Methods
const fetchJobs = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await backendApi.get("/public/open-job");
    jobs.value = response.data.jobs || [];
    pagination.value = {
      current_page: response.data.pagination?.current_page || 1,
      total_pages: response.data.pagination?.total_pages || 1,
      total_jobs: response.data.pagination?.total_jobs || 0,
    };
  } catch (err: any) {
    error.value = err.message || "Failed to fetch jobs";
    console.error("Error fetching jobs:", err);
  } finally {
    loading.value = false;
  }
};

const applyForJob = async (jobId: number): Promise<void> => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  try {
    await backendApi.post(
      `/jobs/${jobId}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    alert("Application submitted successfully!");
    await fetchJobs();
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to apply for job";
    if (err.response?.status === 401) {
      router.push("/login");
    }
  }
};

const toggleFilters = (): void => {
  showFilters.value = !showFilters.value;
};

const applyFilters = (): void => {
  activeFilters.value = [];
  if (filters.value.category)
    activeFilters.value.push({
      key: "category",
      label: "Category",
      value: filters.value.category,
    });
  if (filters.value.type)
    activeFilters.value.push({
      key: "type",
      label: "Type",
      value: filters.value.type,
    });
  if (filters.value.rate)
    activeFilters.value.push({
      key: "rate",
      label: "Rate",
      value: filters.value.rate,
    });
};

const removeFilter = (filter: ActiveFilter): void => {
  filters.value[filter.key] = "";
  activeFilters.value = activeFilters.value.filter((f) => f.key !== filter.key);
};

const nextPage = (): void => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Watchers
watch([searchQuery, filters], () => {
  currentPage.value = 1;
});

// Lifecycle hooks
onMounted(() => {
  fetchJobs();
});
</script>
