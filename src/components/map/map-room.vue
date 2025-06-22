<script setup lang="ts">
import { useManorMap } from "@/composables/useManorMap";
import type { Room } from "@/core/rooms";
import type { DeepReadonly } from "vue";

defineProps<{
  room: DeepReadonly<Room>;
}>();

const { scale } = useManorMap();
</script>

<template>
  <g
    :key="room.name"
    :data-room-name="room.name"
    class="cursor-pointer focus:drop-shadow focus:drop-shadow-blue-300 focus:outline focus:rounded-sm"
    tabindex="0"
  >
    <rect
      v-for="(p, i) in room.points"
      :key="i"
      :x="p.x * scale"
      :y="p.y * scale"
      :width="scale"
      :height="scale"
      :fill="room.color || '#e0e7ef'"
      stroke="#333"
      stroke-width="1"
      :data-coords="`${p.x},${p.y}`"
    />
    <text
      v-if="room.name"
      :x="room.label.x * scale"
      :y="room.label.y * scale"
      text-anchor="middle"
      alignment-baseline="middle"
      class="font-bold text-xs select-none"
    >
      {{ room.name }}
    </text>
  </g>
</template>
