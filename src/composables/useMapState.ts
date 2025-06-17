import { rawRooms, type Room } from "@/core/rooms";
import { computed, inject, provide, reactive, readonly, ref, type InjectionKey } from "vue";

const LOCAL_STORAGE_KEY = "househeir.customRooms";

type ManorMap = ReturnType<typeof createManorMap>;
const ManorMapKey = Symbol("ManorMap") as InjectionKey<ManorMap>;

function getCustomRooms(): Map<string, Room> {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      return new Map();
    }

    const arr = JSON.parse(data) as Room[];
    return new Map(arr.map((room) => [room.name, room]));
  } catch {
    return new Map();
  }
}

function saveCustomRooms(customRooms: Map<string, Room>) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(customRooms.values())));
}

export function createManorMap() {
  const selectedRoomId = ref<string | null>(null);
  const scale = ref(14);

  // Chargement des rooms prédéfinies + custom (custom écrase prédéfini)
  const customRooms = getCustomRooms();
  const rooms = reactive(
    new Map<string, Room>([
      ...rawRooms.map((room) => [room.name, room] as [string, Room]),
      ...Array.from(customRooms.entries()),
    ]),
  );

  const selectedRoom = computed(() => {
    if (!selectedRoomId.value) {
      return;
    }
    return rooms.get(selectedRoomId.value);
  });

  function persistCustom(room: Room) {
    customRooms.set(room.name, room);
    saveCustomRooms(customRooms);
  }

  const state = {
    rooms: readonly(rooms),
    addRoom(room: Room) {
      if (rooms.has(room.name)) {
        throw new Error(`Room with id ${room.name} already exists.`);
      }
      rooms.set(room.name, room);
      persistCustom(room);
    },
    updateRoom(room: Room) {
      rooms.set(room.name, room);
      persistCustom(room);
    },
    selectedRoom,
    selectRoom(id: string | null) {
      if (id && !rooms.has(id)) {
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
