<script setup lang="ts">
import { useManorMap } from "@/composables/useMapState";
import RoomDetails from "./room-details.vue";
// import RoomEditorModal from "./room-editor-modal.vue";

const { selectedRoom } = useManorMap();
</script>

<template>
  <aside
    class="border-l border-blue-300 bg-blue-50 text-blue-900 p-4 w-72 min-h-full flex flex-col gap-4 shadow-xl z-10"
  >
    <template v-if="selectedRoom">
      <RoomDetails :room="selectedRoom"></RoomDetails>
    </template>
    <template v-else>
      <div class="text-blue-600 italic text-center py-8">
        Sélectionnez une salle sur la carte pour voir ses détails.
      </div>
    </template>

    <!-- <RoomEditorModal /> -->
  </aside>
</template>
