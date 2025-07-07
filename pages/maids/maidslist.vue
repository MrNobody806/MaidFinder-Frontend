<template>
  <section class="py-12 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl font-bold text-center text-lime-500 dark:text-lime-400 mb-8"
      >
        Find a Maid
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
                placeholder="Search maids by name, skill or location"
                @keyup.enter="fetchMaids"
              />
              <button
                @click="fetchMaids"
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
              <!-- Location -->
              <div class="min-w-[140px]">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Location</label
                >
                <select
                  v-model="filters.location"
                  class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Locations</option>
                  <option
                    v-for="location in locations"
                    :key="location"
                    :value="location"
                  >
                    {{ location }}
                  </option>
                </select>
              </div>

              <!-- Skill -->
              <div class="min-w-[140px]">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Skill</label
                >
                <select
                  v-model="filters.skill"
                  class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Skills</option>
                  <option v-for="skill in skills" :key="skill" :value="skill">
                    {{ skill }}
                  </option>
                </select>
              </div>

              <!-- Gender -->
              <div class="min-w-[120px]">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Gender</label
                >
                <select
                  v-model="filters.gender"
                  class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Genders</option>
                  <option
                    v-for="gender in genders"
                    :key="gender"
                    :value="gender"
                  >
                    {{ gender }}
                  </option>
                </select>
              </div>

              <!-- Rating -->
              <div class="min-w-[120px]">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Min Rating</label
                >
                <select
                  v-model="filters.rating"
                  class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
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

      <!-- Top Rated Maids Section -->
      <div v-if="topRatedMaids.length > 0" class="mb-8">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Top Rated Maids
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="maid in topRatedMaids"
            :key="'top-' + maid.id"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-lime-500"
            @click="viewMaidDetail(maid.id)"
          >
            <div class="flex items-start gap-4 mb-4">
              <div class="w-20 h-20 rounded-full overflow-hidden">
                <img
                  :src="maid.image_url || '/placeholder-user.jpg'"
                  :alt="maid.first_name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <h3
                  class="text-xl font-semibold text-gray-800 dark:text-gray-100"
                >
                  {{ maid.first_name }} {{ maid.last_name }}
                </h3>
                <div class="flex items-center mt-1">
                  <Icon
                    name="mdi:map-marker"
                    class="text-gray-500 dark:text-gray-400 mr-1"
                  />
                  <span class="text-gray-600 dark:text-gray-300">{{
                    maid.address
                  }}</span>
                </div>
                <div class="flex items-center mt-2">
                  <div class="flex items-center">
                    <Icon
                      name="mdi:star"
                      class="text-yellow-400 mr-1"
                      v-for="star in Math.floor(parseFloat(maid.rating))"
                      :key="star"
                    />
                    <span class="text-gray-600 dark:text-gray-300 ml-1">
                      {{ maid.rating }} ({{ maid.total_reviews }} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-300">Skill:</span>
                <span class="text-gray-800 dark:text-gray-200 capitalize">
                  {{ maid.skill }}
                </span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-300">Gender:</span>
                <span class="text-gray-800 dark:text-gray-200 capitalize">
                  {{ maid.gender }}
                </span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-300">Age:</span>
                <span class="text-gray-800 dark:text-gray-200">
                  {{ calculateAge(maid.date_of_birth) }} years
                </span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-300">Languages:</span>
                <span class="text-gray-800 dark:text-gray-200">
                  {{ maid.main_language }}
                  <span v-if="maid.other_language"
                    >, {{ maid.other_language }}</span
                  >
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between border-t pt-4">
              <div class="flex items-center">
                <Icon
                  name="mdi:shield-check"
                  class="text-green-500 mr-1"
                  v-if="maid.verification_status === 'verified'"
                />
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ maid.verification_status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Maid Listings -->
      <div>
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-300">Loading maids...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 dark:text-red-400">{{ error }}</p>
          <button
            @click="fetchMaids"
            class="mt-4 px-6 py-2 bg-lime-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>

        <div
          v-else-if="filteredMaids.length === 0"
          class="text-center py-12 text-gray-600 dark:text-gray-300"
        >
          No maids found matching your criteria.
        </div>

        <!-- Grid View -->
        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="maid in filteredMaids"
            :key="maid.id"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            @click="viewMaidDetail(maid.id)"
          >
            <div class="flex items-start gap-4 mb-4">
              <div class="w-20 h-20 rounded-full overflow-hidden">
                <img
                  :src="maid.image_url || '/placeholder-user.jpg'"
                  :alt="maid.first_name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <h3
                  class="text-xl font-semibold text-gray-800 dark:text-gray-100"
                >
                  {{ maid.first_name }} {{ maid.last_name }}
                </h3>
                <div class="flex items-center mt-1">
                  <Icon
                    name="mdi:map-marker"
                    class="text-gray-500 dark:text-gray-400 mr-1"
                  />
                  <span class="text-gray-600 dark:text-gray-300">{{
                    maid.address
                  }}</span>
                </div>
                <div class="flex items-center mt-2">
                  <div class="flex items-center">
                    <Icon
                      name="mdi:star"
                      class="text-yellow-400 mr-1"
                      v-for="star in Math.floor(parseFloat(maid.rating))"
                      :key="star"
                    />
                    <span class="text-gray-600 dark:text-gray-300 ml-1">
                      {{ maid.rating }} ({{ maid.total_reviews }} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-300">Skill:</span>
                <span class="text-gray-800 dark:text-gray-200 capitalize">
                  {{ maid.skill }}
                </span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-300">Gender:</span>
                <span class="text-gray-800 dark:text-gray-200 capitalize">
                  {{ maid.gender }}
                </span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-300">Age:</span>
                <span class="text-gray-800 dark:text-gray-200">
                  {{ calculateAge(maid.date_of_birth) }} years
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between border-t pt-4">
              <div class="flex items-center">
                <Icon
                  name="mdi:shield-check"
                  class="text-green-500 mr-1"
                  v-if="maid.verification_status === 'verified'"
                />
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ maid.verification_status }}
                </span>
              </div>
              <button
                @click.stop="hireMaid(maid.id)"
                class="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition text-sm"
              >
                Hire Now
              </button>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <div
            v-for="maid in filteredMaids"
            :key="maid.id"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            @click="viewMaidDetail(maid.id)"
          >
            <div class="flex flex-col md:flex-row md:items-center gap-6">
              <div class="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <img
                  :src="maid.image_url || '/placeholder-user.jpg'"
                  :alt="maid.first_name"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="flex-1">
                <div
                  class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h3
                      class="text-xl font-semibold text-gray-800 dark:text-gray-100"
                    >
                      {{ maid.first_name }} {{ maid.last_name }}
                    </h3>
                    <div class="flex items-center mt-1">
                      <Icon
                        name="mdi:map-marker"
                        class="text-gray-500 dark:text-gray-400 mr-1"
                      />
                      <span class="text-gray-600 dark:text-gray-300">{{
                        maid.address
                      }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <div class="flex items-center">
                      <Icon
                        name="mdi:star"
                        class="text-yellow-400 mr-1"
                        v-for="star in Math.floor(parseFloat(maid.rating))"
                        :key="star"
                      />
                      <span class="text-gray-600 dark:text-gray-300">
                        {{ maid.rating }} ({{ maid.total_reviews }} reviews)
                      </span>
                    </div>
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="
                        verificationStatusClasses(maid.verification_status)
                      "
                    >
                      {{ maid.verification_status }}
                    </span>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Skill
                    </p>
                    <p class="text-gray-800 dark:text-gray-200 capitalize">
                      {{ maid.skill }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Gender
                    </p>
                    <p class="text-gray-800 dark:text-gray-200 capitalize">
                      {{ maid.gender }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Age</p>
                    <p class="text-gray-800 dark:text-gray-200">
                      {{ calculateAge(maid.date_of_birth) }} years
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Languages
                    </p>
                    <p class="text-gray-800 dark:text-gray-200">
                      {{ maid.main_language }}
                      <span v-if="maid.other_language"
                        >, {{ maid.other_language }}</span
                      >
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex-shrink-0">
                <button
                  @click.stop="hireMaid(maid.id)"
                  class="w-full md:w-auto px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition"
                >
                  Hire Now
                </button>
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
const maids = ref([]);
const showFilters = ref(false);
const viewMode = ref("grid"); // 'grid' or 'list'
const searchQuery = ref("");
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_maids: 0,
});

const filters = ref({
  location: "",
  skill: "",
  gender: "",
  rating: "",
});

const locations = ref([
  "Addis Ababa",
  "Hawassa",
  "Bahir Dar",
  "Gondar",
  "Mekelle",
  "Dire Dawa",
  "Other",
]);

const skills = ref([
  "Cleaning",
  "Cooking",
  "Babysitting",
  "Elderly Care",
  "Laundry",
  "Other",
]);

const genders = ref(["male", "female"]);

// Computed
const filteredMaids = computed(() => {
  return maids.value.filter((maid) => {
    const matchesSearch = searchQuery.value
      ? maid.first_name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        maid.last_name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        maid.skill.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        maid.address.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true;

    const matchesLocation = filters.value.location
      ? maid.address.includes(filters.value.location)
      : true;
    const matchesSkill = filters.value.skill
      ? maid.skill.includes(filters.value.skill)
      : true;
    const matchesGender = filters.value.gender
      ? maid.gender === filters.value.gender
      : true;
    const matchesRating = filters.value.rating
      ? parseFloat(maid.rating) >= parseFloat(filters.value.rating)
      : true;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesSkill &&
      matchesGender &&
      matchesRating
    );
  });
});

const topRatedMaids = computed(() => {
  // Get maids with rating >= 4 and sort by rating
  return [...filteredMaids.value]
    .filter((maid) => parseFloat(maid.rating) >= 4)
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 3);
});

// Methods
const verificationStatusClasses = (status) => {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const calculateAge = (dateString) => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const fetchMaids = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const params = {
      page: pagination.value.current_page,
      search: searchQuery.value,
      location: filters.value.location,
      skill: filters.value.skill,
      gender: filters.value.gender,
      rating: filters.value.rating,
    };

    const response = await backendApi.get("/maids/verified", {
      params,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    maids.value = response.data.data || [];
    pagination.value = {
      current_page: response.data.current_page || 1,
      total_pages: response.data.last_page || 1,
      total_maids: response.data.total || 0,
    };
  } catch (err) {
    error.value = err.message || "Failed to fetch maids";
  } finally {
    loading.value = false;
  }
};

const hireMaid = (maidId) => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }
  router.push(`/maids/maids-${maidId}`);
};

const viewMaidDetail = (maidId) => {
  router.push(`/maids/maids-${maidId}`);
};

const clearFilters = () => {
  filters.value = {
    location: "",
    skill: "",
    gender: "",
    rating: "",
  };
  searchQuery.value = "";
  fetchMaids();
};

const prevPage = () => {
  if (pagination.value.current_page > 1) {
    pagination.value.current_page--;
    fetchMaids();
  }
};

const nextPage = () => {
  if (pagination.value.current_page < pagination.value.total_pages) {
    pagination.value.current_page++;
    fetchMaids();
  }
};

const goToPage = (page) => {
  pagination.value.current_page = page;
  fetchMaids();
};

// Lifecycle
onMounted(() => {
  fetchMaids();
});

definePageMeta({
  layout: "house",
});
</script>
