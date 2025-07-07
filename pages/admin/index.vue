<template>
  <section class="flex flex-col min-h-screen ml-0 bg-gray-100 dark:bg-gray-900">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Main Content Container -->
    <div class="container mx-auto px-4 py-6">
      <!-- Stats Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-600 dark:text-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h2
                class="text-lg font-semibold text-gray-500 dark:text-gray-300"
              >
                Total Households
              </h2>
              <p class="text-3xl font-bold dark:text-white">
                {{ stats.total_households || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-green-600 dark:text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h2
                class="text-lg font-semibold text-gray-500 dark:text-gray-300"
              >
                Total Maids
              </h2>
              <p class="text-3xl font-bold dark:text-white">
                {{ stats.total_maids || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-purple-600 dark:text-purple-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h2
                class="text-lg font-semibold text-gray-500 dark:text-gray-300"
              >
                Total Job Posts
              </h2>
              <p class="text-3xl font-bold dark:text-white">
                {{ stats.total_job_posts || 0 }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- User Registrations Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold dark:text-white">
              User Registrations Trend
            </h2>
            <select
              v-model="userRegTimeRange"
              @change="fetchUserRegistrations"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div class="chart-container">
            <canvas
              ref="userRegistrationsChart"
              class="w-full h-[300px]"
            ></canvas>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Shows the trend of new user registrations over time.
          </p>
        </div>

        <!-- Job Posts Created Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold dark:text-white">
              Job Posts Trend
            </h2>
            <select
              v-model="jobPostsTimeRange"
              @change="fetchJobPostsCreated"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div class="chart-container">
            <canvas ref="jobPostsChart" class="w-full h-[300px]"></canvas>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Shows the trend of new job posts created over time.
          </p>
        </div>
      </div>

      <!-- Charts Row 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Job Time Distribution Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4 dark:text-white">
            Job Time Preferences
          </h2>
          <div class="chart-container">
            <canvas ref="jobTimeChart" class="w-full h-[300px]"></canvas>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Distribution of job posts by preferred working time.
          </p>
        </div>

        <!-- Gender Preference Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4 dark:text-white">
            Gender Preferences
          </h2>
          <div class="chart-container">
            <canvas
              ref="genderPreferenceChart"
              class="w-full h-[300px]"
            ></canvas>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Distribution of job posts by preferred maid gender.
          </p>
        </div>
      </div>

      <!-- Charts Row 3 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- User Distribution Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4 dark:text-white">
            User Type Distribution
          </h2>
          <div class="chart-container">
            <canvas
              ref="userDistributionChart"
              class="w-full h-[300px]"
            ></canvas>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Proportion of maids vs households in the system.
          </p>
        </div>

        <!-- Job Status Chart -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4 dark:text-white">
            Job Status Distribution
          </h2>
          <div class="chart-container">
            <canvas ref="jobStatusChart" class="w-full h-[300px]"></canvas>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Current status distribution of all job posts.
          </p>
        </div>
      </div>

      <!-- Activities Section -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold dark:text-white">
            Recent Activities
          </h2>
          <button
            @click="fetchActivityFeed"
            class="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd"
              />
            </svg>
            Refresh
          </button>
        </div>
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
            >
              <tr
                v-for="(activity, index) in activities"
                :key="index"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      :class="getActivityDotClass(activity.type)"
                      class="w-2 h-2 rounded-full mr-2"
                    ></div>
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                      >{{ activity.type }}</span
                    >
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                >
                  {{ activity.description }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                >
                  {{ formatDate(activity.created_at) }}
                </td>
              </tr>
              <tr v-if="activities.length === 0">
                <td
                  colspan="3"
                  class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300"
                >
                  No activities found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            v-if="activities.length > 0"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All Activities
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Chart, registerables } from "chart.js";
import backendApi from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";

// Register Chart.js components
Chart.register(...registerables);

// Refs for charts
const userRegistrationsChart = ref(null);
const jobPostsChart = ref(null);
const jobTimeChart = ref(null);
const genderPreferenceChart = ref(null);
const userDistributionChart = ref(null);
const jobStatusChart = ref(null);

// Chart instances
let userRegistrationsChartInstance = null;
let jobPostsChartInstance = null;
let jobTimeChartInstance = null;
let genderPreferenceChartInstance = null;
let userDistributionChartInstance = null;
let jobStatusChartInstance = null;

// Data refs
const loading = ref(true);
const stats = ref({});
const activities = ref([]);
const userRegistrationsData = ref([]);
const jobPostsData = ref([]);
const jobTimeData = ref([]);
const genderPreferenceData = ref([]);
const jobStatusData = ref([]);

// Time range filters
const userRegTimeRange = ref("30");
const jobPostsTimeRange = ref("30");

const authStore = useAuthStore();

// Format date for display
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get appropriate dot color based on activity type
const getActivityDotClass = (type) => {
  if (type.includes("registered")) return "bg-blue-500";
  if (type.includes("post")) return "bg-green-500";
  if (type.includes("applied")) return "bg-yellow-500";
  if (type.includes("Agreement")) return "bg-purple-500";
  if (type.includes("verification")) return "bg-pink-500";
  return "bg-gray-500";
};

// Destroy chart instance if it exists
const destroyChart = (chartInstance) => {
  if (chartInstance) {
    chartInstance.destroy();
  }
};

// Fetch stats data
const fetchStats = async () => {
  try {
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }
    const response = await backendApi.get("/reports/top-cards", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    stats.value = response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};

// Fetch user registrations data
const fetchUserRegistrations = async () => {
  try {
    const response = await backendApi.get("/reports/user-registrations", {
      params: { time_range: userRegTimeRange.value },
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    userRegistrationsData.value = response.data;
    updateUserRegistrationsChart();
  } catch (error) {
    console.error("Error fetching user registrations:", error);
  }
};

// Fetch job posts data
const fetchJobPostsCreated = async () => {
  try {
    const response = await backendApi.get("/reports/job-posts-created", {
      params: { time_range: jobPostsTimeRange.value },
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    jobPostsData.value = response.data;
    updateJobPostsChart();
  } catch (error) {
    console.error("Error fetching job posts:", error);
  }
};

// Fetch job time distribution data
const fetchJobTimeDistribution = async () => {
  try {
    const response = await backendApi.get("/reports/job-time-distribution", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    jobTimeData.value = response.data;
    updateJobTimeChart();
  } catch (error) {
    console.error("Error fetching job time distribution:", error);
  }
};

// Fetch gender preference data
const fetchGenderPreference = async () => {
  try {
    const response = await backendApi.get("/reports/gender-preference", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    genderPreferenceData.value = response.data;
    updateGenderPreferenceChart();
  } catch (error) {
    console.error("Error fetching gender preference:", error);
  }
};

// Fetch activity feed
const fetchActivityFeed = async () => {
  try {
    const response = await backendApi.get("/reports/activity-feed", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    activities.value = response.data;
  } catch (error) {
    console.error("Error fetching activity feed:", error);
  }
};

// Initialize User Registrations Chart
const updateUserRegistrationsChart = () => {
  destroyChart(userRegistrationsChartInstance);

  const ctx = userRegistrationsChart.value.getContext("2d");
  userRegistrationsChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: userRegistrationsData.value.map((item) => item.date),
      datasets: [
        {
          label: "User Registrations",
          data: userRegistrationsData.value.map((item) => item.count),
          borderColor: "rgba(79, 70, 229, 1)",
          backgroundColor: "rgba(79, 70, 229, 0.05)",
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: "rgba(79, 70, 229, 1)",
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBorderWidth: 2,
          pointBorderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          padding: 12,
          cornerRadius: 6,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            stepSize: 1,
            padding: 10,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            padding: 10,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      elements: {
        line: {
          cubicInterpolationMode: "monotone",
        },
      },
    },
  });
};

// Initialize Job Posts Chart
const updateJobPostsChart = () => {
  destroyChart(jobPostsChartInstance);

  const ctx = jobPostsChart.value.getContext("2d");
  jobPostsChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: jobPostsData.value.map((item) => item.date),
      datasets: [
        {
          label: "Job Posts",
          data: jobPostsData.value.map((item) => item.count),
          borderColor: "rgba(16, 185, 129, 1)",
          backgroundColor: "rgba(16, 185, 129, 0.05)",
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: "rgba(16, 185, 129, 1)",
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBorderWidth: 2,
          pointBorderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          padding: 12,
          cornerRadius: 6,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            stepSize: 1,
            padding: 10,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            padding: 10,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      elements: {
        line: {
          cubicInterpolationMode: "monotone",
        },
      },
    },
  });
};

// Initialize Job Time Distribution Chart
const updateJobTimeChart = () => {
  destroyChart(jobTimeChartInstance);

  const ctx = jobTimeChart.value.getContext("2d");
  jobTimeChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: jobTimeData.value.map((item) => item.job_time),
      datasets: [
        {
          label: "Job Posts",
          data: jobTimeData.value.map((item) => item.count),
          backgroundColor: [
            "rgba(99, 102, 241, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(245, 158, 11, 0.7)",
          ],
          borderColor: [
            "rgba(99, 102, 241, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(245, 158, 11, 1)",
          ],
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          padding: 12,
          cornerRadius: 6,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            padding: 10,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            padding: 10,
          },
        },
      },
    },
  });
};

// Initialize Gender Preference Chart
const updateGenderPreferenceChart = () => {
  destroyChart(genderPreferenceChartInstance);

  const ctx = genderPreferenceChart.value.getContext("2d");
  genderPreferenceChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: genderPreferenceData.value.map((item) => item.gender_preference),
      datasets: [
        {
          label: "Job Posts",
          data: genderPreferenceData.value.map((item) => item.count),
          backgroundColor: [
            "rgba(236, 72, 153, 0.7)",
            "rgba(59, 130, 246, 0.7)",
            "rgba(16, 185, 129, 0.7)",
          ],
          borderColor: [
            "rgba(236, 72, 153, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(16, 185, 129, 1)",
          ],
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          padding: 12,
          cornerRadius: 6,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            padding: 10,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            padding: 10,
          },
        },
      },
    },
  });
};

// Initialize User Distribution Chart
const updateUserDistributionChart = () => {
  destroyChart(userDistributionChartInstance);

  const ctx = userDistributionChart.value.getContext("2d");
  userDistributionChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Maids", "Households"],
      datasets: [
        {
          data: [stats.value.total_maids, stats.value.total_households],
          backgroundColor: [
            "rgba(99, 102, 241, 0.7)",
            "rgba(16, 185, 129, 0.7)",
          ],
          borderColor: ["rgba(99, 102, 241, 1)", "rgba(16, 185, 129, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          padding: 12,
          cornerRadius: 6,
        },
      },
      cutout: "75%",
    },
  });
};

// Initialize Job Status Chart
const updateJobStatusChart = async () => {
  try {
    const response = await backendApi.get("/reports/job-status", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    jobStatusData.value = response.data;

    destroyChart(jobStatusChartInstance);

    const ctx = jobStatusChart.value.getContext("2d");
    jobStatusChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: jobStatusData.value.map((item) => item.status),
        datasets: [
          {
            data: jobStatusData.value.map((item) => item.count),
            backgroundColor: [
              "rgba(99, 102, 241, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(239, 68, 68, 0.7)",
              "rgba(139, 92, 246, 0.7)",
            ],
            borderColor: [
              "rgba(99, 102, 241, 1)",
              "rgba(16, 185, 129, 1)",
              "rgba(245, 158, 11, 1)",
              "rgba(239, 68, 68, 1)",
              "rgba(139, 92, 246, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: "circle",
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 12,
            },
            padding: 12,
            cornerRadius: 6,
          },
        },
        cutout: "75%",
      },
    });
  } catch (error) {
    console.error("Error fetching job status:", error);
  }
};

// Fetch all data
const fetchAllData = async () => {
  try {
    loading.value = true;
    await Promise.all([
      fetchStats(),
      fetchUserRegistrations(),
      fetchJobPostsCreated(),
      fetchJobTimeDistribution(),
      fetchGenderPreference(),
      fetchActivityFeed(),
    ]);
    updateUserDistributionChart();
    await updateJobStatusChart();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch data when component is mounted
onMounted(() => {
  fetchAllData();
});

// Clean up charts when component is unmounted
onUnmounted(() => {
  destroyChart(userRegistrationsChartInstance);
  destroyChart(jobPostsChartInstance);
  destroyChart(jobTimeChartInstance);
  destroyChart(genderPreferenceChartInstance);
  destroyChart(userDistributionChartInstance);
  destroyChart(jobStatusChartInstance);
});

definePageMeta({
  middleware: ["auth", "role"],
  layout: "admin",
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
