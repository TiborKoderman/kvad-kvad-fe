<template>
  <div id="app">
    <NavBar />

    <!-- Dashboard content -->
    <main class="p-4">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<style>
#sidebar {
  width: 250px;
  height: 100vh;
  transition: width 0.3s;
}

#sidebar-collapsed {
  width: 80px;
  height: 100vh;
  transition: width 0.3s;
}

.toggled #sidebar,
.toggled #sidebar-collapsed {
  width: 80px;
}
</style>
