<script setup lang="ts">
import { computed, ref, toRaw, watch, type Ref } from "vue";
import { useManorMap } from "@/composables/useMapState";
import RoomDetails from "./room-details.vue";
import RoomMoveControls from "./room-move-controls.vue";
import RoomCreateModal from "./room-create-modal.vue";
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
    <button
      class="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition mb-2"
      @click="showCreateModal = true"
    >
      + Ajouter une salle
    </button>
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
