import { GRID_SIZE } from "@/core/constants";
import { rawRooms, weeks, type ManorMap, type Room } from "@/core/rooms";
import { inject, provide, reactive, readonly, ref, type InjectionKey } from "vue";

const LOCAL_STORAGE_KEY = "househeir.customRooms";

type LocalStorageEntry = Room | { name: string; deleted: true };

export type Cell = {
  room: Room | null;
  x: number;
  y: number;
};

type ManorMapState = ReturnType<typeof createManorMap>;
const ManorMapKey = Symbol("ManorMap") as InjectionKey<ManorMapState>;

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
  const loadedMap = loadMap();

  const grid = ref<Cell[][]>(
    Array.from({ length: GRID_SIZE.height }, (_, y) =>
      Array.from({ length: GRID_SIZE.width }, (_, x) => {
        let room = null;
        if (loadedMap?.["layers"]?.[0]?.[y]?.[x] !== undefined) {
          const roomId = loadedMap["layers"][0][y][x];
          room = (roomId ? rooms.get(roomId) : undefined) ?? null;
        } else if (weeks[1]?.["layers"]?.[0]?.[y]?.[x]) {
          const roomId = weeks[1]["layers"][0][y][x];
          room = (roomId ? rooms.get(roomId) : undefined) ?? null;
        }

        return { room, x, y };
      }),
    ),
  );

  function persistCustomRooms(name: string, room: Room | null) {
    customRooms.set(name, room);
    saveCustomRooms(customRooms);
  }

  function persistCustomMap() {
    const mapData: ManorMap = {
      layers: [grid.value.map((row) => row.map((cell) => cell.room?.name || null))],
    };
    localStorage.setItem("househeir.map", JSON.stringify(mapData));
  }

  const state = {
    grid: readonly(grid),
    rooms: readonly(rooms),
    addRoom(room: Room) {
      if (rooms.has(room.name)) {
        throw new Error(`Room with id ${room.name} already exists.`);
      }

      rooms.set(room.name, room);
      persistCustomRooms(room.name, room);
    },
    updateRoom(room: Room) {
      rooms.set(room.name, room);
      persistCustomRooms(room.name, room);
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
        persistCustomRooms(name, null);
      } else {
        customRooms.delete(name);
        saveCustomRooms(customRooms);
      }
    },
    setCellRoom(x: number, y: number, roomId: string | null) {
      if (x < 0 || x >= GRID_SIZE.width || y < 0 || y >= GRID_SIZE.height) {
        return;
      }

      if (!roomId) {
        grid.value[y][x].room = null;
        persistCustomMap();
        return;
      }

      const cell = grid.value[y][x];
      cell.room = rooms.get(roomId) ?? null;
      persistCustomMap();
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

function loadMap(): ManorMap | undefined {
  try {
    const rawData = localStorage.getItem("househeir.map");
    const data = rawData ? JSON.parse(rawData) : null;
    return data;
  } catch (e) {
    console.error("Failed to load map from localStorage, using default map.", e);
    return;
  }
}
