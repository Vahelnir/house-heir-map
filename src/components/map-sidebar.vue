<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useManorMap } from "@/composables/useMapState";
import RoomDetails from "./room-details.vue";
import RoomMoveControls from "./room-move-controls.vue";
import RoomCreateModal from "./room-create-modal.vue";
import type { Room } from "@/core/rooms";

const { selectedRoom, updateRoom, addRoom } = useManorMap();

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

function useMovingRooms(movingRoom: Ref<Room | undefined>, updateRoom: (room: Room) => void) {
  const moving = ref(false);

  let previousOffset: { x: number; y: number } | null = null;
  function startMove() {
    const room = movingRoom.value;
    if (!room) {
      return;
    }

    if (room.offset) {
      previousOffset = { ...room.offset };
    }

    moving.value = true;
  }

  function stopMove() {
    if (!moving.value) {
      return;
    }

    moving.value = false;
    previousOffset = null;
  }

  function moveRoom(dx: number, dy: number) {
    const room = movingRoom.value;
    if (!room) {
      return;
    }

    const updated = {
      ...room,
      offset: {
        x: (room.offset?.x ?? 0) + dx,
        y: (room.offset?.y ?? 0) + dy,
      },
    };
    updateRoom(updated);
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

  watch(movingRoom, (newRoom, previousRoom) => {
    if (previousRoom?.name === newRoom?.name) {
      return;
    }

    cancelMove();
  });

  return {
    moving,
    startMove,
    stopMove,
    moveRoom,
    cancelMove,
  };
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
    </template>
    <template v-else>
      <div class="text-blue-600 italic text-center py-8">
        Sélectionnez une salle sur la carte pour voir ses détails.
      </div>
    </template>
  </aside>
</template>
