<template>
  <section class="flex flex-col min-h-screen ml-0 bg-gray-100 dark:bg-gray-900">
    <!-- Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold dark:text-gray-100">
          {{ $t("jobs_applied") }}
        </h2>
        <p class="text-3xl font-bold dark:text-gray-100">2</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold dark:text-gray-100">Accepted</h2>
        <p class="text-3xl font-bold dark:text-gray-100">1</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold dark:text-gray-100">Rejected</h2>
        <p class="text-3xl font-bold dark:text-gray-100">1</p>
      </div>
    </div>

    <!-- Monthly Revenue Chart -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <h2 class="text-lg font-semibold mb-4 dark:text-gray-100">
        Monthly Revenue
      </h2>
      <canvas ref="revenueChart"></canvas>
    </div>

    <!-- Rating & Reviews -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <h2 class="text-lg font-semibold mb-4 dark:text-gray-100">
        Rating & Reviews
      </h2>
      <div class="flex space-x-4">
        <div class="w-1/2">
          <p class="text-3xl font-bold dark:text-gray-100">72.5%</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Positive</p>
        </div>
        <div class="w-1/2">
          <p class="text-3xl font-bold dark:text-gray-100">27.5%</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Negative</p>
        </div>
      </div>
    </div>

    <!-- Activities -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <h2 class="text-lg font-semibold mb-4 dark:text-gray-100">Activities</h2>
      <ul class="space-y-4">
        <li class="flex items-center space-x-4">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p class="dark:text-gray-100">New message from Household #123</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">2023-10-25</p>
        </li>
        <li class="flex items-center space-x-4">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <p class="dark:text-gray-100">Application Accepted</p>
        </li>
        <li class="flex items-center space-x-4">
          <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <p class="dark:text-gray-100">
            Received a 5-star review from Household
          </p>
        </li>
        <li class="flex items-center space-x-4">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p class="dark:text-gray-100">New message from Household #123</p>
        </li>
      </ul>
    </div>

    <!-- Earnings by Job Type Chart -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4 dark:text-gray-100">
        Earnings by Job Type
      </h2>
      <canvas ref="earningsChart"></canvas>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
import axios from "axios";

// Register Chart.js components
Chart.register(...registerables);

const revenueChart = ref(null);
const earningsChart = ref(null);

// Monthly Revenue Data
const revenueData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Revenue (ETB)",
      data: [
        5000, 6000, 7000, 8000, 9000, 10000, 9500, 8500, 7500, 8000, 8500, 9000,
      ],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
    },
  ],
};

const revenueOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

// Earnings by Job Type Data
const earningsData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
  ],
  datasets: [
    {
      label: "Full-Time",
      data: [
        5000, 4000, 3000, 2000, 1000, 5000, 4000, 3000, 2000, 1000, 2000, 1000,
      ],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: true,
    },
    {
      label: "Part-Time",
      data: [3000, 2000, 4000, 1000, 5000],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      fill: true,
    },
    {
      label: "One-Time",
      data: [2000, 3000, 1000, 4000, 3000],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
    },
  ],
};

const earningsOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

// Initialize Charts
onMounted(() => {
  new Chart(revenueChart.value, {
    type: "line",
    data: revenueData,
    options: revenueOptions,
  });

  new Chart(earningsChart.value, {
    type: "line",
    data: earningsData,
    options: earningsOptions,
  });
});

// TODO: Fetch data from API using Axios interceptor
// Example:
// const fetchData = async () => {
//   try {
//     const response = await axios.get("/api/dashboard");
//     console.log("API Response:", response.data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

// onMounted(() => {
//   fetchData();
// });

definePageMeta({
  layout: "mod",
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>
