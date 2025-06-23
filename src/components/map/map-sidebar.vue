<script setup lang="ts">
import { ref } from "vue";
import { useManorMap } from "@/composables/useManorMap";
import MapSettingsModal from "@/components/modals/map-settings-modal.vue";
import TabButton from "../ui/tab-button.vue";
import MapRoom from "./map-room.vue";
import BaseButton from "../ui/base-button.vue";
import type { Room } from "@/core/rooms";
import RoomCreateModal from "../modals/room-create-modal.vue";

const { rooms, selectedCell, setCellRoom, addRoom } = useManorMap();

const showSettings = ref(false);

const showCreateModal = ref(false);
function createRoom(room: Room) {
  addRoom(room);
  showCreateModal.value = false;
}
function closeCreateModal() {
  showCreateModal.value = false;
}

const selectedTab = ref<"selection" | "rooms">("selection");
</script>

<template>
  <aside
    class="border-l border-blue-300 bg-blue-50 text-blue-900 p-4 w-72 min-h-full flex flex-col gap-4 shadow-xl z-10"
  >
    <div class="flex flex-row justify-end items-center mb-2">
      <button
        class="ml-2 p-2 rounded-full hover:bg-blue-200 text-blue-700"
        title="Paramètres"
        @click="showSettings = true"
        style="
          height: 2.2rem;
          width: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.142-.854-.108-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.774-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.806.272 1.204.107.397-.165.71-.505.78-.929l.149-.894z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
      <MapSettingsModal v-if="showSettings" @close="showSettings = false" />
    </div>

    <!-- Tab navigation -->
    <nav class="flex border-b border-blue-200 mb-2">
      <TabButton
        class="mr-1"
        :active="selectedTab === 'selection'"
        @click="selectedTab = 'selection'"
      >
        Selection
      </TabButton>
      <TabButton :active="selectedTab === 'rooms'" @click="selectedTab = 'rooms'">
        Salles
      </TabButton>
    </nav>
    <section v-if="selectedTab === 'selection'" class="flex-1 overflow-y-auto">
      <div v-if="selectedCell" class="mb-4">
        <h2 class="text-lg font-bold">Cellule x: {{ selectedCell?.x }} y: {{ selectedCell?.y }}</h2>
        <p v-if="selectedCell?.room" class="text-sm text-gray-600 mb-2">
          La cellule sélectionnée contient
          <span class="font-bold">{{ selectedCell.room.name }}.</span>
        </p>
        <BaseButton color="red" @click="setCellRoom(selectedCell.x, selectedCell.y, null)">
          Retirer la salle de la cellule
        </BaseButton>
      </div>
      <div v-else>
        <h2 class="text-lg font-bold mb-2">Sélectionnez une cellule</h2>
        <p class="text-sm text-gray-600">Cliquez sur une cellule pour afficher ses détails.</p>
      </div>
    </section>
    <section v-else-if="selectedTab === 'rooms'" class="flex-1 overflow-y-auto flex flex-col gap-4">
      <button
        class="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition"
        @click="showCreateModal = true"
      >
        + Ajouter une salle
      </button>
      <RoomCreateModal v-if="showCreateModal" @close="closeCreateModal" @create="createRoom" />

      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="room in rooms.values()"
          :key="room.name"
          class="p-2 bg-white rounded shadow cursor-grab active:cursor-grabbing"
          draggable="true"
          @dragstart="(e) => e.dataTransfer?.setData('roomName', room.name)"
        >
          <MapRoom :room="room" :scale="10" standalone />
        </div>
      </div>
    </section>
  </aside>
</template>
