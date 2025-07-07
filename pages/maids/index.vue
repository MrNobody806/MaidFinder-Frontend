<template>
  <section class="py-12 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl font-bold text-center text-lime-500 dark:text-lime-400 mb-8"
      >
        Find a Maid Now
      </h2>

      <!-- Search Bar -->
      <div
        class="mb-8 flex flex-col md:flex-row justify-center items-center gap-4"
      >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by skill (e.g., Cooking, Cleaning)"
          class="w-full md:w-1/2 p-2 border border-lime-300 dark:border-lime-600 rounded-lg focus:border-lime-300 dark:focus:border-lime-400 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <div class="flex gap-4">
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
      </div>
      <div class="flex justify-end mb-8">
        <button
          @click="toggleViewMode"
          class="w-full md:w-auto py-2 px-4 text-white bg-black hover:text-black hover:bg-lime-400 dark:bg-[#B9FF66] dark:text-[#191A23] rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Icon
            :name="viewMode === 'grid' ? 'mdi:view-list' : 'mdi:view-grid'"
          />
          <span>{{ viewMode === "grid" ? "List View" : "Grid View" }}</span>
        </button>
      </div>

      <!-- Filters Section -->
      <div
        v-if="showFilters"
        class="flex flex-col md:flex-row justify-center gap-4 mb-8"
      >
        <!-- Gender Dropdown -->
        <select
          v-model="filters.gender"
          class="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        <!-- Type Dropdown -->
        <select
          v-model="filters.type"
          class="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Job Type</option>
          <option value="full time">Full Time</option>
          <option value="part time">Part Time</option>
          <option value="contract">Contract</option>
        </select>

        <!-- Rate Dropdown -->
        <select
          v-model="filters.rate"
          class="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Rating</option>
          <option value="1">1+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
        </select>

        <button
          @click="applyFilters"
          class="w-full md:w-auto px-6 py-2 text-white bg-black hover:text-black hover:bg-lime-400 dark:bg-[#B9FF66] dark:text-[#191A23] rounded-lg"
        >
          Apply Filters
        </button>
      </div>

      <!-- Selected Filters -->
      <div v-if="activeFilters.length > 0" class="mb-8">
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(filter, index) in activeFilters"
            :key="index"
            class="flex items-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full px-3 py-1"
          >
            <span>{{ filter.label }}: {{ filter.value }}</span>
            <button
              @click="removeFilter(filter.key)"
              class="ml-2 text-blue-800 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-300"
            >
              &times;
            </button>
          </div>
        </div>
      </div>

      <!-- Loading and Error States -->
      <div v-if="loading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Loading maids...</p>
      </div>

      <div
        v-if="error"
        class="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 p-4 rounded-lg mb-8 text-center"
      >
        {{ error }}
      </div>

      <!-- Maid List -->
      <div v-if="!loading && !error">
        <!-- Skeleton Loader -->
        <div
          v-if="maids.length === 0"
          :class="{
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8':
              viewMode === 'grid',
            'space-y-6': viewMode === 'list',
          }"
        >
          <div
            v-for="n in itemsPerPage"
            :key="n"
            :class="{
              'bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden':
                viewMode === 'grid',
              'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6':
                viewMode === 'list',
            }"
          >
            <div class="animate-pulse">
              <div
                v-if="viewMode === 'grid'"
                class="h-48 bg-gray-200 dark:bg-gray-700"
              ></div>
              <div v-else class="flex flex-col md:flex-row items-center gap-6">
                <div
                  class="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
                <div class="flex-1 space-y-4 w-full">
                  <div
                    class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"
                  ></div>
                  <div class="space-y-2">
                    <div
                      class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
                    ></div>
                    <div
                      class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"
                    ></div>
                    <div
                      class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"
                    ></div>
                    <div
                      class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/6"
                    ></div>
                  </div>
                </div>
                <div
                  class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actual Maid Cards -->
        <div
          v-else
          :class="{
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8':
              viewMode === 'grid',
            'space-y-6': viewMode === 'list',
          }"
        >
          <div
            v-for="maid in paginatedMaids"
            :key="maid.id"
            :class="{
              'bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]':
                viewMode === 'grid',
              'bg-white dark:bg-gray-800 rounded-lg shadow-lg':
                viewMode === 'list',
            }"
          >
            <!-- Maid Card Content - Grid View -->
            <div v-if="viewMode === 'grid'" class="h-full flex flex-col">
              <div class="relative h-48 overflow-hidden">
                <img
                  :src="maid.image_url || '/default-profile.jpg'"
                  :alt="`${maid.first_name} ${maid.last_name}`"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                >
                  <h3 class="text-xl font-bold text-white">
                    {{ maid.first_name }} {{ maid.last_name }}
                  </h3>
                  <div class="flex items-center mt-1">
                    <div class="flex text-yellow-400">
                      <span v-for="star in 5" :key="star">
                        <Icon
                          :name="
                            star <= Math.round(maid.rating)
                              ? 'mdi:star'
                              : 'mdi:star-outline'
                          "
                        />
                      </span>
                    </div>
                    <span class="text-white text-sm ml-2"
                      >({{ maid.total_reviews }})</span
                    >
                  </div>
                </div>
              </div>
              <div class="p-4 flex-grow">
                <div class="flex items-center mb-2">
                  <Icon name="mdi:briefcase" class="text-lime-500 mr-2" />
                  <span class="text-gray-600 dark:text-gray-300">{{
                    maid.skill
                  }}</span>
                </div>
                <div class="flex items-center mb-2">
                  <Icon name="mdi:clock-outline" class="text-lime-500 mr-2" />
                  <span class="text-gray-600 dark:text-gray-300">{{
                    maid.job_time
                  }}</span>
                </div>
                <div class="flex items-center mb-2">
                  <Icon
                    name="mdi:gender-male-female"
                    class="text-lime-500 mr-2"
                  />
                  <span class="text-gray-600 dark:text-gray-300">{{
                    maid.gender
                  }}</span>
                </div>
                <div class="flex items-center">
                  <Icon name="mdi:map-marker" class="text-lime-500 mr-2" />
                  <span class="text-gray-600 dark:text-gray-300">{{
                    maid.address
                  }}</span>
                </div>
              </div>
              <div class="p-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  class="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-200 flex items-center justify-center"
                >
                  <Icon name="mdi:account-plus" class="mr-2" />
                  Hire Now
                </button>
              </div>
            </div>

            <!-- Maid Card Content - List View -->
            <div
              v-else
              class="p-6 flex flex-col md:flex-row items-center gap-6"
            >
              <div class="flex-shrink-0">
                <img
                  :src="maid.image_url || '/default-profile.jpg'"
                  :alt="`${maid.first_name} ${maid.last_name}`"
                  class="w-32 h-32 rounded-full object-cover border-4 border-lime-500"
                />
              </div>
              <div class="flex-grow w-full">
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {{ maid.first_name }} {{ maid.last_name }}
                </h3>
                <div class="flex items-center my-2">
                  <div class="flex text-yellow-400">
                    <span v-for="star in 5" :key="star">
                      <Icon
                        :name="
                          star <= Math.round(maid.rating)
                            ? 'mdi:star'
                            : 'mdi:star-outline'
                        "
                      />
                    </span>
                  </div>
                  <span class="text-gray-600 dark:text-gray-300 text-sm ml-2"
                    >({{ maid.total_reviews }} reviews)</span
                  >
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div class="flex items-center">
                    <Icon name="mdi:briefcase" class="text-lime-500 mr-2" />
                    <span class="text-gray-600 dark:text-gray-300">{{
                      maid.skill
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="mdi:clock-outline" class="text-lime-500 mr-2" />
                    <span class="text-gray-600 dark:text-gray-300">{{
                      maid.job_time
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon
                      name="mdi:gender-male-female"
                      class="text-lime-500 mr-2"
                    />
                    <span class="text-gray-600 dark:text-gray-300">{{
                      maid.gender
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="mdi:map-marker" class="text-lime-500 mr-2" />
                    <span class="text-gray-600 dark:text-gray-300">{{
                      maid.address
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="flex-shrink-0">
                <button
                  class="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 py-2 rounded transition-colors duration-200 flex items-center"
                >
                  <Icon name="mdi:account-plus" class="mr-2" />
                  Hire Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div
          v-if="!loading && filteredMaids.length === 0 && maids.length > 0"
          class="text-center py-8"
        >
          <p class="text-gray-600 dark:text-gray-300">
            No maids found matching your criteria.
          </p>
        </div>

        <!-- Pagination Controls -->
        <div
          v-if="filteredMaids.length > 0"
          class="flex justify-center items-center mt-6 space-x-4"
        >
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
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import backendApi from "@/networkServices/api/backendApi.js";

const maids = ref([]);
const loading = ref(false);
const error = ref(null);
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
});

const searchQuery = ref("");
const filters = ref({
  gender: "",
  type: "",
  rate: "",
});
const activeFilters = ref([]);
const showFilters = ref(false);
const viewMode = ref("grid");
const currentPage = ref(1);
const itemsPerPage = 6;

const fetchMaids = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await backendApi.get("/public/verified-maid");
    maids.value = response.data.data || [];
    pagination.value = {
      current_page: response.data.current_page || 1,
      total_pages: response.data.last_page || 1,
      total_items: response.data.total || 0,
    };
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Failed to fetch maids";
    console.error("Error fetching maids:", err);
  } finally {
    loading.value = false;
  }
};

const filteredMaids = computed(() => {
  return maids.value.filter((maid) => {
    // Search by skill
    const matchesSearch = maid.skill
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    // Filter by gender
    const matchesGender = filters.value.gender
      ? maid.gender.toLowerCase() === filters.value.gender.toLowerCase()
      : true;

    // Filter by type (job_time in API response)
    const matchesType = filters.value.type
      ? maid.job_time.toLowerCase() === filters.value.type.toLowerCase()
      : true;

    // Filter by rating
    const maidRating = parseFloat(maid.rating);
    const matchesRate = filters.value.rate
      ? maidRating >= parseFloat(filters.value.rate)
      : true;

    // Combine all filters
    return matchesSearch && matchesGender && matchesType && matchesRate;
  });
});

const paginatedMaids = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredMaids.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredMaids.value.length / itemsPerPage);
});

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid";
};

const applyFilters = () => {
  activeFilters.value = [];
  if (filters.value.gender)
    activeFilters.value.push({
      key: "gender",
      label: "Gender",
      value: filters.value.gender,
    });
  if (filters.value.type)
    activeFilters.value.push({
      key: "type",
      label: "Job Type",
      value: filters.value.type,
    });
  if (filters.value.rate)
    activeFilters.value.push({
      key: "rate",
      label: "Rating",
      value: filters.value.rate + "+ stars",
    });

  currentPage.value = 1;
};

const removeFilter = (key) => {
  filters.value[key] = "";
  activeFilters.value = activeFilters.value.filter(
    (filter) => filter.key !== key
  );
  currentPage.value = 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Fetch maids when component is mounted
onMounted(() => {
  fetchMaids();
});
</script>
