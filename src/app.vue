<script setup lang="ts">
import MapRenderer from "@/components/map/map-renderer.vue";
import Sidebar from "@/components/map/map-sidebar.vue";
import { createManorMap } from "@/composables/useManorMap";

createManorMap();
</script>

<template>
  <main class="flex w-screen h-screen">
    <MapRenderer class="flex-1 overflow-auto" />
    <Sidebar class="flex-none w-96" />
  </main>
</template>
