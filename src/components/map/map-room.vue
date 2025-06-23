<script setup lang="ts">
import { ROOM_SIZE } from "@/core/constants";
import type { Room } from "@/core/rooms";
import type { DeepReadonly } from "vue";

defineProps<{
  standalone?: boolean;
  room: DeepReadonly<Room>;
  scale: number;
}>();
</script>

<template>
  <component
    :is="standalone ? 'svg' : 'g'"
    :data-room-name="room.name"
    :viewBox="standalone ? `0 0 ${ROOM_SIZE.width * scale} ${ROOM_SIZE.height * scale}` : undefined"
    class="room"
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
  </component>
</template>
