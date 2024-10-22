<template>
  <div>
    <div class="topbar">Top Bar</div>
    <div :class="['sidebar', { collapsed: isCollapsed }]">
      <button @click="toggleSidebar" class="toggle-btn">
        {{ isCollapsed ? 'Expand' : 'Collapse' }}
      </button>
      <ul v-if="!isCollapsed">
        <li v-for="item in menuItems" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isCollapsed = ref(false)
const menuItems = ref([
  'Home',
  'Projects',
  'Issues',
  'Merge Requests',
  'Settings',
])

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.topbar {
  height: 2em;
  background-color: #34495e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  height: calc(100vh - 2em);
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

.toggle-btn {
  background-color: #34495e;
  color: white;
  border: none;
  width: 100%;
  padding: 10px;
  cursor: pointer;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  cursor: pointer;
}

li:hover {
  background-color: #34495e;
}
</style>
