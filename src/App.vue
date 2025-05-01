<!-- App.vue -->
<template>
  <div v-if="route.meta.layout === 'auth'">
    <router-view></router-view>
  </div>
  <div v-else class="container-fluid m-0 p-0 h-100">
    <div class="d-flex h-100 m-0 p-0">
      <Sidebar />
      <div class="d-flex flex-column flex-grow-1">
        <TopBar/>
        <main class="h-100">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import Sidebar from '@/components/layout/SideBar.vue'
import { useRoute } from 'vue-router'


const route = useRoute()
</script>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}

main {
  height: 100%; /* Ensure it fills the parent's height */
  max-height: 100%; /* Prevent it from exceeding the parent's height */
  overflow-y: auto; /* Allow scrolling if content overflows */
}
</style>
