<script lang="ts" setup>
import { useManorMap } from "@/composables/useManorMap";
import { ROOM_SIZE } from "@/core/constants";
import type { Room } from "@/core/rooms";
import type { DeepReadonly } from "vue";
import MapRoom from "./map-room.vue";

const { scale, selectedRoom, selectRoom } = useManorMap();

defineProps<{
  x: number;
  y: number;
  room: DeepReadonly<Room> | undefined;
}>();
</script>

<template>
  <g class="cell" :transform="`translate(${x}, ${y})`">
    <rect
      :x="0"
      :y="0"
      :width="scale * ROOM_SIZE.width"
      :height="scale * ROOM_SIZE.height"
      fill="#e0e7ef"
      stroke="#333"
      stroke-width="1"
    />
    <MapRoom
      v-if="room"
      :room="room"
      :isSelected="selectedRoom?.name === room.name"
      @click.prevent.stop="selectRoom(room.name)"
    />
  </g>
</template>
