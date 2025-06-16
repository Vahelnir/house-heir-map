<template>
  <div class="flex flex-col items-center mt-8">
    <svg :width="svgWidth" :height="svgHeight" class="border bg-gray-100 rounded shadow">
      <template v-for="(room, idx) in rooms" :key="idx">
        <polygon
          :points="room.points.map((p) => `${p.x},${p.y}`).join(' ')"
          class="transition-all duration-200"
          :fill="room.color || '#e0e7ef'"
          stroke="#333"
          stroke-width="2"
        />
        <text
          v-if="room.name"
          :x="room.label.x"
          :y="room.label.y"
          text-anchor="middle"
          alignment-baseline="middle"
          class="font-bold text-xs select-none"
        >
          {{ room.name }}
        </text>
      </template>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Typescript : définition du type Room et Point
export type Point = { x: number; y: number };
export type Room = {
  name: string;
  points: Point[];
  label: { x: number; y: number };
  color?: string;
};

// Exemple de salles avec des formes personnalisées (polygones)
const rooms = ref<Room[]>([
  {
    name: "entrance",
    points: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    label: { x: 35, y: 30 },
    color: "#e0e7ef",
  },
] satisfies Room[]);

const svgWidth = 320;
const svgHeight = 280;
</script>
