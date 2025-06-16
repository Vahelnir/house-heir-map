import { rawRooms, type Room } from "@/core/rooms";
import { computed, inject, provide, readonly, ref, type InjectionKey } from "vue";

type ManorMap = ReturnType<typeof createManorMap>;
const ManorMapKey = Symbol("ManorMap") as InjectionKey<ManorMap>;

export function createManorMap() {
  const rooms = ref<Room[]>(rawRooms);
  const selectedRoomId = ref<string | null>(null);
  const scale = ref(14);

  const roomMap = computed(
    () => new Map<string, Room>(rooms.value.map((room) => [room.name, room])),
  );
  const selectedRoom = computed(() => {
    if (!selectedRoomId.value) {
      return;
    }

    return roomMap.value.get(selectedRoomId.value);
  });

  const state = {
    rooms: readonly(rooms),
    addRoom(room: Room) {
      if (roomMap.value.has(room.name)) {
        throw new Error(`Room with id ${room.name} already exists.`);
      }

      rooms.value.push(room);
    },

    selectedRoom,
    selectRoom(id: string | null) {
      if (id && !roomMap.value.has(id)) {
        throw new Error(`Room with id ${id} does not exist.`);
      }

      selectedRoomId.value = id;
    },

    scale: readonly(scale),
    setScale(newScale: number) {
      if (Number.isNaN(newScale) || newScale <= 0) {
        throw new Error(`Invalid scale value: ${newScale}. Scale must be a positive number.`);
      }

      scale.value = newScale;
    },
  };
  provide(ManorMapKey, state);
  return state;
}

export function useManorMap() {
  const state = inject(ManorMapKey);
  if (!state) {
    throw new Error("ManorMap was never provided by any of the parent components.");
  }

  return state;
}
