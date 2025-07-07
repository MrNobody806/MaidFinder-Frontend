<template>
    <div class="testimonial">
      <p><strong>{{ testimonial.name }}</strong></p>
      <p>{{ testimonial.feedback }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    testimonial: {
      type: Object,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .testimonial {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    margin: 8px 0;
  }
  </style>