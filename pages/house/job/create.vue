<template>
  <div
    class="flex flex-col items-center justify-center bg-[#F3F3F3] dark:bg-gray-900 py-4"
  >
    <div
      class="bg-white w-full max-w-7xl mx-auto dark:bg-[#20233f] p-8 font-serif rounded-lg shadow-lg text-center"
    >
      <h1 class="text-2xl font-bold mb-6 dark:text-[#F3F3F3]">
        Post a New Job
      </h1>

      <!-- Verification Alert -->
      <div 
        v-if="errorMessage === 'You must verify your household profile before posting jobs.'"
        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100"
      >
        <p>You need to verify your household profile to post jobs. 
          <router-link 
            to="/house/profile" 
            class="text-[#B9FF66] hover:underline font-medium"
          >
            Complete your verification now
          </router-link>
        </p>
      </div>

      <!-- Stepper Component -->
      <div class="flex justify-between items-center mb-8">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col items-center"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="{
              'bg-[#B9FF66] text-[#191A23]': currentStep > index,
              'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-[#F3F3F3]':
                currentStep <= index,
            }"
          >
            {{ index + 1 }}
          </div>
          <span
            class="text-xs mt-1"
            :class="{
              'text-[#B9FF66] font-medium': currentStep > index,
              'text-gray-500 dark:text-gray-400': currentStep <= index,
            }"
          >
            {{ step }}
          </span>
        </div>
      </div>

      <!-- Job Posting Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Step 1: Job Details -->
        <div v-if="currentStep === 1" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Job Details
          </h2>

          <!-- Job Title -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Job Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.job_title"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              placeholder="e.g. Housekeeper, Nanny, Cook"
              required
            />
          </div>

          <!-- Job Description -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Job Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.job_description"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              rows="4"
              placeholder="Describe the responsibilities and duties..."
              required
            ></textarea>
          </div>

          <!-- Job Type -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Job Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.job_time"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              required
            >
              <option value="" disabled selected>Select Job Type</option>
              <option value="full time">Full-time</option>
              <option value="part time">Part-time</option>
              <option value="one time">One-Time</option>
            </select>
          </div>
          <div class="relative">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Number of Maids<span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.num_of_maids"
              type="number"
              min="1"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              placeholder=""
              required
            />
          </div>

          <!-- Required Skills -->
          <div class="relative mb-4">
            <label class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2">
              Required Skills <span class="text-red-500">*</span>
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(skill, index) in form.required_skills"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full bg-[#B9FF66] text-[#191A23] text-sm"
              >
                {{ skill }}
                <button
                  type="button"
                  @click="removeSkill(index)"
                  class="ml-2 text-[#191A23] hover:text-red-500"
                >
                  ×
                </button>
              </span>
            </div>
            <div class="flex">
              <select
                v-model="selectedSkill"
                class="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              >
                <option value="" disabled selected>Select Skill</option>
                <option value="House Cleaning">House Cleaning</option>
                <option value="Cooking">Cooking</option>
                <option value="Child Care">Child Care</option>
                <option value="Elderly Care">Elderly Care</option>
                <option value="Laundry">Laundry</option>
                <option value="Ironing">Ironing</option>
                <option value="Catering">Catering</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Cake Maker">Cake Maker</option>
                <option value="Other">Other</option>
              </select>
              <button
                type="button"
                @click="addSkill"
                class="px-4 py-2 bg-[#B9FF66] text-[#191A23] font-semibold rounded-r-lg hover:bg-[#A0E55C] transition duration-300"
              >
                Add
              </button>
            </div>
            <input
              v-if="form.required_skills.includes('Other')"
              v-model="form.otherSkill"
              type="text"
              class="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              placeholder="Please specify other skill"
            />
          </div>
        </div>

        <!-- Step 2: Requirements -->
        <div v-if="currentStep === 2" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Requirements
          </h2>

          <!-- Language Requirements -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Language Requirements <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.language_requirement"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              placeholder="e.g. English, Amharic (separate with commas)"
              required
            />
          </div>

          <!-- Gender Preference -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Gender Preference
            </label>
            <select
              v-model="form.gender_preference"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            >
              <option value="" selected>No preference</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <!-- Religion Preference -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Religion Preference
            </label>
            <select
              v-model="form.religion_preference"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            >
              <option value="" selected>No preference</option>
              <option value="ortodox">Ortodox</option>
              <option value="Islam">Muslim</option>
              <option value="Protestant">Protestant</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <!-- Start Date -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Expected Start Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.expected_start_date"
              type="date"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              required
            />
          </div>
        </div>

        <!-- Step 3: Compensation & Location -->
        <div v-if="currentStep === 3" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Compensation & Location
          </h2>

          <!-- Min Salary -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Min Salary (ETB) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.salary_min"
                type="number"
                min="1"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                placeholder="e.g. 3000"
                required
              />
            </div>
            <!-- Max Salary -->

            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Max Salary (ETB) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.salary_max"
                type="number"
                min="500"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                placeholder="e.g. 3000"
                required
              />
            </div>
          </div>

          <!-- Benefits -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Benefits (optional)
            </label>
            <input
              v-model="form.benefit"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              placeholder="e.g. Accommodation, Meals, Transportation"
            />
          </div>

          <!-- Location -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
            >
              Location <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.location"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              placeholder="e.g. Bole, Addis Ababa"
              required
            />
          </div>
        </div>

        <!-- Step 4: Review & Submit -->
        <div v-if="currentStep === 4" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Review Your Job Posting
          </h2>

          <div class="text-left space-y-6">
            <!-- Job Details -->
            <div>
              <h3 class="font-medium text-lg dark:text-[#F3F3F3] mb-2">
                Job Details
              </h3>
              <div class="bg-gray-100 dark:bg-[#191A23] p-4 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Title:</span> {{ form.job_title }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Type:</span> {{ form.job_time }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Description:</span>
                  {{ form.job_description }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Required Skills:</span>
                  {{ form.required_skills.join(', ') }}
                  <span v-if="form.otherSkill && form.required_skills.includes('Other')">
                    ({{ form.otherSkill }})
                  </span>
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Expected start Date:</span>
                  {{ formatDate(form.expected_start_date) }}
                </p>
              </div>
            </div>

            <!-- Requirements -->
            <div>
              <h3 class="font-medium text-lg dark:text-[#F3F3F3] mb-2">
                Requirements
              </h3>
              <div class="bg-gray-100 dark:bg-[#191A23] p-4 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Languages:</span>
                  {{ form.language_requirement }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Gender Preference:</span>
                  {{ form.gender_preference || "No preference" }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Religion Preference:</span>
                  {{ form.religion_preference || "No preference" }}
                </p>
              </div>
            </div>

            <!-- Compensation & Location -->
            <div>
              <h3 class="font-medium text-lg dark:text-[#F3F3F3] mb-2">
                Compensation & Location
              </h3>
              <div class="bg-gray-100 dark:bg-[#191A23] p-4 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Salary Range:</span>
                  {{ form.salary_min }} - {{ form.salary_max }} ETB
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Benefits:</span>
                  {{ form.benefit || "None specified" }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Location:</span> {{ form.location }}
                </p>
              </div>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <div class="flex items-center mt-6 mb-4">
            <input
              type="checkbox"
              v-model="form.agreeTerms"
              class="mr-2 accent-[#B9FF66]"
              required
            />
            <label class="text-gray-700 dark:text-[#F3F3F3]">
              I agree to the
              <a href="#" class="text-[#B9FF66] hover:underline"
                >Terms of Service & Conditions</a
              >.
            </label>
          </div>
        </div>

        <!-- Error Message -->
        <div 
          v-if="errorMessage && errorMessage !== 'You must verify your household profile before posting jobs.'" 
          class="text-red-500 text-sm text-left dark:text-red-400"
        >
          {{ errorMessage }}
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-[#F3F3F3] rounded-lg text-gray-700 dark:text-[#F3F3F3] hover:bg-gray-100 dark:hover:bg-[#191A23] transition duration-300"
          >
            Previous
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < steps.length"
            @click="nextStep"
            type="button"
            class="px-4 py-2 bg-[#B9FF66] text-[#191A23] font-semibold rounded-lg hover:bg-[#A0E55C] transition duration-300"
          >
            Next
          </button>
          <button
            v-else
            type="submit"
            class="px-4 py-2 bg-[#B9FF66] text-[#191A23] font-semibold rounded-lg hover:bg-[#A0E55C] transition duration-300"
            :disabled="!isFormComplete || isLoading"
          >
            <span v-if="isLoading">Posting...</span>
            <span v-else>Post Job</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <transition name="fade">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white dark:bg-[#20233f] p-8 rounded-lg shadow-xl max-w-md w-full text-center"
        >
          <!-- Animated Checkmark -->
          <div class="flex justify-center mb-6">
            <svg
              class="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
              width="80"
              height="80"
            >
              <circle
                class="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="#B9FF66"
                stroke-width="2"
              />
              <path
                class="checkmark__check"
                fill="none"
                stroke="#B9FF66"
                stroke-width="4"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>

          <h2 class="text-2xl font-bold mb-4 dark:text-[#F3F3F3]">
            Job Posted Successfully!
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Your job listing has been posted and is now visible to candidates.
          </p>

          <div class="flex flex-col space-y-3">
            <button
              @click="viewJob"
              class="px-4 py-2 bg-[#B9FF66] text-[#191A23] font-semibold rounded-lg hover:bg-[#A0E55C] transition duration-300"
            >
              View Job
            </button>
            <button
              @click="postAnotherJob"
              class="px-4 py-2 border border-[#B9FF66] text-[#B9FF66] font-semibold rounded-lg hover:bg-[#B9FF66] hover:text-[#191A23] transition duration-300"
            >
              Post Another Job
            </button>
            <button
              @click="goToHome"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:underline"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import backendApi from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// Stepper configuration
const steps = ref(["Job Details", "Requirements", "Compensation", "Review"]);
const currentStep = ref(1);
const isLoading = ref(false);
const errorMessage = ref("");
const showSuccessModal = ref(false);
const postedJobId = ref(null);
const selectedSkill = ref("");

// Form data
const form = ref({
  // Job Details
  job_title: "",
  job_description: "",
  job_time: "",
  required_skills: [],
  otherSkill: "",
  num_of_maids: "",

  // Requirements
  language_requirement: "",
  gender_preference: "",
  religion_preference: "",
  expected_start_date: "",

  // Compensation & Location
  salary_min: "",
  salary_max: "",
  benefit: "",
  location: "",

  // Terms
  agreeTerms: false,
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Skill management
const addSkill = () => {
  if (selectedSkill.value && !form.value.required_skills.includes(selectedSkill.value)) {
    form.value.required_skills.push(selectedSkill.value);
    selectedSkill.value = "";
  }
};

const removeSkill = (index) => {
  form.value.required_skills.splice(index, 1);
  // Also remove otherSkill if "Other" was removed
  if (!form.value.required_skills.includes("Other")) {
    form.value.otherSkill = "";
  }
};

// Navigation functions
const nextStep = () => {
  errorMessage.value = "";
  currentStep.value++;
};

const prevStep = () => {
  errorMessage.value = "";
  currentStep.value--;
};

// Validation functions
const validateJobDetails = () => {
  return (
    form.value.job_title &&
    form.value.job_description &&
    form.value.job_time &&
    form.value.required_skills.length > 0 &&
    form.value.num_of_maids
  );
};

const validateRequirements = () => {
  return form.value.language_requirement && form.value.expected_start_date;
};

const validateCompensation = () => {
  return form.value.salary_min && form.value.salary_max && form.value.location;
};

// Computed properties
const isFormComplete = computed(() => {
  return (
    validateJobDetails() &&
    validateRequirements() &&
    validateCompensation() &&
    form.value.agreeTerms
  );
});

// Success modal actions
const viewJob = () => {
  if (postedJobId.value) {
    router.push(`/house/job/my-${postedJobId.value}`);
    showSuccessModal.value = false;
  }
};

const postAnotherJob = () => {
  // Reset form and stepper
  form.value = {
    job_title: "",
    job_description: "",
    job_time: "",
    required_skills: [],
    otherSkill: "",
    num_of_maids: "",
    language_requirement: "",
    gender_preference: "",
    religion_preference: "",
    salary_min: "",
    salary_max: "",
    benefit: "",
    location: "",
    expected_start_date: "",
    agreeTerms: false,
  };
  selectedSkill.value = "";
  currentStep.value = 1;
  showSuccessModal.value = false;
  postedJobId.value = null;
};

const goToHome = () => {
  router.push("/");
  showSuccessModal.value = false;
};

// API Submission
const handleSubmit = async () => {
  if (!isFormComplete.value) {
    errorMessage.value = "Please complete all form steps and agree to the terms";
    return;
  }

  // Validate at least one skill is selected
  if (form.value.required_skills.length === 0) {
    errorMessage.value = "Please select at least one required skill";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const payload = {
      ...form.value,
      // Convert skills array to comma-separated string for backend
      required_skills: form.value.required_skills.join(', '),
      // Include other skill if specified
      ...(form.value.otherSkill && form.value.required_skills.includes("Other") 
        ? { other_skill: form.value.otherSkill } 
        : {})
    };

    const response = await backendApi.post("/jobs/create", payload, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    if (response.data?.job?.id) {
      postedJobId.value = response.data.job.id;
      showSuccessModal.value = true;
    } else {
      throw new Error(response.data?.message || "Job posting failed");
    }
  } catch (error) {
    console.error("Job posting error:", error);
    
    if (error.response?.status === 403 && 
        error.response?.data?.error === 'Only verified households can post jobs.') {
      errorMessage.value = "You must verify your household profile before posting jobs.";
    } else {
      errorMessage.value =
        error.response?.data?.message ||
        error.message ||
        "Job posting failed. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: "house",
});
</script>

<style scoped>
.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Checkmark animation */
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 4;
  stroke: #b9ff66;
  stroke-miterlimit: 10;
  margin: 0 auto;
  animation: fill 0.4s ease-in-out 0.4s forwards,
    scale 0.3s ease-in-out 0.9s both;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0 0 0 100px rgba(185, 255, 102, 0);
  }
}
</style>