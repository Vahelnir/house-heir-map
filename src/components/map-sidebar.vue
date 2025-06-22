<script setup lang="ts">
import { computed, ref, toRaw, watch, type Ref } from "vue";
import { useManorMap } from "@/composables/useManorMap";
import RoomDetails from "./room-details.vue";
import RoomMoveControls from "./room-move-controls.vue";
import RoomCreateModal from "./room-create-modal.vue";
import MapSettingsModal from "./map-settings-modal.vue";
import type { Room } from "@/core/rooms";

const { selectedRoom, updateRoom, addRoom, removeRoom } = useManorMap();

const { moving, startMove, stopMove, moveRoom, cancelMove } = useMovingRooms(
  selectedRoom,
  updateRoom,
);

const showCreateModal = ref(false);
function createRoom(room: Room) {
  addRoom(room);
  showCreateModal.value = false;
}
function closeCreateModal() {
  showCreateModal.value = false;
}

const showSettings = ref(false);

function useMovingRooms(selectedRoom: Ref<Room | undefined>, updateRoom: (room: Room) => void) {
  const movingRoom = ref<Room | undefined>(undefined);

  let previousOffset: { x: number; y: number } | null = null;
  function startMove() {
    const room = selectedRoom.value;
    if (!room) {
      return;
    }

    if (room.offset) {
      previousOffset = { ...room.offset };
    }

    console.log(toRaw(room));
    movingRoom.value = JSON.parse(JSON.stringify(toRaw(room)));
  }

  function stopMove() {
    movingRoom.value = undefined;
    previousOffset = null;
  }

  function moveRoom(dx: number, dy: number) {
    const room = movingRoom.value;
    if (!room) {
      return;
    }

    room.offset = {
      x: (room.offset?.x ?? 0) + dx,
      y: (room.offset?.y ?? 0) + dy,
    };
    updateRoom(room);
  }

  function cancelMove() {
    const room = movingRoom.value;
    if (!room) {
      return;
    }

    if (previousOffset) {
      updateRoom({
        ...room,
        offset: previousOffset,
      });
    }

    stopMove();
  }

  watch(selectedRoom, (newRoom, previousRoom) => {
    if (newRoom === undefined || previousRoom?.name !== newRoom?.name) {
      cancelMove();
    }
  });

  return {
    moving: computed(() => !!movingRoom.value),
    startMove,
    stopMove,
    moveRoom,
    cancelMove,
  };
}

function deleteRoom() {
  if (!selectedRoom.value) {
    return;
  }

  removeRoom(selectedRoom.value.name);
}
</script>

<template>
  <aside
    class="border-l border-blue-300 bg-blue-50 text-blue-900 p-4 w-72 min-h-full flex flex-col gap-4 shadow-xl z-10"
  >
    <div class="flex flex-row justify-between items-center mb-2">
      <button
        class="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition"
        @click="showCreateModal = true"
      >
        + Ajouter une salle
      </button>
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
    </div>
    <MapSettingsModal v-if="showSettings" @close="showSettings = false" />
    <RoomCreateModal v-if="showCreateModal" @close="closeCreateModal" @create="createRoom" />
    <template v-if="selectedRoom">
      <RoomDetails :room="selectedRoom" />
      <RoomMoveControls
        :room="selectedRoom"
        :moving="moving"
        @start="startMove"
        @stop="stopMove"
        @cancel="cancelMove"
        @move="moveRoom"
      />
      <button
        class="bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700 transition mt-4"
        @click="deleteRoom"
      >
        Supprimer la salle
      </button>
    </template>
    <template v-else>
      <div class="text-blue-600 italic text-center py-8">
        Sélectionnez une salle sur la carte pour voir ses détails.
      </div>
    </template>
  </aside>
</template>
