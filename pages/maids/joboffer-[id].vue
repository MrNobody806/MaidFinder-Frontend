<template>
  <section class="mx-auto max-w-7xl dark:bg-gray-900 min-h-screen dark:text-gray-100 p-4 md:p-6">
    <!-- Modals -->
    <!-- Accept Confirmation Modal -->
    <div v-if="showAcceptModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="p-6 text-center">
            <Icon name="mdi:check-circle-outline" class="mx-auto h-16 w-16 text-green-500" />
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
              Accept Job Offer
            </h3>
            <div class="mt-4 text-gray-600 dark:text-gray-300">
              <p>Are you sure you want to accept this job offer?</p>
              <p class="mt-2 font-medium">
                {{ job.job_title || "This job" }}
              </p>
            </div>
            <div class="mt-6 flex justify-center gap-4">
              <button
                @click="showAcceptModal = false"
                class="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                @click="acceptJob"
                class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                :disabled="isResponding"
              >
                <span>Yes, Accept</span>
                <Icon v-if="isResponding" name="mdi:loading" class="animate-spin" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Confirmation Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="p-6 text-center">
            <Icon name="mdi:alert-circle-outline" class="mx-auto h-16 w-16 text-red-500" />
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
              Reject Job Offer
            </h3>
            <div class="mt-4 text-gray-600 dark:text-gray-300">
              <p>Are you sure you want to reject this job offer?</p>
              <p class="mt-2 font-medium">
                {{ job.job_title || "This job" }}
              </p>
            </div>
            <div class="mt-6 flex justify-center gap-4">
              <button
                @click="showRejectModal = false"
                class="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                @click="rejectJob"
                class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                :disabled="isResponding"
              >
                <span>Yes, Reject</span>
                <Icon v-if="isResponding" name="mdi:loading" class="animate-spin" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="p-6 text-center">
            <Icon name="mdi:check-circle" class="mx-auto h-16 w-16 text-green-500" />
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
              {{ successMessage }}
            </h3>
            <div class="mt-4 text-gray-600 dark:text-gray-300">
              <p v-if="invite.status === 'accepted'">
                You've accepted the job offer for
                <span class="font-medium">{{ job.job_title }}</span>.
              </p>
              <p v-else-if="invite.status === 'declined'">
                You've declined the job offer for
                <span class="font-medium">{{ job.job_title }}</span>.
              </p>
            </div>
            <div class="mt-6">
              <button
                @click="showSuccessModal = false"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back Button -->
    <div class="container mx-auto mb-6">
      <button
        @click="$router.go(-1)"
        class="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group"
      >
        <Icon name="mdi:arrow-left" class="mr-2 transition-transform group-hover:-translate-x-1" />
        <span>Back to Invitations</span>
      </button>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto">
      <!-- Status Banner -->
      <div
        class="h-2 w-full rounded-t-xl"
        :class="{
          'bg-blue-500': isPending,
          'bg-green-500': isAccepted,
          'bg-red-500': isDeclined,
          'animate-pulse': isPending,
        }"
      ></div>

      <!-- Job Card -->
      <div class="bg-white dark:bg-gray-800 rounded-b-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="p-6 md:p-8">
          <!-- Header Section -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  {{ job.job_title || "No title provided" }}
                </h1>
                <span
                  class="px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': isPending,
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': isAccepted,
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': isDeclined,
                  }"
                >
                  {{ formattedStatus }}
                </span>
              </div>
              
              <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <Icon name="mdi:map-marker-outline" class="mr-1.5 flex-shrink-0" />
                  <span>{{ job.location || "Location not specified" }}</span>
                </div>
                
                <div class="flex items-center">
                  <Icon name="mdi:calendar-clock" class="mr-1.5 flex-shrink-0" />
                  <span>Posted {{ formatDate(job.created_at) }}</span>
                </div>
                
                <div class="flex items-center">
                  <Icon name="mdi:account-multiple" class="mr-1.5 flex-shrink-0" />
                  <span>{{ job.num_of_maids || 1 }} maid(s) needed</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="printJobDetails"
                class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Icon name="mdi:printer" class="text-gray-600 dark:text-gray-300" />
              </button>
              
              <button
                @click="showAcceptModal = true"
                class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                :class="{
                  'bg-green-500 hover:bg-green-600 text-white': isPending,
                  'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed': !isPending
                }"
                :disabled="!isPending"
              >
                <Icon name="mdi:check" class="h-5 w-5" />
                <span class="hidden sm:inline">Accept</span>
              </button>
              
              <button
                @click="showRejectModal = true"
                class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                :class="{
                  'bg-red-500 hover:bg-red-600 text-white': isPending,
                  'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed': !isPending
                }"
                :disabled="!isPending"
              >
                <Icon name="mdi:close" class="h-5 w-5" />
                <span class="hidden sm:inline">Decline</span>
              </button>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left Column - Job Details -->
            <div class="flex-1 space-y-6">
              <!-- Job Highlights -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Job Type Card -->
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-100 dark:bg-blue-700 rounded-lg">
                      <Icon name="mdi:clock-outline" class="text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Job Type</p>
                      <p class="font-medium">
                        {{ formatJobTime(job.job_time) || "Not specified" }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Salary Card -->
                <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-xl border border-green-100 dark:border-green-800">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-green-100 dark:bg-green-700 rounded-lg">
                      <Icon name="mdi:cash-multiple" class="text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Salary</p>
                      <p class="font-medium">{{ formatSalary(job) }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Start Date Card -->
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-purple-100 dark:bg-purple-700 rounded-lg">
                      <Icon name="mdi:calendar-start" class="text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Expected Start</p>
                      <p class="font-medium">
                        {{ formatDate(job.expected_start_date) || "Flexible" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Job Description Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 class="text-xl font-semibold flex items-center gap-2">
                    <Icon name="mdi:text-box-outline" class="text-indigo-500" />
                    Job Description
                  </h3>
                </div>
                <div class="p-5">
                  <template v-if="job.job_description">
                    <p class="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {{ job.job_description }}
                    </p>
                  </template>
                  <template v-else>
                    <p class="text-gray-400 dark:text-gray-500 italic">
                      No description provided
                    </p>
                  </template>
                </div>
              </div>

              <!-- Requirements Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 class="text-xl font-semibold flex items-center gap-2">
                    <Icon name="mdi:clipboard-list-outline" class="text-purple-500" />
                    Requirements
                  </h3>
                </div>
                <div class="p-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Skills Required
                      </p>
                      <p class="font-medium">
                        {{ job.required_skills || "Not specified" }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Language
                      </p>
                      <p class="font-medium">
                        {{ job.language_requirement || "Not specified" }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Gender Preference
                      </p>
                      <p class="font-medium">
                        {{ job.gender_preference || "No preference" }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Religion Preference
                      </p>
                      <p class="font-medium">
                        {{ job.religion_preference || "No preference" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Benefits Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 class="text-xl font-semibold flex items-center gap-2">
                    <Icon name="mdi:gift-outline" class="text-green-500" />
                    Benefits
                  </h3>
                </div>
                <div class="p-5">
                  <template v-if="job.benefit">
                    <p class="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {{ job.benefit }}
                    </p>
                  </template>
                  <template v-else>
                    <p class="text-gray-400 dark:text-gray-500 italic">
                      Not specified
                    </p>
                  </template>
                </div>
              </div>
            </div>

            <!-- Right Column - Household & Actions -->
            <div class="lg:w-96 flex-shrink-0 space-y-6">
              <!-- Household Profile Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 class="text-xl font-semibold">Household Information</h3>
                </div>
                <div class="p-5">
                  <div class="flex flex-col items-center text-center mb-4">
                    <img
                      :src="household.image_url || 'https://via.placeholder.com/150'"
                      alt="Household profile"
                      class="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow mb-3"
                    />
                    <h2 class="text-xl font-semibold">
                      {{ household.first_name || '' }} {{ household.last_name || '' }}
                    </h2>
                    <div class="flex items-center mt-1">
                      <div class="flex items-center mr-2">
                        <Icon
                          v-for="star in 5"
                          :key="star"
                          :name="star <= Math.round(household.rating || 0) ? 'mdi:star' : 'mdi:star-outline'"
                          class="text-yellow-400 w-5 h-5"
                        />
                      </div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        ({{ household.total_reviews || 0 }} reviews)
                      </span>
                    </div>
                  </div>

                  <div class="space-y-3">


                    <div class="flex items-center">
                      <Icon name="mdi:calendar" class="text-gray-500 dark:text-gray-400 mr-2" />
                      <span class="text-gray-700 dark:text-gray-300 text-sm">
                        Invited on {{ formatDate(invite.invited_at) }}
                      </span>
                    </div>

                    <div class="flex items-center">
                      <Icon name="mdi:clock-outline" class="text-gray-500 dark:text-gray-400 mr-2" />
                      <span class="text-gray-700 dark:text-gray-300 text-sm">
                        Posted {{ formatDate(job.created_at) }}
                      </span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="mt-6 space-y-3">
                    <button
                      @click="showAcceptModal = true"
                      class="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                      :class="{
                        'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg': isPending,
                        'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed': !isPending
                      }"
                      :disabled="!isPending"
                    >
                      <Icon name="mdi:check" class="h-5 w-5" />
                      <span>Accept Offer</span>
                    </button>

                    <button
                      @click="showRejectModal = true"
                      class="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                      :class="{
                        'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg': isPending,
                        'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed': !isPending
                      }"
                      :disabled="!isPending"
                    >
                      <Icon name="mdi:close" class="h-5 w-5" />
                      <span>Decline Offer</span>
                    </button>

    
                  </div>
                </div>
              </div>

              <!-- Ratings & Reviews Card -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 class="text-xl font-semibold flex items-center gap-2">
                    <Icon name="mdi:star-circle-outline" class="text-yellow-500" />
                    Ratings & Reviews
                  </h3>
                </div>
                <div class="p-5">
                  <!-- Average Rating -->
                  <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center">
                      <span class="text-4xl font-bold mr-3">{{
                        household.rating || 0
                      }}</span>
                      <div>
                        <div class="flex items-center mb-1">
                          <Icon
                            v-for="star in 5"
                            :key="star"
                            :name="star <= Math.round(household.rating || 0) ? 'mdi:star' : 'mdi:star-outline'"
                            class="text-yellow-400 w-5 h-5"
                          />
                        </div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          {{ household.total_reviews || 0 }} reviews
                        </span>
                      </div>
                    </div>
                    <div class="text-right">
                      <!-- Rating distribution bars -->
                      <div v-for="n in 5" :key="n" class="flex items-center justify-end mb-1">
                        <span class="text-sm w-8 text-right mr-2">{{ 6 - n }}</span>
                        <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            class="bg-yellow-400 h-2 rounded-full"
                            :style="{ width: getRatingPercentage(6 - n) }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Reviews List -->
                  <div class="space-y-4">
                    <div
                      v-for="(review, index) in household.reviews"
                      :key="index"
                      class="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                    >
                      <div class="flex items-start gap-3">
                        <img
                          :src="review.maid_image || 'https://via.placeholder.com/40'"
                          alt="Reviewer"
                          class="w-10 h-10 rounded-full object-cover"
                        />
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium">{{ review.maid_name }}</h4>
                            <span class="text-xs text-gray-500 dark:text-gray-400">
                              {{ formatDate(review.created_at) }}
                            </span>
                          </div>
                          <div class="flex items-center mb-1">
                            <Icon
                              v-for="star in 5"
                              :key="star"
                              :name="star <= review.rating ? 'mdi:star' : 'mdi:star-outline'"
                              class="text-yellow-400 w-4 h-4"
                            />
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-300">
                            {{ review.review }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="!household.reviews || household.reviews.length === 0"
                      class="text-center py-4"
                    >
                      <p class="text-gray-500 dark:text-gray-400">
                        No reviews yet
                      </p>
                    </div>
                  </div>
                </div>
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
import { useRoute } from "vue-router";
import backendApi from "@/networkServices/api/backendApi";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const inviteId = route.params.id;
const authStore = useAuthStore();

// State
const invite = ref({
  id: null,
  status: "pending",
  job_id: null,
  invited_at: "",
});

const job = ref({
  id: null,
  household_id: null,
  job_title: "",
  job_description: "",
  job_time: "",
  required_skills: "",
  language_requirement: "",
  gender_preference: "",
  religion_preference: "",
  salary_min: "",
  salary_max: "",
  benefit: "",
  location: "",
  num_of_maids: 1,
  expected_start_date: "",
  status: "open",
  created_at: "",
  updated_at: "",
  household: {
    id: null,
    user_id: null,
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    image: "",
    rating: null,
  }
});

const household = ref({
  id: null,
  first_name: "",
  middle_name: "",
  last_name: "",
  image_url: "",
  rating: null,
  total_reviews: 0,
  reviews: [],
});

const loading = ref(true);
const error = ref(null);
const showAcceptModal = ref(false);
const showRejectModal = ref(false);
const showSuccessModal = ref(false);
const successMessage = ref("");
const isResponding = ref(false);

// Computed properties
const isPending = computed(() => {
  return invite.value.status?.toLowerCase() === 'pending';
});

const isAccepted = computed(() => {
  return invite.value.status?.toLowerCase() === 'accepted';
});

const isDeclined = computed(() => {
  return invite.value.status?.toLowerCase() === 'declined';
});

const formattedStatus = computed(() => {
  if (!invite.value.status) return "Unknown";
  return invite.value.status.charAt(0).toUpperCase() + invite.value.status.slice(1);
});

// Methods
const fetchInviteDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.get(`/maid/invitation/${inviteId}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    // Map API response to our state
    invite.value = response.data.invite;
    job.value = response.data.job;
    household.value = response.data.household;

    // Copy household email from job data if available
    if (job.value.household?.email) {
      household.value.email = job.value.household.email;
    }

  } catch (err) {
    error.value = "Failed to load job invitation details";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const acceptJob = async () => {
  try {
    isResponding.value = true;
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.patch(
      `/job/invite/${inviteId}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    // Update local state
    invite.value.status = "accepted";
    showAcceptModal.value = false;
    successMessage.value = "Job Accepted Successfully!";
    showSuccessModal.value = true;
    
    // Refresh the data to get updated status
    await fetchInviteDetails();
  } catch (err) {
    console.error("Error accepting job invite:", err);
    alert("Failed to accept invitation. Please try again.");
  } finally {
    isResponding.value = false;
  }
};

const rejectJob = async () => {
  try {
    isResponding.value = true;
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.patch(
      `/job/invite/${inviteId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    // Update local state
    invite.value.status = "declined";
    showRejectModal.value = false;
    successMessage.value = "Job Declined Successfully";
    showSuccessModal.value = true;
    
    // Refresh the data to get updated status
    await fetchInviteDetails();
  } catch (err) {
    console.error("Error rejecting job invite:", err);
    alert("Failed to decline invitation. Please try again.");
  } finally {
    isResponding.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatJobTime = (jobTime) => {
  if (!jobTime) return "Not specified";
  return jobTime
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatSalary = (job) => {
  if (!job?.salary_min && !job?.salary_max) return "Negotiable";
  if (job.salary_min && job.salary_max) {
    return `ETB ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}`;
  }
  return `ETB ${Number(job?.salary_min || job?.salary_max).toLocaleString()}`;
};

const getRatingPercentage = (rating) => {
  // Simplified - in a real app you'd calculate this based on actual review data
  const percentages = {
    5: '60%',
    4: '20%',
    3: '10%',
    2: '5%',
    1: '5%'
  };
  return percentages[rating] || '0%';
};

const printJobDetails = () => {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Job Offer Details - ${job.value.job_title || "Untitled Job"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1, h2 { color: #333; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .status { padding: 4px 8px; border-radius: 12px; font-size: 14px; }
          .pending { background-color: #d1ecf1; color: #0c5460; }
          .accepted { background-color: #d4edda; color: #155724; }
          .declined { background-color: #f8d7da; color: #721c24; }
          .section { margin-bottom: 30px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .household-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-top: 20px; }
          .household-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 0 auto 10px; display: block; }
          .text-right { text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .rating-bar { background-color: #f2f2f2; height: 10px; border-radius: 5px; margin-bottom: 5px; }
          .rating-fill { background-color: #FFD700; height: 100%; border-radius: 5px; }
          .review { border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Job Offer Details</h1>
          <div class="text-right">
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p class="status ${invite.value.status}">
              Status: ${formattedStatus.value}
            </p>
          </div>
        </div>

        <div class="section">
          <h2>Job Information</h2>
          <div class="grid">
            <div>
              <p><strong>Job Title:</strong> ${job.value.job_title || "Not specified"}</p>
              <p><strong>Location:</strong> ${job.value.location || "Not specified"}</p>
              <p><strong>Job Type:</strong> ${formatJobTime(job.value.job_time) || "Not specified"}</p>
            </div>
            <div>
              <p><strong>Expected Start:</strong> ${formatDate(job.value.expected_start_date) || "Flexible"}</p>
              <p><strong>Maids Needed:</strong> ${job.value.num_of_maids || 1}</p>
              <p><strong>Salary:</strong> ${formatSalary(job.value)}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Job Description</h2>
          <p>${job.value.job_description || "No description provided"}</p>
        </div>

        <div class="section">
          <h2>Requirements</h2>
          <table>
            <tr>
              <th>Skills Required</th>
              <td>${job.value.required_skills || "Not specified"}</td>
            </tr>
            <tr>
              <th>Language Requirement</th>
              <td>${job.value.language_requirement || "Not specified"}</td>
            </tr>
            <tr>
              <th>Gender Preference</th>
              <td>${job.value.gender_preference || "No preference"}</td>
            </tr>
            <tr>
              <th>Religion Preference</th>
              <td>${job.value.religion_preference || "No preference"}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>Employer Information</h2>
          <div class="household-card">
            <img src="${household.value.image_url || "https://via.placeholder.com/150"}" 
                 class="household-img" alt="Employer photo">
            <h3 style="text-align: center;">${household.value.first_name || ''} ${household.value.last_name || ''}</h3>
            <p style="text-align: center; margin-bottom: 15px;">Employer</p>
            
            <table>
              <tr>
                <th>Email</th>
                <td>${job.value.household?.email || "Not specified"}</td>
              </tr>
              <tr>
                <th>Invited On</th>
                <td>${formatDate(invite.value.invited_at)}</td>
              </tr>
              <tr>
                <th>Job Posted</th>
                <td>${formatDate(job.value.created_at)}</td>
              </tr>
              <tr>
                <th>Rating</th>
                <td>
                  ${household.value.rating || 0} stars (${household.value.total_reviews || 0} reviews)
                </td>
              </tr>
            </table>
          </div>
        </div>
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

// Lifecycle
onMounted(() => {
  fetchInviteDetails();
});

definePageMeta({
  layout: "house",
});
</script>

<style scoped>
/* Custom transitions */
button,
a,
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Card shadows */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Rounded corners */
.rounded-2xl {
  border-radius: 1rem;
}

/* Animation for loading state */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Disabled button styles */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button:disabled:hover {
  transform: none !important;
  box-shadow: none !important;
  background-color: initial !important;
}

.dark button:disabled {
  opacity: 0.6;
}

/* Loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>