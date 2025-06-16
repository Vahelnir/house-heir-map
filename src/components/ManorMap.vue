<script setup lang="ts">
import { ref, computed } from "vue";
import RoomEditor from "./RoomEditor.vue";
import { rooms as rawRooms, type Room, type RoomWithOffset } from "@/rooms";

const SCALE = 14;

const rooms = ref<RoomWithOffset[]>(rawRooms);

const bounds = computed(() => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const room of rooms.value) {
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

const svgWidth = computed(() => (bounds.value.maxX - bounds.value.minX) * SCALE);
const svgHeight = computed(() => (bounds.value.maxY - bounds.value.minY) * SCALE);

// Ajout d'une salle sélectionnée pour édition
const editingRoomIdx = ref<number | null>(null);

function editRoom(idx: number) {
  const room = rooms.value[idx];
  if (!room) return;
  editingRoomIdx.value = idx;
}

function onRoomEdited(editedRoom: Room) {
  if (editingRoomIdx.value !== null) {
    // Conserve l'offset si présent
    const offset = rooms.value[editingRoomIdx.value].offset;
    rooms.value[editingRoomIdx.value] = { ...editedRoom, offset };
    editingRoomIdx.value = null;
  }
}

function addRoom(room: Room) {
  rooms.value.push(room);
}

// Ajout de la sélection de salle
const selectedRoomIdx = ref<number>();

function selectRoom(idx: number | undefined) {
  selectedRoomIdx.value = idx;
}
</script>

<template>
  <div class="flex flex-col items-center mt-8">
    <RoomEditor @room-created="addRoom" />
    <svg
      :width="svgWidth"
      :height="svgHeight"
      class="border bg-gray-100 rounded shadow mt-4"
      @click="selectRoom(undefined)"
    >
      <g
        v-for="(room, idx) in rooms"
        :key="idx"
        :data-room-name="room.name"
        @click.prevent.stop="selectRoom(idx)"
        :class="{
          'drop-shadow drop-shadow-blue-300': selectedRoomIdx === idx,
        }"
        class="cursor-pointer"
      >
        <rect
          v-for="(p, i) in room.points"
          :key="i"
          :x="(p.x + (room.offset?.x ?? 0) - bounds.minX) * SCALE"
          :y="(p.y + (room.offset?.y ?? 0) - bounds.minY) * SCALE"
          :width="SCALE"
          :height="SCALE"
          :fill="room.color || '#e0e7ef'"
          stroke="#333"
          stroke-width="1"
          :data-coords="`${p.x},${p.y}`"
        />
        <text
          v-if="room.name"
          :x="(room.label.x + (room.offset?.x ?? 0) - bounds.minX) * SCALE"
          :y="(room.label.y + (room.offset?.y ?? 0) - bounds.minY) * SCALE"
          text-anchor="middle"
          alignment-baseline="middle"
          class="font-bold text-xs select-none"
        >
          {{ room.name }}
        </text>
        <foreignObject
          :x="(room.label.x + (room.offset?.x ?? 0) - bounds.minX) * SCALE - 32"
          :y="(room.label.y + (room.offset?.y ?? 0) - bounds.minY) * SCALE - 32"
          width="120"
          height="24"
        >
          <div class="flex flex-row gap-1 items-center justify-center" style="pointer-events: auto">
            <button
              class="px-1 py-0.5 rounded bg-blue-200 hover:bg-blue-300 text-xs"
              @click.stop="editRoom(idx)"
            >
              ✏️
            </button>
          </div>
        </foreignObject>
      </g>
    </svg>
    <RoomEditor
      v-if="editingRoomIdx !== null"
      :key="editingRoomIdx"
      :initial-room="rooms[editingRoomIdx]"
      @room-created="onRoomEdited"
      @close="editingRoomIdx = null"
    />
  </div>
</template>
