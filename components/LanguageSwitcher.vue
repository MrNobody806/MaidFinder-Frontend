<template>
  <div class="relative" ref="dropdownContainer">
    <!-- Language Toggle Button -->
    <button
      @click.stop="toggleLanguageDropdown"
      class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white rounded-full"
    >
      <Icon :name="currentLanguage.icon" class="size-6" />
      <span class="hidden md:inline ml-2">{{ currentLanguage.label }}</span>
      <Icon
        name="mdi:chevron-down"
        class="size-4 ml-1 transition-transform duration-200"
        :class="{ 'rotate-180': isLanguageDropdownOpen }"
      />
    </button>

    <!-- Language Dropdown -->
    <Transition name="fade">
      <div
        v-if="isLanguageDropdownOpen"
        class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700"
      >
        <ul>
          <li
            v-for="(lang, index) in languages"
            :key="index"
            @click="changeLanguage(lang)"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            :class="{
              'bg-gray-50 dark:bg-gray-700': lang.code === currentLanguage.code,
            }"
          >
            <div class="flex items-center space-x-2">
              <Icon :name="lang.icon" class="size-5" />
              <span>{{ lang.label }}</span>
            </div>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// Use Nuxt's composables
const { locale, setLocale } = useI18n();
const router = useRouter();
const dropdownContainer = ref(null);

// Reactive state for dropdown visibility
const isLanguageDropdownOpen = ref(false);

// Available languages with flags and names
const languages = [
  { code: "en", label: "English", icon: "circle-flags:us" },
  { code: "am", label: "Amharic", icon: "circle-flags:et" },
  // Add more languages as needed
];

// Current language (computed based on the active locale)
const currentLanguage = computed(() => {
  return languages.find((lang) => lang.code === locale.value) || languages[0];
});

// Toggle language dropdown
const toggleLanguageDropdown = (e) => {
  e.stopPropagation();
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value;
};

// Change language
const changeLanguage = (lang) => {
  setLocale(lang.code);
  localStorage.setItem("selectedLanguage", lang.code);
  isLanguageDropdownOpen.value = false;
};

// Handle click outside to close dropdown
const handleClickOutside = (event) => {
  if (
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target)
  ) {
    isLanguageDropdownOpen.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Load saved language
  const savedLanguage = localStorage.getItem("selectedLanguage");
  if (savedLanguage && languages.some((lang) => lang.code === savedLanguage)) {
    setLocale(savedLanguage);
  }

  // Add event listeners
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
