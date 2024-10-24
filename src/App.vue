<!-- App.vue -->
<template>
  <div id="app">
    <div class="d-flex">
      <Sidebar
        :is-collapsed="isCollapsed"
        @toggle-collapse="toggleCollapse"
      />
      <div
        class="main-content d-flex flex-column"
        :class="{ 'collapsed-sidebar': isCollapsed }"
      >
        <TopBar
          :is-collapsed="isCollapsed"
          @toggle-collapse="toggleCollapse"
        />
        <div class="content p-4">
          <!-- Main content -->
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopBar from '@/components/layout/TopBar.vue';
import Sidebar from '@/components/layout/SideBar.vue';

const isCollapsed = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
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
