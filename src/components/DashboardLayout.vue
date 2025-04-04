<template>
    <div></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    node: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
.layout {
    border: 1px solid #ccc;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%; /* Fill the parent's height */
    width: 100%;  /* Fill the parent's width */
    box-sizing: border-box; /* Ensure borders are included in the size */
}

.layout:hover {
    background-color: #f0f0f0;
}

.grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr); /* 12 equal columns */
    gap: 0; /* Remove gaps to align grid lines */
    width: 100%; /* Ensure grid spans the full width */
    height: 100%; /* Ensure grid spans the full height */
    border: 1px solid #000; /* Outer grid border */
}

.grid-cell {
    background-color: #e0e0e0;
    aspect-ratio: 1 / 1; /* Make each cell a square */
    border: 1px solid #000; /* Draw grid lines */
}
</style>