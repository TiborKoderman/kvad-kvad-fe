<template>
  <div class="dropdown">
    <div class="form-group">
      <label for="searchInput">Search</label>
      <input
        type="text"
        id="searchInput"
        class="form-control"
        placeholder="Search..."
        v-model="searchTerm"
        @focus="openDropdown"
      />
    </div>

    <!-- Dropdown menu -->
    <ul 
      v-if="isDropdownOpen && filteredOptions.length > 0" 
      class="dropdown-menu show w-100 mt-1" 
      style="max-height: 200px; overflow-y: auto;"
    >
      <li
        v-for="option in filteredOptions"
        :key="option.id"
        class="dropdown-item"
        @click.prevent="addItem(option)"
        style="cursor: pointer;"
      >
        {{ option.name }}
      </li>
    </ul>

    <!-- Selected items -->
    <div class="mt-3">
      <span
        v-for="item in selectedItems"
        :key="item.id"
        class="badge bg-primary me-2"
      >
        {{ item.name }}
        <button
          type="button"
          class="btn-close btn-close-white ms-2"
          aria-label="Remove"
          @click="removeItem(item)"
        ></button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Define the type for the options
interface Option {
  id: number | string;
  name: string;
}

// Define props
const props = defineProps<{
  options: Option[];
}>();

// Local state
const searchTerm = ref<string>('');
const selectedItems = ref<Option[]>([]);
const isDropdownOpen = ref<boolean>(false);

// Computed property for filtered options
const filteredOptions = computed((): Option[] => {
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  return props.options.filter(
    (option) =>
      option.name.toLowerCase().includes(lowerSearchTerm) &&
      !selectedItems.value.some((item) => item.id === option.id)
  );
});

// Methods
function addItem(option: Option): void {
  selectedItems.value.push(option);
  searchTerm.value = ''; // Clear search term
}

function removeItem(item: Option): void {
  selectedItems.value = selectedItems.value.filter((selected) => selected.id !== item.id);
}

function openDropdown(): void {
  isDropdownOpen.value = true;
}

function closeDropdown(): void {
  isDropdownOpen.value = false;
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent): void {
  const dropdownElement = document.querySelector('.dropdown');
  if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
    closeDropdown();
  }
}

document.addEventListener('click', handleClickOutside);
</script>

<style scoped>
/* Add custom styles if needed */
.dropdown-menu {
  z-index: 1050; /* Ensure dropdown is above other elements */
}
</style>
