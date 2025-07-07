<template>
  <section class="py-12 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <!-- Back Button -->
      <button
        @click="$router.push('/jobs')"
        class="mb-6 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        ← Back to Job Listings
      </button>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-300">Loading job details...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 dark:text-red-400">{{ error }}</p>
        <button
          @click="fetchJobDetails"
          class="mt-4 px-6 py-2 bg-lime-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>

      <div v-else>
        <!-- Job Details -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {{ job.job_title }}
          </h1>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Location:</strong> {{ job.location }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Job Type:</strong> {{ formatJobTime(job.job_time) }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Salary:</strong> {{ job.salary_min }} -
                {{ job.salary_max }} ETB
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Start Date:</strong>
                {{ formatDate(job.expected_start_date) }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Number of Maids Needed:</strong> {{ job.num_of_maids }}
              </p>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Gender Preference:</strong>
                {{ job.gender_preference || "None" }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Religion Preference:</strong>
                {{ job.religion_preference || "None" }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Language Requirement:</strong>
                {{ job.language_requirement }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Status:</strong>
                <span :class="statusClasses(job.status)">
                  {{ job.status }}
                </span>
              </p>
            </div>
          </div>

          <div class="mb-6">
            <h2
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2"
            >
              Job Description
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ job.job_description }}
            </p>
          </div>

          <div class="mb-6" v-if="job.required_skills">
            <h2
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2"
            >
              Required Skills
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ job.required_skills }}
            </p>
          </div>

          <div class="mb-6" v-if="job.benefit">
            <h2
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2"
            >
              Benefits
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ job.benefit }}
            </p>
          </div>

          <!-- Household Details -->
          <div class="mt-6 border-t pt-6">
            <h2
              class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Household Details
            </h2>
            <div class="flex items-center space-x-4">
              <img
                v-if="job.household?.image_url"
                :src="job.household.image_url"
                class="w-16 h-16 rounded-full object-cover"
                alt="Household"
              />
              <div
                v-else
                class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"
              >
                <span
                  class="text-xl font-semibold text-gray-800 dark:text-gray-100"
                >
                  {{ job.household?.first_name?.charAt(0) || "H" }}
                </span>
              </div>
              <div>
                <h3
                  class="text-xl font-semibold text-gray-800 dark:text-gray-100"
                >
                  {{ householdFullName }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ job.household?.address }}
                </p>
                <div class="flex items-center mt-1">
                  <Icon
                    name="mdi:shield-check"
                    class="text-green-500 mr-1"
                    v-if="job.household?.verification_status === 'verified'"
                  />
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ job.household?.verification_status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Review and Rating Section -->
        <div class="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2
            class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
          >
            Reviews & Ratings
          </h2>

          <!-- Average Rating -->
          <div class="flex items-center mb-6">
            <span
              class="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2"
            >
              {{ averageRating.toFixed(1) }}
            </span>
            <div class="flex items-center">
              <span
                v-for="star in 5"
                :key="star"
                class="text-2xl"
                :class="{
                  'text-yellow-400': star <= averageRating,
                  'text-gray-300': star > averageRating,
                }"
              >
                ★
              </span>
            </div>
            <span class="text-gray-600 dark:text-gray-300 ml-2">
              ({{ reviews.length }} reviews)
            </span>
          </div>

          <!-- Review Form -->
          <div class="mb-8" v-if="authStore.isAuthenticated">
            <h3
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Leave a Review
            </h3>
            <form @submit.prevent="submitReview">
              <div class="mb-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Rating
                </label>
                <div class="flex items-center">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="text-2xl cursor-pointer"
                    :class="{
                      'text-yellow-400': star <= newReview.rating,
                      'text-gray-300': star > newReview.rating,
                    }"
                    @click="newReview.rating = star"
                  >
                    ★
                  </span>
                </div>
              </div>
              <div class="mb-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Review
                </label>
                <textarea
                  v-model="newReview.comment"
                  class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  rows="4"
                  placeholder="Write your review..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                class="px-6 py-2 bg-black hover:bg-lime-400 hover:text-black text-white rounded-lg"
              >
                Submit Review
              </button>
            </form>
          </div>
          <div v-else class="mb-8 text-center">
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Please login to leave a review
            </p>
            <button
              @click="$router.push('/login')"
              class="px-6 py-2 bg-lime-500 text-white rounded-lg"
            >
              Login
            </button>
          </div>

          <!-- Reviews List -->
          <div>
            <h3
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              All Reviews
            </h3>
            <div v-if="reviews.length > 0" class="space-y-4">
              <div
                v-for="(review, index) in reviews"
                :key="index"
                class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div class="flex items-center mb-2">
                  <div class="flex items-center">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="text-xl"
                      :class="{
                        'text-yellow-400': star <= review.rating,
                        'text-gray-300': star > review.rating,
                      }"
                    >
                      ★
                    </span>
                  </div>
                  <span class="text-gray-600 dark:text-gray-300 ml-2">
                    {{ review.rating }}.0
                  </span>
                </div>
                <p class="text-gray-800 dark:text-gray-100">
                  {{ review.comment }}
                </p>
              </div>
            </div>
            <p v-else class="text-gray-600 dark:text-gray-300">
              No reviews yet. Be the first to leave a review!
            </p>
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

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Data
const loading = ref(false);
const error = ref(null);
const job = ref({});
const reviews = ref([]);

const newReview = ref({
  rating: 0,
  comment: "",
});

// Computed
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.value.length;
});

const householdFullName = computed(() => {
  if (!job.value.household) return "";
  return `${job.value.household.first_name || ""} ${
    job.value.household.middle_name || ""
  } ${job.value.household.last_name || ""}`.trim();
});

// Methods
const statusClasses = (status) => {
  switch (status) {
    case "open":
      return "text-green-600 dark:text-green-400";
    case "pending":
      return "text-yellow-600 dark:text-yellow-400";
    case "closed":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
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
    month: "long",
    day: "numeric",
  });
};

const fetchJobDetails = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const jobId = route.params.id;
    const response = await backendApi.get(`/maid/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    job.value = response.data;

    // For demo purposes, using sample reviews
    // In a real app, you would fetch reviews for this job from the API
    reviews.value = [
      { rating: 4, comment: "Great experience working with this household!" },
      { rating: 5, comment: "Very professional and friendly." },
    ];
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch job details";
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  if (newReview.value.rating === 0) {
    alert("Please select a rating");
    return;
  }

  if (!newReview.value.comment.trim()) {
    alert("Please write a review comment");
    return;
  }

  try {
    // In a real app, you would post the review to your API
    // For demo purposes, we'll just add it to the local array
    reviews.value.push({
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      // You would typically also include user info from the auth store
      user: {
        name: authStore.user?.name || "Anonymous",
      },
    });

    // Reset the form
    newReview.value = {
      rating: 0,
      comment: "",
    };

    alert("Thank you for your review!");
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Failed to submit review";
  }
};

// Lifecycle
onMounted(() => {
  fetchJobDetails();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
