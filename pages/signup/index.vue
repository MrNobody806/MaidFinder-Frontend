<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-[#F3F3F3] dark:bg-[#191A23]"
  >
    <div
      class="flex flex-col bg-white dark:bg-[#20233f] p-8 font-serif rounded-lg shadow-lg w-auto text-center"
    >
      <div
        class="flex flex-col md:flex-row items-center justify-between mb-6 gap-4"
      >
        <!-- Householder/Client Card -->
        <div
          @click="role(2)"
          class="border bg-[#B9FF66] dark:bg-[#B9FF66] p-4 md:p-6 rounded-lg hover:bg-[#A0E55C] dark:hover:bg-[#A0E55C] w-full md:w-auto text-decoration-none cursor-pointer"
        >
          <h2
            class="text-xl md:text-2xl font-bold text-black dark:text-[#191A23]"
          >
            Householder
          </h2>
        </div>
        <!-- Maid/Job Seeker Card -->
        <div
          @click="role(3)"
          class="border bg-[#B9FF66] dark:bg-[#B9FF66] p-4 md:p-6 rounded-lg hover:bg-[#A0E55C] dark:hover:bg-[#A0E55C] w-full md:w-auto text-decoration-none cursor-pointer"
        >
          <h2
            class="text-xl md:text-2xl font-bold text-black dark:text-[#191A23]"
          >
            Maid
          </h2>
        </div>
      </div>
      <!-- Login Section -->
      <div class="flex flex-row justify-center items-center gap-4">
        <p class="text-gray-600 dark:text-[#F3F3F3]">
          Already Have an account?
        </p>
        <button
          @click="navigateTo(`/login`)"
          class="bg-black dark:bg-[#B9FF66] text-white dark:text-[#191A23] font-semibold px-6 py-1 rounded-lg hover:bg-[#191A23] dark:hover:bg-[#A0E55C] transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const role = (id) => {
  navigateTo(`/signup/${id}`);
};

definePageMeta({
  layout: "custom",
});
</script>
