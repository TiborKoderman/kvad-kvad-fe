<template>
    <div class="devices-view">
        <div class="scrollable-container">
            <div v-for="device in devices" :key="device.id" class="device-card">
                <h3>{{ device.name }}</h3>
                <p>{{ device.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const devices = ref([]);

async function fetchDevices() {
    try {
        const response = await axios.get('/Mdns/devices');
        devices.value = response.data;
    } catch (error) {
        console.error('Error fetching devices:', error);
    }
}

onMounted(() => {
    fetchDevices();
});
</script>

<style scoped>
.devices-view {
    display: flex;
    flex-direction: column;
    height: 100%; /* Fill the parent's height */
    width: 100%; /* Fill the parent's width */
    box-sizing: border-box;
}

.scrollable-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto; /* Enable vertical scrolling */
    height: 100%; /* Make the container scrollable */
    padding: 10px;
    box-sizing: border-box;
}

.device-card {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
