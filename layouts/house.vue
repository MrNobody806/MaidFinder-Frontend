<template>
  <div
    class="bg-[#F3F3F3] font-serif dark:bg-gray-900 min-h-screen flex flex-col"
  >
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>

<script setup></script>

<style scoped>
/* Add custom styles if needed */
</style>
