<template>
  <div class="masonry-dashboard ">
    <div class="masonry-grid">
      <div v-for="card in cards" :key="card.id" class="masonry-card">
        <h3>{{ card.title }}</h3>
        <p>{{ card.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import useMenuStore from '@/stores/menu';

const cards = ref([
  { id: 1, title: 'Card 1', content: 'This is the content of card 1.' },
  { id: 2, title: 'Card 2', content: 'This is the content of card 2.' },
  { id: 3, title: 'Card 3', content: 'This is the content of card 3.' },
  { id: 4, title: 'Card 4', content: 'This is the content of card 4.' },
  { id: 5, title: 'Card 5', content: 'This is the content of card 5.' },
  { id: 6, title: 'Card 6', content: 'This is the content of card 6.' },
  { id: 7, title: 'Card 7', content: 'This is the content of card 7.' },
  { id: 8, title: 'Card 8', content: 'This is the content of card 8.' },
]);

const menuStore = useMenuStore();

const gridColumns = ref(3); // Default number of columns

const updateGridColumns = () => {
  const dashboardWidth = document.querySelector('.masonry-dashboard')?.clientWidth || 0;
  gridColumns.value = Math.max(1, Math.floor(dashboardWidth / 200)); // Adjust based on card width
};

onMounted(() => {
  updateGridColumns();
  window.addEventListener('resize', updateGridColumns);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateGridColumns);
});
</script>

<style scoped>
.masonry-dashboard {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: hidden; /* Prevent overflow */
}

.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Dynamically adjust columns */
  grid-auto-rows: 10px; /* Base row height */
  gap: 16px; /* Space between cards */
  width: 100%; /* Ensure grid spans the full width */
}

.masonry-card {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  grid-row: span 10; /* Default span */
}

.masonry-card:nth-child(2n) {
  grid-row: span 15; /* Example of varying heights */
}

.masonry-card:nth-child(3n) {
  grid-row: span 20; /* Example of varying heights */
}
</style>
