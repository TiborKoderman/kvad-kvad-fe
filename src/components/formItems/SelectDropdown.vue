<template>
  <div class="dropdown">
    <input
      type="text"
      class="form-control"
      v-model="searchQuery"
      @focus="showDropdown = true"
      @blur="hideDropdown"
      @input="filterOptions"
      placeholder="Search..."
    />
    <ul
      class="dropdown-menu w-100"
      :class="{ show: showDropdown }"
      @mousedown.prevent
    >
      <li
        v-for="(option, index) in filteredOptions"
        :key="getOptionKey(option)"
        class="dropdown-item"
        @click="selectOption(option)"
      >
        {{ getOptionLabel(option) }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  options: {
    type: Array as () => Array<string | Record<string, any>>,
    required: true,
  },
  label: {
    type: String,
    default: "label", // Default property for displaying option labels
  },
  value: {
    type: String,
    default: "value", // Default property for option keys
  },
  modelValue: {
    type: [String, Object],
    default: null,
  },
});

const emit = defineEmits(["select", "update:modelValue"]);

const searchQuery = ref("");
const filteredOptions = ref([...props.options]);
const showDropdown = ref(false);

const filterOptions = () => {
  const query = searchQuery.value.toLowerCase();
  filteredOptions.value = props.options.filter((option) => {
    const label = getOptionLabel(option);
    return label.toLowerCase().includes(query);
  });
};

const selectOption = (option) => {
  searchQuery.value = getOptionLabel(option);
  showDropdown.value = false;
  emit("select", option);
  emit("update:modelValue", option);
};

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);l
};

const getOptionLabel = (option) => {
  return typeof option === "object" ? option[props.label] : option;
};

const getOptionKey = (option) => {
  return typeof option === "object" ? option[props.value] : option;
};

watch(
  () => props.options,
  (newOptions) => {
    filteredOptions.value = newOptions;
  }
);

watch(
  () => props.modelValue,
  (newValue) => {
    searchQuery.value = newValue
      ? getOptionLabel(newValue)
      : "";
  },
  { immediate: true }
);
</script>

<style scoped>
.dropdown-menu {
  max-height: 200px;
  overflow-y: auto;
}
</style>
