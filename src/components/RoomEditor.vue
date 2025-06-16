<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from "vue";
import BaseButton from "./ui/BaseButton.vue";
import BaseInput from "./ui/BaseInput.vue";
import type { Point, Room } from "@/rooms";

const props = defineProps<{ initialRoom?: Room }>();

const emit = defineEmits<{
  "room-created": [room: Room];
}>();

const PIXEL_SIZE = 1;
const roomWidth = ref(10);
const roomHeight = ref(10);
const pixelGrid = ref<boolean[][]>([]);
const pixelDrawing = ref(false);
const showJsonModal = ref(false);
const lastRoomJson = ref("");
const showEditor = ref(false);
const nameInput = ref("");
const colorInput = ref("");

// Initialisation de la grille et des champs si édition
watch(
  () => props.initialRoom,
  (room) => {
    if (room) {
      roomWidth.value = Math.max(...room.points.map((p) => p.x)) + 1;
      roomHeight.value = Math.max(...room.points.map((p) => p.y)) + 1;
      pixelGrid.value = pointsToGrid(
        {
          width: roomWidth.value,
          height: roomHeight.value,
        },
        room.points,
      );
      pixelDrawing.value = true;
      showEditor.value = true;
      nameInput.value = room.name;
      colorInput.value = room.color || randomColor();
    }
  },
  { immediate: true },
);

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

// Remplace prompt par champ de saisie
function finishPixelRoom() {
  const points = gridToPoints(pixelGrid.value);
  if (points.length < 1) {
    return;
  }

  const name = nameInput.value.trim();
  if (!name) {
    return;
  }

  const color = colorInput.value || randomColor();
  const room = {
    name,
    points,
    label: getRectangleCenter(points),
    color,
  };

  emit("room-created", room);
  lastRoomJson.value = JSON.stringify(room, null, 2);
  showJsonModal.value = true;
  showEditor.value = false;
  pixelDrawing.value = false;
}

function copyJson() {
  navigator.clipboard.writeText(lastRoomJson.value);
  showJsonModal.value = false;
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

watch([roomWidth, roomHeight], ([newW, newH]) => {
  if (!pixelDrawing.value) {
    return;
  }

  const oldGrid = pixelGrid.value;
  pixelGrid.value = Array.from({ length: newH }, (_, y) =>
    Array.from({ length: newW }, (_, x) => oldGrid[y]?.[x] ?? false),
  );
});
</script>

<template>
  <div>
    <BaseButton
      color="indigo"
      @click="
        () => {
          showEditor = true;
          pixelDrawing = true;
          pixelGrid = Array.from({ length: roomHeight }, () => Array(roomWidth).fill(false));
        }
      "
      >Nouvelle salle</BaseButton
    >
    <div
      v-if="showEditor"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div class="bg-white rounded shadow-lg p-6 w-[90vw] max-w-xl flex flex-col gap-4">
        <div class="flex flex-row gap-4 mb-4">
          <BaseInput type="number" min="1" max="40" v-model.number="roomWidth">
            <span>Largeur :</span>
          </BaseInput>
          <BaseInput type="number" min="1" max="40" v-model.number="roomHeight">
            <span>Hauteur :</span>
          </BaseInput>
        </div>
        <div class="inline-block border bg-gray-100 rounded shadow p-2">
          <div v-for="(row, y) in pixelGrid" :key="y" class="flex flex-row">
            <div
              v-for="(cell, x) in row"
              :key="x"
              class="w-6 h-6 border border-gray-300 cursor-pointer flex items-center justify-center"
              :class="{ 'bg-blue-500': cell }"
              @click="togglePixel(x, y)"
            ></div>
          </div>
        </div>
        <div class="flex flex-row gap-4 mb-4">
          <BaseInput type="text" v-model="nameInput">
            <span>Nom :</span>
          </BaseInput>
          <BaseInput type="text" v-model="colorInput">
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
    <div
      v-if="showJsonModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div class="bg-white rounded shadow-lg p-6 w-[90vw] max-w-xl flex flex-col gap-4">
        <div class="font-bold text-lg">JSON de la salle générée</div>
        <textarea
          readonly
          class="w-full h-40 p-2 border rounded font-mono text-xs bg-gray-100"
          :value="lastRoomJson"
        ></textarea>
        <div class="flex flex-row gap-2 justify-end">
          <BaseButton color="blue" @click="copyJson">Copier dans le presse-papier</BaseButton>
          <BaseButton color="red" @click="showJsonModal = false">Fermer</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
