<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from "vue";
import { useManorMap } from "@/composables/useMapState";

const { rooms, selectedRoom, selectRoom, scale, setScale } = useManorMap();

const bounds = computed(() => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [, room] of rooms) {
    const ox = room.offset?.x ?? 0;
    const oy = room.offset?.y ?? 0;
    for (const p of room.points) {
      minX = Math.min(minX, p.x + ox);
      minY = Math.min(minY, p.y + oy);
      maxX = Math.max(maxX, p.x + ox + 1);
      maxY = Math.max(maxY, p.y + oy + 1);
    }
  }

  return {
    minX: Math.floor(minX) - 1,
    minY: Math.floor(minY) - 1,
    maxX: Math.ceil(maxX) + 1,
    maxY: Math.ceil(maxY) + 1,
  };
});

const svgSize = computed(() => ({
  width: (bounds.value.maxX - bounds.value.minX) * scale.value,
  height: (bounds.value.maxY - bounds.value.minY) * scale.value,
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
    selectRoom(null);
  }
}

onMounted(async () => {
  await nextTick();
  const entree = Array.from(rooms.values()).find((r) => r.name === "Entrée");
  if (!entree) {
    return;
  }

  const svg = document.querySelector("svg");
  // TODO: improve this by maybe using an element ref
  // TODO: improve this to avoid hardcoding the room name
  const g = document.querySelector('svg [data-room-name="Entrée"]');
  if (!svg || !g || !(g instanceof SVGGElement)) {
    return;
  }

  const { x, y, width, height } = g.getBBox();
  const container = svg.parentElement;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const viewportX = container ? container.clientWidth / 2 : svg.width.baseVal.value / 2;
  const viewportY = container ? container.clientHeight / 2 : svg.height.baseVal.value / 2;
  panOffset.value.x = viewportX - cx;
  panOffset.value.y = viewportY - cy;
});
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
        <g
          v-for="[, room] in rooms"
          :key="room.name"
          :data-room-name="room.name"
          @click.prevent.stop="selectRoom(room.name)"
          :class="{
            'outline outline-offset-2': selectedRoom?.name === room.name,
          }"
          class="cursor-pointer focus:drop-shadow focus:drop-shadow-blue-300 focus:outline focus:rounded-sm"
          tabindex="0"
        >
          <rect
            v-for="(p, i) in room.points"
            :key="i"
            :x="(p.x + (room.offset?.x ?? 0) - bounds.minX) * scale"
            :y="(p.y + (room.offset?.y ?? 0) - bounds.minY) * scale"
            :width="scale"
            :height="scale"
            :fill="room.color || '#e0e7ef'"
            stroke="#333"
            stroke-width="1"
            :data-coords="`${p.x},${p.y}`"
          />
          <text
            v-if="room.name"
            :x="(room.label.x + (room.offset?.x ?? 0) - bounds.minX) * scale"
            :y="(room.label.y + (room.offset?.y ?? 0) - bounds.minY) * scale"
            text-anchor="middle"
            alignment-baseline="middle"
            class="font-bold text-xs select-none"
          >
            {{ room.name }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>
