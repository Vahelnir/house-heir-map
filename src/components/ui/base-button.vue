<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  color?: "blue" | "green" | "indigo" | "red";
  disabled?: boolean;
}>();

defineEmits<{
  click: [event: MouseEvent];
}>();

const colorClass = computed(() => {
  switch (props.color) {
    case "green":
      return "bg-green-500 hover:bg-green-600";
    case "indigo":
      return "bg-indigo-500 hover:bg-indigo-600";
    case "red":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-blue-500 hover:bg-blue-600";
  }
});
</script>

<template>
  <button
    class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
    :class="colorClass"
    :disabled="disabled"
    @click="$emit('click', $event)"
    type="button"
  >
    <slot />
  </button>
</template>
