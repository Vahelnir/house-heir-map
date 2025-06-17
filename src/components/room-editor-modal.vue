<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits } from "vue";
import BaseButton from "./ui/base-button.vue";
import BaseInput from "./ui/base-input.vue";
import type { Point, Room } from "../core/rooms";

const props = defineProps<{ initialRoom: Room | null }>();
const emit = defineEmits<{ (e: "room-created", room: Room): void; (e: "close"): void }>();

const isEdit = computed(() => !!props.initialRoom);

const room = ref<Room>(
  props.initialRoom
    ? JSON.parse(JSON.stringify(props.initialRoom))
    : {
        name: "",
        points: [],
        label: { x: 0, y: 0 },
        color: randomColor(),
        offset: { x: 0, y: 0 },
      },
);

const roomSize = ref({
  width: getRoomWidth(room.value),
  height: getRoomHeight(room.value),
});

const pixelGrid = ref<boolean[][]>(pointsToGrid(roomSize.value, room.value.points));

watch(
  () => props.initialRoom,
  (val) => {
    if (val) {
      room.value = JSON.parse(JSON.stringify(val));
      roomSize.value.width = getRoomWidth(val);
      roomSize.value.height = getRoomHeight(val);
      pixelGrid.value = pointsToGrid(roomSize.value, val.points);
    } else {
      resetRoom();
    }
  },
  { immediate: true },
);

watch(roomSize, ({ width, height }) => {
  const oldGrid = pixelGrid.value;
  pixelGrid.value = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => oldGrid[y]?.[x] ?? false),
  );
});

function getRoomWidth(r: Room) {
  if (!r.points.length) return 10;
  return Math.max(...r.points.map((p) => p.x)) + 1;
}
function getRoomHeight(r: Room) {
  if (!r.points.length) return 10;
  return Math.max(...r.points.map((p) => p.y)) + 1;
}

function pointsToGrid({ width, height }: { width: number; height: number }, points: Point[]) {
  const grid: boolean[][] = Array.from({ length }, () => Array(width).fill(false));
  for (const { x, y } of points) {
    if (y < height && x < width) grid[y][x] = true;
  }
  return grid;
}

function gridToPoints(grid: boolean[][]): Point[] {
  const points: Point[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x]) points.push({ x, y });
    }
  }
  return points;
}

function togglePixel(x: number, y: number) {
  pixelGrid.value[y][x] = !pixelGrid.value[y][x];
}

function resetRoom() {
  room.value = {
    name: "",
    points: [],
    label: { x: 0, y: 0 },
    color: randomColor(),
    offset: { x: 0, y: 0 },
  };
  roomSize.value = { width: 10, height: 10 };
  pixelGrid.value = pointsToGrid(roomSize.value, []);
}

function closeModal() {
  emit("close");
}

const error = ref("");
function submitRoom() {
  const points = gridToPoints(pixelGrid.value);
  if (!room.value.name.trim()) {
    error.value = "Le nom est requis.";
    return;
  }
  if (points.length < 1) {
    error.value = "La salle doit contenir au moins un bloc.";
    return;
  }
  error.value = "";
  const label = getRectangleCenter(points);
  emit("room-created", {
    ...room.value,
    points,
    label,
  });
}

function getRectangleCenter(points: Point[]): { x: number; y: number } {
  return {
    x: Math.max(...points.map((p) => p.x)) / 2,
    y: Math.max(...points.map((p) => p.y)) / 2,
  };
}

function randomColor() {
  const colors = ["#fbbf24", "#60a5fa", "#a7f3d0", "#fca5a5", "#fcd34d", "#bbf7d0", "#e0e7ef"];
  return colors[Math.floor(Math.random() * colors.length)];
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-2xl p-0 w-[95vw] max-w-xl flex flex-col">
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-blue-50 rounded-t-lg"
        >
          <h2 class="text-xl font-bold text-blue-900">
            {{ isEdit ? "Modifier la salle" : "Créer une nouvelle salle" }}
          </h2>
          <button
            class="text-2xl text-blue-400 hover:text-blue-700"
            @click="closeModal"
            title="Fermer"
          >
            ×
          </button>
        </div>
        <div class="flex flex-col gap-4 px-6 py-4">
          <div class="flex flex-row gap-4">
            <BaseInput
              type="number"
              min="1"
              max="40"
              :model-value="roomSize.width"
              @update:model-value="(val) => (roomSize.width = Number(val))"
            >
              <span>Largeur :</span>
            </BaseInput>
            <BaseInput
              type="number"
              min="1"
              max="40"
              :model-value="roomSize.height"
              @update:model-value="(val) => (roomSize.height = Number(val))"
            >
              <span>Hauteur :</span>
            </BaseInput>
          </div>
          <div class="inline-block border bg-gray-100 rounded shadow p-2">
            <div v-for="(row, y) in pixelGrid" :key="y" class="flex flex-row">
              <div
                v-for="(cell, x) in row"
                :key="x"
                class="w-6 h-6 border cursor-pointer flex items-center justify-center"
                :class="{
                  'border-gray-300': !cell,
                  'border-blue-500': cell,
                  'bg-blue-100': cell,
                }"
                :style="{ 'background-color': cell ? room.color : '#f3f4f6' }"
                @click="togglePixel(x, y)"
              ></div>
            </div>
          </div>
          <div class="flex flex-row gap-4">
            <BaseInput type="text" v-model="room.name">
              <span>Nom :</span>
            </BaseInput>
            <BaseInput type="text" v-model="room.color">
              <span>Couleur :</span>
            </BaseInput>
          </div>
          <div class="flex flex-row gap-4">
            <BaseInput
              type="number"
              :model-value="room.offset.x"
              @update:model-value="(val) => (room.offset.x = Number(val))"
            >
              <span>Décalage X :</span>
            </BaseInput>
            <BaseInput
              type="number"
              :model-value="room.offset.y"
              @update:model-value="(val) => (room.offset.y = Number(val))"
            >
              <span>Décalage Y :</span>
            </BaseInput>
          </div>
          <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
        </div>
        <div
          class="flex flex-row gap-2 justify-end px-6 py-4 border-t border-blue-100 bg-blue-50 rounded-b-lg"
        >
          <BaseButton color="green" @click.prevent="submitRoom">{{
            isEdit ? "Enregistrer" : "Créer"
          }}</BaseButton>
          <BaseButton color="red" @click="closeModal">Annuler</BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
