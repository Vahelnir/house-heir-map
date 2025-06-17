<script setup lang="ts">
import { useManorMap } from "@/composables/useMapState";
import BaseButton from "./ui/base-button.vue";

defineEmits<{
  close: [];
}>();

const { exportRoomsToJson, resetCustomRooms } = useSettingsActions();

function useSettingsActions() {
  const { rooms } = useManorMap();

  function exportRoomsToJson() {
    const data = Array.from(rooms.values());
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manor-rooms.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetCustomRooms() {
    localStorage.removeItem("househeir.customRooms");
    window.location.reload();
  }

  return { exportRoomsToJson, resetCustomRooms };
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 min-w-[320px] flex flex-col gap-4">
        <h2 class="text-xl font-bold mb-2">Paramètres</h2>
        <BaseButton color="blue" @click="exportRoomsToJson">Exporter les salles en JSON</BaseButton>
        <BaseButton color="red" @click="resetCustomRooms">
          Réinitialiser les salles custom
        </BaseButton>
        <BaseButton color="indigo" @click="$emit('close')">Fermer</BaseButton>
      </div>
    </div>
  </Teleport>
</template>
