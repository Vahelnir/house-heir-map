import { GRID_SIZE } from "@/core/constants";
import { rawRooms, weeks, type Room } from "@/core/rooms";
import { inject, provide, reactive, readonly, ref, type InjectionKey } from "vue";

const LOCAL_STORAGE_KEY = "househeir.customRooms";

type LocalStorageEntry = Room | { name: string; deleted: true };

export type Cell = {
  room: Room | null;
  x: number;
  y: number;
};

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

  const selectedCell = ref<Cell | null>(null);
  const grid = ref<Cell[][]>(
    Array.from({ length: GRID_SIZE.height }, (_, y) =>
      Array.from({ length: GRID_SIZE.width }, (_, x) => ({ room: null, x, y })),
    ),
  );
  for (const [coords, roomId] of Object.entries(weeks[1].layers[0])) {
    const [x, y] = coords.split(",").map(Number);
    grid.value[y][x].room = rooms.get(roomId) || null;
  }

  function persistCustom(name: string, room: Room | null) {
    customRooms.set(name, room);
    saveCustomRooms(customRooms);
  }

  const state = {
    grid: readonly(grid),
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
    selectedCell: readonly(selectedCell),
    selectCell(cell: { readonly x: number; readonly y: number } | null) {
      if (cell === null) {
        console.log("selected cell set to null");
        selectedCell.value = null;
        return;
      }

      if (cell.x < 0 || cell.x >= GRID_SIZE.width || cell.y < 0 || cell.y >= GRID_SIZE.height) {
        throw new Error(`Invalid cell coordinates: ${cell.x}, ${cell.y}`);
      }

      selectedCell.value = grid.value[cell.y][cell.x];
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
