<script setup lang="ts">
import { ref, watch } from "vue";
import BaseButton from "./ui/base-button.vue";
import BaseInput from "./ui/base-input.vue";
import type { Point, Room } from "../core/rooms";
import { useManorMap } from "@/composables/useMapState";

const { selectedRoom, addRoom } = useManorMap();

const roomSize = ref({ width: 10, height: 10 });
const room = ref(defaultRoom());

const PIXEL_SIZE = 1;
const pixelGrid = ref<boolean[][]>([]);
const pixelDrawing = ref(false);
const showEditor = ref(false);

watch(
  () => selectedRoom.value,
  (selectedRoom) => {
    room.value = defaultRoom();

    if (selectedRoom) {
      roomSize.value.width = Math.max(...selectedRoom.points.map((p) => p.x)) + 1;
      roomSize.value.height = Math.max(...selectedRoom.points.map((p) => p.y)) + 1;
      pixelGrid.value = pointsToGrid(
        {
          width: roomSize.value.width,
          height: roomSize.value.height,
        },
        selectedRoom.points,
      );
      pixelDrawing.value = true;
      showEditor.value = true;
      room.value.name = selectedRoom.name;
      room.value.color = selectedRoom.color || randomColor();
      return;
    }

    room.value = defaultRoom();
  },
  { immediate: true },
);

function defaultRoom() {
  return {
    name: "",
    points: [] as Point[],
    label: { x: 0, y: 0 },
    color: randomColor(),
    offset: { x: 0, y: 0 },
  } satisfies Room;
}

function pointsToGrid({ width, height }: { width: number; height: number }, points: Point[]) {
  const grid: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));
  for (const { x, y } of points) {
    grid[y][x] = true;
  }

  return grid;
}

function gridToPoints(grid: boolean[][]): Point[] {
  const points: Point[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x]) {
        points.push({ x: x * PIXEL_SIZE, y: y * PIXEL_SIZE });
      }
    }
  }

  return points;
}

function togglePixel(x: number, y: number) {
  pixelGrid.value[y][x] = !pixelGrid.value[y][x];
}

function closeEditor() {
  showEditor.value = false;
  pixelDrawing.value = false;
}

function finishPixelRoom() {
  const points = gridToPoints(pixelGrid.value);
  if (points.length < 1) {
    return;
  }

  const name = room.value.name.trim();
  if (!name) {
    return;
  }

  const roomData = {
    ...room.value,
    label: getRectangleCenter(points),
  };

  addRoom(roomData);
  showEditor.value = false;
  pixelDrawing.value = false;
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

watch(roomSize, ({ width, height }) => {
  if (!pixelDrawing.value) {
    return;
  }

  const oldGrid = pixelGrid.value;
  pixelGrid.value = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => oldGrid[y]?.[x] ?? false),
  );
});
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div class="bg-white rounded shadow-lg p-6 w-[90vw] max-w-xl flex flex-col gap-4">
      <div class="flex flex-row gap-4 mb-4">
        <BaseInput type="number" min="1" max="40" v-model.number="roomSize.width">
          <span>Largeur :</span>
        </BaseInput>
        <BaseInput type="number" min="1" max="40" v-model.number="roomSize.height">
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
              'border-black': cell,
            }"
            :style="{ 'background-color': cell ? room.color : '#f3f4f6' }"
            @click="togglePixel(x, y)"
          ></div>
        </div>
      </div>
      <div class="flex flex-row gap-4 mb-4">
        <BaseInput type="text" v-model="room.name">
          <span>Nom :</span>
        </BaseInput>
        <BaseInput type="text" v-model="room.color">
          <span>Couleur :</span>
        </BaseInput>
      </div>
      <div class="flex flex-row gap-2 justify-end mt-4">
        <BaseButton color="green" @click.prevent="finishPixelRoom">Valider la salle</BaseButton>
        <BaseButton color="red" @click="closeEditor">Annuler</BaseButton>
      </div>
      <span class="text-gray-600">Cliquez sur la grille pour dessiner la salle</span>
    </div>
  </div>
</template>
