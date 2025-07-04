<script setup lang="ts">
import { computed, ref } from "vue";
import { useManorMap } from "@/composables/useManorMap";
import { CELL_SIZE, GRID_SIZE } from "@/core/constants";
import MapCell from "./map-cell.vue";

const { grid, selectCell, scale, setScale } = useManorMap();

const svgSize = computed(() => ({
  width: CELL_SIZE.width * GRID_SIZE.width * scale.value,
  height: CELL_SIZE.height * GRID_SIZE.height * scale.value,
}));

const panOffset = ref({ x: 0, y: 0 });
const isPanning = ref(false);
const lastPan = ref({ x: 0, y: 0 });

let dragMoved = false;
const dragThreshold = 5; // pixels

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) {
    return;
  }

  isPanning.value = true;
  lastPan.value = { x: e.clientX, y: e.clientY };
  dragMoved = false;
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  if (!isPanning.value) {
    return;
  }

  const dx = e.clientX - lastPan.value.x;
  const dy = e.clientY - lastPan.value.y;
  if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
    dragMoved = true;
  }

  panOffset.value.x += dx;
  panOffset.value.y += dy;
  lastPan.value = { x: e.clientX, y: e.clientY };
}

function onMouseUp() {
  isPanning.value = false;
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
}

function onSvgClick() {
  if (!dragMoved) {
    selectCell(null);
  }
}
</script>

<template>
  <div class="flex flex-col h-full w-full bg-gray-100 relative">
    <div class="absolute top-4 right-4 z-20 flex flex-col gap-2">
      <button
        class="bg-white border border-blue-300 rounded shadow flex justify-center items-center h-8 w-8 text-xl hover:bg-blue-100 transition"
        @click="setScale(Math.min(scale + 2, 64))"
        title="Zoomer"
      >
        +
      </button>
      <button
        class="bg-white border border-blue-300 rounded shadow flex justify-center items-center h-8 w-8 text-xl hover:bg-blue-100 transition"
        @click="setScale(Math.max(scale - 2, 4))"
        title="Dézoomer"
      >
        -
      </button>
    </div>

    <div class="overflow-hidden h-full w-full" @mousedown="onMouseDown" style="cursor: grab">
      <svg
        :width="svgSize.width"
        :height="svgSize.height"
        :style="{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }"
        @click="onSvgClick"
      >
        <template v-for="(row, y) in grid" :key="`col-${y}`">
          <MapCell
            v-for="(cell, x) in row"
            :key="`cell-${x}-${y}`"
            :x="x * scale * CELL_SIZE.width"
            :y="y * scale * CELL_SIZE.height"
            :cell
          ></MapCell>
        </template>
      </svg>
    </div>
  </div>
</template>
