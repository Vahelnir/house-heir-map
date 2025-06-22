import { rawRooms, type Room } from "@/core/rooms";
import { computed, inject, provide, reactive, readonly, ref, type InjectionKey } from "vue";

const LOCAL_STORAGE_KEY = "househeir.customRooms";

type LocalStorageEntry = Room | { name: string; deleted: true };

type ManorMap = ReturnType<typeof createManorMap>;
const ManorMapKey = Symbol("ManorMap") as InjectionKey<ManorMap>;

function loadCustomRooms(): Map<string, Room | null> {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      return new Map();
    }

    const arr = JSON.parse(data) as LocalStorageEntry[];

    return new Map(
      arr.map((obj) =>
        obj && "deleted" in obj && obj.deleted === true
          ? [obj.name, null]
          : [obj.name, obj as Room],
      ),
    );
  } catch {
    return new Map();
  }
}

function saveCustomRooms(customRooms: Map<string, Room | null>) {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(
      Array.from(customRooms.entries()).map(([name, room]) =>
        room === null ? { name, null: true } : room,
      ),
    ),
  );
}

export function createManorMap() {
  const selectedRoomId = ref<string | null>(null);
  const scale = ref(10);

  // Chargement des rooms prédéfinies + custom (custom écrase prédéfini)
  const customRooms = loadCustomRooms();
  const predefinedEntries = rawRooms
    .map((room) => [room.name, room] as [string, Room])
    .filter(([name]) => !customRooms.has(name) || customRooms.get(name) !== null);
  const customEntries = Array.from(customRooms.entries())
    .filter(([, room]) => room !== null)
    .map(([name, room]) => [name, room as Room] as [string, Room]);
  const rooms = reactive(new Map<string, Room>([...predefinedEntries, ...customEntries]));

  const selectedRoom = computed(() => {
    if (!selectedRoomId.value) {
      return;
    }
    return rooms.get(selectedRoomId.value);
  });

  function persistCustom(name: string, room: Room | null) {
    customRooms.set(name, room);
    saveCustomRooms(customRooms);
  }

  const state = {
    rooms: readonly(rooms),
    addRoom(room: Room) {
      if (rooms.has(room.name)) {
        throw new Error(`Room with id ${room.name} already exists.`);
      }
      rooms.set(room.name, room);
      persistCustom(room.name, room);
    },
    updateRoom(room: Room) {
      rooms.set(room.name, room);
      persistCustom(room.name, room);
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
    removeRoom(name: string) {
      if (!rooms.has(name)) {
        return;
      }

      const isPredefined = rawRooms.some((r) => r.name === name);
      rooms.delete(name);

      if (isPredefined) {
        persistCustom(name, null);
      } else {
        customRooms.delete(name);
        saveCustomRooms(customRooms);
      }
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
