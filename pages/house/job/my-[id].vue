<template>
  <section class="max-w-7xl mx-auto p-4 md:p-6 dark:bg-gray-900 dark:text-gray-100">
    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center"
        :class="{
          'bg-green-500 text-white': toast.type === 'success',
          'bg-red-500 text-white': toast.type === 'error',
          'bg-blue-500 text-white': toast.type === 'info'
        }"
      >
        <Icon 
          :name="toastIcon(toast.type)" 
          class="w-5 h-5 mr-2" 
        />
        <span>{{ toast.message }}</span>
        <button
          @click="toast.show = false"
          class="ml-3 focus:outline-none"
          aria-label="Close notification"
        >
          <Icon name="mdi:close" class="w-5 h-5" />
        </button>
      </div>
    </Transition>

    <!-- Custom Confirmation Dialog -->
    <Transition name="modal">
      <div 
        v-if="showCancelConfirmation" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showCancelConfirmation = false"
      >
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
          <div class="flex items-center mb-4">
            <Icon 
              name="mdi:alert-circle-outline" 
              class="w-6 h-6 text-red-500 mr-2" 
            />
            <h3 class="text-lg font-medium">Confirm Cancellation</h3>
          </div>
          <p class="mb-6 text-gray-600 dark:text-gray-300">
            Are you sure you want to cancel this job posting? This action cannot be undone.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showCancelConfirmation = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              No, Keep It
            </button>
            <button
              @click="confirmCancelJob"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Icon name="mdi:delete-outline" class="w-5 h-5 mr-1" />
              Yes, Cancel It
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Job Details</h1>
        <div class="flex space-x-2">
          <NuxtLink
            to="/house"
            class="p-2 items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 inline-flex"
          >
            <Icon name="mdi:arrow-left" class="w-5 h-5 mr-1" />
            Back to Jobs
          </NuxtLink>
          <button
            v-if="job?.job?.status === 'pending' || job?.job?.status === 'rejected'"
            @click="editJob"
            class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <Icon name="mdi:pencil" class="w-5 h-5 mr-1" />
            Edit
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <Spinner class="mx-auto" />
        <p class="mt-2">Loading job details...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded-lg mb-6"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-medium">Error Loading Job</h3>
            <p>{{ error }}</p>
          </div>
          <button
            @click="fetchJobDetails"
            class="text-red-600 dark:text-red-300 hover:underline flex items-center"
          >
            <Icon name="mdi:refresh" class="w-4 h-4 mr-1" />
            Retry
          </button>
        </div>
      </div>

      <!-- Job Details -->
      <div v-else-if="job" class="space-y-6">
        <!-- Status Banner -->
        <div 
          class="p-4 rounded-lg mb-6"
          :class="statusBannerClass(job.job.status)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon 
                :name="statusIcon(job.job.status)" 
                class="w-5 h-5 mr-2" 
              />
              <span class="font-medium">
                {{ formatStatus(job.job.status) }}
              </span>
              <span
                v-if="job.job.status === 'rejected' && job.job.rejection_reason"
                class="ml-3 text-sm"
              >
                Reason: {{ job.job.rejection_reason }}
              </span>
            </div>
            <button
              v-if="['pending', 'rejected', 'open'].includes(job.job.status)"
              @click="cancelJob"
              class="px-3 py-1 border border-red-600 text-red-600 dark:text-red-400 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition duration-300 text-sm flex items-center"
            >
              <Icon name="mdi:delete-outline" class="w-4 h-4 mr-1" />
              Cancel Posting
            </button>
          </div>
        </div>

        <!-- Basic Information Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Title
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ job.job.job_title }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Type
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ formatJobTime(job.job.job_time) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expected Start Date
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ formatDate(job.job.expected_start_date) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ job.job.location }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of Maids Needed
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ job.job.num_of_maids }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Salary Range
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ formatSalary(job.job) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Posted
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ formatDate(job.job.created_at) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Updated
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ formatDate(job.job.updated_at) }}
            </p>
          </div>
        </div>

        <!-- Description Section -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Description
          </label>
          <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-pre-line min-h-20">
            {{ job.job.job_description || "No description provided." }}
          </div>
        </div>

        <!-- Requirements Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="job.job.required_skills">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Required Skills
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ job.job.required_skills }}
            </p>
          </div>
          <div v-if="job.job.language_requirement">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language Requirements
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ job.job.language_requirement }}
            </p>
          </div>
          <div v-if="job.job.gender_preference">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender Preference
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ formatGenderPreference(job.job.gender_preference) }}
            </p>
          </div>
          <div v-if="job.job.religion_preference">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Religion Preference
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ formatReligionPreference(job.job.religion_preference) }}
            </p>
          </div>
          <div v-if="job.job.benefit">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Benefits
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ job.job.benefit }}
            </p>
          </div>
          <div v-if="job.job.experience_requirement">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Experience Requirement
            </label>
            <p class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {{ job.job.experience_requirement }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import backendApi from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const jobId = route.params.id;

// State
const job = ref(null);
const loading = ref(false);
const error = ref(null);
const showCancelConfirmation = ref(false);
const toast = ref({
  show: false,
  message: "",
  type: "success"
});

// Helper functions
const formatJobTime = (time) => {
  const timeMap = {
    "full time": "Full Time",
    "part time": "Part Time",
    "one time": "One Time",
  };
  return timeMap[time] || time;
};

const formatStatus = (status) => {
  const statusMap = {
    open: "Open",
    rejected: "Rejected",
    pending: "Pending Review",
    cancelled: "Cancelled",
    closed: "Closed"
  };
  return statusMap[status] || status;
};

const statusBannerClass = (status) => {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "cancelled":
    case "closed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const statusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "open": return "mdi:check-circle-outline";
    case "rejected": return "mdi:close-circle-outline";
    case "pending": return "mdi:clock-outline";
    case "cancelled": return "mdi:cancel";
    case "closed": return "mdi:lock-outline";
    default: return "mdi:information-outline";
  }
};

const toastIcon = (type) => {
  switch (type) {
    case "success": return "mdi:check-circle-outline";
    case "error": return "mdi:alert-circle-outline";
    case "info": return "mdi:information-outline";
    default: return "mdi:information-outline";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatSalary = (job) => {
  if (job.salary_min && job.salary_max) {
    return `$${job.salary_min} - $${job.salary_max}`;
  }
  return job.salary_min
    ? `$${job.salary_min}`
    : job.salary_max
    ? `$${job.salary_max}`
    : "Negotiable";
};

const formatGenderPreference = (gender) => {
  const genderMap = {
    male: "Male",
    female: "Female",
    any: "Any"
  };
  return genderMap[gender] || gender;
};

const formatReligionPreference = (religion) => {
  const religionMap = {
    islam: "Islam",
    christianity: "Christianity",
    hinduism: "Hinduism",
    buddhism: "Buddhism",
    other: "Other",
    any: "Any"
  };
  return religionMap[religion?.toLowerCase()] || religion;
};

// Toast notification
const showToast = (message, type = "success", duration = 3000) => {
  toast.value = {
    show: true,
    message,
    type
  };
  
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
};

// Job operations
const fetchJobDetails = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.get(`/household/my-jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    job.value = response.data;
  } catch (err) {
    console.error("Error fetching job details:", err);
    error.value = "Failed to load job details. Please try again later.";
    showToast("Failed to load job details", "error");
  } finally {
    loading.value = false;
  }
};

const cancelJob = () => {
  showCancelConfirmation.value = true;
};

const confirmCancelJob = async () => {
  showCancelConfirmation.value = false;
  try {
    loading.value = true;
    await backendApi.patch(
      `/jobs/${jobId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    
    showToast("Job posting has been successfully canceled!", "success");
    await fetchJobDetails();
  } catch (err) {
    console.error("Error canceling job:", err);
    showToast("Failed to cancel job posting. Please try again.", "error");
  } finally {
    loading.value = false;
  }
};

const editJob = () => {
  showToast("Edit functionality coming soon!", "info");
};

// Initialize
onMounted(() => {
  fetchJobDetails();
});

definePageMeta({
  layout: "house",
});
</script>

<style scoped>
/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(-20px);
}
</style>