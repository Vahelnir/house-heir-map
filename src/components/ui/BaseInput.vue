<script setup lang="ts">
const model = defineModel<unknown>();
</script>

<template>
  <label class="flex items-center gap-2">
    <slot />
    <input
      v-bind="$attrs"
      class="w-16 px-1 py-0.5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
      v-model="model"
    />
  </label>
</template>
