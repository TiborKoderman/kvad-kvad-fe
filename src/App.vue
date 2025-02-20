<!-- App.vue -->
<template>
  <div v-if="route.meta.layout === 'auth'">
    <router-view></router-view>
  </div>
  <div v-else class="container-fluid">
    <div class="row">
      <Sidebar :is-collapsed="isCollapsed" @toggle-collapse="toggleCollapse" />
      <div class="col p-0 d-flex flex-column">
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
