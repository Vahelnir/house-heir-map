<script setup lang="ts">
import { ref, computed } from "vue";
import RoomEditor from "./RoomEditor.vue";
import type { Room } from "./RoomEditor.vue";

export type RoomWithOffset = Room & { offset?: { x: number; y: number } };

const SCALE = 14;

const rooms = ref<RoomWithOffset[]>([
  {
    name: "Entrée",
    points: [
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 11, y: 1 },
      { x: 12, y: 1 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 13, y: 2 },
      { x: 14, y: 2 },
      { x: 3, y: 3 },
      { x: 15, y: 3 },
      { x: 2, y: 4 },
      { x: 16, y: 4 },
      { x: 2, y: 5 },
      { x: 16, y: 5 },
      { x: 1, y: 6 },
      { x: 17, y: 6 },
      { x: 1, y: 7 },
      { x: 17, y: 7 },
      { x: 0, y: 8 },
      { x: 0, y: 10 },
      { x: 1, y: 11 },
      { x: 17, y: 11 },
      { x: 1, y: 12 },
      { x: 17, y: 12 },
      { x: 2, y: 13 },
      { x: 16, y: 13 },
      { x: 2, y: 14 },
      { x: 16, y: 14 },
      { x: 3, y: 15 },
      { x: 15, y: 15 },
      { x: 4, y: 16 },
      { x: 5, y: 16 },
      { x: 13, y: 16 },
      { x: 14, y: 16 },
      { x: 6, y: 17 },
      { x: 7, y: 17 },
      { x: 11, y: 17 },
      { x: 12, y: 17 },
      { x: 8, y: 18 },
      { x: 10, y: 18 },
    ],
    label: { x: 9, y: 9 },
    color: "#bbf7d0",
    offset: { x: 0, y: 0 },
  },
  {
    name: "Chambre jaune",
    points: [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 8, y: 0 },
      { x: 9, y: 0 },
      { x: 10, y: 0 },
      { x: 11, y: 0 },
      { x: 12, y: 0 },
      { x: 2, y: 1 },
      { x: 13, y: 1 },
      { x: 2, y: 2 },
      { x: 14, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 14, y: 3 },
      { x: 0, y: 4 },
      { x: 14, y: 4 },
      { x: 14, y: 5 },
      { x: 14, y: 6 },
      { x: 14, y: 7 },
      { x: 0, y: 8 },
      { x: 14, y: 8 },
      { x: 1, y: 9 },
      { x: 2, y: 9 },
      { x: 14, y: 9 },
      { x: 2, y: 10 },
      { x: 14, y: 10 },
      { x: 3, y: 11 },
      { x: 14, y: 11 },
      { x: 4, y: 12 },
      { x: 5, y: 12 },
      { x: 11, y: 12 },
      { x: 12, y: 12 },
      { x: 13, y: 12 },
      { x: 5, y: 13 },
      { x: 11, y: 13 },
      { x: 6, y: 14 },
      { x: 10, y: 14 },
    ],
    label: { x: 8, y: 6 },
    color: "red",
    offset: { x: 1, y: -15 },
  },
  {
    name: "Cheminée",
    points: [
      { x: 6, y: 0 },
      { x: 10, y: 0 },
      { x: 6, y: 1 },
      { x: 10, y: 1 },
      { x: 6, y: 2 },
      { x: 10, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 10, y: 3 },
      { x: 11, y: 3 },
      { x: 12, y: 3 },
      { x: 13, y: 3 },
      { x: 14, y: 3 },
      { x: 15, y: 3 },
      { x: 16, y: 3 },
      { x: 0, y: 4 },
      { x: 16, y: 4 },
      { x: 0, y: 5 },
      { x: 16, y: 5 },
      { x: 0, y: 6 },
      { x: 16, y: 6 },
      { x: 0, y: 10 },
      { x: 16, y: 10 },
      { x: 0, y: 11 },
      { x: 16, y: 11 },
      { x: 0, y: 12 },
      { x: 16, y: 12 },
      { x: 0, y: 13 },
      { x: 16, y: 13 },
      { x: 1, y: 14 },
      { x: 2, y: 14 },
      { x: 14, y: 14 },
      { x: 15, y: 14 },
      { x: 3, y: 15 },
      { x: 13, y: 15 },
      { x: 4, y: 16 },
      { x: 5, y: 16 },
      { x: 6, y: 16 },
      { x: 7, y: 16 },
      { x: 8, y: 16 },
      { x: 9, y: 16 },
      { x: 10, y: 16 },
      { x: 11, y: 16 },
      { x: 12, y: 16 },
    ],
    label: { x: 8, y: 6.3999999999999995 },
    color: "#bbf7d0",
    offset: { x: -17, y: -17 },
  },
  {
    name: "Salle à manger",
    points: [
      { x: 0, y: 12 },
      { x: 0, y: 11 },
      { x: 0, y: 10 },
      { x: 0, y: 9 },
      { x: 0, y: 8 },
      { x: 1, y: 14 },
      { x: 1, y: 13 },
      { x: 1, y: 7 },
      { x: 1, y: 6 },
      { x: 2, y: 15 },
      { x: 2, y: 5 },
      { x: 3, y: 16 },
      { x: 3, y: 4 },
      { x: 4, y: 16 },
      { x: 4, y: 4 },
      { x: 5, y: 17 },
      { x: 5, y: 3 },
      { x: 6, y: 17 },
      { x: 6, y: 3 },
      { x: 7, y: 17 },
      { x: 7, y: 3 },
      { x: 8, y: 17 },
      { x: 8, y: 3 },
      { x: 9, y: 17 },
      { x: 9, y: 3 },
      { x: 10, y: 16 },
      { x: 10, y: 4 },
      { x: 11, y: 16 },
      { x: 11, y: 4 },
      { x: 12, y: 15 },
      { x: 12, y: 5 },
      { x: 13, y: 14 },
      { x: 13, y: 13 },
      { x: 13, y: 7 },
      { x: 13, y: 6 },
      { x: 14, y: 12 },
      { x: 14, y: 8 },
      { x: 15, y: 12 },
      { x: 15, y: 8 },
      { x: 16, y: 12 },
      { x: 16, y: 8 },
      { x: 17, y: 12 },
      { x: 17, y: 8 },
    ],
    label: { x: 8, y: 9.767441860465116 },
    color: "#fcd34d",
    offset: { x: -36, y: -19 },
  },
  {
    name: "Cantine",
    points: [
      { x: 13, y: 14 },
      { x: 12, y: 14 },
      { x: 11, y: 14 },
      { x: 10, y: 14 },
      { x: 9, y: 14 },
      { x: 8, y: 14 },
      { x: 7, y: 14 },
      { x: 6, y: 14 },
      { x: 5, y: 14 },
      { x: 4, y: 14 },
      { x: 3, y: 14 },
      { x: 15, y: 13 },
      { x: 14, y: 13 },
      { x: 2, y: 13 },
      { x: 1, y: 13 },
      { x: 16, y: 12 },
      { x: 0, y: 12 },
      { x: 16, y: 11 },
      { x: 0, y: 11 },
      { x: 16, y: 10 },
      { x: 0, y: 10 },
      { x: 16, y: 9 },
      { x: 0, y: 9 },
      { x: 16, y: 5 },
      { x: 0, y: 5 },
      { x: 15, y: 4 },
      { x: 0, y: 4 },
      { x: 15, y: 3 },
      { x: 14, y: 3 },
      { x: 13, y: 3 },
      { x: 12, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 11, y: 2 },
      { x: 5, y: 2 },
      { x: 11, y: 1 },
      { x: 5, y: 1 },
      { x: 11, y: 0 },
      { x: 5, y: 0 },
      { x: 11, y: -2 },
      { x: 10, y: -2 },
      { x: 6, y: -2 },
      { x: 5, y: -2 },
    ],
    label: {
      x: 8.022222222222222,
      y: 6.666666666666667,
    },
    color: "#a7f3d0",
    offset: { x: 19, y: 2 },
  },
  {
    name: "Couloir rouge/violet",
    points: [
      { x: 1, y: 1 },
      { x: 10, y: 1 },
      { x: 0, y: 2 },
      { x: 10, y: 2 },
      { x: 0, y: 3 },
      { x: 10, y: 3 },
      { x: 0, y: 4 },
      { x: 9, y: 4 },
      { x: 0, y: 5 },
      { x: 9, y: 5 },
      { x: 0, y: 6 },
      { x: 9, y: 6 },
      { x: 13, y: 6 },
      { x: 14, y: 6 },
      { x: 15, y: 6 },
      { x: 16, y: 6 },
      { x: 17, y: 6 },
      { x: 10, y: 7 },
      { x: 11, y: 7 },
      { x: 12, y: 7 },
      { x: 10, y: 9 },
      { x: 11, y: 9 },
      { x: 12, y: 9 },
      { x: 0, y: 10 },
      { x: 9, y: 10 },
      { x: 13, y: 10 },
      { x: 14, y: 10 },
      { x: 15, y: 10 },
      { x: 16, y: 10 },
      { x: 17, y: 10 },
      { x: 0, y: 11 },
      { x: 9, y: 11 },
      { x: 0, y: 12 },
      { x: 9, y: 12 },
      { x: 0, y: 13 },
      { x: 10, y: 13 },
      { x: 0, y: 14 },
      { x: 10, y: 14 },
      { x: 1, y: 15 },
      { x: 10, y: 15 },
      { x: 9, y: 16 },
      { x: 8, y: 16 },
      { x: 7, y: 16 },
      { x: 6, y: 16 },
      { x: 5, y: 16 },
      { x: 4, y: 16 },
      { x: 3, y: 16 },
      { x: 2, y: 16 },
      { x: 9, y: 0 },
      { x: 8, y: 0 },
      { x: 7, y: 0 },
      { x: 6, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 0 },
    ],
    label: {
      x: 8.3,
      y: 7,
    },
    color: "#e0e7ef",
    offset: { x: 37, y: 1 },
  },
  {
    name: "Three-way :eyes:",
    points: [
      {
        x: 6,
        y: 0,
      },
      {
        x: 10,
        y: 0,
      },
      {
        x: 5,
        y: 1,
      },
      {
        x: 11,
        y: 1,
      },
      {
        x: 5,
        y: 2,
      },
      {
        x: 11,
        y: 2,
      },
      {
        x: 5,
        y: 3,
      },
      {
        x: 11,
        y: 3,
      },
      {
        x: 5,
        y: 4,
      },
      {
        x: 11,
        y: 4,
      },
      {
        x: 1,
        y: 5,
      },
      {
        x: 2,
        y: 5,
      },
      {
        x: 3,
        y: 5,
      },
      {
        x: 4,
        y: 5,
      },
      {
        x: 5,
        y: 5,
      },
      {
        x: 11,
        y: 5,
      },
      {
        x: 0,
        y: 6,
      },
      {
        x: 11,
        y: 6,
      },
      {
        x: 11,
        y: 7,
      },
      {
        x: 11,
        y: 8,
      },
      {
        x: 11,
        y: 9,
      },
      {
        x: 0,
        y: 10,
      },
      {
        x: 11,
        y: 10,
      },
      {
        x: 1,
        y: 11,
      },
      {
        x: 2,
        y: 11,
      },
      {
        x: 3,
        y: 11,
      },
      {
        x: 4,
        y: 11,
      },
      {
        x: 5,
        y: 11,
      },
      {
        x: 11,
        y: 11,
      },
      {
        x: 5,
        y: 12,
      },
      {
        x: 11,
        y: 12,
      },
      {
        x: 5,
        y: 13,
      },
      {
        x: 11,
        y: 13,
      },
      {
        x: 5,
        y: 14,
      },
      {
        x: 11,
        y: 14,
      },
      {
        x: 5,
        y: 15,
      },
      {
        x: 11,
        y: 15,
      },
      {
        x: 6,
        y: 16,
      },
      {
        x: 10,
        y: 16,
      },
    ],
    label: {
      x: 6.846153846153846,
      y: 8,
    },
    color: "#fcd34d",
    offset: { x: 56, y: 1 },
  },
  {
    name: "Ledger room",
    points: [
      {
        x: 6,
        y: 0,
      },
      {
        x: 10,
        y: 0,
      },
      {
        x: 6,
        y: 1,
      },
      {
        x: 10,
        y: 1,
      },
      {
        x: 4,
        y: 2,
      },
      {
        x: 5,
        y: 2,
      },
      {
        x: 6,
        y: 2,
      },
      {
        x: 10,
        y: 2,
      },
      {
        x: 11,
        y: 2,
      },
      {
        x: 12,
        y: 2,
      },
      {
        x: 3,
        y: 3,
      },
      {
        x: 13,
        y: 3,
      },
      {
        x: 2,
        y: 4,
      },
      {
        x: 14,
        y: 4,
      },
      {
        x: 2,
        y: 5,
      },
      {
        x: 14,
        y: 5,
      },
      {
        x: 0,
        y: 6,
      },
      {
        x: 1,
        y: 6,
      },
      {
        x: 2,
        y: 6,
      },
      {
        x: 14,
        y: 6,
      },
      {
        x: 14,
        y: 7,
      },
      {
        x: 14,
        y: 8,
      },
      {
        x: 14,
        y: 9,
      },
      {
        x: 0,
        y: 10,
      },
      {
        x: 1,
        y: 10,
      },
      {
        x: 2,
        y: 10,
      },
      {
        x: 14,
        y: 10,
      },
      {
        x: 2,
        y: 11,
      },
      {
        x: 14,
        y: 11,
      },
      {
        x: 2,
        y: 12,
      },
      {
        x: 14,
        y: 12,
      },
      {
        x: 3,
        y: 13,
      },
      {
        x: 13,
        y: 13,
      },
      {
        x: 4,
        y: 14,
      },
      {
        x: 5,
        y: 14,
      },
      {
        x: 6,
        y: 14,
      },
      {
        x: 7,
        y: 14,
      },
      {
        x: 8,
        y: 14,
      },
      {
        x: 9,
        y: 14,
      },
      {
        x: 10,
        y: 14,
      },
      {
        x: 11,
        y: 14,
      },
      {
        x: 12,
        y: 14,
      },
    ],
    label: {
      x: 7.714285714285714,
      y: 7.714285714285714,
    },
    color: "#e0e7ef",
    offset: { x: 56, y: 19 },
  },
  {
    name: "Freezer",
    points: [
      {
        x: 1,
        y: 0,
      },
      {
        x: 2,
        y: 0,
      },
      {
        x: 3,
        y: 0,
      },
      {
        x: 4,
        y: 0,
      },
      {
        x: 5,
        y: 0,
      },
      {
        x: 6,
        y: 0,
      },
      {
        x: 7,
        y: 0,
      },
      {
        x: 8,
        y: 0,
      },
      {
        x: 9,
        y: 0,
      },
      {
        x: 0,
        y: 1,
      },
      {
        x: 10,
        y: 1,
      },
      {
        x: 0,
        y: 2,
      },
      {
        x: 10,
        y: 2,
      },
      {
        x: 0,
        y: 3,
      },
      {
        x: 10,
        y: 3,
      },
      {
        x: 0,
        y: 4,
      },
      {
        x: 10,
        y: 4,
      },
      {
        x: 11,
        y: 4,
      },
      {
        x: 12,
        y: 4,
      },
      {
        x: 13,
        y: 4,
      },
      {
        x: 14,
        y: 4,
      },
      {
        x: 15,
        y: 4,
      },
      {
        x: 16,
        y: 4,
      },
      {
        x: 0,
        y: 5,
      },
      {
        x: 0,
        y: 6,
      },
      {
        x: 0,
        y: 7,
      },
      {
        x: 0,
        y: 8,
      },
      {
        x: 10,
        y: 8,
      },
      {
        x: 11,
        y: 8,
      },
      {
        x: 12,
        y: 8,
      },
      {
        x: 13,
        y: 8,
      },
      {
        x: 14,
        y: 8,
      },
      {
        x: 15,
        y: 8,
      },
      {
        x: 16,
        y: 8,
      },
      {
        x: 0,
        y: 9,
      },
      {
        x: 10,
        y: 9,
      },
      {
        x: 0,
        y: 10,
      },
      {
        x: 10,
        y: 10,
      },
      {
        x: 0,
        y: 11,
      },
      {
        x: 10,
        y: 11,
      },
      {
        x: 1,
        y: 12,
      },
      {
        x: 2,
        y: 12,
      },
      {
        x: 3,
        y: 12,
      },
      {
        x: 4,
        y: 12,
      },
      {
        x: 5,
        y: 12,
      },
      {
        x: 6,
        y: 12,
      },
      {
        x: 7,
        y: 12,
      },
      {
        x: 8,
        y: 12,
      },
      {
        x: 9,
        y: 12,
      },
    ],
    label: {
      x: 6.775510204081633,
      y: 6,
    },
    color: "#fcd34d",
    offset: { x: 38, y: 21 },
  },
  {
    name: "Coude violet",
    points: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 1,
        y: 0,
      },
      {
        x: 2,
        y: 0,
      },
      {
        x: 3,
        y: 0,
      },
      {
        x: 4,
        y: 0,
      },
      {
        x: 5,
        y: 0,
      },
      {
        x: 6,
        y: 0,
      },
      {
        x: 7,
        y: 0,
      },
      {
        x: 8,
        y: 0,
      },
      {
        x: 9,
        y: 0,
      },
      {
        x: 10,
        y: 0,
      },
      {
        x: 11,
        y: 0,
      },
      {
        x: 0,
        y: 1,
      },
      {
        x: 1,
        y: 1,
      },
      {
        x: 2,
        y: 1,
      },
      {
        x: 3,
        y: 1,
      },
      {
        x: 4,
        y: 1,
      },
      {
        x: 5,
        y: 1,
      },
      {
        x: 6,
        y: 1,
      },
      {
        x: 7,
        y: 1,
      },
      {
        x: 8,
        y: 1,
      },
      {
        x: 9,
        y: 1,
      },
      {
        x: 10,
        y: 1,
      },
      {
        x: 11,
        y: 1,
      },
      {
        x: 10,
        y: 2,
      },
      {
        x: 11,
        y: 2,
      },
      {
        x: 10,
        y: 3,
      },
      {
        x: 11,
        y: 3,
      },
      {
        x: 10,
        y: 4,
      },
      {
        x: 11,
        y: 4,
      },
      {
        x: 0,
        y: 5,
      },
      {
        x: 1,
        y: 5,
      },
      {
        x: 2,
        y: 5,
      },
      {
        x: 3,
        y: 5,
      },
      {
        x: 4,
        y: 5,
      },
      {
        x: 5,
        y: 5,
      },
      {
        x: 6,
        y: 5,
      },
      {
        x: 10,
        y: 5,
      },
      {
        x: 11,
        y: 5,
      },
      {
        x: 0,
        y: 6,
      },
      {
        x: 1,
        y: 6,
      },
      {
        x: 2,
        y: 6,
      },
      {
        x: 3,
        y: 6,
      },
      {
        x: 4,
        y: 6,
      },
      {
        x: 5,
        y: 6,
      },
      {
        x: 6,
        y: 6,
      },
      {
        x: 10,
        y: 6,
      },
      {
        x: 11,
        y: 6,
      },
      {
        x: 5,
        y: 7,
      },
      {
        x: 6,
        y: 7,
      },
      {
        x: 10,
        y: 7,
      },
      {
        x: 11,
        y: 7,
      },
      {
        x: 5,
        y: 8,
      },
      {
        x: 6,
        y: 8,
      },
      {
        x: 10,
        y: 8,
      },
      {
        x: 11,
        y: 8,
      },
      {
        x: 5,
        y: 9,
      },
      {
        x: 6,
        y: 9,
      },
      {
        x: 10,
        y: 9,
      },
      {
        x: 11,
        y: 9,
      },
      {
        x: 5,
        y: 10,
      },
      {
        x: 6,
        y: 10,
      },
      {
        x: 10,
        y: 10,
      },
      {
        x: 11,
        y: 10,
      },
      {
        x: 5,
        y: 11,
      },
      {
        x: 6,
        y: 11,
      },
      {
        x: 10,
        y: 11,
      },
      {
        x: 11,
        y: 11,
      },
    ],
    label: {
      x: 6.455882352941177,
      y: 4.544117647058823,
    },
    color: "#fcd34d",
    offset: { x: 56, y: -12 },
  },
  {
    name: "L'atelier",
    points: [
      {
        x: 4,
        y: 0,
      },
      {
        x: 5,
        y: 0,
      },
      {
        x: 6,
        y: 0,
      },
      {
        x: 7,
        y: 0,
      },
      {
        x: 8,
        y: 0,
      },
      {
        x: 9,
        y: 0,
      },
      {
        x: 10,
        y: 0,
      },
      {
        x: 12,
        y: 0,
      },
      {
        x: 13,
        y: 0,
      },
      {
        x: 14,
        y: 0,
      },
      {
        x: 15,
        y: 0,
      },
      {
        x: 2,
        y: 1,
      },
      {
        x: 3,
        y: 1,
      },
      {
        x: 11,
        y: 1,
      },
      {
        x: 16,
        y: 1,
      },
      {
        x: 1,
        y: 2,
      },
      {
        x: 16,
        y: 2,
      },
      {
        x: 1,
        y: 3,
      },
      {
        x: 16,
        y: 3,
      },
      {
        x: 0,
        y: 4,
      },
      {
        x: 16,
        y: 4,
      },
      {
        x: 0,
        y: 5,
      },
      {
        x: 11,
        y: 5,
      },
      {
        x: 12,
        y: 5,
      },
      {
        x: 13,
        y: 5,
      },
      {
        x: 14,
        y: 5,
      },
      {
        x: 15,
        y: 5,
      },
      {
        x: 16,
        y: 5,
      },
      {
        x: 0,
        y: 6,
      },
      {
        x: 16,
        y: 6,
      },
      {
        x: 0,
        y: 7,
      },
      {
        x: 0,
        y: 8,
      },
      {
        x: 0,
        y: 9,
      },
      {
        x: 0,
        y: 10,
      },
      {
        x: 16,
        y: 10,
      },
      {
        x: 0,
        y: 11,
      },
      {
        x: 11,
        y: 11,
      },
      {
        x: 12,
        y: 11,
      },
      {
        x: 13,
        y: 11,
      },
      {
        x: 14,
        y: 11,
      },
      {
        x: 15,
        y: 11,
      },
      {
        x: 16,
        y: 11,
      },
      {
        x: 0,
        y: 12,
      },
      {
        x: 16,
        y: 12,
      },
      {
        x: 1,
        y: 13,
      },
      {
        x: 16,
        y: 13,
      },
      {
        x: 1,
        y: 14,
      },
      {
        x: 16,
        y: 14,
      },
      {
        x: 2,
        y: 15,
      },
      {
        x: 3,
        y: 15,
      },
      {
        x: 11,
        y: 15,
      },
      {
        x: 16,
        y: 15,
      },
      {
        x: 4,
        y: 16,
      },
      {
        x: 5,
        y: 16,
      },
      {
        x: 6,
        y: 16,
      },
      {
        x: 7,
        y: 16,
      },
      {
        x: 8,
        y: 16,
      },
      {
        x: 9,
        y: 16,
      },
      {
        x: 10,
        y: 16,
      },
      {
        x: 12,
        y: 16,
      },
      {
        x: 13,
        y: 16,
      },
      {
        x: 14,
        y: 16,
      },
      {
        x: 15,
        y: 16,
      },
    ],
    label: {
      x: 8.952380952380953,
      y: 8,
    },
    color: "#fbbf24",
    offset: { x: 38, y: -17 },
  },
] satisfies RoomWithOffset[]);

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

function addRoom(room: Room) {
  rooms.value.push(room);
}

function rotateRoom(idx: number, angle: number) {
  const room = rooms.value[idx];
  if (!room) {
    return;
  }

  const cx = room.label.x;
  const cy = room.label.y;
  const rad = (angle * Math.PI) / 180;

  room.points = room.points.map(({ x, y }) => {
    const dx = x - cx;
    const dy = y - cy;
    return {
      x: Math.round(cx + dx * Math.cos(rad) - dy * Math.sin(rad)),
      y: Math.round(cy + dx * Math.sin(rad) + dy * Math.cos(rad)),
    };
  });
}
</script>

<template>
  <div class="flex flex-col items-center mt-8">
    <RoomEditor @room-created="addRoom" />
    <svg :width="svgWidth" :height="svgHeight" class="border bg-gray-100 rounded shadow mt-4">
      <g v-for="(room, idx) in rooms" :key="idx" :data-room-name="room.name">
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
          width="64"
          height="24"
        >
          <div class="flex flex-row gap-1 items-center justify-center" style="pointer-events: auto">
            <button
              class="px-1 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs"
              @click.stop="rotateRoom(idx, 90)"
            >
              ⟳ 90°
            </button>
            <button
              class="px-1 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs"
              @click.stop="rotateRoom(idx, -90)"
            >
              ⟲ 90°
            </button>
          </div>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>
