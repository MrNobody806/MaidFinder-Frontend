<template>
  <div class="min-h-screen dark:bg-gray-900 p-6">
    <div
      class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
    >
      <!-- Maid Picture -->
      <div class="flex justify-between items-start px-4 gap-4">
        <div class="w-1/2 flex flex-col items-center space-y-2">
          <span
            class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold"
            >NEW PROFILE</span
          >

          <NuxtImg
            src="/4.jpg"
            alt="Maid Picture"
            class="w-full object-cover rounded-md"
          />
        </div>

        <div class="flex-1 mt-6 border p-4 ml-4">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-gray-500 text-sm">Date Posted</p>
              <p class="dark:text-white">{{ maid.datePosted }}</p>
            </div>
          </div>

          <h2 class="text-lg font-bold dark:text-white mb-2">Contact</h2>
          <div class="space-y-2">
            <p class="dark:text-white">WhatsApp: {{ maid.contact.whatsapp }}</p>
            <p class="dark:text-white">Phone: {{ maid.contact.phone }}</p>
            <p class="dark:text-white">Facebook: {{ maid.contact.facebook }}</p>
            <p class="dark:text-white">Email: Raid@Finder.com</p>
          </div>
        </div>
      </div>

      <!-- Maid Name and Location -->
      <h1 class="text-2xl font-bold dark:text-white mt-4">{{ maid.name }}</h1>
      <p class="text-gray-600 dark:text-gray-300">{{ maid.location }}</p>

      <!-- Maid Details -->
      <div class="mt-6">
        <h2 class="text-xl font-bold dark:text-white">Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p class="font-semibold dark:text-white">Age:</p>
            <p class="dark:text-gray-300">{{ maid.age }}</p>
          </div>
          <div>
            <p class="font-semibold dark:text-white">Experience:</p>
            <p class="dark:text-gray-300">{{ maid.experience }} years</p>
          </div>
          <div>
            <p class="font-semibold dark:text-white">Salary Expected:</p>
            <p class="dark:text-gray-300">{{ maid.salary }}</p>
          </div>
          <div>
            <p class="font-semibold dark:text-white">Availability:</p>
            <p class="dark:text-gray-300">{{ maid.availability }}</p>
          </div>
          <div>
            <p class="font-semibold dark:text-white">Religion:</p>
            <p class="dark:text-gray-300">{{ maid.religion }}</p>
          </div>
          <div>
            <p class="font-semibold dark:text-white">Visa Status:</p>
            <p class="dark:text-gray-300">{{ maid.visaStatus }}</p>
          </div>
          <div>
            <p class="font-semibold dark:text-white">Marital Status:</p>
            <p class="dark:text-gray-300">{{ maid.maritalStatus }}</p>
          </div>
        </div>
      </div>

      <!-- Key Skills -->
      <div class="mt-6">
        <h2 class="text-xl font-bold dark:text-white">Key Skills</h2>
        <div class="flex flex-wrap gap-2 mt-4">
          <span
            v-for="skill in maid.keySkills"
            :key="skill"
            class="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import { useRoute } from "vue-router";
// import { useVerificationStore } from "@/stores/verificationStore";
// import axios from "axios";

// const route = useRoute();
const maid = ref({
  id: 6,
  picture: "[]", // Placeholder image
  name: "",
  age: 22,
  experience: "2 years",
  salary: "2,000-2,500 AED",
  availability: "Immediately",
  religion: "Christian",
  location: "Dubai, UAE",
  visaStatus: "Own Visa",
  maritalStatus: "Single",
  keySkills: ["Live-in Maid", "Child Care", "Pet Care", "Cooking"],
  contact: {
    whatsapp: "+971 123 456 789",
    phone: "+971 987 654 321",
    facebook: "Select M.",
  },
});

// const verificationStore = useVerificationStore();
// const isVerified = verificationStore.isVerified;

onMounted(() => {
  // Fetch maid details from API (if needed)
  // axios.get(`/api/maids/${route.params.id}`).then(response => {
  //   maid.value = response.data;
  // });
});
</script>
