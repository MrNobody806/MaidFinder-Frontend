<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div
      class="max-w-7xl mx-auto bg-[url('/herosec.jpg')] bg-cover px-8 py-12 flex flex-col justify-center min-h-screen mb-8"
    >
      <!-- Left-aligned Content -->
      <div class="max-w-2xl">
        <!-- Skeleton Loader for Welcome Text -->
        <div v-if="loading" class="animate-pulse">
          <div
            class="h-12 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"
          ></div>
          <div
            class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full mb-6"
          ></div>
          <div class="flex gap-4">
            <div class="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            <div class="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          </div>
        </div>

        <!-- Actual Welcome Content -->
        <template v-else>
          <h1
            class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-[#F3F3F3] mb-4"
          >
            {{
              authStore.isAuthenticated
                ? "Welcome to MaidFinder"
                : $t("welcome")
            }}
          </h1>

          <p class="text-gray-600 dark:text-[#F3F3F3] mb-6 text-left">
            <template v-if="authStore.isAuthenticated">
              <template v-if="authStore.user.role === 'maid'">
                Find Your Next Job With Ease
              </template>
              <template v-else-if="authStore.user.role === 'household'">
                Find Domestic Help With Ease
              </template>
            </template>
            <template v-else>
              {{ $t("description") }}
            </template>
          </p>

          <div
            v-if="!authStore.isAuthenticated"
            class="text-left flex flex-col sm:flex-row justify-start gap-4"
          >
            <button
              @click="navigateTo('/signup')"
              class="bg-lime-600 dark:text-white hover:bg-lime-700 font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Post a Job
            </button>
            <button
              @click="navigateTo('/signup')"
              class="dark:bg-gray-900 bg-white text-black bg-opacity-20 hover:bg-opacity-40 dark:hover:bg-opacity-20 dark:text-white font-bold py-3 px-8 rounded-lg transition duration-300 border border-lime-600"
            >
              Create Maid Profile
            </button>
          </div>
        </template>
      </div>
    </div>

    <div class="mb-8 flex justify-center items-center gap-2">
      <!-- Search Bar -->
      <input
        type="text"
        :placeholder="
          !authStore.user || authStore.user.role === 'household'
            ? 'Find maids...'
            : 'Find a job...'
        "
        class="w-full md:w-1/2 p-2 border border-lime-300 dark:border-lime-600 rounded-lg focus:border-lime-300 dark:focus:border-lime-400 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />

      <!-- Toggle Filters Button -->
      <button
        class="py-2 px-8 text-white bg-black hover:bg-lime-400 hover:text-black rounded-lg flex items-center gap-2 transition-all duration-300"
      >
        Search
      </button>
    </div>

    <!-- Maid/Job Section -->
    <section class="max-w-7xl mx-auto py-6 px-8 text-center">
      <div class="mx-auto items-center px-8 mb-8">
        <h2
          class="text-2xl font-serif font-semibold text-lime-500 px-3 py-1 rounded-md"
        >
          {{ shouldShowJobs ? "Latest Job Listings" : "Latest Maid Profiles" }}
        </h2>
        <p
          class="font-serif ml-2 align-text-top text-gray-600 dark:text-[#F3F3F3]"
        >
          {{
            shouldShowJobs
              ? "Find your next opportunity today"
              : "Find your perfect helper today"
          }}
        </p>
      </div>

      <!-- Carousel -->
      <div class="relative group">
        <!-- Skeleton Loader -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
          <div
            v-for="n in 3"
            :key="n"
            class="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
          >
            <div class="animate-pulse">
              <div class="bg-gray-300 dark:bg-gray-600 h-48 w-full"></div>
              <div class="p-4">
                <div
                  class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"
                ></div>
                <div
                  class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"
                ></div>
                <div class="flex flex-wrap gap-1 mb-4">
                  <div
                    class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"
                  ></div>
                  <div
                    class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"
                  ></div>
                </div>
                <div
                  class="h-10 bg-gray-300 dark:bg-gray-600 rounded w-full"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Container -->
        <div v-else class="overflow-hidden">
          <div class="flex">
            <div class="w-full">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
                <!-- Maid Cards -->
                <div
                  v-if="!shouldShowJobs"
                  v-for="maid in maids"
                  :key="maid.id"
                  class="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div class="relative">
                    <img
                      :src="maid.image_url || 'https://via.placeholder.com/150'"
                      :alt="`${maid.first_name} ${maid.last_name}`"
                      class="w-full h-48 object-cover"
                    />
                    <div
                      v-if="maid.experience"
                      class="absolute bottom-2 right-2 bg-lime-500 text-white text-xs font-bold px-2 py-1 rounded"
                    >
                      {{ maid.experience }} experience
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="flex justify-between items-start">
                      <h3 class="font-bold dark:text-[#F3F3F3] text-lg">
                        {{ maid.first_name }} {{ maid.last_name }}
                      </h3>
                      <div v-if="maid.rating" class="flex items-center">
                        <Icon
                          name="material-symbols:star"
                          class="text-yellow-400"
                        />
                        <span class="ml-1 dark:text-white">{{
                          maid.rating
                        }}</span>
                      </div>
                    </div>

                    <div
                      v-if="maid.address"
                      class="flex items-center mt-2 text-gray-600 dark:text-gray-300"
                    >
                      <Icon name="mdi:location" class="mr-1" />
                      <span>{{ maid.address }}</span>
                    </div>

                    <div v-if="maid.skills" class="mt-3">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="(skill, i) in maid.skills.split(',')"
                          :key="i"
                          class="text-xs bg-lime-100 dark:bg-gray-700 px-2 py-1 rounded"
                        >
                          {{ skill.trim() }}
                        </span>
                      </div>
                    </div>

                    <div class="mt-4 flex">
                      <button
                        @click="handleAction(maid.id)"
                        class="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-200"
                      >
                        {{
                          authStore.isAuthenticated ? "Hire Now" : "Hire Now"
                        }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Job Cards -->
                <div
                  v-if="shouldShowJobs"
                  v-for="job in jobs"
                  :key="job.id"
                  class="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div class="p-4">
                    <div class="flex justify-between items-start">
                      <h3 class="font-bold dark:text-[#F3F3F3] text-lg">
                        {{ job.title }}
                      </h3>
                      <span
                        v-if="job.job_time"
                        class="text-sm bg-lime-100 dark:bg-gray-700 px-2 py-1 rounded"
                      >
                        {{ job.job_time }}
                      </span>
                    </div>

                    <div
                      v-if="job.location"
                      class="mt-2 flex items-center text-gray-600 dark:text-gray-300"
                    >
                      <Icon name="mdi:location" class="mr-1" />
                      <span>{{ job.location }}</span>
                    </div>

                    <div v-if="job.description" class="mt-3">
                      <p class="text-gray-600 dark:text-gray-300 text-sm">
                        {{ job.description.substring(0, 100) }}...
                      </p>
                    </div>

                    <div class="mt-4">
                      <div class="flex items-center justify-between">
                        <span
                          v-if="job.created_at"
                          class="text-sm text-gray-500 dark:text-gray-400"
                        >
                          <Icon name="mdi:calendar" class="inline mr-1" />
                          Posted: {{ formatDate(job.created_at) }}
                        </span>
                        <span
                          v-if="job.salary_range"
                          class="text-sm font-semibold"
                        >
                          {{ job.salary_range }}
                        </span>
                      </div>
                      <div
                        v-if="job.expected_start_date"
                        class="mt-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        <Icon name="mdi:calendar-start" class="inline mr-1" />
                        Start: {{ formatDate(job.expected_start_date) }}
                      </div>
                      <div
                        v-if="job.household_name"
                        class="mt-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        <Icon name="mdi:account" class="inline mr-1" />
                        Posted by: {{ job.household_name }}
                      </div>
                    </div>

                    <div class="mt-4 flex">
                      <button
                        @click="handleAction(job.id)"
                        class="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-200"
                      >
                        {{
                          authStore.isAuthenticated
                            ? "Apply Now"
                            : "Login to Apply"
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- See All Button -->
      <div
        v-if="!loading && (maids.length > 0 || jobs.length > 0)"
        class="flex sm:flex-row justify-center items-center gap-4 mt-8"
      >
        <button
          @click="showAllItems"
          class="px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors duration-200 flex items-center gap-2"
        >
          See All {{ shouldShowJobs ? "Jobs" : "Maids" }}
          <Icon name="mdi:arrow-right" />
        </button>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="max-w-7xl mx-auto py-6 px-8 text-center">
      <div class="mx-auto items-center px-8 mb-8">
        <h2
          class="text-3xl font-serif font-semibold text-lime-500 px-3 py-1 rounded-md"
        >
          How It Works
        </h2>
        <p
          class="font-serif ml-2 align-text-top text-gray-600 dark:text-[#F3F3F3]"
        >
          Simple steps to
          {{
            shouldShowJobs ? "find your next job" : "find your perfect helper"
          }}
        </p>
      </div>

      <div class="flex flex-col justify-around mt-4 px-8">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex-1 min-w-[200px] my-2 py-4 px-8 dark:text-white bg-white dark:bg-gray-800 shadow-md rounded-xl text-left cursor-pointer"
          :class="{
            'bg-[#B9FF66] border-[#B9FF66] ': activeStep === index,
          }"
          @click="toggleStep(index)"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-serif font-bold mb-2 dark:text-white">
              {{ step.title }}
            </h3>
            <Icon
              name="ic:baseline-arrow-drop-down"
              class="w-10 h-10 transition-transform duration-200"
              :class="{ 'rotate-180': activeStep === index }"
              style="color: black"
            />
          </div>

          <div
            v-if="activeStep === index"
            class="border-t-2 border-black my-2"
          ></div>
          <p
            v-if="activeStep === index"
            class="font-serif text-gray-700 dark:text-white text-wrap mt-2"
          >
            {{ step.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="max-w-7xl mx-auto py-6 px-8 mb-8">
      <!-- Header Section -->
      <div class="mx-auto text-center px-8 mb-8">
        <h2
          class="text-3xl font-serif font-semibold text-lime-500 px-3 py-1 rounded-md"
        >
          Our Services
        </h2>
        <p class="font-serif text-gray-600 dark:text-[#F3F3F3] mt-2">
          Comprehensive solutions for your
          {{ shouldShowJobs ? "career" : "household" }} needs
        </p>
      </div>

      <!-- Services Grid -->
      <div
        class="font-serif grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4"
      >
        <!-- Loop through services -->
        <div
          v-for="(service, index) in filteredServices"
          :key="index"
          class="p-6 rounded-lg shadow-lg dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex flex-col items-center px-5 py-6 gap-2">
            <Icon :name="service.icon" class="w-12 h-12 mb-4 text-[#B9FF66]" />
            <h3 class="text-xl font-semibold mb-4 dark:text-[#F3F3F3]">
              {{ service.title }}
            </h3>
          </div>
          <p class="text-gray-600 dark:text-[#F3F3F3] mb-4">
            {{ service.description }}
          </p>
          <div class="flex items-center justify-center gap-2">
            <Icon
              name="solar:round-arrow-right-up-bold"
              class="w-6 h-6 text-black dark:text-[#F3F3F3] mr-2"
            />
            <a
              href="#"
              class="text-black dark:text-[#F3F3F3] hover:text-[#B9FF66]"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      v-if="!authStore.isAuthenticated"
      class="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12"
    >
      <div
        class="container mx-auto bg-white dark:bg-gray-800 font-serif border-2 rounded-2xl px-6 sm:px-12 py-8 sm:py-10 text-left"
      >
        <!-- Heading -->
        <h2 class="text-2xl sm:text-3xl font-bold mb-2 dark:text-[#F3F3F3]">
          Let's Make Things Happen
        </h2>

        <!-- Description -->
        <p
          class="text-gray-600 dark:text-[#F3F3F3] mb-6 sm:mb-8 max-w-full sm:max-w-96"
        >
          Ready to
          {{
            shouldShowJobs ? "find your next job" : "find your perfect helper"
          }}? Sign up now to get started.
        </p>

        <!-- Hire Now Button -->
        <button
          @click="navigateTo('/signup')"
          class="inline-block bg-black hover:text-black hover:bg-lime-400 dark:bg-[#B9FF66] text-white dark:text-[#191A23] font-semibold px-6 py-2 rounded-md dark:hover:bg-[#A0E55C] transition-colors duration-200"
        >
          {{ shouldShowJobs ? "Apply Now" : "Hire Now" }}
        </button>
      </div>
    </section>

    <!-- Team Members Section -->
    <section class="max-w-7xl mx-auto py-6 px-8">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="text-center mb-8">
          <h2
            class="text-3xl font-serif font-semibold text-lime-500 px-3 py-1 rounded-md inline-block"
          >
            Our Team
          </h2>
          <p
            class="max-w-2xl mx-auto font-serif mt-2 text-gray-600 dark:text-[#F3F3F3]"
          >
            Meet the people behind MaidFinder
          </p>
        </div>

        <!-- Team Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <!-- Loop through team members -->
          <div
            v-for="(member, index) in teamMembers"
            :key="index"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
          >
            <div
              class="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden border-2 border-lime-500"
            >
              <NuxtImg
                :src="`/${member.photo}`"
                :alt="`Portrait of ${member.name}, ${member.role}`"
                class="w-full h-full object-cover"
              />
            </div>
            <h3 class="text-xl font-semibold dark:text-[#F3F3F3]">
              {{ member.name }}
            </h3>
            <p class="text-gray-500 dark:text-[#F3F3F3] mb-4">
              {{ member.role }}
            </p>
            <div class="text-left">
              <div
                class="border-t border-black dark:border-[#F3F3F3] my-2"
              ></div>
              <p class="text-gray-600 dark:text-[#F3F3F3] text-wrap">
                {{ member.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Contact Form Section -->
    <section class="py-12 font-serif">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="text-center mb-8">
          <h2
            class="text-3xl font-semibold text-lime-500 px-3 py-1 rounded-md inline-block"
          >
            Contact Us
          </h2>
          <p class="max-w-2xl mx-auto mt-2 text-gray-600 dark:text-[#F3F3F3]">
            Have questions? Get in touch with our team
          </p>
        </div>

        <!-- Contact Form -->
        <form
          @submit.prevent="submitForm"
          class="max-w-2xl mx-auto dark:bg-gray-800 bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Name Input -->
          <div class="mb-6">
            <label
              for="name"
              class="block text-gray-700 dark:text-[#F3F3F3] font-semibold mb-2"
              >Your Name</label
            >
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="w-full px-4 py-2 border border-gray-300 dark:border-[#F3F3F3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3]"
              placeholder="Enter your name"
            />
          </div>

          <!-- Email Input -->
          <div class="mb-6">
            <label
              for="email"
              class="block text-gray-700 dark:text-[#F3F3F3] font-semibold mb-2"
              >Your Email</label
            >
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="w-full px-4 py-2 border border-gray-300 dark:border-[#F3F3F3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3]"
              placeholder="Enter your email"
              required
            />
          </div>

          <!-- Message Input -->
          <div class="mb-6">
            <label
              for="message"
              class="block text-gray-700 dark:text-[#F3F3F3] font-semibold mb-2"
              >Your Message</label
            >
            <textarea
              id="message"
              v-model="form.message"
              class="w-full px-4 py-2 border border-gray-300 dark:border-[#F3F3F3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3]"
              rows="5"
              placeholder="Enter your message"
              required
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="text-center">
            <button
              type="submit"
              class="w-full bg-black dark:bg-[#B9FF66] text-white dark:text-[#191A23] font-semibold px-6 py-2 rounded-md hover:bg-[#191A23] dark:hover:bg-[#A0E55C] transition-colors duration-200"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import backendApi from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";

const activeStep = ref(null);
const loading = ref(true);
const error = ref(null);

const authStore = useAuthStore();

const maids = ref([]);
const jobs = ref([]);
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
});

// Determine whether to show jobs or maids
const shouldShowJobs = computed(() => {
  return authStore.isAuthenticated && authStore.user?.role === "maid";
});

const steps = computed(() => {
  if (shouldShowJobs.value) {
    return [
      {
        title: "01 Browse available jobs",
        description:
          "Explore a variety of job listings that match your skills and preferences. Filter by location, salary, and job type to find the perfect opportunity.",
      },
      {
        title: "02 Check job details",
        description:
          "Review job descriptions, requirements, and employer profiles to ensure the position is right for you.",
      },
      {
        title: "03 Submit your application",
        description:
          "Apply directly through our platform with your profile information or upload a custom application.",
      },
      {
        title: "04 Get hired & start working",
        description:
          "Communicate with potential employers, negotiate terms, and begin your new job with confidence.",
      },
    ];
  } else {
    return [
      {
        title: "01 Browse verified maids",
        description:
          "Browse Verified Maids with Confidence. Explore a curated selection of experienced and background-checked maids. Each profile includes detailed information, skills, and reviews to help you find the perfect match for your household needs. Hire with confidence, knowing you're choosing from trusted professionals.",
      },
      {
        title: "02 Check profiles & reviews",
        description:
          "Check profiles and reviews to ensure you are selecting the best maid for your needs.",
      },
      {
        title: "03 Interview & select",
        description:
          "Interview potential candidates and select the one that best fits your household requirements.",
      },
      {
        title: "04 Hire & manage",
        description:
          "Hire your chosen maid and manage the relationship through our platform with contracts and payment options.",
      },
    ];
  }
});

// Service data
const services = ref([
  {
    icon: "ic:baseline-people",
    title: "Maid Listing & Profiles",
    description:
      "Browse through a curated list of verified maids with detailed profiles.",
    for: "household",
  },
  {
    icon: "ic:baseline-work",
    title: "Job Listings",
    description:
      "Find available jobs that match your skills and preferences as a domestic helper.",
    for: "maid",
  },
  {
    icon: "ic:baseline-search",
    title: "Advanced Search & Filters",
    description:
      "Use advanced search and filters to find exactly what you're looking for.",
    for: "both",
  },
  {
    icon: "ic:baseline-security",
    title: "Background Check",
    description:
      "Ensure safety and reliability with thorough background checks for all users.",
    for: "both",
  },
  {
    icon: "ic:baseline-description",
    title: "Contract Management",
    description: "Manage contracts and agreements seamlessly with our tools.",
    for: "both",
  },
  {
    icon: "ic:baseline-support-agent",
    title: "Customer Support",
    description:
      "Get dedicated customer support and assistance whenever you need it.",
    for: "both",
  },
]);

// Filter services based on user type
const filteredServices = computed(() => {
  return services.value.filter((service) => {
    if (service.for === "both") return true;
    if (shouldShowJobs.value) return service.for === "maid";
    return service.for === "household";
  });
});

// Team data
const teamMembers = ref([
  {
    name: "Manuhe Wolde",
    role: "Frontend Developer",
    photo: "/manuhe.jpg",
    description:
      "Transforms UI designs into seamless user experiences with clean, efficient code",
    icon: "mdi:code-json",
  },
  {
    name: "Gutu Tamiru",
    role: "Backend Developer",
    photo: "/gutu.jpg",
    description: "Builds the secure, scalable systems powering our platform",
    icon: "mdi:server",
  },
  {
    name: "Abrham Kassa",
    role: "Frontend Developer",
    photo: "/abrham.jpg",
    description: "Ensures every interaction is intuitive and accessible",
    icon: "mdi:palette",
  },
  {
    name: "Habtamu Fentahun",
    role: "Backend Developer",
    photo: "/habtamu.jpg",
    description: "Designs and optimizes our data infrastructure",
    icon: "mdi:database",
  },
  {
    name: "Kenaol Bekele",
    role: "Frontend Developer",
    photo: "/kenaol.jpg",
    description: "Crafts intuitive interfaces that work across all devices",
    icon: "mdi:monitor",
  },
]);

// Reactive state for form data
const form = ref({
  name: "",
  email: "",
  message: "",
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const fetchMaids = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await backendApi.get("/public/verified-maids");
    maids.value = response.data.data || [];
    pagination.value = {
      current_page: response.data.current_page || 1,
      total_pages: response.data.last_page || 1,
      total_items: response.data.total || 0,
    };
  } catch (err) {
    error.value = err.message || "Failed to fetch maids";
    // console.error("Error fetching maids:", err);
  } finally {
    loading.value = false;
  }
};

const fetchJobs = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await backendApi.get("/public/open-jobs");
    jobs.value = response.data.jobs || []; // Updated to match the API response structure
    pagination.value = {
      current_page: response.data.pagination?.current_page || 1,
      total_pages: response.data.pagination?.total_pages || 1,
      total_items: response.data.pagination?.total_jobs || 0,
    };
  } catch (err) {
    error.value = err.message || "Failed to fetch jobs";
    console.error("Error fetching jobs:", err);
  } finally {
    loading.value = false;
  }
};

const handleAction = (id) => {
  if (!authStore.isAuthenticated) {
    navigateTo("/login");
  } else {
    if (shouldShowJobs.value) {
      navigateTo(`jobs/job/${id}`);
    } else {
      navigateTo(`maids/maids-${id}`);
    }
  }
};

const showAllItems = () => {
  if (shouldShowJobs.value) {
    navigateTo("/jobs/job");
  } else {
    navigateTo("maids");
  }
};

// Function to handle form submission
const submitForm = () => {
  console.log("Form Data:", form.value);
  alert("Message sent successfully!");
  // Reset form after submission
  form.value = {
    name: "",
    email: "",
    message: "",
  };
};

// Function to toggle the active step
const toggleStep = (index) => {
  activeStep.value = activeStep.value === index ? null : index;
};

onMounted(() => {
  fetchMaids();
  fetchJobs();
  authStore.hydrate();
});
</script>
