<template>
    <div class="border p-4 rounded-lg shadow">
      <img :src="maid.photo" alt="maid.name" class="w-full h-40 object-cover rounded-md">
      <h3 class="text-lg font-bold">{{ maid.name }}</h3>
      <p>{{ maid.location }}</p>
      <p class="text-sm text-gray-500">Experience: {{ maid.experience }} years</p>
      <NuxtLink :to="`/maids/${maid.id}`" class="text-blue-500">View Profile</NuxtLink>
    </div>
  </template>
  
  <script setup>
    defineProps({ maid: Object });
  </script>