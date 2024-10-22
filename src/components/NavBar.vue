<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <nav
      class="sidebar bg-light border-end"
      :class="{ collapsed: isCollapsed }"
    >
      <div class="sidebar-header p-3 d-flex justify-content-between">
        <button class="btn btn-outline-secondary btn-sm" @click="toggleSidebar">
          <i
            class="bi"
            :class="isCollapsed ? 'bi-arrow-right' : 'bi-arrow-left'"
          ></i>
        </button>
      </div>
      <ul class="nav flex-column">
        <li v-for="item in menuItems" :key="item.label" class="nav-item">
          <a href="#" class="nav-link d-flex align-items-center">
            <i :class="item.icon" class="me-2"></i>
            <span v-if="!isCollapsed">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Main content -->
    <div class="main-content flex-grow-1">
      <!-- Top bar -->
      <header class="navbar navbar-light bg-white border-bottom shadow-sm">
        <div class="container-fluid">
          <div class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search or go to..."
              aria-label="Search"
            />
          </div>
          <div class="d-flex align-items-center">
            <button class="btn btn-light position-relative me-2">
              <i class="bi bi-bell"></i>
              <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                1
              </span>
            </button>
            <button class="btn btn-light me-2">
              <i class="bi bi-envelope"></i>
            </button>
            <div class="dropdown">
              <button
                class="btn btn-light dropdown-toggle"
                type="button"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle"></i>
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="profileDropdown"
              >
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <!-- Dynamic content -->
      <div class="content p-3">
        <h1>Project Dashboard</h1>
        <!-- Your project data here -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isCollapsed = ref(false)
const menuItems = ref([
  { label: 'Projects', icon: 'bi bi-folder' },
  { label: 'Groups', icon: 'bi bi-people' },
  { label: 'Issues', icon: 'bi bi-bug' },
  { label: 'Merge requests', icon: 'bi bi-arrow-down-up' },
  { label: 'To-Do List', icon: 'bi bi-list-check' },
])

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
/* Sidebar styles */
.sidebar {
  width: 240px;
  transition: width 0.3s;
}
.sidebar.collapsed {
  width: 80px;
}

.nav-link {
  padding: 1rem;
  display: flex;
  align-items: center;
  color: #333;
}

.nav-link .bi {
  font-size: 1.25rem;
}

.sidebar.collapsed .nav-link span {
  display: none;
}

/* Main content styles */
.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex-grow: 1;
  padding: 1rem;
}
</style>
