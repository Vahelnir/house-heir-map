<script setup lang="ts">
import type { Room } from "@/core/rooms";
import { computed } from "vue";

const { room } = defineProps<{
  room: Room;
}>();

const dimensions = computed(() => {
  const xs = room.points.map((p) => p.x);
  const ys = room.points.map((p) => p.y);
  return {
    width: Math.max(...xs) - Math.min(...xs) + 1,
    height: Math.max(...ys) - Math.min(...ys) + 1,
  };
});
</script>

<template>
  <div class="flex items-center gap-2 mb-2">
    <span
      class="inline-block w-4 h-4 rounded border border-blue-200"
      :style="{ background: room.color }"
    ></span>
    <span class="font-bold text-lg">{{ room.name }}</span>
  </div>
  <div class="text-sm text-blue-800 mb-2">
    <div>
      <span class="font-semibold">Dimensions :</span>
      {{ dimensions.width }} x {{ dimensions.height }}
    </div>
    <div v-if="room.offset">
      <span class="font-semibold">Offset :</span> x: {{ room.offset.x }}, y:
      {{ room.offset.y }}
    </div>
  </div>
  <div class="mb-2">
    <span class="font-semibold">JSON :</span>
    <textarea
      readonly
      class="w-full h-32 p-1 rounded bg-white text-xs text-blue-900 mt-1 font-mono border border-blue-200"
      :value="JSON.stringify(room, null, 2)"
    ></textarea>
  </div>
</template>
