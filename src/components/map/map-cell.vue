<script lang="ts" setup>
import { useManorMap, type Cell } from "@/composables/useManorMap";
import { ROOM_SIZE } from "@/core/constants";
import { computed, type DeepReadonly } from "vue";
import MapRoom from "./map-room.vue";

const { scale, selectedCell, selectCell } = useManorMap();

const props = defineProps<{
  x: number;
  y: number;
  cell: DeepReadonly<Cell>;
}>();

const isSelected = computed(() => selectedCell.value === props.cell);
</script>

<template>
  <g
    class="cell cursor-pointer"
    :transform="`translate(${x}, ${y})`"
    @click.prevent.stop="selectCell(cell)"
    :data-coords="`${cell.x},${cell.y}`"
    :data-selected="isSelected"
  >
    <rect
      :x="0"
      :y="0"
      :width="scale * ROOM_SIZE.width"
      :height="scale * ROOM_SIZE.height"
      :fill="'#e0e7ef'"
      :stroke="isSelected ? '#333' : '#ccc'"
      stroke-width="2"
    />
    <MapRoom v-if="cell.room" :room="cell.room" :scale />
  </g>
</template>
