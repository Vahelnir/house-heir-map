<script setup lang="ts">
import BaseButton from "./ui/base-button.vue";

defineProps<{
  moving: boolean;
}>();

const emit = defineEmits<{
  start: [];
  stop: [];
  cancel: [];
  move: [dx: number, dy: number];
}>();
</script>

<template>
  <div>
    <div class="flex flex-row gap-2 mt-2">
      <BaseButton color="indigo" @click="emit('start')" v-if="!moving">
        Déplacer la salle
      </BaseButton>
    </div>
    <div v-if="moving" class="flex flex-col items-center gap-2 mt-2">
      <div class="font-semibold text-blue-700">Déplacement</div>
      <div class="flex flex-col items-center gap-1">
        <button class="w-8 h-8 bg-blue-200 rounded hover:bg-blue-300" @click="emit('move', 0, -1)">
          ↑
        </button>
        <div class="flex flex-row gap-1">
          <button
            class="w-8 h-8 bg-blue-200 rounded hover:bg-blue-300"
            @click="emit('move', -1, 0)"
          >
            ←
          </button>
          <button class="w-8 h-8 bg-blue-200 rounded hover:bg-blue-300" @click="emit('move', 1, 0)">
            →
          </button>
        </div>
        <button class="w-8 h-8 bg-blue-200 rounded hover:bg-blue-300" @click="emit('move', 0, 1)">
          ↓
        </button>
      </div>

      <div class="flex gap-4">
        <BaseButton color="green" class="mt-2" @click="emit('stop')">Valider</BaseButton>
        <BaseButton color="red" class="mt-2" @click="emit('cancel')">Annuler</BaseButton>
      </div>
    </div>
  </div>
</template>
