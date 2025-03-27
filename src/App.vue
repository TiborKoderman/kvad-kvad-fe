<!-- App.vue -->
<template>
  <div v-if="route.meta.layout === 'auth'">
    <router-view></router-view>
  </div>
  <div v-else class="container-fluid m-0 p-0">
    <div class="d-flex flex-row h-100 m-0 p-0">
      <Sidebar :is-collapsed="isCollapsed" @toggle-collapse="toggleCollapse" />
      <div class="d-flex flex-column flex-fill">
        <TopBar :is-collapsed="isCollapsed" @toggle-collapse="toggleCollapse" />
        <main class="content p-2 flex-grow-1">
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

const isCollapsed = ref(false)

const route = useRoute()

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}
</style>
