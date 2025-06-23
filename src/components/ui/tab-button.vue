<script setup lang="ts">
defineProps<{
  active: boolean;
}>();

defineEmits<{
  click: [MouseEvent];
}>();
</script>

<template>
  <button
    :class="[
      'px-3 py-1.5 -mb-px text-sm font-medium focus:outline-none transition-all duration-200 border-b-2 rounded-t',
      active
        ? 'border-blue-600 text-blue-900 bg-white shadow z-10 scale-105'
        : 'border-transparent text-blue-500 bg-blue-100 hover:bg-blue-200 hover:text-blue-800',
      'mr-1',
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
