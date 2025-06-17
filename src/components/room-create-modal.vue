<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "./ui/base-button.vue";
import BaseInput from "./ui/base-input.vue";
import type { Point, Room } from "@/core/rooms";

const emit = defineEmits<{
  close: [];
  create: [room: Room];
}>();

const name = ref("");
const color = ref(randomColor());
const gridSize = ref({ width: 12, height: 12 });
const pixelGrid = ref<boolean[][]>(
  Array.from({ length: gridSize.value.height }, () => Array(gridSize.value.width).fill(false)),
);

function randomColor() {
  const colors = ["#fbbf24", "#60a5fa", "#a7f3d0", "#fca5a5", "#fcd34d", "#bbf7d0", "#e0e7ef"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function togglePixel(x: number, y: number) {
  pixelGrid.value[y][x] = !pixelGrid.value[y][x];
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

function getRectangleCenter(points: Point[]): { x: number; y: number } {
  return {
    x: Math.max(...points.map((p) => p.x)) / 2,
    y: Math.max(...points.map((p) => p.y)) / 2,
  };
}

function resizeGrid(newWidth: number, newHeight: number) {
  const oldGrid = pixelGrid.value;
  pixelGrid.value = Array.from({ length: newHeight }, (_, y) =>
    Array.from({ length: newWidth }, (_, x) => oldGrid[y]?.[x] ?? false),
  );
  gridSize.value.width = newWidth;
  gridSize.value.height = newHeight;
}

const error = ref("");
function createRoom() {
  const points = gridToPoints(pixelGrid.value);
  if (!name.value.trim()) {
    error.value = "Le nom est requis.";
    return;
  }
  if (points.length < 1) {
    error.value = "La salle doit contenir au moins un bloc.";
    return;
  }
  error.value = "";
  emit("create", {
    name: name.value.trim(),
    color: color.value,
    points,
    label: getRectangleCenter(points),
    offset: { x: 0, y: 0 },
  });
}

function close() {
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
      @click.self="close"
    >
      <div class="bg-white rounded-lg shadow-2xl p-0 w-[95vw] max-w-xl flex flex-col">
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-blue-50 rounded-t-lg"
        >
          <h2 class="text-xl font-bold text-blue-900">Créer une nouvelle salle</h2>
          <button class="text-2xl text-blue-400 hover:text-blue-700" @click="close" title="Fermer">
            ×
          </button>
        </div>
        <div class="flex flex-col gap-4 px-6 py-4">
          <div class="flex flex-row gap-4">
            <BaseInput type="text" v-model="name"><span>Nom/ID :</span></BaseInput>
            <BaseInput type="text" v-model="color"><span>Couleur :</span></BaseInput>
          </div>
          <div class="flex flex-row gap-4">
            <BaseInput type="number" min="4" max="40" v-model.number="gridSize.width"
              ><span>Largeur :</span></BaseInput
            >
            <BaseInput type="number" min="4" max="40" v-model.number="gridSize.height"
              ><span>Hauteur :</span></BaseInput
            >
            <BaseButton color="blue" @click="resizeGrid(gridSize.width, gridSize.height)"
              >Redimensionner</BaseButton
            >
          </div>
          <div class="inline-block border bg-gray-100 rounded shadow p-2">
            <div v-for="(row, y) in pixelGrid" :key="y" class="flex flex-row">
              <div
                v-for="(cell, x) in row"
                :key="x"
                class="w-6 h-6 border cursor-pointer flex items-center justify-center"
                :class="{ 'border-gray-300': !cell, 'border-blue-500': cell, 'bg-blue-100': cell }"
                :style="{ 'background-color': cell ? color : '#f3f4f6' }"
                @click="togglePixel(x, y)"
              ></div>
            </div>
          </div>
          <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
        </div>
        <div
          class="flex flex-row gap-2 justify-end px-6 py-4 border-t border-blue-100 bg-blue-50 rounded-b-lg"
        >
          <BaseButton color="green" @click.prevent="createRoom">Créer</BaseButton>
          <BaseButton color="red" @click="close">Annuler</BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
