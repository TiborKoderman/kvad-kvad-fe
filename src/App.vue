<!-- App.vue -->
<template>
  <div v-if="route.meta.layout === 'auth'">
    <router-view></router-view>
  </div>
  <div v-else class="container-fluid">
    <div class="row">
      <Sidebar :is-collapsed="isCollapsed" @toggle-collapse="toggleCollapse" />
      <div class="col p-0">
        <TopBar :is-collapsed="isCollapsed" @toggle-collapse="toggleCollapse" />
        <main class="content">
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

.d-flex {
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s;
}

.collapsed-sidebar {
  margin-left: 80px; /* Width of collapsed sidebar */
}

.main-content:not(.collapsed-sidebar) {
  margin-left: 250px; /* Width of expanded sidebar */
}

.content {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
