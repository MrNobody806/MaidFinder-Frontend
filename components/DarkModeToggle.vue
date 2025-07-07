<template>
  <div class="flex justify-center items-center">
    <button @click="changeColor" class="srounded-lg p-2">
      <!-- Moon icon for light mode -->
      <Icon
        v-if="colorMode.value === 'light'"
        name="mdi:weather-night"
        class="size-6 text-gray-700 dark:text-gray-400"
      />

      <!-- Sun icon for dark mode -->
      <Icon v-else name="mdi:weather-sunny" class="size-6 text-yellow-500" />
    </button>
  </div>
</template>

<script setup>
const colorMode = useColorMode();

const changeColor = () => {
  colorMode.preference = colorMode.value === "light" ? "dark" : "light";
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
