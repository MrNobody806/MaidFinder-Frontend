<template>
  <footer class="dark:bg-black font-serif text-dark pt-4 bottom-0 border-lg">
    <div class="max-w-7xl container mx-auto px-4">
      <!-- Top Section: Logo, Navs, Social Icons -->
      <div
        class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
      >
        <!-- MailFinder Section -->
        <div>
          <h2 class="text-2xl font-bold dark:text-white">MaidFinder</h2>
        </div>

        <!-- Navs -->
        <div class="justify-around">
          <nav
            class="flex flex-wrap justify-center gap-4 md:gap-6 text-dark dark:text-[#F3F3F3]"
          >
            <NuxtLink to="/about" class="hover:text-[#B9FF66]"
              >About us</NuxtLink
            >
            <NuxtLink to="/services" class="hover:text-[#B9FF66]"
              >Services</NuxtLink
            >
            <NuxtLink to="/maids" class="hover:text-[#B9FF66]">Maids</NuxtLink>
            <NuxtLink to="#" class="hover:text-[#B9FF66]"
              >How it works</NuxtLink
            >
          </nav>
        </div>

        <!-- Social Icons -->
        <div class="flex justify-center gap-4">
          <Icon
            name="mdi:linkedin"
            class="w-8 h-8 text-black dark:text-white hover:text-[#A0E55C]"
          />
          <Icon
            name="ic:baseline-facebook"
            class="w-8 h-8 text-black dark:text-white hover:text-[#A0E55C]"
          />
          <Icon
            name="line-md:twitter-x"
            class="w-8 h-8 text-black dark:text-white hover:text-[#A0E55C]"
          />
        </div>
      </div>

      <!-- Middle Section: Contact Us and Newsletter -->
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-24">
        <!-- Contact Us Section -->
        <div class="flex-1">
          <h3
            class="text-xl font-semibold text-lime-500 px-2 py-1 rounded-md mb-4"
          >
            Contact Us:
          </h3>
          <ul class="text-dark dark:text-gray-400">
            <li class="mb-2">Email: info@maildfinder.com</li>
            <li class="mb-2">Phone: +25194317302</li>
            <li class="mb-2">
              Address: Hossana<br />
              Hossana, Ethiopia 0000
            </li>
          </ul>
        </div>

        <!-- Newsletter Section -->
        <div class="flex-1">
          <div
            class="w-full mx-auto border bg-gray dark:bg-[#20233f] p-6 lg:p-10 rounded-lg"
          >
            <h3 class="text-xl dark:text-white font-semibold mb-4">
              Subscribe to News
            </h3>
            <form
              @submit.prevent="subscribe"
              class="flex flex-col md:flex-row gap-2"
            >
              <input
                type="email"
                v-model="email"
                class="w-full px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-dark dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B9FF66]"
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                class="bg-[#B9FF66] text-[#191A23] font-semibold px-6 py-2 rounded-md hover:bg-[#A0E55C] transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="border-t border-dark dark:border-white mt-8 pt-8 text-center">
        <p class="text-black dark:text-white">
          © 2025. All Rights Reserved. |
          <a href="#" class="hover:text-[#B9FF66]">Privacy Policy</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";

// Reactive state for email input
const email = ref("");

// Function to handle newsletter subscription
const subscribe = () => {
  console.log("Subscribed with email:", email.value);
  alert("Thank you for subscribing!");
  email.value = ""; // Clear the input after submission
};
</script>
