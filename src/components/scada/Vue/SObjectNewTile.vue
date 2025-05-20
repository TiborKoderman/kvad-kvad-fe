<template>
    <div class="tile" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <span style="font-size: 3rem; color: var(--bs-primary); user-select: none;">+</span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useModalStore } from '@/stores/modals';

const modals = useModalStore();

</script>

<style scoped>
.tile {
    aspect-ratio: 1;
    min-width: 250px;
    min-height: 250px;
    max-width: 10vw;
    max-height: 10vw;
    border-radius: 10px;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
}

.tile:hover {
    background-color: #e0e0e0;
    cursor: pointer;
}

.active {
    background-color: #d0d0d0;
    border: 2px solid #007bff;
}


</style>